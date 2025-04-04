export default function DashResidenceCard({ residence }) {
  return (
    <div className="flex flex-col items-start justify-start h-32 rounded-sm p-3 bg-gray-200">
        <p className="text-lg text-gray-400 dark:text-gray-500">
            {residence.name}
        </p>
        <p>
            {residence.address}
        </p>
    </div>
  );
}
