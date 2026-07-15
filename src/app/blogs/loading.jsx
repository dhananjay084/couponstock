export default function BlogsLoading() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="h-32 rounded-[26px] bg-gray-200 animate-pulse" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-52 rounded-[24px] border border-gray-200 bg-white shadow-sm animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
