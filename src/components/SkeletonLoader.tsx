const shimmer = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

const skeletonClass = `
  bg-gradient-to-r from-white/5 via-white/10 to-white/5 
  bg-[length:200%_100%] 
  animate-[shimmer_1.5s_ease-in-out_infinite]
`;

export default function SkeletonLoader() {
  return (
    <main className="relative max-w-120 mx-auto min-h-screen bg-container-radial border-x border-white/5 shadow-lateral flex flex-col items-center gap-4 overflow-x-hidden pb-10">
      <style>{shimmer}</style>

      <div className="w-full h-20 bg-[#082d5e] flex items-center px-6">
        <div className={`w-32 h-8 ${skeletonClass} rounded`} />
      </div>

      <div className="w-full px-5 -mt-16 text-center">
        <div className={`w-3/4 h-10 mx-auto mb-2 ${skeletonClass} rounded`} />
        <div className={`w-1/2 h-6 mx-auto ${skeletonClass} rounded`} />
      </div>

      <div className="w-full px-6">
        <div className="w-full aspect-[2/1] max-h-56 bg-surface-card rounded-xl overflow-hidden">
          <div className={`w-full h-full ${skeletonClass}`} />
        </div>
      </div>

      <div className="w-full px-6 text-left mt-4">
        <div className={`w-40 h-7 ${skeletonClass} rounded mb-2`} />
        <div className={`w-64 h-5 ${skeletonClass} rounded`} />
      </div>

      <div className="w-full px-6 grid grid-cols-2 gap-3.75">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface-card rounded-xl overflow-hidden">
            <div className={`w-full h-27.5 ${skeletonClass}`} />
            <div className="p-3">
              <div className={`w-3/4 h-5 ${skeletonClass} rounded mb-2`} />
              <div className={`w-1/2 h-3 ${skeletonClass} rounded mb-3`} />
              <div className={`w-full h-3 ${skeletonClass} rounded`} />
            </div>
          </div>
        ))}
      </div>

      <div className="w-full px-6 mt-5">
        <div className={`w-64 h-6 mx-auto ${skeletonClass} rounded mb-3`} />
        <div className={`w-72 h-4 mx-auto ${skeletonClass} rounded`} />
      </div>

      <div className="w-full px-6 flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`w-full h-12 ${skeletonClass} rounded-lg`} />
        ))}
      </div>

      <div className="w-full px-6 mt-4">
        <div className={`w-full h-14 ${skeletonClass} rounded-2xl`} />
      </div>
    </main>
  );
}
