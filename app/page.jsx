import { auth } from "@/config/auth";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

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
      <p>You are not signed in</p>
      <Link href="/login">
        Sign in
      </Link>
    </div>
  );
}
