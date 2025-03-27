export default function PriceCard({ badge, title, currentPrice, oldPrice, properties }) {
  return (
    <div className="card w-96 bg-base-100 shadow-sm">
        <div className="card-body">
            <span className="badge badge-xs badge-warning">{badge}</span>
            <div className="flex flex-col items-center gap-2">
                <h2 className="text-3xl font-bold">{title}</h2>
                <div className="flex gap-1">
                    <span className="text-2xl">{currentPrice}</span>
                    <span className="text-md line-through">{oldPrice}</span>
                </div>
            </div>
            <ul className="mt-6 flex flex-col gap-2 text-xs">
                {
                    properties.map((row, index) => (
                        <li key={index}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4 me-2 inline-block text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            <span>{row}</span>
                        </li>
                    ))
                }
            </ul>
            <div className="mt-6">
                <button className="btn btn-primary btn-block">GET ACCESS</button>
            </div>
        </div>
    </div>
  )
}
