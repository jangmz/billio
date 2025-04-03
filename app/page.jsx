import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HeroSection from "@/components/sections/HeroSection";
import PropertiesSection from "@/components/sections/PropertiesSection";
import ProblemsSection from "@/components/sections/ProblemsSection";
import PricingSection from "@/components/sections/PricingSection";
import FaqSection from "@/components/sections/FaqSection";

export default async function Home() {
  const session = await auth();

  if(session?.user) {
    redirect("/dashboard");
  }

  return (
    <div>
      <HeroSection />
      <PropertiesSection />
      <ProblemsSection />
      <PricingSection />
      <FaqSection />
    </div>
  );
}
