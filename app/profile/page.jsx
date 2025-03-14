import { auth } from "@/config/auth";
import Image from "next/image";
import { logout } from "@/_actions/authActions";

export default async function ProfilePage() {
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
