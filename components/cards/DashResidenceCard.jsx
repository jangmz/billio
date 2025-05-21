export default function DashResidenceCard({ residence, totalExpense }) {

  return (
    <div className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body">
        <h2 className="card-title text-lg font-bold">{residence.name}</h2>
        <p className="text-sm text-gray-500">{residence.address}</p>
        <div className="mt-4 text-center">
          <p className="text-2xl font-bold">
            {totalExpense !== null ? `${totalExpense}€` : "No data yet"}
          </p>
        </div>
      </div>
    </div>
    
  );
}