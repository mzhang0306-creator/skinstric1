// Nested rotating dotted "diamonds" — the recurring Skinstric background motif.
export default function RotatingDiamonds() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="diamond-spin-slow absolute h-[560px] w-[560px] max-h-[80vw] max-w-[80vw] border border-dotted border-foreground/25" />
      <div className="diamond-spin absolute h-[460px] w-[460px] max-h-[66vw] max-w-[66vw] border border-dotted border-foreground/20" />
      <div className="diamond-spin-reverse absolute h-[360px] w-[360px] max-h-[52vw] max-w-[52vw] border border-dotted border-foreground/15" />
    </div>
  );
}
