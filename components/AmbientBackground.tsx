export default function AmbientBackground() {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-[120vh] w-full bg-transparent pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-0 h-full w-full [background:radial-gradient(125%_100%_at_50%_-30%,#6366f125_0%,transparent_100%)]" />
    </div>
  );
}
