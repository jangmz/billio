export default function ExpenseDisplayCard({ value, text }) {
    return (
        <div className="card bg-base-200 shadow-md">
            <div className="card-body">
                <p className="text-sm text-gray-500 self-center">{text}</p>
                <h1 className="text-5xl font-bold self-center">{value}€</h1>
            </div>
        </div>
    )
}
