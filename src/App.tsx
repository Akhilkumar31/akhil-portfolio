import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Code2,
  Database,
  Boxes,
  Server,
  Rocket,
  Terminal,
  ShieldCheck,
  Cloud,
  Cpu,
  Globe,
  Layout,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  X,
} from "lucide-react";

/** ========================= CONFIG ========================= */
const CONFIG = {
  name: "Akhil Kumar Puri",
  title: "Full-Stack Engineer",
  location: "Glassboro, NJ",
  email: "puriakhil74@gmail.com",
  phone: "(856) 565-8270",
  linkedin: "https://www.linkedin.com/in/akhilkumarpuri1/",
  github: "https://github.com/Akhilkumar31",
  hero:
    "I design, build, and ship robust systems—pairing clean APIs with expressive, accessible UI. Performance-minded. Product-obsessed.",
  highlights: [
    { icon: <Code2 className="w-4 h-4" />, text: "Java, C++, Python, JavaScript" },
    { icon: <Server className="w-4 h-4" />, text: "React · Node · Express" },
    { icon: <Database className="w-4 h-4" />, text: "MySQL · MongoDB · SQL Server" },
    { icon: <Cloud className="w-4 h-4" />, text: "Docker · AWS" },
    { icon: <ShieldCheck className="w-4 h-4" />, text: "CI/CD · Testing" },
    { icon: <Cpu className="w-4 h-4" />, text: "Concurrency · Systems" },
  ],
  projects: [
    {
      id: "hotel",
      tag: "Case Study",
      name: "Hotel Reservation System",
      stack: ["PHP", "MySQL", "Bootstrap", "MVC"],
      blurb:
        "Full-stack booking platform with dynamic pricing, secure auth, and concurrency-safe workflows.",
      cta: { label: "View Demo", href: "#" },
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1400&auto=format&fit=crop",
      metrics: [
        { k: "Bookings/min", v: "+40%" },
        { k: "Auth fail", v: "-90%" },
        { k: "TTFB", v: "<150ms" },
      ],
      body:
        "Designed MVC modules, optimized queries with proper indexing and transactions, and added concurrency-safe booking holds.",
    },
    {
      id: "tindog",
      tag: "UX Build",
      name: "Tindog Website",
      stack: ["HTML", "CSS", "Bootstrap"],
      blurb:
        "Mobile-first SPA for pet owners; sleek, animated UI with semantic markup and fast loads.",
      cta: { label: "Open Site", href: "#" },
      image:
        "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop",
      metrics: [
        { k: "CLS", v: "0.01" },
        { k: "LCP", v: "<2.1s" },
        { k: "Bounce", v: "-18%" },
      ],
      body:
        "Crafted animations, optimized images, and ensured accessibility (WCAG AA).",
    },
    {
      id: "portal",
      tag: "Platform",
      name: "Dev Workflow Automation Portal",
      stack: ["React", "Node", "Express", "MongoDB/MySQL", "JWT", "Docker", "AWS"],
      blurb:
        "Automation dashboard for distributed jobs with real-time logs, RBAC, and cloud-native deploys.",
      cta: { label: "Explore", href: "#" },
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop",
      metrics: [
        { k: "MTTR", v: "-35%" },
        { k: "Deploy time", v: "-50%" },
        { k: "Coverage", v: "+20%" },
      ],
      body:
        "Real-time streaming logs, job orchestration, and dockerized deployments on AWS.",
    },
  ],
  experience: [
    {
      org: "Xact IT Solutions",
      role: "Java & C++ Developer Intern",
      time: "Jun 2025 – Sep 2025",
      points: [
        "Engineered and optimized Java and C++ application modules, integrating with MySQL for efficient data storage, retrieval, concurrency control, and transactional processing.",
        "Designed and consumed RESTful APIs to facilitate seamless interoperability between distributed systems and client-facing applications.",
        "Applied MVC architecture and OOP principles to enforce modularity, scalability, and maintainability across the codebase.",
        "Leveraged GitHub for collaborative version control, engaged in pair programming and code reviews, and participated in Agile sprint cycles to deliver iterative, high-quality releases",
      ],
    },
    {
      org: "Informatica (MDM)",
      role: "Software Engineer",
      time: "Sep 2022 – Sep 2023",
      points: [
        "Designed and implemented C++ and Python utilities to automate diagnostics and performance tuning, helping reduce manual troubleshooting effort by ~10%.",
        "Contributed to feature development and debugging in the Informatica MDM Suite (Hub, IDD, ActiveVOS, Business Entity Services, Hierarchy Manager), used by enterprise clients.",
        "Improved match & merge rules and survivorship logic, enhancing data quality and slightly reducing duplicate records in test environments.",
        "Applied concurrency concepts and OS-level knowledge (Linux/Windows) to optimize system stability and performance during customer deployments.",
        "Collaborated with cross-functional teams to test, review, and ship enhancements, gaining experience with CI/CD workflows.",
        "Created technical documentation and internal tools, which made issue resolution and knowledge sharing faster for the team.",
      ],
    },
  ],
  education: {
    school: "Rowan University",
    degree: "M.S. Computer Science (GPA 3.9)",
    time: "Expected Dec 2025",
  },
  certifications: [
    "AWS Cloud Practitioner",
    "AWS Data Engineer Associate",
    "AWS Machine Learning Engineer Associate",
    "Oracle Generative AI Professional",
    "Google Fundamentals of Digital Marketing",
  ],
} as const;

const ABOUT = {
  p1: `As a passionate Software Engineer specializing in Java and full-stack development, I thrive on building robust, scalable solutions for modern enterprises. With hands-on experience at industry leaders like Informatica, where I supported global clients and engineered critical enterprise MDM solutions, I’ve developed deep expertise in cloud computing, automation, and system optimization.`,
  p2: `Currently, I’m pursuing my M.S. in Computer Science at Rowan University (GPA 3.9), sharpening my technical acumen while interning as a Java Developer at Xact IT Solutions. There, I’ve contributed to the design and optimization of cloud-based applications, leveraging AWS, REST APIs, and MVC architecture.`,
  p3: `My technical toolkit includes Java, C++, React, Node.js, Python, PHP, MySQL, and AWS Cloud, complemented by certifications from both AWS and Oracle. I’m driven by a desire to solve complex challenges and deliver high-quality, reliable software that empowers organizations to scale.`,
  p4: `Let’s connect if you’re interested in discussing cloud-native development, enterprise architecture, or opportunities to collaborate on innovative software solutions!`,
};

/** ============ Types derived from CONFIG (after declaration) ============ */
type Project = (typeof CONFIG)["projects"][number];

/** ========================= UTIL & PRIMITIVES ========================= */
const fade = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

type GlassProps = { children: React.ReactNode; className?: string; dark?: boolean };
function Glass({ children, className = "", dark = false }: GlassProps) {
  return (
    <div
      className={
        (dark
          ? "relative rounded-2xl border border-white/10 bg-white/5 "
          : "relative rounded-2xl border border-slate-200 bg-white ") +
        " shadow-[0_10px_30px_-10px_rgba(2,6,23,0.15)] " +
        className
      }
    >
      {children}
    </div>
  );
}

type ChipProps = { icon: React.ReactNode; children: React.ReactNode };
function Chip({ icon, children }: ChipProps) {
  return (
    <span className="pill inline-flex items-center gap-1 px-3 py-1 text-xs">
      {icon}
      <span className="relative z-10">{children}</span>
    </span>
  );
}

type MagneticProps = { className?: string; children: React.ReactNode };
const Magnetic = ({ className = "", children }: MagneticProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [t, setT] = React.useState({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        setT({ x: mx * 0.08, y: my * 0.08 });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0 })}
      className={className}
      style={{
        transform: `translate3d(${t.x}px, ${t.y}px, 0)`,
        transition: "transform 120ms ease-out",
      }}
    >
      {children}
    </div>
  );
};

type ParallaxProps = { speed?: number; className?: string; children: React.ReactNode };
const ParallaxLayer = ({ speed = 0.05, className = "", children }: ParallaxProps) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      el.style.transform = `translate3d(${x * 20 * speed}px, ${y * 14 * speed}px, 0)`;
    };
    const onScroll = () => {
      const y = window.scrollY;
      el.style.opacity = String(Math.max(0.6, 1 - y / 1400));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};

// Replace your existing Mascot component with this:

type MascotProps = { isDark: boolean; triggerKey: number };

const Mascot = ({ isDark, triggerKey }: MascotProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${triggerKey}-${isDark ? "dark" : "light"}`}
        className="pointer-events-none absolute right-6 top-6 sm:right-10 sm:top-10 z-30"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.25, ease: "easeOut" }} // faster fade
      >
        <div className="relative h-32 w-56">
          {/* Pedestal */}
          <motion.div
            className="absolute left-1/2 top-10 -translate-x-1/2 h-2 w-28 rounded-full"
            style={{ background: isDark ? "rgba(255,255,255,.10)" : "rgba(2,6,23,.08)" }}
            initial={{ scaleX: 0.7, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.25 }} // snappier
          />

          {/* Sun / Moon being placed */}
          <motion.div
            key={isDark ? "moon" : "sun"}
            className="absolute left-1/2 -translate-x-1/2"
            initial={{ y: -24, opacity: 0, scale: 0.9 }}
            animate={{ y: 8, opacity: 1, scale: 1 }}
            exit={{ y: -18, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 14, duration: 0.35 }} // faster spring
          >
            {isDark ? (
              <Moon className="h-8 w-8 text-slate-200 drop-shadow" />
            ) : (
              <Sun className="h-8 w-8 text-amber-400 drop-shadow" />
            )}
          </motion.div>

          {/* Courier */}
          <motion.svg
            viewBox="0 0 120 60"
            className="absolute bottom-2 right-2 h-12 w-24"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }} // quicker entry
            aria-hidden
          >
            {isDark ? (
              // Owl
              <>
                <ellipse cx="50" cy="30" rx="18" ry="20" fill="#94a3b8" />
                <ellipse cx="43" cy="27" rx="5" ry="6" fill="#cbd5e1" />
                <ellipse cx="57" cy="27" rx="5" ry="6" fill="#cbd5e1" />
                <circle cx="43" cy="28" r="2" fill="#0f172a" />
                <circle cx="57" cy="28" r="2" fill="#0f172a" />
                <polygon points="50,32 46,36 54,36" fill="#f59e0b" />
                <motion.ellipse
                  cx="64"
                  cy="34"
                  rx="10"
                  ry="12"
                  fill="#64748b"
                  animate={{ rotate: [0, 6, -3, 0] }}
                  transform-origin="64px 34px"
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            ) : (
              // Bird
              <>
                <ellipse cx="50" cy="32" rx="16" ry="12" fill="#60a5fa" />
                <circle cx="58" cy="26" r="7" fill="#93c5fd" />
                <circle cx="60" cy="24" r="2" fill="#0c4a6e" />
                <polygon points="66,26 74,22 66,18" fill="#f59e0b" />
                <motion.ellipse
                  cx="40"
                  cy="30"
                  rx="10"
                  ry="8"
                  fill="#3b82f6"
                  animate={{ rotate: [0, -8, 4, 0] }}
                  transform-origin="40px 30px"
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </>
            )}
          </motion.svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};




type CaseStudyModalProps = { open: boolean; onClose: () => void; project: Project };
const CaseStudyModal = ({ open, onClose, project }: CaseStudyModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" aria-modal>
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute inset-0 overflow-auto">
        <div className="mx-auto max-w-5xl p-4 sm:p-8">
          <Glass className="overflow-hidden" dark>
            <div className="relative h-64 sm:h-96">
              <img src={project.image} alt={project.name} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={onClose}
                className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm ring-1 ring-white/15 hover:bg-white/20"
              >
                <X className="h-4 w-4" /> Close
              </button>
              <div className="absolute bottom-4 left-4">
                <div className="text-xs uppercase tracking-wider text-white/70">{project.tag}</div>
                <h3 className="text-2xl font-semibold text-white">{project.name}</h3>
              </div>
            </div>
            <div className="grid gap-6 p-6 sm:grid-cols-3">
              <div className="sm:col-span-2 text-white/90 leading-relaxed">
                {project.body}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((s, i) => (
                    <span key={i} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] ring-1 ring-white/15">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 text-sm text-white/70">Key Metrics</div>
                <div className="grid grid-cols-3 gap-2">
                  {project.metrics.map((m, i) => (
                    <div key={i} className="rounded-lg bg-white/10 p-3 text-center ring-1 ring-white/10">
                      <div className="text-lg font-bold text-emerald-300">{m.v}</div>
                      <div className="text-[11px] text-white/70">{m.k}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Glass>
        </div>
      </div>
    </div>
  );
};

/** ========================= PAGE ========================= */
export default function App() {
  // theme
  const [theme, setTheme] = React.useState<"light" | "dark">(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (stored === "light" || stored === "dark") return stored;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  });
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  const isDark = theme === "dark";
  const [isFading, setIsFading] = React.useState(false);
  const [mascotKey, setMascotKey] = React.useState(0);
  const toggleTheme = () => {
    setIsFading(true);
    setTheme(isDark ? "light" : "dark");
    setMascotKey((k) => k + 1);
    setTimeout(() => setIsFading(false), 450);
  };

  // exp carousel
  const [expIndex, setExpIndex] = React.useState(0);
  const [expDir, setExpDir] = React.useState(1 as 1 | -1);
  const nextExp = () => {
    setExpDir(1);
    setExpIndex((i) => (i + 1) % CONFIG.experience.length);
  };
  const prevExp = () => {
    setExpDir(-1);
    setExpIndex((i) => (i - 1 + CONFIG.experience.length) % CONFIG.experience.length);
  };

  // case study modal
  const [openId, setOpenId] = React.useState<string | null>(null);
  const activeProject = CONFIG.projects.find((p) => p.id === openId) || null;

  // Experience card variants
  const expVariants = {
    initial: (dir: 1 | -1) => ({ x: dir * 24, opacity: 0, scale: 0.98 }),
    animate: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.35, ease: "easeOut" } },
    exit: (dir: 1 | -1) => ({ x: -dir * 24, opacity: 0, scale: 0.98, transition: { duration: 0.25, ease: "easeIn" } }),
  };

  return (
    <div className={isDark ? "min-h-screen bg-slate-950 text-white" : "min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white text-slate-900"}>
      {/* NAV */}
      <header className="w-full px-6 py-6 sm:px-8">
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <div className="relative">
              <div
                className={
                  (isDark
                    ? "absolute -inset-1 rounded-xl bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-emerald-400 opacity-50 blur"
                    : "absolute -inset-1 rounded-xl bg-gradient-to-r from-fuchsia-400 via-cyan-400 to-emerald-400 opacity-50 blur")
                }
              />
              <div
                className={
                  (isDark
                    ? "relative grid h-9 w-9 place-items-center rounded-xl bg-slate-900 ring-1 ring-white/15"
                    : "relative grid h-9 w-9 place-items-center rounded-xl bg-white ring-1 ring-slate-200")
                }
              >
                <Layout className={isDark ? "h-5 w-5 text-white/90" : "h-5 w-5 text-slate-900"} />
              </div>
            </div>
            <span className="font-semibold tracking-tight">Akhil</span>
          </a>
          <nav className="hidden gap-6 text-sm md:flex">
            <a href="#work" className={isDark ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900"}>
              Work
            </a>
            <a href="#experience" className={isDark ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900"}>
              Experience
            </a>
            <a href="#stack" className={isDark ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900"}>
              Stack
            </a>
            <a href="#contact" className={isDark ? "text-white/80 hover:text-white" : "text-slate-600 hover:text-slate-900"}>
              Contact
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Magnetic>
              <button
                onClick={toggleTheme}
                className={
                  isDark
                    ? "inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15"
                    : "inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm ring-1 ring-slate-200 hover:bg-slate-200/50"
                }
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span>{isDark ? "Day" : "Night"}</span>
              </button>
            </Magnetic>
            <a
              href={CONFIG.linkedin}
              target="_blank"
              rel="noreferrer"
              className={
                isDark
                  ? "group inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15"
                  : "group inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm ring-1 ring-slate-200 hover:bg-slate-200/50"
              }
            >
              <Linkedin className="h-4 w-4" />
              <span>Connect</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative w-full">
        <div className="relative mx-auto w-full max-w-[1600px] px-6 sm:px-8">
          <Glass className="overflow-hidden p-0" dark={isDark}>
            <div className="grid items-stretch gap-0 md:grid-cols-2">
              <div className="relative p-8 md:p-12">
                <ParallaxLayer speed={0.03} className="pointer-events-none absolute -left-20 -top-20 h-44 w-44 rounded-full bg-fuchsia-400/20 blur-3xl" />
                <ParallaxLayer speed={-0.02} className="pointer-events-none absolute -right-24 -bottom-24 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />

                <motion.h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl" initial={fade.initial} animate={fade.animate}>
                  Building{" "}
                  <span className="bg-gradient-to-r from-fuchsia-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                    bold products
                  </span>
                  <br /> with reliable systems.
                </motion.h1>
                <motion.p {...fade} className={isDark ? "mt-5 max-w-xl text-white/80" : "mt-5 max-w-xl text-slate-700"}>
                  {CONFIG.hero}
                </motion.p>
                <motion.p {...fade} className={isDark ? "mt-3 max-w-xl text-white/60" : "mt-3 max-w-xl text-slate-600"}>
                  I build robust, scalable systems for modern enterprises—Java-first, cloud-native, and design-minded.
                </motion.p>

                <motion.div {...fade} className="mt-6 flex flex-wrap gap-3">
                  {CONFIG.highlights.map((h, i) => (
                    <Chip key={i} icon={h.icon}>
                      {h.text}
                    </Chip>
                  ))}
                </motion.div>
                <motion.div {...fade} className="mt-8 flex flex-wrap gap-3">
                  <Magnetic>
                    <a
                      href="#work"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-emerald-400 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-fuchsia-500/10"
                    >
                      See Work <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Magnetic>
                  <Magnetic>
                    <a
                      href={CONFIG.github}
                      target="_blank"
                      rel="noreferrer"
                      className={
                        isDark
                          ? "inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm ring-1 ring-white/15 hover:bg-white/15"
                          : "inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 text-sm ring-1 ring-slate-200 hover:bg-slate-200/50"
                      }
                    >
                      <Github className="h-4 w-4" /> GitHub
                    </a>
                  </Magnetic>
                </motion.div>
              </div>

              <div className="relative min-h-[340px] overflow-hidden md:min-h-[560px]">
                {isDark ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/40 via-cyan-900/30 to-emerald-900/30" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-100 via-cyan-100 to-emerald-100" />
                )}
                <ParallaxLayer speed={0.04} className="absolute right-8 top-8 h-24 w-24 rounded-full bg-fuchsia-400/20 blur-2xl" />
                <ParallaxLayer speed={-0.03} className="absolute bottom-8 left-8 h-28 w-28 rounded-full bg-cyan-400/20 blur-2xl" />
                <Mascot isDark={isDark} triggerKey={mascotKey} />
              </div>
            </div>
          </Glass>

          {/* wave separator */}
          <div className="relative">
            <svg viewBox="0 0 1440 80" className="block w-full" preserveAspectRatio="none" aria-hidden>
              <path
                fill={isDark ? "#0f172a" : "#ffffff"}
                d="M0,32L80,48C160,64,320,96,480,80C640,64,800,0,960,0C1120,0,1280,64,1360,96L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
              >
                <animate
                  attributeName="d"
                  dur="8s"
                  repeatCount="indefinite"
                  values="M0,32L80,48C160,64,320,96,480,80C640,64,800,0,960,0C1120,0,1280,64,1360,96L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z;
                          M0,20L80,40C160,60,320,90,480,70C640,50,800,10,960,10C1120,10,1280,70,1360,90L1440,110L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z;
                          M0,32L80,48C160,64,320,96,480,80C640,64,800,0,960,0C1120,0,1280,64,1360,96L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
                />
              </path>
            </svg>
          </div>
        </div>
      </section>

      {/* VISUAL STRIP */}
      <section className="w-full py-20">
        <div className="mx-auto w-full max-w-[1800px] px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              "https://images.unsplash.com/photo-1529336953121-4a5e63ef0f02?q=80&w=1600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
            ].map((src, i) => (
              <div
                key={i}
                className={
                  isDark
                    ? "group relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-white/10"
                    : "group relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-slate-200"
                }
              >
                <img src={src} alt="showcase" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <div
                  className={
                    isDark
                      ? "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
                      : "pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent"
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT & FOCUS */}
      <section className="w-full py-24">
        <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">About & Focus</h2>
            <p className={isDark ? "mt-2 text-white/70" : "mt-2 text-slate-600"}>Enterprise impact, cloud-native delivery, and high-quality engineering.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Glass className="p-6" dark={isDark}>
              <div className={isDark ? "space-y-4 text-[15px] leading-relaxed text-white/80" : "space-y-4 text-[15px] leading-relaxed text-slate-700"}>
                <p>{ABOUT.p1}</p>
                <p>{ABOUT.p2}</p>
              </div>
            </Glass>

            <Glass className="p-6" dark={isDark}>
              <h3 className="text-lg font-semibold">Toolkit & Interests</h3>
              <p className={isDark ? "mt-2 text-white/70" : "mt-2 text-slate-600"}>Java, C++, React, Node.js, Python, PHP, MySQL, AWS Cloud</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Java", "C++", "React", "Node.js", "Python", "PHP", "MySQL", "AWS", "REST APIs", "MVC", "Automation", "Cloud-native"].map((t, i) => (
                  <span
                    key={i}
                    className={isDark ? "rounded-full bg-white/10 px-3 py-1 text-sm ring-1 ring-white/15" : "rounded-full bg-slate-100 px-3 py-1 text-sm ring-1 ring-slate-200"}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className={isDark ? "mt-6 text-white/80" : "mt-6 text-slate-700"}>{ABOUT.p3}</div>
            </Glass>
          </div>
        </div>
      </section>

      {/* WORK */}
      <div className="relative">
        <svg viewBox="0 0 1440 80" className="block w-full rotate-180" preserveAspectRatio="none" aria-hidden>
          <path
            fill={isDark ? "#0f172a" : "#ffffff"}
            d="M0,32L80,48C160,64,320,96,480,80C640,64,800,0,960,0C1120,0,1280,64,1360,96L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          >
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="M0,32L80,48C160,64,320,96,480,80C640,64,800,0,960,0C1120,0,1280,64,1360,96L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z;
                      M0,20L80,40C160,60,320,90,480,70C640,50,800,10,960,10C1120,10,1280,70,1360,90L1440,110L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z;
                      M0,32L80,48C160,64,320,96,480,80C640,64,800,0,960,0C1120,0,1280,64,1360,96L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            />
          </path>
        </svg>
      </div>

      <section id="work" className="w-full py-28">
        <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Selected Work</h2>
              <p className={isDark ? "mt-2 text-white/70" : "mt-2 text-slate-600"}>Case studies designed for speed, clarity, and craft.</p>
            </div>
            <Magnetic>
              <a
                href="#contact"
                className={
                  isDark
                    ? "hidden items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm ring-1 ring-white/15 hover:bg-white/15 md:inline-flex"
                    : "hidden items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm ring-1 ring-slate-200 hover:bg-slate-200/50 md:inline-flex"
                }
              >
                <Rocket className="h-4 w-4" /> Start a project
              </a>
            </Magnetic>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CONFIG.projects.map((p, i) => (
              <div key={i} className="group block">
                <Glass className="flex h-full flex-col overflow-hidden transition-transform duration-300 will-change-transform group-hover:-translate-y-1" dark={isDark}>
                  <div className={isDark ? "relative h-48 w-full overflow-hidden ring-1 ring-white/10 sm:h-56" : "relative h-48 w-full overflow-hidden ring-1 ring-slate-200 sm:h-56"}>
                    <img src={p.image} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 via-cyan-400/10 to-emerald-400/10" />
                  </div>
                  <div className={isDark ? "flex flex-1 flex-col gap-3 bg-gradient-to-b from-white/5 to-transparent p-5" : "flex flex-1 flex-col gap-3 bg-gradient-to-b from-white to-transparent p-5"}>
                    <div className={isDark ? "text-[11px] uppercase tracking-wider text-white/60" : "text-[11px] uppercase tracking-wider text-slate-500"}>{p.tag}</div>
                    <h3 className="text-lg font-semibold leading-tight">{p.name}</h3>
                    <p className={isDark ? "text-sm text-white/70" : "text-sm text-slate-600"}>{p.blurb}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.stack.map((s, k) => (
                        <span key={k} className={isDark ? "rounded-full bg-white/10 px-2.5 py-1 text-[11px] ring-1 ring-white/15" : "rounded-full bg-slate-100 px-2.5 py-1 text-[11px] ring-1 ring-slate-200"}>
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className={isDark ? "mt-auto flex items-center justify-between pt-2 text-sm text-emerald-300" : "mt-auto flex items-center justify-between pt-2 text-sm text-emerald-600"}>
                      <button onClick={() => setOpenId(p.id)} className="underline">
                        View case study
                      </button>
                      <span>{p.cta.label} →</span>
                    </div>
                  </div>
                </Glass>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="w-full py-28">
        <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Experience</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={prevExp}
                className={isDark ? "rounded-lg bg-white/10 p-2 ring-1 ring-white/15 hover:bg-white/15" : "rounded-lg bg-slate-100 p-2 ring-1 ring-slate-200 hover:bg-slate-200/50"}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextExp}
                className={isDark ? "rounded-lg bg-white/10 p-2 ring-1 ring-white/15 hover:bg-white/15" : "rounded-lg bg-slate-100 p-2 ring-1 ring-slate-200 hover:bg-slate-200/50"}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Glass className="overflow-hidden p-6" dark={isDark}>
            <div className="relative">
              <AnimatePresence mode="wait" custom={expDir}>
                <motion.div key={expIndex} custom={expDir} initial="initial" animate="animate" exit="exit" variants={expVariants}>
                  {(() => {
                    const e = CONFIG.experience[expIndex];
                    return (
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className={isDark ? "text-sm text-white/60" : "text-sm text-slate-500"}>{e.time}</div>
                            <div className="mt-1 text-lg font-semibold">{e.role}</div>
                            <div className={isDark ? "text-white/80" : "text-slate-700"}>{e.org}</div>
                          </div>
                          <div className={isDark ? "rounded-xl bg-white/10 p-2 ring-1 ring-white/15" : "rounded-xl bg-slate-100 p-2 ring-1 ring-slate-200"}>
                            <Terminal className="h-5 w-5" />
                          </div>
                        </div>
                        <ul className={isDark ? "mt-4 space-y-2 text-sm text-white/80" : "mt-4 space-y-2 text-sm text-slate-700"}>
                          {e.points.map((pt, k) => (
                            <li key={k} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-500" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })()}
                </motion.div>
              </AnimatePresence>
            </div>
          </Glass>
        </div>
      </section>

      {/* STACK */}
      <section id="stack" className="w-full py-28">
        <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Technical Stack</h2>
            <div className={isDark ? "text-xs text-white/60" : "text-xs text-slate-500"}>Hand-picked tools for velocity</div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Code2 />, title: "Languages", items: ["C", "C++", "Java", "Python", "JavaScript", "SQL", "Bash"] },
              { icon: <Globe />, title: "Web", items: ["HTML", "CSS", "PHP", "REST", "SOAP", "XML", "JSON"] },
              { icon: <Boxes />, title: "Frameworks", items: ["React", "Node.js", "Express", "Bootstrap"] },
              { icon: <Database />, title: "Databases", items: ["MySQL", "SQL Server", "MongoDB"] },
              { icon: <Server />, title: "Platforms", items: ["Docker", "AWS", "GitHub"] },
              { icon: <ShieldCheck />, title: "Design", items: ["OOP", "MVC", "Concurrency", "Distributed Systems", "Debugging"] },
            ].map((card, i) => (
              <Glass key={i} className="p-6" dark={isDark}>
                <div className="flex items-center gap-3">
                  <div className={isDark ? "rounded-xl bg-white/10 p-2 ring-1 ring-white/15" : "rounded-xl bg-slate-100 p-2 ring-1 ring-slate-200"}>
                    {React.cloneElement(card.icon as React.ReactElement, { className: "h-5 w-5" })}
                  </div>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                </div>
                <div className={isDark ? "mt-3 flex flex-wrap gap-2 text-sm text-white/80" : "mt-3 flex flex-wrap gap-2 text-sm text-slate-700"}>
                  {card.items.map((it, k) => (
                    <span key={k} className={isDark ? "rounded-full bg-white/10 px-2.5 py-1 ring-1 ring-white/15" : "rounded-full bg-slate-100 px-2.5 py-1 ring-1 ring-slate-200"}>
                      {it}
                    </span>
                  ))}
                </div>
              </Glass>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative w-full">
        <div className="mx-auto w-full max-w-[1600px] px-6 pb-24 sm:px-8">
          <Glass className="relative overflow-hidden p-6 md:p-10" dark={isDark}>
            {/* morphing blob */}
            <svg className="absolute -right-24 -top-24 h-80 w-80 opacity-30" viewBox="0 0 600 600" aria-hidden>
              <g fill={isDark ? "#10b981" : "#22d3ee"}>
                <path>
                  <animate
                    attributeName="d"
                    dur="10s"
                    repeatCount="indefinite"
                    values="M300,521.5Q174,543,125,421.5Q76,300,143.5,195.5Q211,91,330.5,109Q450,127,501,213.5Q552,300,501,387.5Q450,475,300,521.5Z;
                            M300,520Q169,520,136,410Q103,300,167,212Q231,124,343.5,121.5Q456,119,510.5,209.5Q565,300,506,396.5Q447,493,300,520Z;
                            M300,521.5Q174,543,125,421.5Q76,300,143.5,195.5Q211,91,330.5,109Q450,127,501,213.5Q552,300,501,387.5Q450,475,300,521.5Z"
                  />
                </path>
              </g>
            </svg>

            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-2xl font-bold tracking-tight md:text-3xl">Let’s build something remarkable</h3>
                <p className={isDark ? "mt-2 max-w-prose text-white/80" : "mt-2 max-w-prose text-slate-700"}>{ABOUT.p4}</p>
                <div className="mt-6 grid gap-3 text-sm">
                  <div className={isDark ? "inline-flex items-center gap-2 text-white/80" : "inline-flex items-center gap-2 text-slate-700"}>
                    <Mail className="h-4 w-4" /> {CONFIG.email}
                  </div>
                  <div className={isDark ? "inline-flex items-center gap-2 text-white/80" : "inline-flex items-center gap-2 text-slate-700"}>
                    <Phone className="h-4 w-4" /> {CONFIG.phone}
                  </div>
                  <div className={isDark ? "inline-flex items-center gap-2 text-white/80" : "inline-flex items-center gap-2 text-slate-700"}>
                    <MapPin className="h-4 w-4" /> {CONFIG.location}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Magnetic>
                    <a
                      href={`mailto:${CONFIG.email}`}
                      className={
                        isDark
                          ? "inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950"
                          : "inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
                      }
                    >
                      Email me <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Magnetic>
                  <a
                    href={CONFIG.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className={
                      isDark
                        ? "inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm ring-1 ring-white/15 hover:bg-white/15"
                        : "inline-flex items-center gap-2 rounded-full bg-slate-100 px-5 py-2.5 text-sm ring-1 ring-slate-200 hover:bg-slate-200/50"
                    }
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </div>
              </div>
              <div>
                <Glass className="p-6" dark={isDark}>
                  <h4 className="text-lg font-semibold">Capabilities at a glance</h4>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    {[
                      { icon: <Rocket className="h-4 w-4" />, text: "Product strategy" },
                      { icon: <Terminal className="h-4 w-4" />, text: "API design" },
                      { icon: <Database className="h-4 w-4" />, text: "Data modeling" },
                      { icon: <ShieldCheck className="h-4 w-4" />, text: "Security & auth" },
                      { icon: <Server className="h-4 w-4" />, text: "Cloud deploys" },
                      { icon: <Code2 className="h-4 w-4" />, text: "Testing & CI" },
                    ].map((c, i) => (
                      <div key={i} className={isDark ? "flex items-center gap-2 rounded-lg bg-white/5 p-3 ring-1 ring-white/10" : "flex items-center gap-2 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200"}>
                        {c.icon}
                        <span className={isDark ? "text-white/80" : "text-slate-700"}>{c.text}</span>
                      </div>
                    ))}
                  </div>
                </Glass>
              </div>
            </div>
          </Glass>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={isDark ? "border-t border-white/10 bg-slate-950/70" : "border-t border-slate-200 bg-white"}>
        <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-3 px-6 py-6 sm:px-8 md:flex-row">
          <div className={isDark ? "text-sm text-white/60" : "text-sm text-slate-600"}>
            © {new Date().getFullYear()} {CONFIG.name}. All rights reserved.
          </div>
          <div className={isDark ? "flex items-center gap-4 text-sm text-white/70" : "flex items-center gap-4 text-sm text-slate-600"}>
            <a href={CONFIG.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:opacity-90">
              <Github className="h-4 w-4" /> GitHub
            </a>
            <a href={CONFIG.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:opacity-90">
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>
            <a href={`mailto:${CONFIG.email}`} className="inline-flex items-center gap-2 hover:opacity-90">
              <Mail className="h-4 w-4" /> Email
            </a>
          </div>
        </div>
      </footer>

      {/* theme crossfade */}
      {isFading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="pointer-events-none fixed inset-0"
          style={{
            background: isDark
              ? "radial-gradient(1200px 1200px at 50% 50%, rgba(2,6,23,0.55), rgba(2,6,23,0.9))"
              : "radial-gradient(1200px 1200px at 50% 50%, rgba(255,255,255,0.6), rgba(255,255,255,0.95))",
          }}
        />
      )}

      {/* local styles for chip sheen */}
      <style>{`
        html { scroll-behavior: smooth; }
        section { scroll-margin-top: 96px; }
        .pill { border-radius: 9999px; background: #0f172a; color: #fff; box-shadow: 0 6px 18px rgba(2,6,23,0.15); position: relative; overflow: hidden; }
        .dark .pill { background: rgba(255,255,255,.10); color: #fff; box-shadow: 0 6px 18px rgba(255,255,255,0.06); }
        .pill:after { content: ""; position: absolute; inset: 0; background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.28) 35%, transparent 70%); transform: translateX(-120%); animation: sheen 6s ease-in-out infinite; }
        @keyframes sheen { 0% { transform: translateX(-120%); } 40% { transform: translateX(120%); } 100% { transform: translateX(120%); } 
      `}</style>

      {/* modal */}
      {activeProject && <CaseStudyModal open={!!activeProject} onClose={() => setOpenId(null)} project={activeProject} />}
    </div>
  );
}
