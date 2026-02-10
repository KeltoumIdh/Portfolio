import React, { useState, useEffect } from 'react';
import Chatbot from './Chatbot';
import AnimatedCursor from './AnimatedCursor';
import SpaceBackground from './SpaceBackground';
import SocialSidebar from './SocialSidebar';
import './App.css';

const NAV = [
  { id: 'home', label: 'Home' },
  { id: 'insights', label: 'Insights' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const INSIGHTS = [
  { value: '3+', label: 'Projects' },
  { value: '2+', label: 'Years Experience' },
  { value: '8+', label: 'Skills' },
  { value: '100%', label: 'Passion' },
];

// Keltoum Idhssou – from CV
const PROFILE = {
  name: 'Keltoum Idhssou',
  tagline: 'Junior AI & Intelligent Systems Engineer | Full-Stack Developer',
  about: [
    "I'm a dynamic Full-Stack Developer with a strong foundation in modern web technologies (React, Node.js, Laravel), currently specializing in Machine Learning, Deep Learning, and Applied AI.",
    "I'm experienced in end-to-end project development, from UI/UX design in Figma to backend deployment. I've completed hands-on AI training with mini-projects in Computer Vision, ML, DL, and Agentic AI, and I'm actively building expertise in Generative AI and LLM-based solutions.",
  ],
  contact: {
    email: 'keltoumidhssou1710@gmail.com',
    phone: '+212 701 186 600',
    linkedin: 'https://linkedin.com/in/keltoum-idhssou-9a64a1232',
    github: 'https://github.com/KeltoumIdh',
  },
};

const SKILLS = [
  { name: 'React & JavaScript', level: 90 },
  { name: 'Python & OOP', level: 88 },
  { name: 'Machine Learning', level: 85 },
  { name: 'Deep Learning', level: 82 },
  { name: 'Laravel & Node.js', level: 88 },
  { name: 'Data Science & Visualization', level: 80 },
  { name: 'Figma & UI/UX', level: 85 },
  { name: 'Git & Agile', level: 90 },
];

const PROJECTS = [
  {
    title: 'Collaborative E-Vote Web Application',
    description: 'Final year project: full-stack collaborative e-voting application built with React.js, Laravel, and MySQL.',
    tech: ['React', 'Laravel', 'MySQL', 'REST API'],
    category: 'Full-Stack',
    url: 'https://github.com/KeltoumIdh',
  },
  {
    title: 'Full-Stack E-Commerce Website',
    description: 'Complete e-commerce platform with product and order management using Laravel and Bootstrap.',
    tech: ['Laravel', 'Bootstrap', 'PHP', 'MySQL'],
    category: 'Full-Stack',
    url: 'https://github.com/KeltoumIdh',
  },
  {
    title: 'AI Mini-Projects (CV, ML, DL & Agentic AI)',
    description: 'Hands-on projects in Computer Vision, Machine Learning, Deep Learning, and Agentic AI conversational systems.',
    tech: ['Python', 'Scikit-learn', 'Neural Networks', 'NLP'],
    category: 'AI & ML',
    url: 'https://github.com/KeltoumIdh',
  },
];

function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [inView, setInView] = useState(new Set());

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    ['home', 'insights', 'about', 'skills', 'projects', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">
      <SpaceBackground />
      <AnimatedCursor />
      <SocialSidebar />
      <div className="app-content">
      <nav className={`nav ${navScrolled ? 'scrolled' : ''}`}>
        <div className="nav-inner">
          <button className="nav-brand" onClick={() => scrollTo('home')}>Keltoum</button>
          <ul className="nav-links">
            {NAV.map(({ id, label }) => (
              <li key={id}>
                <button onClick={() => scrollTo(id)} className="nav-link">{label}</button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <section id="home" className="section section-hero">
        <div className="hero-content">
          <p className="hero-greeting">Hello, I'm</p>
          <h1 className="hero-title-line">
            <span className="hero-name">{PROFILE.name}</span>
          </h1>
          <p className="hero-tagline">{PROFILE.tagline}</p>
          <p className="hero-desc">Bridging robust software engineering with intelligent systems — from UI/UX to ML & GenAI.</p>
          <div className="hero-cta">
            <button onClick={() => scrollTo('projects')} className="btn btn-primary">View Projects</button>
            <button onClick={() => scrollTo('contact')} className="btn btn-outline">Get in Touch</button>
          </div>
        </div>
        <div className="hero-decoration" aria-hidden />
      </section>

      <section id="insights" className={`section section-insights ${inView.has('insights') ? 'in-view' : ''}`}>
        <div className="section-inner">
          <h2 className="section-title"><span className="section-num">01.</span> By the Numbers</h2>
          <div className="insights-grid">
            {INSIGHTS.map((item) => (
              <div key={item.label} className="insight-card">
                <span className="insight-value">{item.value}</span>
                <span className="insight-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className={`section ${inView.has('about') ? 'in-view' : ''}`}>
        <div className="section-inner">
          <h2 className="section-title"><span className="section-num">02.</span> About Me</h2>
          <div className="about-grid">
            <div className="about-text">
              {PROFILE.about.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <p>When I'm not coding, I enjoy creative coding, travel, and sports — and I love collaborating with teams and learning new tools.</p>
            </div>
            <div className="about-visual">
              <div className="about-avatar-wrap">
                <div className="about-avatar-ring about-avatar-ring--1" aria-hidden />
                <div className="about-avatar-ring about-avatar-ring--2" aria-hidden />
                <img
                  src="/profile.jpg"
                  alt={PROFILE.name}
                  className="about-avatar-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling?.classList.add('about-avatar-fallback--show');
                  }}
                />
                <div className="about-avatar-fallback" aria-hidden />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className={`section section-alt ${inView.has('skills') ? 'in-view' : ''}`}>
        <div className="section-inner">
          <h2 className="section-title"><span className="section-num">03.</span> Tech Stack</h2>
          <div className="tech-stack">
            {SKILLS.map((s, i) => (
              <span key={s.name} className="tech-pill" style={{ animationDelay: `${i * 0.05}s` }}>{s.name}</span>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className={`section ${inView.has('projects') ? 'in-view' : ''}`}>
        <div className="section-inner">
          <h2 className="section-title"><span className="section-num">04.</span> Projects</h2>
          <div className="projects-grid">
            {PROJECTS.map((p, i) => (
              <article key={p.title} className="project-card" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="project-card-visual" aria-hidden />
                <div className="project-card-body">
                  <span className="project-category">{p.category}</span>
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc">{p.description}</p>
                  <div className="project-tech">
                    {p.tech.map(t => <span key={t} className="tech-pill tech-pill--sm">{t}</span>)}
                  </div>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="project-link">
                    View project <span className="project-link-arrow">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className={`section section-contact ${inView.has('contact') ? 'in-view' : ''}`}>
        <div className="section-inner">
          <h2 className="section-title"><span className="section-num">05.</span> Get in Touch</h2>
          <p className="contact-intro">I'd love to hear from you — whether for a project, a chat, or just to connect.</p>
          <div className="contact-cards">
            <a href={`mailto:${PROFILE.contact.email}`} className="contact-card">
              <span className="contact-card-icon" aria-hidden>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </span>
              <span className="contact-card-label">Email</span>
              <span className="contact-card-value">{PROFILE.contact.email}</span>
            </a>
            <a href={`tel:${PROFILE.contact.phone.replace(/\s/g, '')}`} className="contact-card">
              <span className="contact-card-icon" aria-hidden>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </span>
              <span className="contact-card-label">Phone</span>
              <span className="contact-card-value">{PROFILE.contact.phone}</span>
            </a>
            <a href={PROFILE.contact.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card">
              <span className="contact-card-icon" aria-hidden>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v2a2 2 0 0 1 2-2 6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </span>
              <span className="contact-card-label">LinkedIn</span>
              <span className="contact-card-value">Keltoum Idhssou</span>
            </a>
            <a href={PROFILE.contact.github} target="_blank" rel="noopener noreferrer" className="contact-card">
              <span className="contact-card-icon" aria-hidden>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
              </span>
              <span className="contact-card-label">GitHub</span>
              <span className="contact-card-value">KeltoumIdh</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Portfolio. Built with React & AI.</p>
      </footer>
      </div>

      <Chatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} onOpen={() => setChatOpen(true)} />
    </div>
  );
}

export default App;
