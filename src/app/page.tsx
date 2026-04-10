import Example from "@/components/carousel-standard-4";
import Category from "@/components/HomeComponents/Category";
import HeroSection from "@/components/HomeComponents/HeroSection";
import { Testimonial10 } from "@/components/testimonial10";


export default function Home() {
  return (
    <div className="min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <HeroSection />
      <Category />
      <Example/>
      <Testimonial10 />
    </div>
  );
}
