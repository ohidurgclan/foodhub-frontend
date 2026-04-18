
import FeaturedRestaurants from "@/components/HomeComponents/Featured";
import HeroSection from "@/components/HomeComponents/HeroSection";
import OurWorks from "@/components/HomeComponents/OurWorks";
import { Testimonial10 } from "@/components/testimonial10";


export default function Home() {
  return (
    <div className="min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <HeroSection />
      <FeaturedRestaurants />
      <OurWorks />
      <Testimonial10 />
    </div>
  );
}
