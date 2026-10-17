import Link from "next/link";
import EnterCode from "@/components/EnterCode";

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
      <EnterCode />
    </header>
  );
}
