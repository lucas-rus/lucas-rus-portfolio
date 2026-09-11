"use client";

import { useEffect, useRef, useState } from "react";

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function Interactive3DCore() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [statusText, setStatusText] = useState("ENGINE_ONLINE");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = 340);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = Math.min(360, width);
    };
    window.addEventListener("resize", handleResize);

    // 3D Vertices for an Icosahedron / Geodesic Dual Shell
    const t = (1 + Math.sqrt(5)) / 2;
    const baseVertices: Point3D[] = [
      { x: -1, y: t, z: 0 },
      { x: 1, y: t, z: 0 },
      { x: -1, y: -t, z: 0 },
      { x: 1, y: -t, z: 0 },
      { x: 0, y: -1, z: t },
      { x: 0, y: 1, z: t },
      { x: 0, y: -1, z: -t },
      { x: 0, y: 1, z: -t },
      { x: t, y: 0, z: -1 },
      { x: t, y: 0, z: 1 },
      { x: -t, y: 0, z: -1 },
      { x: -t, y: 0, z: 1 },
    ].map((v) => {
      const len = Math.hypot(v.x, v.y, v.z);
      return { x: (v.x / len) * 95, y: (v.y / len) * 95, z: (v.z / len) * 95 };
    });

    // Edges between vertices
    const edges: [number, number][] = [];
    for (let i = 0; i < baseVertices.length; i++) {
      for (let j = i + 1; j < baseVertices.length; j++) {
        const d = Math.hypot(
          baseVertices[i].x - baseVertices[j].x,
          baseVertices[i].y - baseVertices[j].y,
          baseVertices[i].z - baseVertices[j].z
        );
        if (d < 115) {
          edges.push([i, j]);
        }
      }
    }

    // Inner orbiting data particles
    const particles: (Point3D & { vx: number; vy: number; vz: number; size: number; hue: number })[] = [];
    for (let i = 0; i < 35; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 25 + Math.random() * 55;
      particles.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        vz: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2.2 + 1,
        hue: Math.random() > 0.5 ? 190 : 220, // Cyan to Blue
      });
    }

    // Rotation angles and mouse tracking
    let rotX = 0.3;
    let rotY = 0.4;
    let targetRotX = 0.3;
    let targetRotY = 0.4;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRotY = nx * 1.2;
      targetRotX = -ny * 1.2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 3D rotation matrix function
    const project = (p: Point3D, rx: number, ry: number, cx: number, cy: number) => {
      // Rotate Y
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;

      // Rotate X
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      // Perspective Projection
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

    const render = () => {
      time += 0.015;
      // Smooth lerp towards mouse target
      rotX += (targetRotX - rotX) * 0.05 + 0.003;
      rotY += (targetRotY - rotY) * 0.05 + 0.005;

      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Projected outer core vertices
      const projected = baseVertices.map((v) => {
        // Subtle breathing expansion
        const pulse = 1 + Math.sin(time * 2) * 0.04;
        return project({ x: v.x * pulse, y: v.y * pulse, z: v.z * pulse }, rotX, rotY, cx, cy);
      });

      // Draw outer cage lines
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        const avgZ = (p1.z + p2.z) / 2;
        // Depth-based opacity
        const alpha = Math.max(0.12, Math.min(0.85, (avgZ + 100) / 200));

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.6})`;
        ctx.lineWidth = 1.2 * p1.scale;
        ctx.stroke();
      });

      // Draw glowing vertices
      projected.forEach((p) => {
        const alpha = Math.max(0.2, (p.z + 100) / 200);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${alpha})`;
        ctx.fill();

        // Subtle glow halo
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.25})`;
        ctx.fill();
      });

      // Render internal orbiting data particles
      particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.z += pt.vz;

        // Bounce inside sphere
        const dist = Math.hypot(pt.x, pt.y, pt.z);
        if (dist > 75) {
          pt.vx *= -1;
          pt.vy *= -1;
          pt.vz *= -1;
        }

        const proj = project(pt, rotX * 1.5, rotY * 1.5, cx, cy);
        const alpha = Math.max(0.15, (proj.z + 80) / 160);

        ctx.beginPath();
        ctx.arc(proj.x, proj.y, pt.size * proj.scale, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${pt.hue}, 90%, 65%, ${alpha})`;
        ctx.fill();
      });

      // Ambient Core Glow
      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 110);
      grad.addColorStop(0, "rgba(59, 130, 246, 0.12)");
      grad.addColorStop(0.7, "rgba(20, 184, 166, 0.05)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 110, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center p-4 group select-none bg-slate-950/60 rounded-2xl border border-cyan-500/20 backdrop-blur-md shadow-2xl overflow-hidden"
      onMouseEnter={() => {
        setHovered(true);
        setStatusText("OLAP_STREAM_ACTIVE");
      }}
      onMouseLeave={() => {
        setHovered(false);
        setStatusText("ENGINE_ONLINE");
      }}
    >
      {/* Decorative Technical HUD Overlay */}
      <div className="w-full flex items-center justify-between text-[10px] font-mono text-cyan-400/80 tracking-widest px-2 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span>SYS.3D // {statusText}</span>
        </div>
        <span className="text-slate-500">LATENCY: &lt;4.2ms</span>
      </div>

      {/* Cyber Corner Brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60"></div>
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60"></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60"></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60"></div>

      {/* Interactive 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="cursor-crosshair w-full max-w-[360px] h-[300px] drop-shadow-[0_0_25px_rgba(56,189,248,0.25)]"
      />

      {/* Bottom Telemetry Bar */}
      <div className="w-full flex items-center justify-between text-[9px] font-mono text-slate-400 px-3 pt-2 border-t border-cyan-500/20 mt-1">
        <span className="text-cyan-300">NODE: DUCKDB_OLAP</span>
        <span className="text-indigo-300">ENTITIES: 1.8M+</span>
        <span className="text-emerald-400">FPS: 60</span>
      </div>
    </div>
  );
}
