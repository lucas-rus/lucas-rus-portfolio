"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Github,
  Linkedin,
  Mail,
  Terminal,
  Shield,
  Gamepad2,
  Database,
  Code2,
  Cpu,
  ExternalLink,
  Award,
  Zap,
  Layers,
  FileText,
  Sparkles,
  Download,
  Building2,
  BookOpen,
  Eye,
  CheckCircle2,
  ArrowUpRight,
  Search,
} from "lucide-react";
import { FadeIn, SlideInLeft } from "@/components/Animations";
import ChatWidget from "@/components/ChatWidget";
import Interactive3DCore from "@/components/Interactive3DCore";
import { CyberCircuitBackground, SectionDividerWithTelemetry } from "@/components/CyberCircuitLines";

type ProjectCategory = "all" | "ai" | "fullstack" | "systems";

interface ProjectItem {
  title: string;
  subtitle?: string;
  category: "ai" | "fullstack" | "systems";
  badge?: string;
  badgeColor?: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
  icon: any;
  iconBg: string;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>("all");

  const projects: ProjectItem[] = [
    {
      title: "Company Data Hub v2",
      subtitle: "Enterprise Corporate BI & OLAP Engine",
      category: "fullstack",
      badge: "Production at Vitas",
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      description:
        "Zero-dependency columnar OLAP intelligence engine in DuckDB consolidating 1.8M+ Romanian commercial entities and 16 years of national fiscal filings. Powers sub-5ms solvency queries, 360° corporate dossiers, and portfolio watchlist snapshot differential tracking.",
      stack: ["DuckDB", "Python", "Polars", "Parquet", "Pytest (130 tests)"],
      icon: Database,
      iconBg: "from-blue-600/20 to-indigo-700/20 text-primary",
    },
    {
      title: "Trial Balance Parser & Mapper",
      subtitle: "Automated SME Credit Underwriting Engine",
      category: "systems",
      badge: "Production at Vitas",
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
      description:
        "Automated credit underwriting pipeline transforming non-standard trial balance PDFs (Balanță de Verificare) directly into official Balance Sheets and P&L statements. Features deterministic coordinate boundary reconstruction, SHA-256 layout caching (<2s execution), cent-accurate OMFP 1802/2014 account netting, and 3-tier OpenAI multimodal vision fallbacks.",
      stack: ["Python", "Streamlit", "PyMuPDF", "OpenAI Vision", "OMFP 1802/2014"],
      icon: FileText,
      iconBg: "from-teal-600/20 to-emerald-700/20 text-teal-400",
    },
    {
      title: "Font Recognition AI",
      subtitle: "26-Class Print Typography Classifier",
      category: "ai",
      badge: "96.53% Top-3 Accuracy",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      description:
        "Computer vision print font family classifier using EfficientNet-B0 (4.04M params) trained on 312k synthetic documents. Features multi-scale sliding-window patch extraction and ink-density-weighted probability aggregation deployed via interactive Gradio UI.",
      stack: ["PyTorch", "EfficientNet-B0", "OpenCV", "Gradio UI", "Synthetic Synthesis"],
      github: "https://github.com/lucas-rus/font-recognition-ai",
      icon: Eye,
      iconBg: "from-emerald-500/20 to-teal-600/20 text-emerald-400",
    },
    {
      title: "GigTim",
      subtitle: "Day-Laborer Marketplace (Legea 52/2011)",
      category: "fullstack",
      badge: "Upcoming Flagship Venture",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      description:
        "Next-generation Romanian HoReCa day-laborer marketplace (zilieri) modernizing short-term staffing in Timișoara. Features instant shift matching, interactive animated SVG map with live route paths, automated ITM compliance CSV generation, and deferred GDPR identity verification.",
      stack: ["Next.js 16", "React 19", "Tailwind CSS v4", "Supabase", "PostgreSQL"],
      live: "https://gigtim.arhebis.ro",
      icon: Zap,
      iconBg: "from-amber-500/20 to-orange-600/20 text-amber-400",
    },
    {
      title: "ContaAI",
      subtitle: "Automated Document OCR & Audit Engine",
      category: "ai",
      badge: "FastAPI + Avalonia .NET",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      description:
        "Enterprise document OCR and accounting verification pairing a high-throughput FastAPI backend with a cross-platform Avalonia .NET C# desktop UI. Integrates multi-provider LLMs, 6-axis confidence scoring, live Romanian ANAF API CUI validation, and SAGA XML export.",
      stack: ["FastAPI", "Python", "Avalonia .NET (C#)", "ANAF API", "LLM Ensembles"],
      github: "https://github.com/lucas-rus/Conta",
      icon: Sparkles,
      iconBg: "from-purple-500/20 to-pink-600/20 text-purple-400",
    },
    {
      title: "German Legal Book Digitizer",
      subtitle: "Enterprise Commentary Pipeline",
      category: "ai",
      badge: "Collab with Arhebis",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      description:
        "Scalable digitization pipeline built in collaboration with Arhebis Digital Systems for German legal commentaries (400k+ pages). Engineered an agentic self-correction loop validating LLM output against strict DTD schemas with compiler-guided auto-repair, cutting manual costs by 90%.",
      stack: ["Docling (CUDA)", "Tesseract OCR", "OpenAI / Gemini", "Streamlit", "XML DTD"],
      icon: BookOpen,
      iconBg: "from-cyan-500/20 to-blue-600/20 text-cyan-400",
    },
    {
      title: "CoFound",
      subtitle: "Founder Dating & Startup Collaboration",
      category: "fullstack",
      badge: "1st Place Winner",
      badgeColor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      description:
        "Awarded 1st Place at UVT Prototype Fair 2025. Full-stack platform connecting technical founders with collaborator teams for equity-based side projects. Features real-time bidirectional STOMP WebSockets messaging, skill-matching search, and collaboration agreements.",
      stack: ["Spring Boot 3", "React 18", "STOMP WebSockets", "Hibernate JPA", "MySQL"],
      live: "https://cofound-app.vercel.app",
      icon: Award,
      iconBg: "from-yellow-500/20 to-amber-600/20 text-yellow-400",
    },
    {
      title: "SAT Solving & CSP Solvers",
      subtitle: "Theoretical & Experimental Benchmark",
      category: "systems",
      badge: "AC-2001 Map Coloring",
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
      description:
        "Comparative runtime and memory benchmarking of Resolution, Davis-Putnam (DP), DPLL, and Glucose3 solvers across SAT instances. Implemented Bessiere et al.'s optimal Arc Consistency (AC-2001 O(ed^2)) solver in C++ for the Map Coloring constraint satisfaction problem using support pointers.",
      stack: ["C++", "Python", "PySAT", "Algorithms & Theory", "Optimization"],
      github: "https://github.com/lucas-rus/Theoretical_and_Experimental_Comparison_of_SAT_Solving_Algorithms",
      icon: Terminal,
      iconBg: "from-teal-500/20 to-emerald-600/20 text-secondary",
    },
    {
      title: "Systems & Creative Tech",
      subtitle: "Interactive Games & OS Background Utilities",
      category: "systems",
      badge: "lucas-rus.itch.io",
      badgeColor: "bg-red-500/20 text-red-300 border-red-500/30",
      description:
        "Engineering native utilities and interactive simulations: 'Mouse Mover' (C++11/Obj-C++ using Win32 SendInput and macOS Cocoa/IOKit APIs), 'Ludo' (educational 3D chemistry simulation & synthesis game in Unity C# modeling compound reaction stoichiometries and commercial marketplace sales loops), and 'Future Jump' (3rd Place iTec Hackathon).",
      stack: ["Unity C#", "C++11", "Objective-C++", "Win32 APIs", "Cocoa / IOKit"],
      live: "https://lucas-rus.itch.io",
      icon: Gamepad2,
      iconBg: "from-red-500/20 to-orange-600/20 text-red-400",
    },
  ];

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden bg-[#0a0f1d] text-slate-100 selection:bg-primary/30 selection:text-white">
      {/* Ambient Depth Gradients & Cyber Circuit Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden w-full max-w-[100vw]">
        {/* Subtle atmospheric blue wash */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-10%,rgba(59,130,246,0.07),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px] animate-aurora-1"></div>
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-teal-500/8 rounded-full blur-[160px] animate-aurora-2"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/9 rounded-full blur-[150px] animate-aurora-1" style={{ animationDelay: "-8s" }}></div>
        <div className="absolute -bottom-20 right-1/4 w-[550px] h-[450px] bg-blue-600/7 rounded-full blur-[160px] animate-aurora-2"></div>
        <CyberCircuitBackground />
      </div>

      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 w-full z-40 bg-[#0a0f1d]/85 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="#" className="flex items-center space-x-2 group shrink-0">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
                LR.
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
              <a href="#about" className="hover:text-primary transition-colors">About</a>
              <a href="#experience" className="hover:text-primary transition-colors">Experience</a>
              <a href="#projects" className="hover:text-primary transition-colors">Ventures</a>
              <a href="#credentials" className="hover:text-primary transition-colors">Credentials</a>
              <a href="#skills" className="hover:text-primary transition-colors">Skills</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Professional Refined Resume Button */}
              <a
                href="/Lucas_Rus_CV.pdf"
                download="Lucas_Rus_CV.pdf"
                className="group inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white bg-slate-900/70 hover:bg-slate-800/90 border border-slate-700/60 hover:border-slate-500/80 backdrop-blur-md transition-all duration-200 shadow-sm"
              >
                <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 transition-colors" />
                <span>Resume</span>
                <span className="hidden sm:inline-block text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 group-hover:text-slate-200 transition-colors">
                  PDF
                </span>
              </a>

              {/* Professional High-Polish Contact CTA */}
              <a
                href="#contact"
                className="group inline-flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-400/30 shadow-[0_1px_3px_rgba(0,0,0,0.3),0_0_12px_rgba(59,130,246,0.25)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.3),0_0_16px_rgba(59,130,246,0.4)] transition-all duration-200 active:scale-[0.98]"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
                <span>Contact</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-150" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-44 md:pb-28 px-4 max-w-6xl mx-auto z-10">
        <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-center">
          <FadeIn className="md:col-span-7 space-y-6" delay={0.1}>
            <div className="inline-flex items-center rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-[11px] sm:text-xs font-medium text-teal-300 backdrop-blur-sm shadow-sm max-w-full">
              <span className="flex h-2 w-2 rounded-full bg-teal-400 mr-2 shrink-0 animate-pulse"></span>
              <span className="hidden sm:inline">Available for Software Engineering & AI Systems Roles</span>
              <span className="sm:hidden">Available for SWE & AI Systems Roles</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Lucas{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-indigo-300">
                Rus
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-300 font-light leading-snug">
              High-throughput data engines, agentic LLM automation & offensive security.
            </p>

            <p className="text-sm sm:text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
              Software engineer focused on architecting mission-critical systems: consolidating 1.8M+ entities with sub-5ms query performance, engineering compiler-guided document pipelines, and training frontier autonomous coding agents.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
              {/* Primary Radiant Button */}
              <a
                href="#projects"
                className="w-full sm:w-auto relative group inline-flex items-center justify-center rounded-xl p-[1px] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-blue-600 via-teal-500 to-indigo-600 opacity-60 blur-md group-hover:opacity-90 group-hover:blur-lg transition-all duration-500 -z-10" />
                <span className="w-full sm:w-auto justify-center relative flex items-center space-x-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 group-hover:from-blue-500 group-hover:via-blue-400 group-hover:to-teal-400 text-white font-medium text-sm sm:text-base shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all duration-300">
                  <span>Explore Ventures</span>
                  <ArrowUpRight className="w-4 h-4 text-white/85 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                </span>
              </a>

              {/* Sleek Cyber-Glass Download CV Button */}
              <a
                href="/Lucas_Rus_CV.pdf"
                download="Lucas_Rus_CV.pdf"
                className="w-full sm:w-auto relative group inline-flex items-center justify-center p-[1px] rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-slate-700 via-teal-500/40 to-slate-700 group-hover:from-cyan-500/60 group-hover:via-blue-500/50 group-hover:to-teal-400/60 transition-all duration-500" />
                <span className="w-full sm:w-auto justify-center relative flex items-center space-x-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-900/80 group-hover:bg-slate-850/90 backdrop-blur-md text-white font-medium text-sm sm:text-base shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] transition-all duration-300">
                  <Download className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 group-hover:translate-y-0.5 transition-all duration-200" />
                  <span>Download CV</span>
                </span>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
              </a>

              {/* Social Icons Row */}
              <div className="flex items-center gap-3 pt-1 sm:pt-0">
                <a
                  href="https://github.com/lucas-rus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 sm:p-3 border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all"
                  title="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>

                <a
                  href="https://linkedin.com/in/lucas-rus-96492a222"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 sm:p-3 border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition-all"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </FadeIn>

          {/* Interactive 3D Core & Live System Console */}
          <FadeIn className="md:col-span-5 relative space-y-4" delay={0.25}>
            <Interactive3DCore />

            <div className="relative glass-card p-5 rounded-2xl shadow-2xl border border-white/10 bg-slate-900/80 backdrop-blur-xl">
              {/* Terminal Window Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span>lucas_sys_monitor.sh</span>
                </div>
              </div>

              {/* Console Metrics */}
              <div className="font-mono text-xs space-y-2.5">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-slate-500">primary_engine:</span>
                  <span className="text-cyan-400 font-semibold">DuckDB Columnar OLAP</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-slate-500">commercial_entities:</span>
                  <span className="text-teal-300 font-semibold">1,824,500 rows</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-slate-500">solvency_query_latency:</span>
                  <span className="text-emerald-400 font-semibold">&lt; 4.8ms</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-slate-500">vision_classifier_acc:</span>
                  <span className="text-purple-300 font-semibold">96.53% Top-3</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-slate-500">agentic_validation_loop:</span>
                  <span className="text-amber-300 font-semibold">Compiler-Guided DTD</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-slate-500">oss_contributions:</span>
                  <span className="text-slate-300">Grafana, Godot Engine</span>
                </div>

                <div className="pt-2.5 border-t border-white/5 text-[11px] text-slate-400 leading-relaxed">
                  <span className="text-emerald-400 font-bold">$</span> sys.status = <span className="text-teal-300">&quot;Ready for high-throughput challenges&quot;</span>;
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">About Me</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-3 rounded-full"></div>
          </div>

          <SlideInLeft>
            <div className="glass-card p-8 rounded-2xl text-slate-300 leading-relaxed text-base md:text-lg border border-white/5 bg-slate-900/50 space-y-6">
              <p>
                I am pursuing a degree in <strong className="text-white">Computer Science (English Stream)</strong> at the <strong>West University of Timișoara (UVT)</strong>. My approach pairs theoretical rigor in data structures and constraint satisfaction with battle-tested systems engineering.
              </p>
              <p>
                As a former <strong className="text-white">competitive debate trainer and tournament referee</strong> at C.D. Loga National College, I spent years dissecting arguments, structuring formal logic, and communicating complex technical abstractions with clarity. In software teams, this enables me to rapidly bridge the gap between low-level architectural execution and strategic product goals.
              </p>
              <p>
                From architecting zero-dependency columnar OLAP intelligence engines indexing millions of records in <strong className="text-primary">DuckDB</strong> to validating autonomous coding agent trajectories on <strong className="text-secondary">Grafana and Godot</strong>, I engineer systems that are deterministic, fast, and secure.
              </p>
            </div>
          </SlideInLeft>
        </div>
      </section>

      {/* Section Divider */}
      <div className="max-w-6xl mx-auto px-4">
        <SectionDividerWithTelemetry label="SEC_01 // ENTERPRISE PRODUCTION & WORK" />
      </div>

      {/* Professional Experience Section */}
      <section id="experience" className="py-12 px-4 max-w-6xl mx-auto z-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">Professional Experience</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary mt-3 rounded-full"></div>
        </div>

        <div className="space-y-8">
          {/* Vitas Romania - Enterprise Showcase */}
          <FadeIn delay={0.1} className="relative glass-card p-6 sm:p-8 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all bg-gradient-to-b from-slate-900/90 to-slate-950/90 shadow-2xl overflow-hidden">
            {/* Cyber Corner Accents */}
            <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-cyan-400"></div>
            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-cyan-400"></div>
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-cyan-400"></div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3 pb-6 border-b border-white/10">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    ENTERPRISE PLATFORM
                  </span>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    SUB-5MS QUERY SPEED
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">Software Engineering Intern (Automation & Development)</h3>
                <p className="text-cyan-400 font-medium text-sm mt-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>Vitas Romania • Timișoara, RO</span>
                </p>
              </div>
              <div className="md:text-right">
                <span className="inline-block text-xs font-mono px-3.5 py-1.5 bg-slate-800/90 border border-slate-700/80 text-cyan-300 rounded-lg shadow-inner">
                  Feb 2026 - Aug 2026
                </span>
                <p className="text-[11px] font-mono text-slate-500 mt-1">Full Production Deployment</p>
              </div>
            </div>

            {/* Two Core Systems Subsections */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* System 1: Company Data Hub v2 */}
              <div className="p-5 rounded-xl bg-slate-900/90 border border-cyan-500/20 hover:border-cyan-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5 text-cyan-400" />
                      01 // Company Data Hub v2
                    </span>
                    <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                      OLAP Platform
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    Architected an enterprise Business Intelligence platform indexing <strong className="text-white">1.8M+ Romanian commercial entities</strong> and 16 years of open-source national fiscal filings. Embedded a columnar OLAP engine delivering borrower solvency queries in <strong className="text-emerald-400">sub-5ms</strong>.
                  </p>

                  <ul className="text-xs text-slate-400 space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span><strong className="text-slate-200">360° Corporate Profiles:</strong> Ingests executive boards, ownership chains, revenue trajectories, and liquidity/solvency ratios.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span><strong className="text-slate-200">Watchlist Differential Tracking:</strong> Atomic snapshot migrations detecting fiscal anomalies across loan portfolios.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span><strong className="text-slate-200">Production Rigor:</strong> 130 automated Pytest test suites ensuring zero-drift data integrity (MIT License).</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-cyan-950/60 text-cyan-300 text-[11px] font-mono rounded border border-cyan-500/30">DuckDB OLAP</span>
                  <span className="px-2 py-0.5 bg-blue-950/60 text-blue-300 text-[11px] font-mono rounded border border-blue-500/30">Python</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] font-mono rounded border border-slate-700">Parquet / Polars</span>
                  <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-300 text-[11px] font-mono rounded border border-emerald-500/30">&lt;5ms Latency</span>
                </div>
              </div>

              {/* System 2: Trial Balance Parser */}
              <div className="p-5 rounded-xl bg-slate-900/90 border border-teal-500/20 hover:border-teal-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-teal-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-teal-400" />
                      02 // Trial Balance Parser
                    </span>
                    <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                      Underwriting AI
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm leading-relaxed mb-4">
                    Automated the SME credit underwriting pipeline by transforming non-standard PDF trial balances (<em className="text-teal-200">Balanță de Verificare</em>) directly into official Balance Sheets (<em className="text-teal-200">Bilanț</em>) and P&amp;L statements.
                  </p>

                  <ul className="text-xs text-slate-400 space-y-2 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400 font-bold">•</span>
                      <span><strong className="text-slate-200">OMFP 1802/2014 Compliance:</strong> Bottom-up automated account netting accurate down to the cent.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400 font-bold">•</span>
                      <span><strong className="text-slate-200">Sub-2s Execution:</strong> Deterministic spatial coordinate reconstruction with SHA-256 layout caching.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-400 font-bold">•</span>
                      <span><strong className="text-slate-200">3-Tier Vision Fallback:</strong> OpenAI multimodal fallback for complex or scanned accounting documents.</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 bg-teal-950/60 text-teal-300 text-[11px] font-mono rounded border border-teal-500/30">OMFP 1802/2014</span>
                  <span className="px-2 py-0.5 bg-purple-950/60 text-purple-300 text-[11px] font-mono rounded border border-purple-500/30">OpenAI Vision</span>
                  <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] font-mono rounded border border-slate-700">Streamlit UI</span>
                  <span className="px-2 py-0.5 bg-emerald-950/60 text-emerald-300 text-[11px] font-mono rounded border border-emerald-500/30">&lt;2s Cache</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* JoinStellar.ai */}
          <FadeIn delay={0.2} className="glass-card p-7 rounded-2xl border border-white/5 hover:border-secondary/40 transition-all bg-slate-900/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-white">Private Contractor (AI Training & Evaluation)</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20">
                    Agentic AI
                  </span>
                </div>
                <p className="text-secondary font-medium text-sm mt-0.5">JoinStellar.ai • Remote</p>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-slate-800/80 border border-slate-700/60 text-slate-300 rounded-lg w-fit">
                Nov 2024 - Present
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Trained frontier autonomous coding agents to resolve real-world GitHub Pull Requests and pass comprehensive integration test suites across large open-source codebases (including <strong className="text-white">Grafana</strong> and <strong className="text-white">Godot Engine</strong>). Benchmarked multi-agent execution trajectories, stress-testing autonomous tool call sequences, code repair loops, environment interactions, and database state transitions.
            </p>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700/50">Autonomous Agents</span>
              <span className="px-2.5 py-1 bg-teal-900/30 text-teal-200 text-xs rounded-lg border border-teal-500/20">TypeScript</span>
              <span className="px-2.5 py-1 bg-blue-900/30 text-blue-200 text-xs rounded-lg border border-blue-500/20">Python</span>
              <span className="px-2.5 py-1 bg-purple-900/30 text-purple-200 text-xs rounded-lg border border-purple-500/20">Tool Benchmarking</span>
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700/50">Grafana & Godot</span>
            </div>
          </FadeIn>

          {/* Arhebis Digital Systems */}
          <FadeIn delay={0.3} className="glass-card p-7 rounded-2xl border border-white/5 hover:border-accent/40 transition-all bg-slate-900/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
              <div>
                <h3 className="text-xl font-bold text-white">Junior Software Developer</h3>
                <p className="text-accent font-medium text-sm mt-0.5">Arhebis Digital Systems • Timișoara, RO</p>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-slate-800/80 border border-slate-700/60 text-slate-300 rounded-lg w-fit">
                Sep 2024 - Aug 2025
              </span>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Automated commercial digital production in Photoshop and Illustrator via ExtendScript JavaScript, reducing manual graphic prep time by 60%. Built Python automation tools interfacing with Google Maps APIs to geocode addresses and automate Points of Interest (POI) maps; engineered end-to-end XML/XHTML and CSS transformation pipelines converting fixed PDFs into reflowable ePub3 books.
            </p>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
              <span className="px-2.5 py-1 bg-orange-900/30 text-orange-200 text-xs rounded-lg border border-orange-500/20">ExtendScript (JS)</span>
              <span className="px-2.5 py-1 bg-blue-900/30 text-blue-200 text-xs rounded-lg border border-blue-500/20">Python</span>
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700/50">Google Maps API</span>
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg border border-slate-700/50">XML/XHTML & ePub3</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section Divider */}
      <div className="max-w-6xl mx-auto px-4">
        <SectionDividerWithTelemetry label="SEC_02 // VENTURES & AI ARCHITECTURE" />
      </div>

      {/* Featured Ventures & Projects Section */}
      <section id="projects" className="py-12 px-4 max-w-6xl mx-auto z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Ventures & Technical Projects</h2>
            <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary mt-3 rounded-full"></div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/5 w-fit">
            {[
              { id: "all", label: "All Ventures" },
              { id: "ai", label: "AI & Vision" },
              { id: "fullstack", label: "Full-Stack & OLAP" },
              { id: "systems", label: "Systems & Creative" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as ProjectCategory)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === tab.id
                    ? "bg-primary text-white shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-7">
          {filteredProjects.map((project, idx) => {
            const IconComponent = project.icon;
            return (
              <FadeIn
                key={project.title}
                delay={0.05 * idx}
                className="group glass-card rounded-2xl overflow-hidden hover:border-primary/50 transition-all flex flex-col bg-slate-900/50 border border-white/5"
              >
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${project.iconBg} border border-white/5`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                            {project.title}
                          </h3>
                          {project.subtitle && (
                            <p className="text-xs text-slate-400 font-medium">{project.subtitle}</p>
                          )}
                        </div>
                      </div>

                      {project.badge && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${project.badgeColor} whitespace-nowrap`}>
                          {project.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mt-4">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 bg-slate-800/80 text-slate-300 text-[11px] font-mono rounded border border-slate-700/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-2 pl-3">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="View on GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-primary hover:text-blue-300 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Visit Project"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* Section Divider */}
      <div className="max-w-6xl mx-auto px-4">
        <SectionDividerWithTelemetry label="SEC_03 // VERIFIED CREDENTIALS & CERTIFICATIONS" />
      </div>

      {/* Credentials & Certifications Section (NO GPA) */}
      <section id="credentials" className="py-12 px-4 max-w-6xl mx-auto z-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">Credentials & Certifications</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary mt-3 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FadeIn delay={0.1} className="glass-card p-6 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-primary font-bold">University Education</span>
              <h3 className="font-bold text-base text-white mt-1">West University of Timișoara</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                BSc in Computer Science (English Stream, 2024-2027). Core focus on algorithms, data structures, and computer systems.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-teal-300 font-medium">
              UVT • Timișoara, Romania
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="glass-card p-6 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-secondary font-bold">Language Mastery</span>
              <h3 className="font-bold text-base text-white mt-1">Cambridge English (CAE)</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Grade A (Score 200+). Certified CEFR Level C2: Native English language equivalence.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-teal-300 font-medium">
              Certified CEFR C2
            </div>
          </FadeIn>

          <FadeIn delay={0.3} className="glass-card p-6 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-accent font-bold">Security Training</span>
              <h3 className="font-bold text-base text-white mt-1">Google.org Cybersecurity</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Virtual Routes at UVT. Labs covering MITRE ATT&CK, AI SecOps, Splunk SIEM, Snort IDS, and network defense.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-orange-300 font-medium">
              SecOps & Defense
            </div>
          </FadeIn>

          <FadeIn delay={0.4} className="glass-card p-6 rounded-xl border border-white/5 bg-slate-900/50 flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-purple-400 font-bold">National Credential</span>
              <h3 className="font-bold text-base text-white mt-1">CS Professional Competence</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                Romanian Ministry of Education (2024). Intensive Mathematics & Informatics track. Capstone: <em>Ludo 3D</em>.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-purple-300 font-medium">
              Ministry of Education
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section Divider */}
      <div className="max-w-6xl mx-auto px-4">
        <SectionDividerWithTelemetry label="SEC_04 // TECHNICAL PROFICIENCIES & PROTOCOLS" />
      </div>

      {/* Skills Section - Miller's Law (Chunking) */}
      <section id="skills" className="py-12 px-4 max-w-6xl mx-auto z-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">Technical Proficiencies</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-primary to-secondary mt-3 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-7">
          <SlideInLeft delay={0.1} className="p-6 glass-card rounded-xl border-t-2 border-primary bg-slate-900/50">
            <div className="flex items-center space-x-3 mb-4">
              <Terminal className="w-6 h-6 text-primary" />
              <h3 className="font-bold text-lg text-white">Languages</h3>
            </div>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>Python</li>
              <li>TypeScript / JavaScript</li>
              <li>Java 17+</li>
              <li>C++ / C</li>
              <li>C# (.NET)</li>
              <li>SQL</li>
              <li>HTML5 / SCSS</li>
            </ul>
          </SlideInLeft>

          <SlideInLeft delay={0.2} className="p-6 glass-card rounded-xl border-t-2 border-secondary bg-slate-900/50">
            <div className="flex items-center space-x-3 mb-4">
              <Code2 className="w-6 h-6 text-secondary" />
              <h3 className="font-bold text-lg text-white">Full-Stack & Data</h3>
            </div>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>Next.js (App Router) / React 19</li>
              <li>DuckDB (Columnar OLAP)</li>
              <li>Spring Boot 3 (JPA)</li>
              <li>FastAPI / Flask</li>
              <li>PostgreSQL / MySQL</li>
              <li>Tailwind CSS v4</li>
              <li>Avalonia .NET C#</li>
            </ul>
          </SlideInLeft>

          <SlideInLeft delay={0.3} className="p-6 glass-card rounded-xl border-t-2 border-purple-400 bg-slate-900/50">
            <div className="flex items-center space-x-3 mb-4">
              <Cpu className="w-6 h-6 text-purple-400" />
              <h3 className="font-bold text-lg text-white">AI & Vision</h3>
            </div>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>PyTorch & EfficientNet</li>
              <li>Multimodal LLMs (OpenAI, Gemini)</li>
              <li>Docling (CUDA) Layout OCR</li>
              <li>Tesseract OCR & OpenCV</li>
              <li>Agentic Self-Correction Loops</li>
              <li>RLHF & Data Annotation</li>
              <li>Gradio & Streamlit</li>
            </ul>
          </SlideInLeft>

          <SlideInLeft delay={0.4} className="p-6 glass-card rounded-xl border-t-2 border-accent bg-slate-900/50">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-accent" />
              <h3 className="font-bold text-lg text-white">Systems & Security</h3>
            </div>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>Linux / Bash Automation</li>
              <li>Docker Containerization</li>
              <li>Win32 & Cocoa/IOKit APIs</li>
              <li>Unity 3D Engine</li>
              <li>Metasploit & Wireshark</li>
              <li>Splunk SIEM & Snort IDS</li>
              <li>Git / GitHub Actions</li>
            </ul>
          </SlideInLeft>
        </div>
      </section>

      {/* Section Divider */}
      <div className="max-w-4xl mx-auto px-4">
        <SectionDividerWithTelemetry label="SEC_05 // COMMS & DIRECT TRANSMISSION" />
      </div>

      {/* Contact & Footer Section */}
      <footer id="contact" className="relative z-10 pt-10 pb-20 overflow-hidden">
        {/* Subtle, soft ambient glow centered underneath */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/[0.04] rounded-full blur-[150px] pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-slate-800/80 bg-slate-900/30 backdrop-blur-md rounded-2xl p-6 sm:p-10 lg:p-12">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Column: Heading & Context */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                  <span className="tracking-widest uppercase">Contact &amp; Collaboration</span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Let&apos;s build something impactful.
                </h2>

                <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
                  I am actively seeking software engineering and AI systems roles. Whether you are scaling mission-critical data engines, building compiler-guided AI pipelines, or exploring offensive security, my inbox is open.
                </p>

                {/* Location & Status Badges */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-400 font-mono">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60 text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 mr-2" />
                    Timișoara, Romania (UTC+2)
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5" />
                    Open to Remote &amp; Hybrid
                  </span>
                </div>
              </div>

              {/* Right Column: Grounded, Professional Action Channels */}
              <div className="lg:col-span-5 space-y-3">
                {/* Primary Email Channel */}
                <a
                  href="mailto:lucas.rus.gheorghiu@gmail.com"
                  className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 transition-colors duration-150 shadow-sm"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Direct Email</div>
                      <div className="text-xs sm:text-sm font-medium text-white truncate">lucas.rus.gheorghiu@gmail.com</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors shrink-0 ml-2" />
                </a>

                {/* Resume Download Channel */}
                <a
                  href="/Lucas_Rus_CV.pdf"
                  download="Lucas_Rus_CV.pdf"
                  className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/50 transition-colors duration-150 shadow-sm"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Curriculum Vitae</div>
                      <div className="text-xs sm:text-sm font-medium text-white">Download Resume (PDF)</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400 shrink-0 ml-2">
                    854 KB
                  </span>
                </a>

                {/* Social Profiles Grid */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <a
                    href="https://github.com/lucas-rus"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-600 transition-colors duration-150 text-xs font-medium text-slate-300 hover:text-white shadow-sm"
                  >
                    <Github className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
                    <span>GitHub</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/in/lucas-rus-96492a222"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/50 transition-colors duration-150 text-xs font-medium text-slate-300 hover:text-white shadow-sm"
                  >
                    <Linkedin className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-colors" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href="https://lucas-rus.itch.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-red-500/50 transition-colors duration-150 text-xs font-medium text-slate-300 hover:text-white shadow-sm"
                  >
                    <Gamepad2 className="w-3.5 h-3.5 text-red-400 group-hover:text-red-300 transition-colors" />
                    <span>Itch.io</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Sub-Footer Bar */}
            <div className="mt-10 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 font-medium">Lucas Rus</span>
                <span>•</span>
                <span>Software Engineer</span>
              </div>
              <div>
                © {new Date().getFullYear()} • Built with Next.js &amp; React
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating AI Chatbot Assistant */}
      <ChatWidget />
    </div>
  );
}
