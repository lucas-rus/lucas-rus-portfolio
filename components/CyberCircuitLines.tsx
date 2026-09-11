"use client";

import { motion } from "framer-motion";

export function CyberCircuitBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-40">
      {/* SVG Circuit Lines with Animated Light Pulses */}
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cyberGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.3" />
          </linearGradient>

          <pattern id="cyberGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="0.8" fill="#38bdf8" fillOpacity="0.18" />
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.04" />
          </pattern>
        </defs>

        {/* Global Dot Matrix Grid */}
        <rect width="100%" height="100%" fill="url(#cyberGrid)" />

        {/* Diagonal and Orthogonal Circuit Traces */}
        {/* Trace 1 - Left side downwards */}
        <path
          d="M 40,0 L 40,240 L 140,340 L 140,800 L 80,860 L 80,1800"
          fill="none"
          stroke="url(#cyberGrad1)"
          strokeWidth="1"
          strokeDasharray="4,8"
        />
        {/* Flowing Pulse 1 */}
        <circle r="2.5" fill="#38bdf8" className="drop-shadow-[0_0_8px_#38bdf8]">
          <animateMotion
            path="M 40,0 L 40,240 L 140,340 L 140,800 L 80,860 L 80,1800"
            dur="12s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Trace 2 - Right side downwards */}
        <path
          d="M 92%,0 L 92%,400 L 85%,470 L 85%,1100 L 90%,1150 L 90%,2200"
          fill="none"
          stroke="url(#cyberGrad1)"
          strokeWidth="1"
          strokeDasharray="6,6"
        />
        {/* Flowing Pulse 2 */}
        <circle r="3" fill="#2dd4bf" className="drop-shadow-[0_0_8px_#2dd4bf]">
          <animateMotion
            path="M 92%,0 L 92%,400 L 85%,470 L 85%,1100 L 90%,1150 L 90%,2200"
            dur="16s"
            repeatCount="indefinite"
          />
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
