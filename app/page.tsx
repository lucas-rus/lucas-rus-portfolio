import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail, Terminal, Shield, Gamepad2, Database, Code2, Cpu, ExternalLink, ChevronDown, Award, Zap, Smartphone, Layout, MousePointerClick, Layers } from "lucide-react";
import { FadeIn, SlideInLeft } from "@/components/Animations";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <div className="min-h-screen font-sans relative overflow-x-hidden bg-slate-900">
      {/* Animated Background */}
      <div className="background-animate"></div>
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 glass-panel">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold tracking-tight text-primary">LR.</div>
            <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
              <a href="#about" className="hover:text-primary transition-colors">About</a>
              <a href="#experience" className="hover:text-primary transition-colors">Experience</a>
              <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
              <a href="#skills" className="hover:text-primary transition-colors">Skills</a>
              <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <FadeIn className="space-y-6" delay={0.1}>
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Available for opportunities
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
              Lucas <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Rus</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-light">
              Software Engineer & Cybersecurity Enthusiast.
            </p>
            <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
              Bridging the gap between robust software architecture and offensive security operations. 
              Passionate about building secure, efficient systems and solving complex problems.
            </p>
            <div className="flex space-x-4 pt-4">
              <Link 
                href="#contact"
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40"
              >
                Get in Touch
              </Link>
              <Link 
                href="#projects"
                className="px-6 py-3 border border-slate-700 bg-slate-800/50 text-white rounded-lg font-medium hover:bg-slate-800 transition-all backdrop-blur-sm"
              >
                View Work
              </Link>
            </div>
          </FadeIn>
          
          <FadeIn className="relative hidden md:block" delay={0.3}>
            {/* Abstract visual element representing structure/code */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative glass-card p-8 rounded-2xl shadow-2xl border border-white/10">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="font-mono text-sm space-y-2 text-slate-300">
                <p><span className="text-purple-400">class</span> <span className="text-yellow-300">Developer</span> <span className="text-slate-500">{`{`}</span></p>
                <p className="pl-4"><span className="text-purple-400">const</span> passion = <span className="text-green-400">"Knowledge"</span>;</p>
                <p className="pl-4"><span className="text-purple-400">let</span> skills = [<span className="text-green-400">"FullStack"</span>, <span className="text-green-400">"CyberSec"</span>, <span className="text-green-400">"GameDev"</span>];</p>
                <p className="pl-4"><span className="text-purple-400">function</span> <span className="text-blue-400">innovate</span>() <span className="text-slate-500">{`{`}</span></p>
                <p className="pl-8"><span className="text-purple-400">return</span> <span className="text-green-400">"Impactful Solutions"</span>;</p>
                <p className="pl-4"><span className="text-slate-500">{`}`}</span></p>
                <p><span className="text-slate-500">{`}`}</span></p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">About Me</h2>
            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
          </div>
          <SlideInLeft>
            <div className="glass-card p-8 rounded-2xl text-slate-300 leading-relaxed text-lg">
              <p className="mb-6">
                I am currently pursuing a degree in <strong className="text-white">Computer Science (English)</strong> at the <strong>West University of Timisoara (UVT)</strong>. 
                My journey in technology is driven by an insatiable thirst for knowledge—a trait that not only defines my academic career but also my professional ethos.
              </p>
              <p className="mb-6">
                Beyond code, I have a background as a <strong className="text-white">debate trainer</strong>, a role that honed my ability to research deeply, construct logical arguments, and communicate complex technical concepts with clarity. This "soft skill" has become my secret weapon in engineering teams, bridging the gap between technical execution and strategic vision.
              </p>
              <p>
                Whether I'm analyzing a system for security vulnerabilities using <strong className="text-secondary">Metasploit</strong> or architecting a scalable web application with <strong className="text-primary">Spring Boot</strong>, I approach every challenge with the same rigorous, analytical mindset.
              </p>
            </div>
          </SlideInLeft>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-16">Professional Experience</h2>
        
        <div className="space-y-0">
          
          {/* JoinStellar */}
          <FadeIn delay={0.1} className="relative grid md:grid-cols-[140px_auto_1fr] gap-4 md:gap-0">
            {/* Date Column (Desktop) */}
            <div className="hidden md:block text-right py-6 pr-6">
              <span className="text-sm font-semibold text-primary">2024 - Present</span>
            </div>
            
            {/* Timeline Column */}
            <div className="hidden md:flex flex-col items-center">
              {/* Dot */}
              <div className="w-3 h-3 rounded-full bg-primary border-2 border-slate-900 z-10 mt-8 relative">
                <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
              </div>
              {/* Line */}
              <div className="w-px h-full bg-slate-800 absolute top-0 bottom-0"></div>
            </div>

            {/* Content Card */}
            <div className="pb-12 md:pl-8">
              <div className="glass-card p-6 rounded-xl border border-white/5 relative hover:border-primary/30 transition-colors">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">Private Contractor</h3>
                  <p className="text-primary font-medium">JoinStellar.ai</p>
                  <span className="md:hidden text-xs font-semibold bg-primary/20 text-primary px-2 py-1 rounded mt-2 inline-block">2024 - Present</span>
                </div>
                <ul className="list-disc list-inside text-slate-300 space-y-2 text-sm">
                  <li>Training AI models to autonomously handle <strong>GitHub Pull Requests</strong> and generate robust test suites.</li>
                  <li>Specializing in creating test files and validation logic for complex open-source projects like <strong>Grafana</strong> and <strong>Godot</strong>.</li>
                  <li>Conducting high-precision data annotation and prompt engineering for code-generation models.</li>
                </ul>
              </div>
            </div>
          </FadeIn>

          {/* Arhebis */}
          <FadeIn delay={0.2} className="relative grid md:grid-cols-[140px_auto_1fr] gap-4 md:gap-0">
            {/* Date Column (Desktop) */}
            <div className="hidden md:block text-right py-6 pr-6">
              <span className="text-sm font-semibold text-slate-500">2024 - 2025</span>
            </div>
            
            {/* Timeline Column */}
            <div className="hidden md:flex flex-col items-center">
              {/* Dot */}
              <div className="w-3 h-3 rounded-full bg-secondary border-2 border-slate-900 z-10 mt-8"></div>
              {/* Line - Only show if there were more items below, but for the last item we can fade it out or keep it consistent */}
              <div className="w-px h-full bg-slate-800 absolute top-0 bottom-0"></div> 
            </div>

            {/* Content Card */}
            <div className="pb-12 md:pl-8">
              <div className="glass-card p-6 rounded-xl border border-white/5 relative hover:border-secondary/30 transition-colors">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">Junior Software Developer</h3>
                  <p className="text-secondary font-medium">Arhebis Digital Systems</p>
                  <span className="md:hidden text-xs font-semibold bg-slate-800 text-slate-400 px-2 py-1 rounded mt-2 inline-block">2024 - 2025</span>
                </div>
                <ul className="list-disc list-inside text-slate-300 space-y-2 text-sm">
                  <li>Developed custom <strong>JavaScript scripts</strong> to automate repetitive data entry tasks, significantly reducing manual labor.</li>
                  <li>Optimized legacy workflows and handled XHTML/CSS data processing.</li>
                </ul>
              </div>
            </div>
          </FadeIn>

        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* CoFound */}
            <FadeIn delay={0.1} className="group glass-card rounded-xl overflow-hidden hover:border-primary/50 flex flex-col">
              <div className="h-48 bg-gradient-to-br from-blue-600/20 to-indigo-700/20 flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-500">
                <Database className="w-16 h-16 text-primary" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">CoFound</h3>
                  <div title="1st Place Winner">
                    <Award className="w-6 h-6 text-yellow-500" />
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-4 flex-1">
                  A &quot;founder dating&quot; platform for startups. Facilitates equity-based collaboration for unpaid/low-budget projects. Won <strong className="text-primary">1st Place</strong> at the UVT Prototype Fair 2025.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-200 text-xs rounded-md border border-blue-500/20">Spring Boot</span>
                  <span className="px-2 py-1 bg-cyan-900/30 text-cyan-200 text-xs rounded-md border border-cyan-500/20">React.js</span>
                  <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-600/20">MySQL</span>
                </div>
              </div>
            </FadeIn>

            {/* SAT Solver */}
            <FadeIn delay={0.2} className="group glass-card rounded-xl overflow-hidden hover:border-secondary/50 flex flex-col">
              <div className="h-48 bg-gradient-to-br from-teal-500/20 to-emerald-600/20 flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-500">
                <Terminal className="w-16 h-16 text-secondary" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">SAT Solving Comparison</h3>
                  <a 
                    href="https://github.com/lucas-rus/Theoretical_and_Experimental_Comparison_of_SAT_Solving_Algorithms" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-white transition-colors"
                    title="View on GitHub"
                  >
                    <Github className="w-6 h-6" />
                  </a>
                </div>
                <p className="text-slate-400 text-sm mb-4 flex-1">
                  Theoretical and experimental analysis of <strong>Boolean Satisfiability (SAT)</strong> algorithms, comparing heuristics and performance across diverse problem sets.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-600/20">Algorithms</span>
                  <span className="px-2 py-1 bg-purple-900/30 text-purple-200 text-xs rounded-md border border-purple-500/20">Theory</span>
                  <span className="px-2 py-1 bg-green-900/30 text-green-200 text-xs rounded-md border border-green-500/20">Optimization</span>
                </div>
              </div>
            </FadeIn>

            {/* CyberSec/CTF */}
            <FadeIn delay={0.3} className="group glass-card rounded-xl overflow-hidden hover:border-accent/50 flex flex-col">
              <div className="h-48 bg-gradient-to-br from-orange-500/20 to-red-600/20 flex items-center justify-center p-6 group-hover:scale-105 transition-transform duration-500">
                <Shield className="w-16 h-16 text-accent" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-4">Security Research & CTF</h3>
                <p className="text-slate-400 text-sm mb-4 flex-1">
                  Active participant in the <strong>UVT CTF Team</strong> and iTec CyberSecurity Hackathon 2025. Focused on Red Teaming operations and Web Exploitation.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-red-900/30 text-red-200 text-xs rounded-md border border-red-500/20">Metasploit</span>
                  <span className="px-2 py-1 bg-blue-900/30 text-blue-200 text-xs rounded-md border border-blue-500/20">Wireshark</span>
                  <span className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-600/20">Aircrack-ng</span>
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* Skills Section - Miller's Law (Chunking) */}
      <section id="skills" className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-12">Technical Skills</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <SlideInLeft delay={0.1} className="p-6 glass-card rounded-lg border-t-2 border-primary">
            <div className="flex items-center space-x-3 mb-4">
              <Terminal className="w-6 h-6 text-primary" />
              <h3 className="font-bold text-lg text-white">Languages</h3>
            </div>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>Java</li>
              <li>C++</li>
              <li>C</li>
              <li>Python</li>
              <li>C#</li>
              <li>JavaScript/TypeScript</li>
              <li>SQL</li>
            </ul>
          </SlideInLeft>

          <SlideInLeft delay={0.2} className="p-6 glass-card rounded-lg border-t-2 border-secondary">
            <div className="flex items-center space-x-3 mb-4">
              <Code2 className="w-6 h-6 text-secondary" />
              <h3 className="font-bold text-lg text-white">Web Stack</h3>
            </div>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>Spring Boot</li>
              <li>React.js / Next.js</li>
              <li>Tailwind CSS</li>
              <li>HTML5 / CSS3</li>
              <li>Node.js</li>
            </ul>
          </SlideInLeft>

          <SlideInLeft delay={0.3} className="p-6 glass-card rounded-lg border-t-2 border-accent">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-6 h-6 text-accent" />
              <h3 className="font-bold text-lg text-white">Security</h3>
            </div>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>Red Teaming</li>
              <li>Web Exploitation</li>
              <li>Metasploit Framework</li>
              <li>Wireshark Analysis</li>
              <li>Airmon/Aircrack Suite</li>
            </ul>
          </SlideInLeft>

          <SlideInLeft delay={0.4} className="p-6 glass-card rounded-lg border-t-2 border-purple-500">
            <div className="flex items-center space-x-3 mb-4">
              <Cpu className="w-6 h-6 text-purple-500" />
              <h3 className="font-bold text-lg text-white">Tools & Dev</h3>
            </div>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>Unity 3D</li>
              <li>Git / GitHub</li>
              <li>Linux / Bash</li>
              <li>Docker</li>
              <li>IntelliJ IDEA</li>
            </ul>
          </SlideInLeft>

        </div>
      </section>

      {/* Footer / Contact */}
      <footer id="contact" className="bg-slate-900 border-t border-white/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to collaborate?</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">
            I am always open to discussing new projects, security challenges, or innovative ideas. Let's connect.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="https://www.linkedin.com/in/lucas-rus-96492a222" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-white hover:text-slate-900 transition-all">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://github.com/lucas-rus" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-full hover:bg-white hover:text-slate-900 transition-all">
              <Github className="w-6 h-6" />
            </a>
            <a href="mailto:lucas.rus.gheorghiu@gmail.com" className="p-3 bg-white/5 rounded-full hover:bg-white hover:text-slate-900 transition-all">
              <Mail className="w-6 h-6" />
            </a>
          </div>
          <div className="mt-12 text-sm text-slate-500">
            © {new Date().getFullYear()} Lucas Rus. Built with Next.js & Tailwind.
          </div>
        </div>
      </footer>

      <ChatWidget />
    </div>
  );
}

import { Eye, Maximize, Search } from "lucide-react";
