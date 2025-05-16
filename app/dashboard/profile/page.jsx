import ProfileMainContent from "@/components/mainContent/ProfileMainContent";
import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";

const apiUrl = process.env.API_URL;

export default async function ProfilePage() {
    // validate session
    const session = await validateSession();

    // retrieve cookies
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get("authjs.session-token")?.value;

  return (
    <ProfileMainContent 
      userData={session.user}
      apiUrl={apiUrl}
      sessionToken={sessionToken}
    />  
  )
}
