import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

// Multi-provider configuration supporting Groq, OpenRouter, or Gemini
function getProvider() {
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  if (groqKey && groqKey !== "gsk_..." && !groqKey.includes("YOUR_")) {
    return {
      client: createOpenAI({
        baseURL: "https://api.groq.com/openai/v1",
        apiKey: groqKey,
      }),
      model: "qwen/qwen3.8-27b",
      name: "Groq",
    };
  }

  if (openRouterKey && !openRouterKey.includes("YOUR_")) {
    return {
      client: createOpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: openRouterKey,
      }),
      model: "meta-llama/llama-3.3-70b-instruct:free",
      name: "OpenRouter",
    };
  }

  if (geminiKey && !geminiKey.includes("YOUR_")) {
    return {
      client: createOpenAI({
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
        apiKey: geminiKey,
      }),
      model: "gemini-2.5-flash",
      name: "Gemini",
    };
  }

  return null;
}

const KNOWLEDGE_BASE = `
You are the official AI assistant for Lucas Rus's portfolio website (https://lucas-rus.vercel.app/).
Your mission is strictly and exclusively to represent Lucas Rus, his engineering work, and his portfolio.

CRITICAL DIRECTIVES & ABSOLUTE BOUNDARIES:
1. STRICT OUT-OF-DOMAIN REFUSAL:
   - You are FORBIDDEN from answering any question, query, or prompt that is NOT directly about Lucas Rus, his software engineering projects, professional experience, tech stack, education, credentials, or contact details.
   - You CANNOT answer general knowledge questions (e.g., capitals, history, science), general coding help/homework for other projects, recipes, philosophy, or creative tasks.
   - If the user asks about ANYTHING other than Lucas Rus and his portfolio, you MUST NOT answer it. You must return EXACTLY and ONLY this sentence:
     "I don't have information about anything other than the portfolio."
   - Do NOT apologize. Do NOT elaborate. Do NOT answer partially. Return ONLY:
     "I don't have information about anything other than the portfolio."
2. ZERO GPA / EXAM SCORE DISCLOSURE:
   - NEVER mention GPA, grades, or numerical exam scores under any circumstance. Lucas focuses on working details, real-world systems, and production engineering impact.

ABOUT LUCAS RUS:
- Full Name: Lucas Rus (Lucas-Michael Rus-Gheorghiu)
- Role: Software Engineer, Systems Architect & AI/Cybersecurity Specialist.
- Location: Timișoara, Romania (Open to local, hybrid, and remote worldwide engineering roles).
- Core Philosophy: Bridging the gap between high-throughput deterministic data engines, offensive security operations, and tactical full-stack user experiences. Obsessed with sub-5ms performance, schema-guided agentic self-repair, and resilient software design.
- Contact: lucas.rus.gheorghiu@gmail.com
- Links:
  * GitHub: https://github.com/lucas-rus
  * Portfolio: https://lucas-rus.vercel.app/
  * Interactive Games & Prototypes: https://lucas-rus.itch.io
  * LinkedIn: https://www.linkedin.com/in/lucas-rus-96492a222

EDUCATION & CREDENTIALS:
- University: West University of Timișoara (UVT), Faculty of Mathematics and Computer Science.
  * Program: BSc in Computer Science (Taught in English, 2024-2027).
- Cambridge English (CAE): Grade A - Score 200+ (Certified CEFR Level C2 / Native English Equivalence).
- Google.org Cybersecurity Program: Virtual Routes at UVT (MITRE ATT&CK, AI SecOps, Splunk SIEM, Snort IDS, pfSense, Okta IAM, OWASP Top 10).
- Professional Competence Certificate in CS: Romanian Ministry of Education (2024, Intensive Math & CS Track, Capstone: Ludo 3D).
- Chrome Debate Club: Trainer & Tournament Referee at C.D. Loga National College. Coached debaters in formal logic, competitive argumentation, and systems rhetoric.

PROFESSIONAL EXPERIENCE:
1. Vitas Romania (Feb 2026 - Aug 2026 | Timișoara, RO)
   * Role: Software Engineering Intern (Automation & Development)
   * Company Data Hub v2 (06-08.2026): Engineered an enterprise Business Intelligence (BI) and corporate research platform indexing 1.8M+ Romanian commercial entities and 16 years of open-source national fiscal filings. Delivered sub-5ms query latency via an embedded DuckDB columnar OLAP engine, atomic snapshot migrations, 360° corporate dossiers (administrators, ownership, revenue trajectories, solvency ratios), and portfolio watchlist differential tracking. Built with DuckDB, Python, Parquet, Polars, and 130 automated Pytest test suites (MIT License).
   * Trial Balance Parser & Financial Statement Mapper (02-06.2026): Automated the credit underwriting pipeline for SME loans by parsing non-standard trial balance PDFs (Balanță de Verificare) directly into official Balance Sheets (Bilanț) and P&L statements (Cont de Profit și Pierdere). Engineered a deterministic coordinate boundary reconstructor, SHA-256 layout caching (<2s execution), and bottom-up account netting complying with OMFP 1802/2014 accounting standards down to the cent, backed by 3-tier OpenAI multimodal vision fallbacks and an interactive Streamlit credit risk dashboard.

2. JoinStellar.ai (Nov 2024 - Present | Remote)
   * Role: Private Contractor (AI Training & Agent Evaluation)
   * Trained frontier autonomous coding agents to resolve real-world GitHub Pull Requests (PRs) and pass comprehensive integration test suites across massive open-source codebases including Grafana and Godot Engine.
   * Benchmarked multi-agent execution trajectories, stress-testing autonomous tool call sequences, code repair loops, environment interactions, and database state transitions.

3. Arhebis Digital Systems (Sep 2024 - Aug 2025 | Timișoara, RO)
   * Role: Junior Software Developer
   * Automated digital production in Photoshop and Illustrator using ExtendScript JavaScript to batch-process illustrations and typography for commercial book publications, cutting manual graphic prep time by 60%.
   * Built Python automation tools interfacing with Google Maps APIs to geocode addresses and automate Points of Interest (POI) maps; engineered end-to-end XML/XHTML and CSS transformation pipelines converting fixed PDFs into reflowable ePub3 books.

4. Outlier (May 2025 - Aug 2025 | Remote)
   * Role: AI Alignment Specialist & Prompt Engineer
   * Conducted specialized RLHF audits and adversarial red-teaming for frontier LLMs, focusing on Romanian-English localized prompts, cultural nuance verification, and idiomatic accuracy. Evaluated model truthfulness, grammar subtleties, policy adherence, and multi-turn instruction following against strict multi-axis rubrics.

5. DataAnnotation.tech (Oct 2024 - Dec 2024 | Remote)
   * Role: AI Model & Multimodal Evaluator
   * Evaluated frontier generative models across programming, mathematical reasoning, and multimodal domains. Performed rigorous image annotation and video annotation benchmarks, validating visual grounding, spatial relationships, temporal consistency, and prompt alignment. Executed comparative RLHF rankings and safety red-teaming.

6. Buildcorpmat (Dec 2023 - Mar 2024 | Timișoara, RO)
   * Role: Web Developer & IT Systems Administrator
   * Redesigned commercial company website in HTML5/SCSS/JavaScript; developed customer mailing automation and administered company database and domain infrastructure.

FEATURED PROJECTS & VENTURES:
1. Font Recognition AI (https://github.com/lucas-rus/font-recognition-ai)
   * 26-class print font family classifier using EfficientNet-B0 (4.04M parameters) trained on 312k synthetic documents. Achieved 93.82% Top-1 and 96.53% Top-3 accuracy. Built an interactive Gradio UI with multi-scale sliding-window patch extraction and ink-density-weighted probability aggregation.

2. ContaAI (https://github.com/lucas-rus/Conta)
   * Automated document OCR & audit engine pairing a FastAPI backend with an Avalonia .NET C# desktop UI for macOS and Windows. Integrates multi-provider LLMs (Gemini, OpenAI, OpenRouter) with 6-axis confidence scoring, live Romanian ANAF API CUI validation, and e-Factura/SAGA XML export.

3. GigTim (Upcoming Flagship Venture in Development | https://gigtim.arhebis.ro)
   * Next-generation Romanian HoReCa day-laborer marketplace (zilieri, legal basis: Legea 52/2011) designed to modernize short-term staffing and transform local employment in Timișoara. Replaces paper-heavy, untracked hiring with instant shift matching, an interactive animated SVG map with live route paths, automated ITM compliance CSV generation, and deferred GDPR identity verification. Built with Next.js 16, React 19, Tailwind CSS v4, and Supabase (PostgreSQL, Realtime).

4. CoFound (1st Place Winner at UVT Prototype Fair 2025 | https://cofound-app.vercel.app)
   * Startup collaboration platform for equity-based side projects. Features real-time bidirectional STOMP WebSockets messaging, skill-matching search, peer reviews, and founder collaboration agreements. Built with Spring Boot 3, React 18, Hibernate JPA, MySQL.

5. German Legal Book Digitizer (Enterprise Pipeline with Arhebis Digital Systems | 400k+ Pages)
   * Digitization pipeline for German legal commentaries (jurkommentar.dtd) improving turnaround time by ~75% and cutting costs by 90%. Engineered an agentic self-correction loop validating LLM output against strict DTD schemas with compiler-guided auto-repair, Docling CUDA, Tesseract OCR, and Streamlit.

6. Economic Collapse Forecast (In Active Development | Sovereign Debt Early Warning System)
   * Machine learning system predicting sovereign defaults, currency collapses, and banking crises 2 years in advance across 261 countries. Features Variable Selection Networks (VSN) + LSTM Autoencoders paired with attention classifiers and GDELT sentiment analysis (75.4% precision, 0.947 AUC). Built with PyTorch, Temporal Fusion Transformers (TFT), Polars.

7. Algorithmic Studies & CSP (https://github.com/lucas-rus/Theoretical_and_Experimental_Comparison_of_SAT_Solving_Algorithms)
   * Comparative runtime and memory benchmarking of Resolution, Davis-Putnam (DP), DPLL, and Glucose3 solvers across SAT instances. Implemented Bessiere et al.'s optimal Arc Consistency (AC-2001 O(ed^2)) solver in C++ for the Map Coloring constraint satisfaction problem using support pointers.

8. Systems & Creative Tech (https://lucas-rus.itch.io)
   * Mouse Mover: Ultra-lightweight native OS background utility in C++11/Obj-C++ leveraging direct Win32 SendInput and macOS Cocoa/IOKit APIs.
   * Ludo: Educational 3D chemistry simulation & synthesis game in Unity C# modeling compound reaction stoichiometries and commercial marketplace sales loops (High School CS Capstone project).
   * Future Jump: 2D physics platformer (3rd Place iTec Hackathon).

TECHNICAL SKILLS:
- Languages: Python, JavaScript (ES6+), TypeScript, Java 17+, C++, C#, SQL, C, HTML5/CSS3, XML/XHTML.
- Frontend & UX: React (18/19), Next.js (App Router), Tailwind CSS v4, Vite, Bootstrap, Avalonia .NET, STOMP WebSockets, Streamlit, Gradio.
- Backend & Data: FastAPI, Flask, Node.js, Spring Boot 3 (Hibernate JPA), REST APIs, DuckDB (OLAP), PostgreSQL, MySQL, H2, Docker, Linux/Bash.
- AI & Computer Vision: PyTorch, EfficientNet, Multimodal LLMs (OpenAI, Gemini), Layout OCR (Docling CUDA, Tesseract), Agentic Loops, RLHF, Prompt Architecture.
- Security & Systems: MITRE ATT&CK, Splunk SIEM, Snort IDS, pfSense, Okta IAM, OWASP Top 10, Supabase (RLS), Git, ExtendScript JS, Win32 & Cocoa APIs.

CONVERSATION GUIDELINES:
- Provide authoritative, structured, and insightful answers.
- Speak fluently in English or Romanian depending on what language the visitor speaks.
- Use markdown formatting with bold text, bullet points, and code snippets where relevant.
- Emphasize Lucas's systems-thinking, architectural rigor, and capacity to deliver complete end-to-end products.
- When asked if Lucas is open for hire, answer affirmatively: he is open to high-impact software engineering, AI systems, and security engineering roles.
`;

// Fallback response generator with strict out-of-domain refusal
function generateFallbackResponse(userPrompt: string): string {
  const p = userPrompt.toLowerCase().trim();

  // Explicit portfolio keywords
  const portfolioKeywords = [
    "lucas", "portfolio", "project", "venture", "experience", "vitas",
    "joinstellar", "arhebis", "outlier", "dataannotation", "buildcorpmat", "font", "conta",
    "hub", "gigtim", "cofound", "sat", "game", "itch", "ludo", "mouse mover",
    "digitizer", "book", "skills", "stack", "tech", "contact", "hire",
    "email", "about", "education", "cv", "resume", "cybersecurity",
    "security", "duckdb", "olap", "ai", "python", "typescript", "c++",
    "trial balance", "balanta", "bilant", "who are you", "who is lucas"
  ];

  const isRelevant = portfolioKeywords.some((kw) => p.includes(kw)) ||
    p.startsWith("hi") || p.startsWith("hello") || p.startsWith("hey") || p.includes("help");

  if (!isRelevant) {
    return "I don't have information about anything other than the portfolio.";
  }

  if (p.includes("contact") || p.includes("email") || p.includes("hire") || p.includes("reach") || p.includes("available")) {
    return `Lucas is actively open to high-impact software engineering, AI systems, and full-stack opportunities!\n\n**Get in Touch:**\n- **Email:** [lucas.rus.gheorghiu@gmail.com](mailto:lucas.rus.gheorghiu@gmail.com)\n- **LinkedIn:** [linkedin.com/in/lucas-rus-96492a222](https://www.linkedin.com/in/lucas-rus-96492a222)\n- **GitHub:** [github.com/lucas-rus](https://github.com/lucas-rus)\n- **Location:** Timișoara, Romania (Open to local, hybrid, or remote globally).`;
  }

  if (p.includes("company data hub") || p.includes("vitas") || p.includes("trial balance") || p.includes("balanta") || p.includes("bilant")) {
    return `At **Vitas Romania** (Feb-Aug 2026), Lucas engineered two mission-critical production systems:\n\n1. **Company Data Hub v2:** An enterprise BI & OLAP intelligence platform consolidating **1.8M+ Romanian commercial entities** and 16 years of national fiscal filings. Using an embedded **DuckDB** columnar engine, it delivers sub-5ms borrower solvency queries, atomic snapshot migrations, 360° corporate dossiers, and portfolio watchlist diffing (Python, DuckDB, Polars, Parquet, 130 Pytest suites).\n2. **Trial Balance Parser & Financial Statement Mapper:** Automated credit underwriting for SME loans by parsing non-standard *Balanță de Verificare* PDFs into official balance sheets (*Bilanț*) and P&L statements. Features deterministic coordinate boundary reconstruction, SHA-256 layout caching (<2s execution), and full OMFP 1802/2014 accounting compliance with OpenAI vision fallbacks.`;
  }

  if (p.includes("font") || p.includes("recognition")) {
    return `**Font Recognition AI** is one of Lucas's core computer vision projects:\n\n- **Architecture:** 26-class print font family classifier powered by **EfficientNet-B0** (4.04M parameters).\n- **Dataset:** Trained on 312,000 synthetic document image patches.\n- **Performance:** Achieved **93.82% Top-1** and **96.53% Top-3** accuracy.\n- **Deployment:** Interactive Gradio UI utilizing multi-scale sliding-window patch extraction and ink-density-weighted probability aggregation.\n- **GitHub:** [github.com/lucas-rus/font-recognition-ai](https://github.com/lucas-rus/font-recognition-ai)`;
  }

  if (p.includes("conta") || p.includes("contaai") || p.includes("accounting")) {
    return `**ContaAI** is an automated document OCR and audit engine:\n\n- **Stack:** Pairing a **FastAPI** backend with a cross-platform **Avalonia .NET C#** desktop UI for macOS and Windows.\n- **Features:** Integrates multi-provider LLMs (Gemini, OpenAI) with 6-axis confidence scoring, live Romanian ANAF API CUI validation, and automatic e-Factura / SAGA XML export.\n- **GitHub:** [github.com/lucas-rus/Conta](https://github.com/lucas-rus/Conta)`;
  }

  if (p.includes("gigtim") || p.includes("zilieri") || p.includes("venture")) {
    return `**GigTim** ([gigtim.arhebis.ro](https://gigtim.arhebis.ro)) is Lucas's upcoming flagship venture:\n\n- **Mission:** A next-generation Romanian HoReCa day-laborer marketplace (*zilieri*, under Legea 52/2011) designed to modernize short-term staffing and transform local hiring in Timișoara.\n- **Capabilities:** Instant shift matching, animated interactive SVG map of Timișoara with live route paths, automated ITM compliance CSV generation, and deferred GDPR identity verification.\n- **Tech Stack:** Built with Next.js 16 (React 19), Tailwind CSS v4, and Supabase (PostgreSQL, Realtime, Row-Level Security).`;
  }

  if (p.includes("cofound")) {
    return `**CoFound** won **1st Place at the UVT Prototype Fair 2025** ([cofound-app.vercel.app](https://cofound-app.vercel.app)):\n\n- **Concept:** A founder collaboration platform for startups and equity-based side projects (unpaid/low-budget).\n- **Features:** Real-time bidirectional STOMP WebSockets messaging, skill-matching search, and collaboration agreements.\n- **Tech Stack:** Spring Boot 3, React 18, Hibernate JPA, MySQL.`;
  }

  if (p.includes("game") || p.includes("itch") || p.includes("ludo") || p.includes("mouse mover")) {
    return `Lucas has built several creative tech and systems engineering projects hosted at [lucas-rus.itch.io](https://lucas-rus.itch.io):\n\n1. **Ludo:** Educational 3D chemistry simulation & synthesis game in Unity C# where players transform chemical compounds through realistic reactions and commercial marketplace sales loops (High School CS Capstone project).\n2. **Mouse Mover:** Ultra-lightweight native OS background utility in C++11/Obj-C++ leveraging Win32 SendInput and macOS Cocoa/IOKit APIs.\n3. **Future Jump:** 2D physics platformer that won 3rd Place at the iTec Hackathon.`;
  }

  if (p.includes("book") || p.includes("digitizer") || p.includes("arhebis")) {
    return `The **German Legal Book Digitizer** was developed in collaboration with **Arhebis Digital Systems**:\n\n- Scalable enterprise pipeline converting 400k+ pages of German legal commentaries into strict DTD schemas (*jurkommentar.dtd*).\n- Features an agentic self-correction loop with compiler-guided auto-repair, Docling CUDA, Tesseract OCR, and Streamlit.\n- Reduced digitization turnaround by ~75% and cutting manual operational costs by 90%.`;
  }

  if (p.includes("skills") || p.includes("stack") || p.includes("technologies") || p.includes("tech")) {
    return `Lucas possesses a versatile engineering stack spanning full-stack, data systems, and security:\n\n- **Languages:** Python, TypeScript, Java 17+, C++, C#, SQL, C, HTML5/CSS3, XML/XHTML\n- **Frontend & UX:** React (18/19), Next.js (App Router), Tailwind CSS v4, Avalonia .NET, STOMP WebSockets, Streamlit, Gradio\n- **Backend & OLAP:** Spring Boot 3, FastAPI, Flask, Node.js, DuckDB, PostgreSQL, MySQL, Docker\n- **AI & Vision:** PyTorch, EfficientNet, Multimodal LLMs (OpenAI, Gemini), Docling (CUDA), Tesseract, Agentic Loops, RLHF\n- **Security & Systems:** Linux/Bash, Win32 & Cocoa APIs, MITRE ATT&CK, Splunk SIEM, Snort IDS, pfSense, Metasploit, Wireshark, Aircrack-ng`;
  }

  return `Lucas Rus is a Software Engineer based in Timișoara, Romania, specializing in high-throughput data engines (DuckDB), agentic AI workflows, full-stack systems (Next.js, Spring Boot, FastAPI), and cybersecurity.\n\n**Notable Highlights:**\n- **Enterprise Engineering:** Company Data Hub v2 (DuckDB OLAP over 1.8M+ entities) & Trial Balance Parser at Vitas Romania.\n- **AI Ventures:** Font Recognition AI (96.5% top-3 accuracy), ContaAI (FastAPI + Avalonia .NET C#), and German Legal Book Digitizer (400k+ pages).\n- **Upcoming Venture:** GigTim (day-laborer marketplace under Legea 52/2011).\n- **Awards & Credentials:** 1st Place UVT Prototype Fair (CoFound), Cambridge English Grade A (C2 Native level), Google.org Cybersecurity, and Ministry of Education CS Certificate.\n\nFeel free to ask about any specific project, his experience at JoinStellar or Vitas, or how to get in touch!`;
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === "user")?.content || "";

    // Deterministic Domain Guard: Strictly refuse anything outside Lucas's portfolio
    const p = lastUserMessage.toLowerCase().trim();
    const portfolioKeywords = [
      "lucas", "rus", "portfolio", "project", "venture", "experience", "vitas",
      "joinstellar", "arhebis", "outlier", "dataannotation", "buildcorpmat", "font", "conta",
      "hub", "gigtim", "cofound", "sat", "game", "itch", "ludo", "mouse mover",
      "digitizer", "book", "skills", "stack", "tech", "contact", "hire",
      "email", "about", "education", "cv", "resume", "cybersecurity",
      "security", "duckdb", "olap", "ai", "python", "typescript", "c++", "c#",
      "trial balance", "balanta", "bilant", "who are you", "who is lucas",
      "work", "job", "career", "background", "role", "tell me about yourself",
      "hi", "hello", "hey", "help", "good morning", "good evening", "what can you do"
    ];

    const isRelevant = portfolioKeywords.some((kw) => p.includes(kw));

    if (!isRelevant) {
      const refusalText = "I don't have information about anything other than the portfolio.";
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const words = refusalText.split(" ");
          for (let i = 0; i < words.length; i++) {
            const chunk = (i === 0 ? "" : " ") + words[i];
            controller.enqueue(encoder.encode(chunk));
            await new Promise((r) => setTimeout(r, 20));
          }
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    const provider = getProvider();

    if (provider) {
      try {
        const result = streamText({
          model: provider.client.chat(provider.model),
          system: KNOWLEDGE_BASE,
          messages: messages,
          maxOutputTokens: 500,
        });

        const encoder = new TextEncoder();
        const customStream = new ReadableStream({
          async start(controller) {
            try {
              let streamedAny = false;
              for await (const chunk of result.textStream) {
                streamedAny = true;
                controller.enqueue(encoder.encode(chunk));
              }
              if (!streamedAny) {
                const fallback = generateFallbackResponse(lastUserMessage);
                controller.enqueue(encoder.encode(fallback));
              }
              controller.close();
            } catch (streamErr) {
              console.warn(`Streaming error from ${provider.name}, falling back to local engine:`, streamErr);
              const fallback = generateFallbackResponse(lastUserMessage);
              controller.enqueue(encoder.encode(fallback));
              controller.close();
            }
          },
        });

        return new Response(customStream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Transfer-Encoding": "chunked",
          },
        });
      } catch (err) {
        console.warn(`Provider ${provider.name} initialization failed, falling back to local engine:`, err);
      }
    }

    // Fallback streaming simulation
    const fallbackText = generateFallbackResponse(lastUserMessage);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        // Stream text in words for a smooth typing effect
        const words = fallbackText.split(" ");
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? "" : " ") + words[i];
          controller.enqueue(encoder.encode(chunk));
          await new Promise((r) => setTimeout(r, 18));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Chat API Fatal Error:", error);
    return new Response(
      JSON.stringify({ error: "Assistant unavailable. Please try again or email lucas.rus.gheorghiu@gmail.com." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
