import Link from "next/link";

export default function Header({ label = "INTRO" }: { label?: string }) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-4 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-sm font-semibold uppercase tracking-tight">
          Skinstric
        </Link>
        <span className="text-[10px] font-semibold tracking-[0.2em] text-foreground/60">
          [ {label} ]
        </span>
      </div>
      <button
        type="button"
        className="bg-foreground px-3 py-2 text-[10px] font-semibold tracking-[0.15em] text-white"
      >
        ENTER CODE
      </button>
    </header>
  );
}
