export default function StoreDetailLoading() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-[26px] border border-[#E3D9FF] bg-[linear-gradient(120deg,#231147_0%,#3A1D78_45%,#5D31BD_100%)] px-5 py-6 text-white shadow-[0_20px_45px_rgba(36,16,82,0.3)] sm:px-8 animate-pulse">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="h-20 w-20 rounded-full bg-white/20" />
          <div className="min-w-0 flex-1">
            <div className="h-8 w-3/4 rounded bg-white/20" />
            <div className="mt-3 h-4 w-full rounded bg-white/15" />
            <div className="mt-2 h-4 w-2/3 rounded bg-white/15" />
            <div className="mt-4 h-8 w-40 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      <div className="mx-auto mt-6 max-w-6xl">
        <div className="h-7 w-32 rounded bg-gray-200 animate-pulse" />
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-40 rounded-[20px] border border-gray-200 bg-white shadow-sm animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
