import Image from "next/image"
import { Button } from "@/components/ui/button"
import { IMGBB_IMAGES } from "@/utils/imgbbImages"

export default function BannerSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Banner 1 */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg group">
            <Image
              src={IMGBB_IMAGES.productBanner1}
              alt="Home-made Aachar Collection"
              width={600}
              height={400}
              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized={true} // Add this if images don't load
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Premium Aachar Collection</h3>
              <p className="text-sm mb-4 opacity-90">Made from organically grown produce</p>
              <Button variant="secondary" size="sm">
                Shop Collection
              </Button>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg group">
            <Image
              src={IMGBB_IMAGES.productBanner2}
              alt="Borcelle Pickles by Niranjan Devi"
              width={600}
              height={400}
              className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized={true} // Add this if images don't load
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Founder&rsquo;s Special</h3>
              <p className="text-sm mb-4 opacity-90">Traditional recipes by Niranjan Devi</p>
              <Button variant="secondary" size="sm">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}