import React from "react";
import Container from "./Container";

export default function Navbar({
  items,
  activeId,
  scrolled,
  open,
  onToggle,
  onNavigate,
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <Container className="py-4">
        <div
          className={[
            "relative flex items-center justify-between rounded-2xl border border-white/10",
            "bg-[#140f11]/60 backdrop-blur-xl",
            "px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.35)]",
            scrolled ? "bg-[#140f11]/80" : "",
          ].join(" ")}
        >
          <button
            onClick={() => onNavigate("home")}
            className="group inline-flex items-center gap-2 rounded-xl px-2 py-1 text-left"
          >
            <span className="text-lg font-semibold tracking-tight text-white">
              Keltoum
            </span>
            <span className="hidden text-xs font-medium text-white/50 sm:inline">
              AI × Full‑Stack
            </span>
            <span className="pointer-events-none absolute left-6 top-1/2 -z-10 h-8 w-32 -translate-y-1/2 rounded-full bg-(--glow-rose) blur-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Primary">
            {items.map((item) => {
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "relative rounded-full px-4 py-2 text-sm font-medium transition",
                    "text-white/70 hover:text-white",
                    "hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--rose)/60 focus-visible:ring-offset-0",
                    isActive ? "text-white bg-white/5" : "",
                  ].join(" ")}
                >
                  {item.label}
                  {isActive ? (
                    <span className="absolute inset-x-4 -bottom-1 h-px bg-linear-to-r from-transparent via-(--rose) to-transparent" />
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={onToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 shadow-sm transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--rose)/60 sm:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <div className="relative h-4 w-5">
              <span
                className={[
                  "absolute left-0 top-0 h-0.5 w-5 rounded bg-current transition-transform duration-200",
                  open ? "translate-y-[7px] rotate-45" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-[7px] h-0.5 w-5 rounded bg-current transition-opacity duration-200",
                  open ? "opacity-0" : "opacity-100",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute left-0 top-[14px] h-0.5 w-5 rounded bg-current transition-transform duration-200",
                  open ? "-translate-y-[7px] -rotate-45" : "",
                ].join(" ")}
              />
            </div>
          </button>

          {/* Mobile overlay */}
          <div
            className={[
              "absolute left-0 right-0 top-full mt-3 overflow-hidden rounded-2xl border border-white/10",
              "bg-[#140f11]/90 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.45)]",
              "transition-all duration-200 sm:hidden",
              open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <nav className="flex flex-col p-2" aria-label="Mobile">
              {items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={[
                      "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base",
                      "text-white/80 hover:bg-white/5 hover:text-white",
                      isActive ? "bg-white/5 text-white" : "",
                    ].join(" ")}
                  >
                    <span>{item.label}</span>
                    {isActive ? (
                      <span className="h-1.5 w-1.5 rounded-full bg-(--rose) shadow-[0_0_18px_rgba(232,180,188,0.6)]" />
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </Container>
    </header>
  );
}

