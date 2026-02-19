import React from "react";
import Container from "./ui/Container";

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70">
      {children}
    </span>
  );
}

export default function Hero({ profile, onPrimary, onSecondary }) {
  return (
    <section id="home" className="relative pt-28 sm:pt-32">
      <Container className="py-16 sm:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-8">
            <div className="flex flex-wrap gap-2">
              <Pill>AI & Intelligent Systems</Pill>
              <Pill>Full‑Stack Engineering</Pill>
              <Pill>GenAI • ML • DL • LLM</Pill>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold tracking-[0.22em] text-white/60">
                HELLO, I’M
              </p>
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="bg-linear-to-r from-white via-(--blush) to-(--rose) bg-clip-text text-transparent">
                  {profile.name}
                </span>
              </h1>
              <p className="text-pretty text-base leading-relaxed text-white/75 sm:text-lg">
                {profile.tagline}
              </p>
              <p className="max-w-xl text-pretty text-base leading-relaxed text-white/65">
                Bridging robust software engineering with intelligent systems from UI/UX
                to ML & GenAI. I build calm, premium interfaces with production-grade
                foundations.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={onPrimary}
                className={[
                  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white",
                  "bg-linear-to-r from-(--rose) to-(--mauve)",
                  "shadow-[0_10px_40px_rgba(232,180,188,0.25)]",
                  "transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--rose)/70",
                ].join(" ")}
              >
                View Projects
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </button>

              <button
                onClick={onSecondary}
                className={[
                  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold",
                  "border border-white/15 bg-white/5 text-white/80",
                  "hover:bg-white/10 hover:text-white transition",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--rose)/60",
                ].join(" ")}
              >
                Get in touch
              </button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--teal)/80" />
                Based in Morocco
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-(--lavender)/80" />
                Open to opportunities
              </span>
            </div>
          </div>

          <div className="relative">
            {/* Premium portrait card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/4 p-6 backdrop-blur-xl">
              <div className="pointer-events-none absolute -inset-24 bg-linear-to-tr from-(--glow-rose) via-transparent to-(--glow-lavender) blur-3xl opacity-50" />

              <div className="img-harmonize relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0f0c0d] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_70px_rgba(0,0,0,0.55),0_0_42px_rgba(232,180,188,0.14)]">
                <img
                  src="/profile_1.jpg"
                  alt={profile.name}
                  className="img-harmonize-img h-full w-full object-cover opacity-95"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0f0c0d] via-transparent to-transparent opacity-60" />
              </div>

              <div className="relative mt-6 space-y-2">
                <p className="text-sm font-semibold text-white">Focus</p>
                <p className="text-sm leading-relaxed text-white/65">
                  ML/DL • Computer Vision • LLM Apps • Full‑Stack Systems
                </p>
              </div>
            </div>

            {/* Ambient glow */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-(--glow-rose) blur-3xl opacity-40" />
          </div>
        </div>
      </Container>
    </section>
  );
}

