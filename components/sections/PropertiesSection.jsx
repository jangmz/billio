import CardLanding from "../CardLanding"
import Link from "next/link";
import Button from "../buttons/Button";

export default function PropertiesSection() {
  return (
    <section id="features" className="relative overflow-hidden">
        <div className="flex flex-col items-center justify-center bg-neutral-200 min-h-screen">
            {/* title + description */}
            <div className="max-w-5xl flex flex-col items-center gap-10 pt-10 lg:flex-row lg:gap-15 lg:pt-0">
                <h1 className="text-5xl text-center font-bold lg:text-6xl lg:w-2/3 lg:py-8">
                    Track your housing expenses<span> </span>
                    <span className="underline decoration-amber-400 decoration-7">
                        with ease
                    </span>
                </h1>
                <p className="text-gray-600 px-6 text-center lg:w-1/3 lg:py-10">
                    Billio empowers you to monitor expenses across all your residences seamlessly. Whether you own a house, apartment, or other properties, maintain control of your finances effortlessly.
                </p>
            </div>
            {/* cards */}
            <div className="flex flex-col justify-center gap-8 pt-10 md:flex-row md:flex-wrap lg:flex-row lg:pt-0">
                <CardLanding 
                    title="Consolidate your expenses in one place"
                    text="Easily manage all bills from different properties with Billio's intuitive dashboard, simplifying your financial oversight."
                />
                <CardLanding 
                    title="Generate insightful financial reports"
                    text="Create comprehensive monthly, quarterly, and yearly expense reports for each residence, helping you make informed financial decisions."
                />
                <CardLanding 
                    title="Stay organized and in control with your finances"
                    text="With Billio, you can easily track, manage, and optimize your housing expenses, ensuring clarity and peace of mind throughout your financial journey."
                />
            </div>
            <Link href="/login" className="my-6 lg:mt-6"> {/* link to stripe checkout */}
                <Button 
                    text={"SIGN UP NOW"} //{"GET ACCESS"}
                    btnStyle={"btn-primary btn-lg"}
                />
            </Link>
        </div> 
    </section>
  )
}
