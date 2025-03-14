import { auth } from "@/config/auth";
import { checkSession } from "@/config/checkSession";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    await checkSession();
    const session = await auth();

  return (
    <div>
        <h1>Welcome, {session?.user?.name}</h1>
        <h2>With email {session?.user?.email}</h2>
        {
          session?.user?.image && 
          <Image 
            src={session.user.image} 
            width={48} 
            height={48} 
            alt={"avatar"} 
            style={{ borderRadius: "50%" }}
          />
        }
      </div>
  )
}
