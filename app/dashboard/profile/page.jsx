import { auth } from "@/auth";
import { checkSession } from "@/config/checkSession";
import Image from "next/image";

export default async function ProfilePage() {
    await checkSession();
    const session = await auth();

  return (
    <div>
        <h1>Name: {session?.user?.name}</h1>
        <h2>Email: {session?.user?.email}</h2>
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
