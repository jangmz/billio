import CardLanding from "../CardLanding"

export default function PropertiesSection() {
  return (
    <section id="features" className="relative overflow-hidden">
        <div className="flex flex-col items-center justify-center bg-neutral-200 min-h-screen">
            {/* title + description */}
            <div className="max-w-4xl flex items-center gap-15">
                <h1 className="w-2/3 text-5xl font-bold py-8">
                    Track your housing expenses<span> </span>
                    <span className="underline decoration-amber-400 decoration-7">
                        with ease
                    </span>
                </h1>
                <p className="w-1/3 text-gray-600 py-10">
                    Billio empowers you to monitor expenses across all your residences seamlessly. Whether you own a house, apartment, or other properties, maintain control of your finances effortlessly.
                </p>
            </div>
            {/* cards */}
            <div className="flex gap-8">
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
        </div> 
    </section>
  )
}
