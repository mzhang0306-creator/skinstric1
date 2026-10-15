import Link from "next/link";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="relative h-screen overflow-hidden">
      <Header label="INTRO" />

      {/* Large faint dotted squares bleeding off each edge (inner corner
          points toward the DISCOVER / TAKE TEST diamonds) */}
      <span className="pointer-events-none absolute left-0 top-1/2 h-[82vh] w-[82vh] -translate-x-[58%] -translate-y-1/2 rotate-45 border border-dotted border-foreground/20" />
      <span className="pointer-events-none absolute right-0 top-1/2 h-[82vh] w-[82vh] translate-x-[58%] -translate-y-1/2 rotate-45 border border-dotted border-foreground/20" />

      {/* Centered hero */}
      <div className="flex h-full flex-col items-center justify-center text-center">
        <h1 className="text-[13vw] font-normal leading-[0.85] tracking-tight md:text-[7vw]">
          Sophisticated
          <br />
          skincare
        </h1>
      </div>

      {/* Left: discover */}
      <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 items-center gap-4 sm:left-8 md:flex">
        <span className="flex h-12 w-12 rotate-45 items-center justify-center border border-foreground">
          <FaAngleLeft className="-rotate-45" />
        </span>
        <span className="text-xs font-medium tracking-wide">DISCOVER A.I.</span>
      </div>

      {/* Right: take test -> intro flow */}
      <Link
        href="/testing"
        className="group absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-4 sm:right-8"
      >
        <span className="text-xs font-medium tracking-wide">TAKE TEST</span>
        <span className="flex h-12 w-12 rotate-45 items-center justify-center border border-foreground transition-colors group-hover:bg-foreground">
          <FaAngleRight className="-rotate-45 transition-colors group-hover:text-white" />
        </span>
      </Link>

      {/* Bottom-left blurb */}
      <p className="absolute bottom-8 left-4 max-w-xs text-[11px] font-medium uppercase leading-relaxed tracking-wide text-foreground/70 sm:left-8">
        Skinstric developed an A.I. that creates a highly-personalised routine
        tailored to what your skin needs.
      </p>
    </main>
  );
}
