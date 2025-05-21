import FaqAccordion from "../FaqAccordion";

export default function FaqSection() {
  return (
    <section id="faq" className="relative overflow-hidden">
        <div className="flex flex-col justify-center items-center bg-neutral-200 min-h-screen">
            {/* title */}
            <div className="max-w-5xl flex justify-center text-center gap-15">
                <h1 className="w-2/3 text-6xl font-bold py-8">
                    FAQs
                </h1>
            </div>
            {/* questions */}
            <div className="flex flex-col gap-3">
                <FaqAccordion 
                    title="What is Billio?"
                    text="Billio is a web application that helps you track, manage, and analyze your household bills and expenses in one place."
                />
                <FaqAccordion 
                    title="How do I create an account?"
                    text="Click the 'Sign up' or 'Log in' button and choose your preferred sign up method (Google or Github)."
                />
                <FaqAccordion 
                    title="Is Billio free to use?"
                    text="Yes, Billio offers a free plan with all essential features. Premium features may be available in the future."
                />
                <FaqAccordion 
                    title="How do I add a new bill or expense?"
                    text="After logging in, go to your dashboard and click the 'Add Bill' button. Fill in the details and save."
                />
                <FaqAccordion 
                    title="Can I manage multiple properties or residences?"
                    text="Yes, you can add and manage multiple residences and track expenses for each separately."
                />
                <FaqAccordion 
                    title="Is my data secure?"
                    text="We take your privacy seriously. Your data is stored securely and is never shared with third parties."
                />
                <FaqAccordion 
                    title="How do I contact support?"
                    text="You can reach out to our support team via the 'Support & Feedback' section in your dashboard."
                />
            </div>
        </div> 
    </section>
  )
}
