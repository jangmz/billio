import { auth } from "@/auth";
import { redirect } from "next/navigation";
import HeroSection from "@/components/sections/HeroSection";
import PropertiesSection from "@/components/sections/PropertiesSection";
import ProblemsSection from "@/components/sections/ProblemsSection";
import PricingSection from "@/components/sections/PricingSection";
import FaqSection from "@/components/sections/FaqSection";

export const metadata = {
  title: "Billio – Effortless Housing Expense Tracking",
  description: "Billio helps you track, manage, and analyze your household bills and property expenses in one place. Free, secure, and easy to use.",
  keywords: [
    "housing expenses",
    "bill tracking",
    "property management",
    "expense management",
    "household bills",
    "financial dashboard",
    "residence expenses",
    "Billio"
  ],
  openGraph: {
    title: "Billio – Effortless Housing Expense Tracking",
    description: "Track, manage, and analyze your household bills and property expenses in one place with Billio.",
    url: "https://www.billio-app.com",
    siteName: "Billio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Billio App Dashboard"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Billio – Effortless Housing Expense Tracking",
    description: "Track, manage, and analyze your household bills and property expenses in one place with Billio.",
    images: ["/og-image.png"]
  }
};

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
      {/*<PricingSection />*/}
      <FaqSection />
    </div>
  );
}
