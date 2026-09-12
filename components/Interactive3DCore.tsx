"use client";

import { useEffect, useRef, useState } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Particle3D extends Point3D {
  vx: number;
  vy: number;
  vz: number;
  size: number;
  hue: number;
}

interface EdgePacket {
  edgeIndex: number;
  progress: number;
  speed: number;
  color: string;
}

export default function Interactive3DCore() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [statusText, setStatusText] = useState("CORE_SYNAPSE_ONLINE");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let cssWidth = Math.min(canvas.parentElement?.clientWidth || 280, 360);
    let cssHeight = Math.min(270, Math.max(220, cssWidth * 0.8));

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      cssWidth = Math.min(canvas.parentElement.clientWidth, 360);
      cssHeight = Math.min(270, Math.max(220, cssWidth * 0.8));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(cssWidth * dpr);
      canvas.height = Math.floor(cssHeight * dpr);
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // ================= 3D GEOMETRY DEFINITIONS =================

    // 1. Outer Icosahedron / Geodesic Cage (radius ~92)
    const phi = (1 + Math.sqrt(5)) / 2;
    const outerBase: Point3D[] = [
      { x: -1, y: phi, z: 0 },
      { x: 1, y: phi, z: 0 },
      { x: -1, y: -phi, z: 0 },
      { x: 1, y: -phi, z: 0 },
      { x: 0, y: -1, z: phi },
      { x: 0, y: 1, z: phi },
      { x: 0, y: -1, z: -phi },
      { x: 0, y: 1, z: -phi },
      { x: phi, y: 0, z: -1 },
      { x: phi, y: 0, z: 1 },
      { x: -phi, y: 0, z: -1 },
      { x: -phi, y: 0, z: 1 },
    ].map((v) => {
      const len = Math.hypot(v.x, v.y, v.z);
      const r = 90;
      return { x: (v.x / len) * r, y: (v.y / len) * r, z: (v.z / len) * r };
    });

    const outerEdges: [number, number][] = [];
    for (let i = 0; i < outerBase.length; i++) {
      for (let j = i + 1; j < outerBase.length; j++) {
        const d = Math.hypot(
          outerBase[i].x - outerBase[j].x,
          outerBase[i].y - outerBase[j].y,
          outerBase[i].z - outerBase[j].z
        );
        if (d < 105) {
          outerEdges.push([i, j]);
        }
      }
    }

    // 2. Inner Counter-Rotating Core (Octahedron, radius ~46)
    const innerBase: Point3D[] = [
      { x: 46, y: 0, z: 0 },
      { x: -46, y: 0, z: 0 },
      { x: 0, y: 46, z: 0 },
      { x: 0, y: -46, z: 0 },
      { x: 0, y: 0, z: 46 },
      { x: 0, y: 0, z: -46 },
    ];

    const innerEdges: [number, number][] = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2],
    ];

    // 3. Orbital Ring 1 Points (Circle in XZ plane, tilted 25 deg on Z axis)
    const ring1Count = 28;
    const ring1Radius = 112;
    const ring1Points: Point3D[] = [];
    for (let i = 0; i < ring1Count; i++) {
      const angle = (i / ring1Count) * Math.PI * 2;
      const rx = Math.cos(angle) * ring1Radius;
      const rz = Math.sin(angle) * ring1Radius;
      // Tilt around Z by 25 deg
      const cosZ = Math.cos(0.44);
      const sinZ = Math.sin(0.44);
      ring1Points.push({
        x: rx * cosZ,
        y: rx * sinZ,
        z: rz,
      });
    }

    // 4. Traveling Photon Energy Packets along outer edges
    const edgePackets: EdgePacket[] = [];
    for (let i = 0; i < 7; i++) {
      edgePackets.push({
        edgeIndex: Math.floor(Math.random() * outerEdges.length),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
        color: i % 2 === 0 ? "#38bdf8" : "#2dd4bf",
      });
    }

    // 5. Internal Constellation / Synaptic Plexus Particles
    const particles: Particle3D[] = [];
    for (let i = 0; i < 36; i++) {
      const theta = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      const rad = 15 + Math.random() * 55;
      particles.push({
        x: rad * Math.sin(ph) * Math.cos(theta),
        y: rad * Math.sin(ph) * Math.sin(theta),
        z: rad * Math.cos(ph),
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        vz: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 1.8 + 0.8,
        hue: Math.random() > 0.4 ? 195 : 230,
      });
    }

    // ================= ROTATION & INERTIAL INTERACTION =================
    let rotX = 0.35;
    let rotY = 0.5;
    let velX = 0;
    let velY = 0;
    let isPointerDown = false;
    let prevX = 0;
    let prevY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      setIsDragging(true);
      prevX = e.clientX;
      prevY = e.clientY;
      velX = 0;
      velY = 0;
      canvas.setPointerCapture(e.pointerId);
      setStatusText("3D_MANUAL_ORBIT");
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;
      targetParallaxX = (mouseY / rect.height) * 0.15;
      targetParallaxY = (mouseX / rect.width) * 0.15;

      if (!isPointerDown) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      const deltaRotY = dx * 0.008;
      const deltaRotX = -dy * 0.008;

      rotY += deltaRotY;
      rotX += deltaRotX;

      velY = deltaRotY;
      velX = deltaRotX;

      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      setIsDragging(false);
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
      setStatusText("CORE_SYNAPSE_ONLINE");
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    // 3D Perspective Projection Function
    const project = (p: Point3D, rx: number, ry: number, cx: number, cy: number) => {
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const cameraDist = 280;
      const scale = cameraDist / (cameraDist + z2);
      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        z: z2,
        scale,
      };
    };

    let time = 0;

    // ================= ANIMATION RENDER LOOP =================
    const render = () => {
      time += 0.018;

      if (isPointerDown) {
        // Direct touch / mouse orbit
      } else {
        // Inertia coasting with smooth damping
        rotX += velX;
        rotY += velY;
        velX *= 0.93;
        velY *= 0.93;

        // Gentle auto-rotation when stationary
        if (Math.hypot(velX, velY) < 0.0008) {
          rotY += 0.0035;
          rotX += 0.0012;
        }

        // Subtle parallax attraction
        rotX += (targetParallaxX - 0) * 0.01;
        rotY += (targetParallaxY - 0) * 0.01;
      }

      ctx.clearRect(0, 0, cssWidth, cssHeight);
      const cx = cssWidth / 2;
      const cy = cssHeight / 2;

      // 1. Ambient Background Core Glow (Atmospheric Singularity)
      const corePulse = 1 + Math.sin(time * 2.5) * 0.08;
      const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, 110 * corePulse);
      grad.addColorStop(0, "rgba(56, 189, 248, 0.18)");
      grad.addColorStop(0.35, "rgba(99, 102, 241, 0.10)");
      grad.addColorStop(0.75, "rgba(20, 184, 166, 0.04)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 110 * corePulse, 0, Math.PI * 2);
      ctx.fill();

      // 2. Projected Orbital Ring with Orbiting Satellite Node
      const projRing = ring1Points.map((pt) => project(pt, rotX * 0.85, rotY * 0.85, cx, cy));
      ctx.beginPath();
      for (let i = 0; i < projRing.length; i++) {
        const p = projRing[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.16)";
      ctx.lineWidth = 0.85;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Satellite node traveling around the orbital ring
      const satAngle = time * 1.4;
      const satIndex = Math.floor((((satAngle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / ((Math.PI * 2) / ring1Count));
      const satPt = projRing[satIndex % projRing.length];
      if (satPt) {
        ctx.beginPath();
        ctx.arc(satPt.x, satPt.y, 2.5 * satPt.scale, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 3. Inner Counter-Rotating Octahedron Core
      const innerRotX = -rotX * 1.15 + time * 0.5;
      const innerRotY = -rotY * 1.15 + time * 0.7;
      const projInner = innerBase.map((v) => {
        const breathe = 1 + Math.sin(time * 3 + v.x) * 0.04;
        return project({ x: v.x * breathe, y: v.y * breathe, z: v.z * breathe }, innerRotX, innerRotY, cx, cy);
      });

      // Draw Inner Edges (Deeper Indigo/Violet Luminescence)
      innerEdges.forEach(([i, j]) => {
        const p1 = projInner[i];
        const p2 = projInner[j];
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.2, Math.min(0.85, (avgZ + 60) / 120));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(129, 140, 248, ${alpha * 0.75})`;
        ctx.lineWidth = 1.0 * p1.scale;
        ctx.stroke();
      });

      // Inner Core Vertices
      projInner.forEach((p) => {
        const alpha = Math.max(0.3, (p.z + 50) / 100);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.2 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${alpha})`;
        ctx.fill();
      });

      // 4. Internal Synaptic Plexus (Particles with Dynamic Micro-Filaments)
      particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.z += pt.vz;

        const dist = Math.hypot(pt.x, pt.y, pt.z);
        if (dist > 65) {
          pt.vx *= -1;
          pt.vy *= -1;
          pt.vz *= -1;
        }
      });

      const projParticles = particles.map((pt) => ({
        ...project(pt, rotX, rotY, cx, cy),
        hue: pt.hue,
        size: pt.size,
      }));

      // Draw proximity synaptic filaments between close particles
      for (let i = 0; i < projParticles.length; i++) {
        for (let j = i + 1; j < projParticles.length; j++) {
          const pi = projParticles[i];
          const pj = projParticles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const d = Math.hypot(dx, dy);
          if (d < 38) {
            const lineAlpha = (1 - d / 38) * 0.28;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      projParticles.forEach((p) => {
        const alpha = Math.max(0.2, (p.z + 70) / 140);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 95%, 68%, ${alpha})`;
        ctx.fill();
      });

      // 5. Outer Geodesic Crystalline Cage
      const outerPulse = 1 + Math.sin(time * 2.2) * 0.025;
      const projOuter = outerBase.map((v) =>
        project(
          { x: v.x * outerPulse, y: v.y * outerPulse, z: v.z * outerPulse },
          rotX,
          rotY,
          cx,
          cy
        )
      );

      // Draw Outer Cage Edges
      outerEdges.forEach(([i, j]) => {
        const p1 = projOuter[i];
        const p2 = projOuter[j];
        const avgZ = (p1.z + p2.z) / 2;
        const alpha = Math.max(0.12, Math.min(0.85, (avgZ + 100) / 200));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.55})`;
        ctx.lineWidth = 1.1 * p1.scale;
        ctx.stroke();
      });

      // 6. Traveling Edge Photon Energy Packets
      edgePackets.forEach((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1) {
          pkt.progress = 0;
          pkt.edgeIndex = Math.floor(Math.random() * outerEdges.length);
        }

        const [i, j] = outerEdges[pkt.edgeIndex];
        const p1 = projOuter[i];
        const p2 = projOuter[j];

        const curX = p1.x + (p2.x - p1.x) * pkt.progress;
        const curY = p1.y + (p2.y - p1.y) * pkt.progress;
        const curScale = p1.scale + (p2.scale - p1.scale) * pkt.progress;

        ctx.beginPath();
        ctx.arc(curX, curY, 2.0 * curScale, 0, Math.PI * 2);
        ctx.fillStyle = pkt.color;
        ctx.shadowColor = pkt.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 7. Outer Cage Nodes / Vertices (with Radiant Bloom)
      projOuter.forEach((p) => {
        const alpha = Math.max(0.25, (p.z + 100) / 200);

        // Core bright pip
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.8 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${alpha})`;
        ctx.fill();

        // Outer halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6.5 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.22})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 group select-none bg-slate-950/60 rounded-2xl border border-cyan-500/20 backdrop-blur-md shadow-2xl overflow-hidden">
      {/* Decorative Technical HUD Overlay */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-cyan-400/80 tracking-widest px-2 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>SYS.3D // {statusText}</span>
        </div>
        <span className="text-slate-500 text-[9px] bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          DRAG TO ROTATE
        </span>
      </div>

      {/* Cyber Corner Brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none" />

      {/* Interactive 3D Canvas with High-DPI Retina Rendering */}
      <canvas
        ref={canvasRef}
        className={`w-full max-w-full h-[240px] sm:h-[270px] drop-shadow-[0_0_28px_rgba(56,189,248,0.22)] touch-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      />

      {/* Bottom Telemetry Bar */}
      <div className="w-full flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-slate-400 px-2 sm:px-3 pt-2 border-t border-cyan-500/20 mt-1 gap-1">
        <span className="text-cyan-300 truncate">NODE: DUCKDB_OLAP</span>
        <span className="text-indigo-300 truncate">ENTITIES: 1.8M+</span>
        <span className="text-emerald-400 shrink-0">LATENCY: &lt;4.8ms</span>
      </div>
    </div>
  );
}
