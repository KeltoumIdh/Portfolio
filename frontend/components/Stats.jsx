import React from "react";
import Container from "./Container";

export default function Stats({ items }) {
  return (
    <section id="insights" className="relative">
      <Container className="py-10 sm:py-12">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div
              key={it.label}
              className={[
                "group relative overflow-hidden rounded-2xl border border-white/10",
                "bg-white/[0.04] backdrop-blur-xl",
                "px-5 py-5 transition",
                "hover:border-white/15 hover:bg-white/[0.06]",
              ].join(" ")}
            >
              <div className="pointer-events-none absolute -inset-20 bg-gradient-to-tr from-[var(--glow-rose)] via-transparent to-[var(--glow-mauve)] blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-40" />
              <p className="relative text-2xl font-semibold tracking-tight text-white">
                {it.value}
              </p>
              <p className="relative mt-1 text-xs font-semibold tracking-[0.22em] text-white/55 uppercase">
                {it.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

