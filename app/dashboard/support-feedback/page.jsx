import ModalCard from "@/components/cards/ModalCard";
import ContactForm from "@/components/forms/ContactForm";
import FeedbackForm from "@/components/forms/FeedbackForm";
import SuggestionsList from "@/components/SuggestionsList";
import { GrContact } from "react-icons/gr";
import { VscFeedback } from "react-icons/vsc";

const test = [
  {
    name: "test name",
    feedback: "This is a test feedback",
    upvotes: 3
  }
]

export default function SupportFeedbackPage() {
  return (
    <div className="flex flex-col items-center gap-10 p-6">
      <div className="grid gap-10 grid-cols-1 md:grid-cols-2">
        <ModalCard 
          icon={<GrContact />}
          title={"Contact Us"}
          modalName={"contact"}
          content={<ContactForm />}
        />
        <ModalCard 
          icon={<VscFeedback />}
          title={"Submit feedback"}
          modalName={"feedback"}
          content={<FeedbackForm />}
        />
      </div>
      <SuggestionsList suggestionsArr={test} />
    </div>
  );
}
