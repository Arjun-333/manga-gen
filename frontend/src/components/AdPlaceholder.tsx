export default function AdPlaceholder() {
  return (
    <div className="w-full h-64 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col items-center justify-center relative overflow-hidden my-4 group cursor-pointer">
      <div className="absolute top-2 right-2 px-1 rounded bg-neutral-800 text-[10px] text-neutral-500 border border-neutral-700">
        Ad
      </div>
      
      <div className="z-10 text-center">
        <h3 className="text-xl font-bold text-neutral-300 group-hover:text-blue-400 transition-colors">
          Support Manga Gen
        </h3>
        <p className="text-sm text-neutral-500 mt-2 max-w-xs mx-auto">
          Get unlimited high-speed generation with Premium.
        </p>
        <button className="mt-4 px-4 py-2 bg-white/10 rounded-full text-xs font-bold text-neutral-300 hover:bg-blue-500 hover:text-white transition-colors">
          Video playing in 5s...
        </button>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]"></div>
    </div>
  );
}
