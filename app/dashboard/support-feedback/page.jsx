import AlertError from "@/components/alerts/AlertError";
import ModalCard from "@/components/cards/ModalCard";
import ContactForm from "@/components/forms/ContactForm";
import FeedbackForm from "@/components/forms/FeedbackForm";
import SuggestionsList from "@/components/SuggestionsList";
import { validateSession } from "@/config/validateSession";
import { cookies } from "next/headers";
import { GrContact } from "react-icons/gr";
import { VscFeedback } from "react-icons/vsc";

const apiUrl = process.env.API_URL;

export default async function SupportFeedbackPage() {
  try {
    // validate session
    const session = await validateSession();

    // retrieve cookies
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get("__Secure-authjs.session-token")?.value;

    if (!sessionToken) {
      throw new Error("Session token is missing");
    }

    return (
      <div className="flex flex-col items-center gap-10 p-6">
        <div className="grid gap-10 grid-cols-1 md:grid-cols-2">
          <ModalCard 
            icon={<GrContact />}
            title={"Contact Us"}
            modalName={"contact"}
            content={<ContactForm user={session.user} apiUrl={apiUrl} sessionToken={sessionToken} />}
          />
          <ModalCard 
            icon={<VscFeedback />}
            title={"Submit feedback"}
            modalName={"feedback"}
            content={<FeedbackForm user={session.user} apiUrl={apiUrl} sessionToken={sessionToken} />}
          />
        </div>
        <SuggestionsList apiUrl={apiUrl} sessionToken={sessionToken} />
      </div>
    );
  } catch (error) {
    console.error(error);
    return <AlertError error={error.message} />;
  }
}
