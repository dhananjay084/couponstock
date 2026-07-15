export default function DealCategoryLoading() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-32 rounded-[26px] bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-48 rounded-[22px] border border-gray-200 bg-white shadow-sm animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
