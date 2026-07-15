export default function BlogDetailLoading() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="h-12 rounded-[24px] bg-gray-200 animate-pulse" />
        <div className="h-64 rounded-[26px] bg-gray-200 animate-pulse" />
        <div className="space-y-3">
          <div className="h-4 w-11/12 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-10/12 rounded bg-gray-200 animate-pulse" />
          <div className="h-4 w-8/12 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
