import { auth } from "@/config/auth";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";
import HeroSection from "@/components/sections/HeroSection";
import PropertiesSection from "@/components/sections/PropertiesSection";

export default async function Home() {
  const session = await auth();

  if(session?.user) {
    return (
      <div>
        <Link href="/profile">
          My profile
        </Link>
        <SignOutButton/>
      </div>
    );
  }

  return (
    <div>
      <HeroSection />
      <PropertiesSection />
    </div>
  );
}
