import React from "react";

export default function SectionHeading({
  kicker,
  title,
  accent,
  align = "left",
  description,
}) {
  const alignClass = align === "center" ? "text-center" : "text-left";

  return (
    <div className={`space-y-3 ${alignClass}`}>
      {kicker ? (
        <p className="text-xs font-semibold tracking-[0.28em] text-white/60">
          {kicker}
        </p>
      ) : null}
      <h2 className="text-balance text-2xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}{" "}
        {accent ? (
          <span className="bg-linear-to-r from-(--rose) via-(--blush) to-(--mauve) bg-clip-text text-transparent">
            {accent}
          </span>
        ) : null}
      </h2>
      {description ? (
        <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-white/70 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

