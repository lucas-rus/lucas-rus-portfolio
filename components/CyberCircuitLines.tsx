"use client";

import { motion } from "framer-motion";

export function CyberCircuitBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-40 sm:opacity-45 w-full max-w-[100vw]">
      {/* Soft Ambient Scanline Radar Sweep */}
      <div className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent blur-[0.5px] animate-radar-sweep pointer-events-none z-0" />

      {/* SVG Circuit Lines with Animated Light Pulses & Nodes */}
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cyberGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="cyberGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.28" />
          </linearGradient>

          <pattern id="cyberGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="0.75" fill="#38bdf8" fillOpacity="0.16" />
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.035" />
          </pattern>

          {/* SVG Glow Filter */}
          <filter id="circuitGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Global Dot Matrix Grid */}
        <rect width="100%" height="100%" fill="url(#cyberGrid)" />

        {/* ================= CIRCUIT TRACES & ACTIVE FLOWS ================= */}

        {/* Trace 1 - Left side downwards */}
        <path
          d="M 40,0 L 40,240 L 140,340 L 140,800 L 80,860 L 80,2400"
          fill="none"
          stroke="url(#cyberGrad1)"
          strokeWidth="1"
          strokeDasharray="4,8"
        />
        {/* Flowing Pulse 1 */}
        <circle r="2.8" fill="#38bdf8" filter="url(#circuitGlow)">
          <animateMotion
            path="M 40,0 L 40,240 L 140,340 L 140,800 L 80,860 L 80,2400"
            dur="11s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Trace 2 - Right side downwards */}
        <path
          d="M 94%,0 L 94%,380 L 87%,450 L 87%,1150 L 92%,1200 L 92%,2600"
          fill="none"
          stroke="url(#cyberGrad1)"
          strokeWidth="1"
          strokeDasharray="6,6"
        />
        {/* Flowing Pulse 2 */}
        <circle r="3.2" fill="#2dd4bf" filter="url(#circuitGlow)">
          <animateMotion
            path="M 94%,0 L 94%,380 L 87%,450 L 87%,1150 L 92%,1200 L 92%,2600"
            dur="15s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Trace 3 - Upper hero horizontal cross-bus */}
        <path
          d="M 0,220 L 260,220 L 320,280 L 640,280 L 700,220 L 100%,220"
          fill="none"
          stroke="url(#cyberGrad2)"
          strokeWidth="0.85"
          strokeDasharray="5,7"
        />
        {/* Flowing Pulse 3 */}
        <circle r="2.5" fill="#818cf8" filter="url(#circuitGlow)">
          <animateMotion
            path="M 0,220 L 260,220 L 320,280 L 640,280 L 700,220 L 100%,220"
            dur="18s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Trace 4 - Mid-lower diagonal interconnect */}
        <path
          d="M 12%,0 L 12%,420 L 24%,540 L 52%,540 L 64%,660 L 64%,1900"
          fill="none"
          stroke="url(#cyberGrad1)"
          strokeWidth="0.8"
          strokeDasharray="3,9"
        />
        {/* Flowing Pulse 4 */}
        <circle r="2.6" fill="#38bdf8" filter="url(#circuitGlow)">
          <animateMotion
            path="M 12%,0 L 12%,420 L 24%,540 L 52%,540 L 64%,660 L 64%,1900"
            dur="14s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Trace 5 - Lower lateral telemetry bus */}
        <path
          d="M 100%,620 L 740,620 L 680,680 L 380,680 L 320,740 L 0,740"
          fill="none"
          stroke="url(#cyberGrad2)"
          strokeWidth="0.85"
          strokeDasharray="4,6"
        />
        {/* Flowing Pulse 5 */}
        <circle r="2.4" fill="#2dd4bf" filter="url(#circuitGlow)">
          <animateMotion
            path="M 100%,620 L 740,620 L 680,680 L 380,680 L 320,740 L 0,740"
            dur="21s"
            repeatCount="indefinite"
          />
        </circle>

        {/* ================= BREATHING JUNCTION NODES ================= */}
        {/* Junction at (140, 340) */}
        <g transform="translate(140, 340)">
          <circle r="2" fill="#38bdf8" />
          <circle r="5" fill="none" stroke="#38bdf8" strokeWidth="0.75">
            <animate attributeName="r" values="3;6.5;3" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Junction at (320, 280) */}
        <g transform="translate(320, 280)">
          <circle r="1.8" fill="#818cf8" />
          <circle r="4" fill="none" stroke="#818cf8" strokeWidth="0.75">
            <animate attributeName="r" values="2.5;5.5;2.5" dur="4.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0.75;0.25" dur="4.2s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Junction at (640, 280) */}
        <g transform="translate(640, 280)">
          <circle r="1.8" fill="#818cf8" />
          <circle r="4" fill="none" stroke="#818cf8" strokeWidth="0.75">
            <animate attributeName="r" values="2.5;5.5;2.5" dur="4.8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4.8s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Junction at (80, 860) */}
        <g transform="translate(80, 860)">
          <circle r="2" fill="#2dd4bf" />
          <circle r="5" fill="none" stroke="#2dd4bf" strokeWidth="0.75">
            <animate attributeName="r" values="3;6;3" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0.8;0.25" dur="5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* ================= FLOATING AMBIENT TELEMETRY NODES ================= */}
        {/* Node A */}
        <circle cx="22%" cy="180" r="1.5" fill="#38bdf8" opacity="0.35">
          <animate attributeName="opacity" values="0.15;0.5;0.15" dur="6s" repeatCount="indefinite" />
          <animate attributeName="cy" values="180;170;180" dur="8s" repeatCount="indefinite" />
        </circle>
        {/* Node B */}
        <circle cx="78%" cy="290" r="1.8" fill="#2dd4bf" opacity="0.3">
          <animate attributeName="opacity" values="0.2;0.55;0.2" dur="7s" repeatCount="indefinite" />
          <animate attributeName="cy" values="290;280;290" dur="9s" repeatCount="indefinite" />
        </circle>
        {/* Node C */}
        <circle cx="48%" cy="140" r="1.3" fill="#818cf8" opacity="0.25">
          <animate attributeName="opacity" values="0.1;0.45;0.1" dur="5.5s" repeatCount="indefinite" />
          <animate attributeName="cy" values="140;132;140" dur="7.5s" repeatCount="indefinite" />
        </circle>
        {/* Node D */}
        <circle cx="85%" cy="580" r="1.5" fill="#38bdf8" opacity="0.3">
          <animate attributeName="opacity" values="0.15;0.5;0.15" dur="6.5s" repeatCount="indefinite" />
          <animate attributeName="cy" values="580;572;580" dur="8.5s" repeatCount="indefinite" />
        </circle>
        {/* Node E */}
        <circle cx="18%" cy="720" r="1.4" fill="#2dd4bf" opacity="0.28">
          <animate attributeName="opacity" values="0.12;0.48;0.12" dur="6.2s" repeatCount="indefinite" />
          <animate attributeName="cy" values="720;710;720" dur="8.2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

export function SectionDividerWithTelemetry({ label, coords }: { label: string; coords?: string }) {
  return (
    <div className="relative w-full py-8 flex items-center justify-between z-10 select-none">
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]"></div>
        <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-semibold">
          [ {label} ]
        </span>
        <div className="h-[1px] w-16 sm:w-36 bg-gradient-to-r from-cyan-500/60 to-transparent"></div>
      </div>

      <div className="hidden sm:flex items-center space-x-3 text-[10px] font-mono text-slate-500">
        <span>{coords || "LOC: 45.7537° N, 21.2257° E // TIMIȘOARA"}</span>
        <span className="text-cyan-500/60">◆</span>
        <span className="text-slate-600">SYS_BUS_SYNCED</span>
      </div>
    </div>
  );
}
