import PriceCard from "../PriceCard";

const properties = [
    "Unlimited properties",
    "Unlimited categories",
    "Monthly/Quarterly/Yearly report generation",
    "Easy to use",
    "Usable on different devices",
];

const trialProperties = [
    "2 properties",
    "5 categories",
    "Monthly report generation",
    "No card needed",
    "Easy to set up"
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden">
        <div className="flex justify-center items-center bg-neutral-200 min-h-screen">
            {/* title */}
            <div className="max-w-5xl flex justify-center text-center gap-15">
                <h1 className="w-2/3 text-6xl font-bold py-8">
                    <span className="underline decoration-amber-400 decoration-7">
                        Streamline
                    </span>
                    <span> </span><br/>your housing expenses <br/>with Billio
                </h1>
            </div>
            {/* card */}
            <div className="flex gap-8">
                <PriceCard 
                    badge="14-days free"
                    title="Try free trial"
                    currentPrice="0€"
                    properties={trialProperties}
                />
                <PriceCard 
                    badge="Launch discount!"
                    title="One-time payment"
                    currentPrice="15€"
                    oldPrice="30€"
                    properties={properties}
                />
            </div>
        </div> 
    </section>
  )
}
