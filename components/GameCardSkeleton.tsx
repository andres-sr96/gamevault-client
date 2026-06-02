export default function GameCardSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden animate-pulse bg-white">
      <div className="w-full h-48 bg-gray-300" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-3 bg-gray-300 rounded w-1/3" />
      </div>
    </div>
  );
}
