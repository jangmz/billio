import FaqAccordion from "../FaqAccordion";

export default function FaqSection() {
  return (
    <section id="faq" className="relative overflow-hidden">
        <div className="flex flex-col justify-center items-center bg-base-200 min-h-screen">
            {/* title */}
            <div className="max-w-5xl flex justify-center text-center gap-15">
                <h1 className="w-2/3 text-6xl font-bold py-8">
                    FAQs
                </h1>
            </div>
            {/* questions */}
            <div className="flex flex-col gap-3">
                <FaqAccordion 
                    title="How do I create an account?"
                    text="Click the 'Sign Up' button in the top right corner and follow the registration process."
                />
                <FaqAccordion
                    title="I forgot my password. What should I do?"
                    text="Click on 'Forgot Password' on the login page and follow the instructions sent to your email."
                />
                <FaqAccordion
                    title="How do I update my profile information?"
                    text="Go to 'My Account' settings and select 'Edit Profile' to make changes."
                />
            </div>
        </div> 
    </section>
  )
}
