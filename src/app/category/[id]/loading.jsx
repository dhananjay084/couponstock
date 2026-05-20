export default function CategoryDetailLoading() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse" />
        <div className="mt-3 h-5 w-28 rounded bg-gray-200 animate-pulse" />

        <div className="mt-6 flex gap-4 overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-56 min-w-[280px] rounded-[24px] bg-gray-200 animate-pulse"
            />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-40 rounded-[20px] bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
