import React from "react";
import Container from "./ui/Container";
import SectionHeading from "./ui/SectionHeading";

export default function Experience({ items }) {
  return (
    <section id="experience" className="relative">
      <Container className="py-16 sm:py-20">
        <div className="space-y-10">
          <SectionHeading
            kicker="02. EXPERIENCE"
            title="Experience"
            description="Professional roles and collaborations."
          />
          <div className="space-y-8">
            {items.map((job, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/4 p-6 backdrop-blur-xl transition hover:border-white/15 hover:bg-white/6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold text-white">
                    {job.role}
                  </h3>
                  <span className="text-sm text-white/60">{job.period}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-white/70">
                  {job.company}
                </p>
                <p className="mt-3 text-pretty text-sm leading-relaxed text-white/70">
                  {job.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
