import React from "react";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

export default function About({ paragraphs }) {
  return (
    <section id="about" className="relative">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="space-y-8">
            <SectionHeading
              kicker="01. ABOUT"
              title="About"
              accent="Me"
              description="Full-stack (React/Node/Laravel) + ML/DL/Applied AI + GenAI/LLM + Agentic AI."
            />

            <div className="space-y-5 text-base leading-relaxed text-white/70">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-pretty">
                  {p}
                </p>
              ))}
              <p className="text-pretty">
                When I'm not coding, I enjoy creative coding, travel, and sports — and I
                love collaborating with teams and learning new tools.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/4 p-6 backdrop-blur-xl">
              <div className="pointer-events-none absolute -inset-24 bg-linear-to-tr from-(--glow-lavender) via-transparent to-(--glow-rose) blur-3xl opacity-50" />

              <div className="img-harmonize relative overflow-hidden rounded-2xl border border-white/10 bg-[#0f0c0d] shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_24px_70px_rgba(0,0,0,0.55),0_0_42px_rgba(232,180,188,0.12)]">
                <div className="aspect-4/5 w-full">
                  <img
                    src="/profile.jpg"
                    alt="Portrait"
                    className="img-harmonize-img h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-[#0f0c0d] via-transparent to-transparent opacity-60" />
              </div>

              <div className="relative mt-5 grid gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs font-semibold tracking-[0.22em] text-white/55 uppercase">
                    Strengths
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    Product-minded UI • Clean architecture • Practical ML
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs font-semibold tracking-[0.22em] text-white/55 uppercase">
                    I like working on
                  </p>
                  <p className="mt-1 text-sm text-white/70">
                    LLM apps • CV pipelines • Full-stack systems • UX polish
                  </p>
                </div>
              </div>
            </div>

            <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-(--glow-mauve) blur-3xl opacity-35" />
          </div>
        </div>
      </Container>
    </section>
  );
}

