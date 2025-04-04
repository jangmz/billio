export default function DashResidenceCard({ residence }) {
  return (
    <div className="flex flex-col items-start justify-start h-32 rounded-sm p-3 bg-gray-200">
        <p className="text-lg">
            {residence.name}
        </p>
        <p className="text-sm text-gray-500">
            {residence.address}
        </p>
    </div>
  );
}
