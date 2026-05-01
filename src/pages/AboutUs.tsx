export default function AboutUs() {
  return (
    <main className="container mx-auto px-4 md:px-8 py-16 md:py-24 max-w-7xl flex-grow min-h-[calc(100vh-24rem)]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Image Half */}
        <div className="relative h-[600px] lg:h-[700px] w-full bg-muted flex items-center justify-center border border-border">
          <img
            src="/mahal.png"
            alt="Zouaq Optique Glasses and Eye Care"
            className="absolute inset-0 w-full h-full object-cover object-top z-10"
          />
        </div>

        {/* Text Content Half */}
        <div className="space-y-6">
          <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground">
            About Zouaq Optique
          </h1>

          <div className="w-12 h-[2px] bg-foreground mb-8"></div>

          <div className="space-y-5 text-base md:text-lg font-sans text-muted-foreground leading-relaxed">
            <p>
              As veterans in the optical field, Zouaq Optique has proudly served our community with
              unwavering dedication. Located in the vibrant heart of Mhamid 7, Marrakesh, we bring
              decades of expert knowledge to ensure your vision is clear and your style is
              impeccable.
            </p>
            <p>
              We are more than just a place to buy glasses. Our dedicated team provides precise,
              professional eye measurements, guiding you step-by-step to the best possible
              prescriptions tailored to your unique visual needs.
            </p>
            <p>
              Whether you are looking for premium, modern frames or need comprehensive help
              understanding your eye care requirements, our experienced opticians are here to help
              you see the world better.
            </p>
          </div>

          {/* Quick Info Grid */}
          <div className="pt-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-border p-5 bg-transparent">
                <h3 className="font-serif text-lg text-foreground mb-1">Visit Us</h3>
                <p className="text-sm font-sans text-muted-foreground">
                  Mhamid 7<br />
                  Marrakesh, Morocco
                </p>
              </div>
              <div className="border border-border p-5 bg-transparent">
                <h3 className="font-serif text-lg text-foreground mb-1">Our Expertise</h3>
                <p className="text-sm font-sans text-muted-foreground">
                  Premium Eyewear
                  <br />
                  Eye Measurements & Prescriptions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
