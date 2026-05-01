import tryonAviator from "@/assets/tryon-aviator.png";
import tryonRoundSunglasses from "@/assets/tryon-round-sunglasses.png";
import tryonBluelight from "@/assets/tryon-bluelight.png";
import tryonPrescription from "@/assets/tryon-prescription.png";
import tryonRoundMetal from "@/assets/tryon-round-metal.png";

// Map product IDs to their transparent try-on overlay images
export const tryonImageMap: Record<string, string> = {
  "1": tryonRoundSunglasses,   // The Riviera - round sunglasses
  "2": tryonBluelight,          // The Scholar - blue light square
  "3": tryonPrescription,       // The Heritage - clubmaster prescription
  "4": tryonAviator,            // The Voyager - aviator sunglasses
  "5": tryonRoundMetal,         // The Curator - round metal
  "6": tryonAviator,            // The Architect - aviator prescription (reuse aviator)
};
