export default function DealDetailLoading() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl overflow-hidden rounded-[26px] border border-[#E3D9FF] bg-[linear-gradient(120deg,#231147_0%,#3A1D78_45%,#5D31BD_100%)] px-5 py-6 text-white shadow-[0_20px_45px_rgba(36,16,82,0.3)] sm:px-8 animate-pulse">
        <div className="h-8 w-3/4 rounded bg-white/20" />
        <div className="mt-4 flex flex-wrap gap-2">
          <div className="h-7 w-28 rounded-full bg-white/20" />
          <div className="h-7 w-36 rounded-full bg-white/15" />
        </div>
        <div className="mt-4 h-4 w-full rounded bg-white/15" />
        <div className="mt-2 h-4 w-2/3 rounded bg-white/15" />
      </section>

      <div className="mx-auto mt-6 max-w-6xl">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="h-72 rounded-[24px] bg-gray-200 animate-pulse" />
          <div className="space-y-4">
            <div className="h-24 rounded-[20px] bg-gray-200 animate-pulse" />
            <div className="h-24 rounded-[20px] bg-gray-200 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
