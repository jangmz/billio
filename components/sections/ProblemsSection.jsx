import ColoredCard from "../ColoredCard";

const cons = [
    "hard to learn and use",
    "not intended for mobile viewing",
    "limited categories",
    "limited number of residences",
    "monthly subscription"
];

const pros = [
    "easy to learn and use",
    "designed for all devices",
    "unlimited custom categories",
    "unlimited residences",
    "one time payment"
];

export default function ProblemsSection() {
  return (
    <section id="problems" className="relative overflow-hidden">
        <div className="flex flex-col items-center justify-center bg-base-200 min-h-screen">
            {/* title */}
            <div className="max-w-4xl flex items-center justify-center">
                <h1 className="w-2/3 text-5xl font-bold py-8 text-center">
                    Housing expense tracking made <span className="underline decoration-amber-400 decoration-7">simple</span>
                </h1>
            </div>
            {/* cards */}
            <div className="flex gap-8">
                <ColoredCard 
                    title="Other expense tracking apps"
                    propertiesArr={cons}
                    color="red"
                />
                <ColoredCard 
                    title="Billio"
                    propertiesArr={pros}
                    color="green"
                />
            </div>
        </div>
    </section>
  )
}
