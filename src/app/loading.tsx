"use client";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      {/* Animated Logo */}
      <div className="relative mb-8 flex h-24 w-24 items-center justify-center">
        {/* Outer Glow */}
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/10 blur-xl" />

        {/* Rotating Ring */}
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-border border-t-primary border-r-muted-foreground/50" />

        {/* Inner Circle */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-border bg-linear-to-br from-primary/10 via-muted to-transparent shadow-lg shadow-primary/10">
          <span className="bg-linear-to-br from-primary to-muted-foreground bg-clip-text text-4xl font-extrabold text-transparent">
            S
          </span>
        </div>

        {/* Orbiting Dot */}
        <div className="absolute inset-0 animate-spin">
          <div className="absolute -top-1 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-background bg-primary shadow-md shadow-primary/30" />
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
      <div className="mt-7 h-1 w-36 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/2 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-linear-to-r from-primary via-muted-foreground to-primary" />
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
