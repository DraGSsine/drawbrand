import Footer from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import HowItWorks from "@/components/landing/how-it-works";
import Pricing from "@/components/landing/pricing";
import Testimonials from "@/components/landing/testimonials";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero/>
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
}
