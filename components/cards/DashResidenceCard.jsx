export default function DashResidenceCard({ residence, pastMonth }) {

  return (
    <div className="flex flex-col items-center justify-start h-32 rounded-sm p-3 bg-gray-200">
      <div className="flex flex-col items-center justify-start mb-4">
          <p className="text-lg">
              {residence.name}
          </p>
          <p className="text-sm text-gray-500">
              {residence.address}
          </p>
      </div>
      <div className="text-2xl font-bold">
        {
          pastMonth !== null 
          ?
          <p>{pastMonth}€</p> 
          : 
          <p>No data yet</p>
        }
      </div>
    </div>
  );
}
