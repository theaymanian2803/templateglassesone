import { useEffect, useRef, useState, useCallback } from "react";
import { X, Camera, Loader2, AlertCircle } from "lucide-react";
import * as faceapi from "face-api.js";

interface VirtualTryOnProps {
  isOpen: boolean;
  onClose: () => void;
  productImage: string;
  productName: string;
}

type Status = "loading-models" | "requesting-camera" | "running" | "error";

const MODEL_URL = "/models";

let modelsLoaded = false;

export default function VirtualTryOn({ isOpen, onClose, productImage, productName }: VirtualTryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const glassesImgRef = useRef<HTMLImageElement | null>(null);

  const [status, setStatus] = useState<Status>("loading-models");
  const [errorMsg, setErrorMsg] = useState("");

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = 0;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    stopCamera();
    setStatus("loading-models");
    onClose();
  }, [stopCamera, onClose]);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    const init = async () => {
      // Preload glasses image
      if (!glassesImgRef.current) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = productImage;
        await new Promise<void>((res) => {
          img.onload = () => res();
          img.onerror = () => res();
        });
        if (cancelled) return;
        glassesImgRef.current = img;
      }

      // Load face-api models
      if (!modelsLoaded) {
        setStatus("loading-models");
        try {
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
          await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
          modelsLoaded = true;
        } catch (e) {
          console.error("Model load error:", e);
          if (!cancelled) {
            setStatus("error");
            setErrorMsg("Failed to load face detection models. Please check your internet connection.");
          }
          return;
        }
      }

      if (cancelled) return;

      // Request camera
      setStatus("requesting-camera");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          // Wait for video to actually have data
          await new Promise<void>((resolve, reject) => {
            video.onloadeddata = () => resolve();
            video.onerror = () => reject(new Error("Video error"));
            // Fallback timeout
            setTimeout(resolve, 3000);
          });
          await video.play();
        }
        if (!cancelled) setStatus("running");
      } catch (err: any) {
        console.error("Camera error:", err);
        if (!cancelled) {
          setStatus("error");
          if (err?.name === "NotAllowedError") {
            setErrorMsg("Camera access denied. Please allow camera permissions in your browser settings and try again.");
          } else if (err?.name === "NotFoundError") {
            setErrorMsg("No camera found. Please connect a camera and try again.");
          } else if (err?.name === "NotReadableError") {
            setErrorMsg("Camera is in use by another application. Please close it and try again.");
          } else {
            setErrorMsg("Could not access the camera. Please check your permissions and try again.");
          }
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [isOpen, productImage, stopCamera]);

  // Face detection loop
  useEffect(() => {
    if (status !== "running" || !isOpen) return;

    const video = videoRef.current;
    const overlay = overlayCanvasRef.current;
    if (!video || !overlay) return;

    const ctx = overlay.getContext("2d");
    if (!ctx) return;

    let running = true;

    const detect = async () => {
      if (!running) return;

      if (!video.videoWidth || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(detect);
        return;
      }

      overlay.width = video.videoWidth;
      overlay.height = video.videoHeight;
      ctx.clearRect(0, 0, overlay.width, overlay.height);

      try {
        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.35 }))
          .withFaceLandmarks(true);

        if (detection && glassesImgRef.current) {
          const landmarks = detection.landmarks;
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();
          const nose = landmarks.getNose();

          const leftEyeCenter = {
            x: leftEye.reduce((s, p) => s + p.x, 0) / leftEye.length,
            y: leftEye.reduce((s, p) => s + p.y, 0) / leftEye.length,
          };
          const rightEyeCenter = {
            x: rightEye.reduce((s, p) => s + p.x, 0) / rightEye.length,
            y: rightEye.reduce((s, p) => s + p.y, 0) / rightEye.length,
          };

          const dx = rightEyeCenter.x - leftEyeCenter.x;
          const dy = rightEyeCenter.y - leftEyeCenter.y;
          const angle = Math.atan2(dy, dx);
          const eyeDistance = Math.sqrt(dx * dx + dy * dy);

          const glassesWidth = eyeDistance * 2.4;
          const aspectRatio = glassesImgRef.current.naturalHeight / glassesImgRef.current.naturalWidth;
          const glassesHeight = glassesWidth * aspectRatio;

          const noseBridge = nose[0];
          const centerX = (leftEyeCenter.x + rightEyeCenter.x) / 2;
          const centerY = (leftEyeCenter.y + rightEyeCenter.y) / 2 + (noseBridge.y - leftEyeCenter.y) * 0.15;

          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(angle);
          ctx.drawImage(
            glassesImgRef.current,
            -glassesWidth / 2,
            -glassesHeight / 2,
            glassesWidth,
            glassesHeight
          );
          ctx.restore();
        }
      } catch (e) {
        console.warn("Detection frame error:", e);
      }

      if (running) {
        animFrameRef.current = requestAnimationFrame(detect);
      }
    };

    animFrameRef.current = requestAnimationFrame(detect);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [status, isOpen]);

  if (!isOpen) return null;

  const isRunning = status === "running";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-2xl mx-4 bg-background border border-border rounded-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="font-serif text-lg">Virtual Try-On</h2>
            <p className="text-xs font-sans text-muted-foreground">{productName}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-sm opacity-70 hover:opacity-100 transition-opacity ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Video area */}
        <div className="relative aspect-[4/3] bg-black">
          {/* Single persistent video element — never unmounts */}
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
            style={{
              transform: "scaleX(-1)",
              opacity: isRunning ? 1 : 0,
            }}
          />
          {isRunning && (
            <canvas
              ref={overlayCanvasRef}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ transform: "scaleX(-1)" }}
            />
          )}

          {/* Loading state */}
          {(status === "loading-models" || status === "requesting-camera") && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm font-sans text-muted-foreground">
                {status === "loading-models" ? "Loading face detection models…" : "Requesting camera access…"}
              </p>
            </div>
          )}

          {/* Error state */}
          {status === "error" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8 text-center">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <p className="text-sm font-sans text-muted-foreground">{errorMsg}</p>
              <button onClick={handleClose} className="btn-outline-luxury text-xs mt-2">
                Close
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {isRunning && (
          <div className="px-6 py-3 border-t border-border flex items-center gap-2">
            <Camera className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs font-sans text-muted-foreground">
              Position your face in the center of the frame for best results
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
