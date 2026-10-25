"use client";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      {/* Animated Logo */}
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
        {/* Outer Glow */}
        <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-xl animate-pulse" />

        {/* Rotating Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-violet-500/10 border-t-violet-600 border-r-purple-400 animate-spin" />

        {/* Inner Circle */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-violet-500/20 bg-linear-to-br from-violet-500/15 via-purple-500/10 to-transparent shadow-lg shadow-violet-500/10">
          <span className="bg-linear-to-br from-violet-500 to-purple-400 bg-clip-text text-4xl font-extrabold text-transparent">
            S
          </span>
        </div>

        {/* Orbiting Dot */}
        <div className="absolute inset-0 animate-spin">
          <div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-background bg-violet-500 shadow-md shadow-violet-500/40" />
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Saraha
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">
        Getting everything ready for you
      </p>

      {/* Loading Progress Indicator */}
      <div className="mt-7 h-1 w-36 overflow-hidden rounded-full bg-violet-500/10">
        <div className="h-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-linear-to-r from-violet-500 via-purple-500 to-violet-400" />
      </div>

      <p className="mt-4 text-xs font-medium tracking-wide text-muted-foreground/70">
        PLEASE WAIT
      </p>

      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}
