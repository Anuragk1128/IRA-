export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <img
          src="/Ira_Logo.svg"
          alt="IRA logo"
          className="h-20 w-20 md:h-24 md:w-24 animate-pulse"
          loading="eager"
        />
        <div className="flex items-center gap-2 text-sm text-black/60">
          <span className="h-2 w-2 rounded-full bg-black/60 animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-2 w-2 rounded-full bg-black/60 animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-2 w-2 rounded-full bg-black/60 animate-bounce"></span>
        </div>
      </div>
    </div>
  )
}
