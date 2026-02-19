import React, { useMemo, useState, useEffect, lazy, Suspense } from "react";
import ChatbotDisabled from "./components/chatbot/ChatbotDisabled";
import AnimatedCursor from "./components/cursor/AnimatedCursor";

const Chatbot = lazy(() => import("./components/chatbot/Chatbot"));
import SpaceBackground from "./components/background/SpaceBackground";
import SocialSidebar from "./components/sidebars/SocialSidebar";
import InsightsSidebar from "./components/sidebars/InsightsSidebar";
import "./styles/app.css";
import "./styles/globals.css";
import TechStack from "./features/tech-stack/TechStack";
import Projects from "./features/projects/Projects";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import About from "./components/About";
import Experience from "./components/Experience";
import Contact from "./components/Contact";

const NAV = [
  { id: "home", label: "Home" },
  { id: "insights", label: "Insights" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const INSIGHTS = [
  { value: "3+", label: "Projects" },
  { value: "2+", label: "Years Experience" },
  { value: "8+", label: "Skills" },
  { value: "100%", label: "Passion" },
];

// Keltoum Idhssou – from CV
const PROFILE = {
  name: "Keltoum Idhssou",
  tagline: "Junior AI & Intelligent Systems Engineer | Full-Stack Developer",
  about: [
    "Full-stack developer with a strong foundation in React, Node.js, and Laravel, and a focus on Machine Learning, Deep Learning, and Applied AI.",
    "I work across the stack—from UI/UX in Figma to backend deployment—and I'm building hands-on experience in GenAI, LLMs, and Agentic AI alongside classical ML/DL.",
  ],
  contact: {
    email: "keltoumidhssou1710@gmail.com",
    phone: "+212 701 186 600",
    linkedin: "https://linkedin.com/in/keltoum-idhssou-9a64a1232",
    github: "https://github.com/KeltoumIdh",
  },
};

const EXPERIENCE = [
  {
    role: "Freelance Full-Stack Developer",
    period: "2024–2025",
    company: "Freelance",
    description: "React/Next/Laravel, Node integrations, UI/UX in Figma. Collaborated with Wenaya.",
  },
  {
    role: "Full-Stack Developer",
    period: "Jul 2023 – Jun 2024",
    company: "Wenaya",
    description: "React/Tailwind, Laravel/PostgreSQL, UI performance optimization.",
  },
  {
    role: "Web Dev Intern",
    period: "2023 (1 month)",
    company: "Sofimed Maroc",
    description: "WordPress e-commerce site.",
  },
];

const SKILLS = [
  { name: "React & JavaScript", level: 90 },
  { name: "Python & OOP", level: 88 },
  { name: "Machine Learning (scikit-learn)", level: 85 },
  { name: "Deep Learning (neural nets)", level: 82 },
  { name: "Laravel & Node.js", level: 88 },
  { name: "Data preprocessing & visualization", level: 80 },
  { name: "Figma & UI/UX", level: 85 },
  { name: "Git & Agile", level: 90 },
];

const PROJECTS = [
  {
    title: "Collaborative E-Vote Web Application",
    description:
      "Final year project: full-stack collaborative e-voting application built with React.js, Laravel, and MySQL.",
    tech: ["React", "Laravel", "MySQL", "REST API"],
    category: "Full-Stack",
    url: "https://github.com/KeltoumIdh",
  },
  {
    title: "Full-Stack E-Commerce Website",
    description:
      "Complete e-commerce platform with product and order management using Laravel and Bootstrap.",
    tech: ["Laravel", "Bootstrap", "PHP", "MySQL"],
    category: "Full-Stack",
    url: "https://github.com/KeltoumIdh",
  },
  {
    title: "AI Mini-Projects (CV, ML, DL & Agentic AI)",
    description:
      "Hands-on projects in Computer Vision, Machine Learning, Deep Learning, and Agentic AI conversational systems.",
    tech: ["Python", "Scikit-learn", "Neural Networks", "NLP"],
    category: "AI & ML",
    url: "https://github.com/KeltoumIdh",
  },
];

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [inView, setInView] = useState(new Set());

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (navOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [navOpen]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        setInView((prev) => {
          const next = new Set(prev);
          entries.forEach((e) => {
            if (e.isIntersecting) next.add(e.target.id);
          });
          return next;
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    ["home", "insights", "about", "experience", "skills", "projects", "contact"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el) obs.observe(el);
      },
    );
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  const activeId = useMemo(() => {
    for (let i = NAV.length - 1; i >= 0; i--) {
      const id = NAV[i].id;
      if (inView.has(id)) return id;
    }
    return "home";
  }, [inView]);

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />
      <AnimatedCursor />
      <SocialSidebar />
      <InsightsSidebar />
      <div className="relative z-10">
        <Navbar
          items={NAV}
          activeId={activeId}
          scrolled={navScrolled}
          open={navOpen}
          onToggle={() => setNavOpen((o) => !o)}
          onNavigate={scrollTo}
        />

        <main>
          <Hero
            profile={PROFILE}
            onPrimary={() => scrollTo("projects")}
            onSecondary={() => scrollTo("contact")}
          />
          <Stats items={INSIGHTS} />
          <About paragraphs={PROFILE.about} />
          <Experience items={EXPERIENCE} />
          <TechStack />
          <Projects />
          <Contact contact={PROFILE.contact} />

          <footer className="border-t border-white/10 py-10">
            <div className="mx-auto max-w-6xl px-4 text-center text-sm text-white/50 sm:px-6 lg:px-8">
              © {new Date().getFullYear()} Portfolio. Built with React & AI.
            </div>
          </footer>
        </main>
      </div>

      {import.meta.env.PROD ? (
        <ChatbotDisabled />
      ) : (
        <Suspense fallback={null}>
          <Chatbot
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            onOpen={() => setChatOpen(true)}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
