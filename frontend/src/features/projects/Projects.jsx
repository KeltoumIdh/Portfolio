import React, { useEffect, useRef, useState } from "react";
import Container from "../../components/ui/Container";
import SectionHeading from "../../components/ui/SectionHeading";

function ExternalLinkIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GithubIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
    </svg>
  );
}

const PROJECTS = [
  {
    number: "03",
    title: "EIE - Earthquake Impact Estimator",
    category: "IoT / Hardware",
    description:
      "IoT-based earthquake detection and impact estimation system using Arduino, sensors, and ML for real-time seismic analysis.",
    tech: ["Arduino", "C++", "IoT Sensors", "Python", "ML", "React"],
    githubUrl: "https://github.com/KeltoumIdh",
    linkedinUrl: "#",
    image: "/api/placeholder/400/300",
  },
  {
    number: "04",
    title: "GameKroy",
    category: "Full Stack",
    description:
      "Full-featured gaming e-commerce platform with user authentication, payment integration, and real-time inventory management.",
    tech: ["React", "Node.js", "MongoDB", "Express", "Stripe", "TailwindCSS"],
    githubUrl: "https://github.com/KeltoumIdh",
    linkedinUrl: "#",
    image: "/api/placeholder/400/300",
  },
  {
    number: "05",
    title: "AI Chess Engine",
    category: "AI / ML",
    description:
      "Advanced chess engine powered by neural networks with real-time move prediction and difficulty adjustment using deep learning algorithms.",
    tech: ["Python", "C++", "Neural Networks", "Bitboards", "UCI Protocol"],
    githubUrl: "https://github.com/KeltoumIdh",
    linkedinUrl: "#",
    image: "/api/placeholder/400/300",
  },
];

function ProjectCard({ project, index, isVisible }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className={[
        "group relative overflow-hidden rounded-2xl project-card-theme",
        "border border-white/10 bg-linear-to-br from-white/5 to-transparent",
        "backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
        "transition-all duration-700 ease-out",
        "hover:-translate-y-3 hover:scale-[1.02]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12",
      ].join(" ")}
      style={{
        transitionDelay: `${index * 150}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-linear-to-br from-rose-500/10 via-[rgb(201,160,160)]/20 to-transparent" />
      </div>

      {/* Project number watermark */}
      <div className="absolute right-6 top-4 z-10">
        <span
          className={[
            "text-7xl font-bold transition-all duration-500",
            isHovered ? "text-white/20 scale-110" : "text-white/5",
          ].join(" ")}
        >
          {project.number}
        </span>
      </div>

      {/* Content container */}
      <div className="relative z-20 flex h-full flex-col p-8">
        {/* Category badge */}
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-200 backdrop-blur-sm">
            {project.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-4 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-rose-200">
          {project.title}
        </h3>

        {/* Description */}
        <p className="mb-6 grow text-sm leading-relaxed text-white/70">
          {project.description}
        </p>

        {/* Tech stack tags */}
        <div className="mb-6 flex flex-wrap gap-2">
          {project.tech.map((tech, i) => (
            <span
              key={i}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-rose-400/50 hover:bg-rose-400/10"
              style={{
                transitionDelay: `${i * 50}ms`,
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Footer with social icons */}
        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <div className="flex gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-rose-400/50 hover:bg-rose-400/10 hover:text-white hover:scale-110"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href={project.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-rose-400/50 hover:bg-rose-400/10 hover:text-white hover:scale-110"
            >
              <LinkedInIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-rose-400/50 hover:bg-rose-400/10 hover:text-white hover:scale-110"
            >
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 backdrop-blur-sm transition-all duration-300 hover:border-rose-400/50 hover:bg-rose-400/10 hover:text-white hover:scale-110"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>

          {/* Project image placeholder */}
          <div className="h-10 w-16 overflow-hidden rounded-lg border border-white/10 bg-linear-to-br from-rose-500/20 to-[rgb(201,160,160)]/20">
            <div className="flex h-full w-full items-center justify-center text-xs text-white/40">
              IMG
            </div>
          </div>
        </div>
      </div>

      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-rose-400/20 via-[rgb(201,160,160)]/20 to-rose-400/20 blur-sm" />
      </div>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-linear-to-r from-rose-400 via-[rgb(201,160,160)] to-rose-400 shadow-[0_0_10px_rgba(232,180,188,0.5)] transition-all duration-700 group-hover:w-full" />
    </article>
  );
}

export default function Projects() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -80px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden py-16 sm:py-20"
    >
      {/* Background – theme rose/mauve (no white dots) */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full projects-bg-glow-left" />
        <div className="absolute right-1/4 top-1/2 h-[500px] w-[500px] rounded-full projects-bg-glow-right" />
      </div>

      <Container>
        <div className="relative">
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(30px)",
            }}
          >
            <SectionHeading
              kicker="04. WORK"
              title="My"
              accent="Work"
              description="Selected projects blending full‑stack engineering with AI and intelligent systems."
            />
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((project, i) => (
              <ProjectCard
                key={project.number}
                project={project}
                index={i}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}