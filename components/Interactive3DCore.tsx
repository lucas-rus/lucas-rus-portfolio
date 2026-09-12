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

interface AmbientStar3D {
  baseSize: number;
  color: string;
  twinklePhase: number;
  twinkleSpeed: number;
  driftAngle: number;
  orbitRadius: number;
  altitude: number;
}

type Matrix3x3 = [
  number, number, number,
  number, number, number,
  number, number, number
];

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

    // 1. Outer Icosahedron / Geodesic Cage (radius ~90)
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

    // 2. Inner Counter-Rotating Octahedron Core (radius ~46)
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

    // 3. Inner Secondary Star Lattice (Stellated crystalline heart)
    const starBase: Point3D[] = [
      { x: 26, y: 26, z: 0 },
      { x: -26, y: -26, z: 0 },
      { x: 26, y: -26, z: 0 },
      { x: -26, y: 26, z: 0 },
      { x: 0, y: 26, z: 26 },
      { x: 0, y: -26, z: -26 },
    ];
    const starEdges: [number, number][] = [
      [0, 1], [2, 3], [4, 5],
      [0, 4], [1, 5], [2, 4], [3, 5],
    ];

    // 4. Surrounding Ambient Celestial Starfield (3D Stardust Dots around the object)
    const ambientStars: AmbientStar3D[] = [];
    const starColors = ["#38bdf8", "#2dd4bf", "#818cf8", "#ffffff", "#c084fc", "#67e8f9"];
    const ambientCount = 96;
    for (let i = 0; i < ambientCount; i++) {
      const r = 95 + Math.random() * 95;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      ambientStars.push({
        baseSize: Math.random() < 0.22 ? Math.random() * 1.2 + 1.6 : Math.random() * 0.9 + 0.7,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: 1.8 + Math.random() * 2.2,
        driftAngle: theta,
        orbitRadius: r,
        altitude: phi,
      });
    }

    // 5. Traveling Photon Energy Packets along outer edges
    const edgePackets: EdgePacket[] = [];
    for (let i = 0; i < 7; i++) {
      edgePackets.push({
        edgeIndex: Math.floor(Math.random() * outerEdges.length),
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
        color: i % 2 === 0 ? "#38bdf8" : "#2dd4bf",
      });
    }

    // 6. Internal Constellation / Synaptic Plexus Particles
    const particles: Particle3D[] = [];
    for (let i = 0; i < 36; i++) {
      const theta = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      const rad = 15 + Math.random() * 50;
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

    // ================= ROTATION MATRIX ENGINE (NO GIMBAL LOCK) =================
    const multiplyMatrix = (a: Matrix3x3, b: Matrix3x3): Matrix3x3 => [
      a[0] * b[0] + a[1] * b[3] + a[2] * b[6],
      a[0] * b[1] + a[1] * b[4] + a[2] * b[7],
      a[0] * b[2] + a[1] * b[5] + a[2] * b[8],

      a[3] * b[0] + a[4] * b[3] + a[5] * b[6],
      a[3] * b[1] + a[4] * b[4] + a[5] * b[7],
      a[3] * b[2] + a[4] * b[5] + a[5] * b[8],

      a[6] * b[0] + a[7] * b[3] + a[8] * b[6],
      a[6] * b[1] + a[7] * b[4] + a[8] * b[7],
      a[6] * b[2] + a[7] * b[5] + a[8] * b[8],
    ];

    const rotatePitch = (m: Matrix3x3, angle: number): Matrix3x3 => {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const rot: Matrix3x3 = [
        1, 0, 0,
        0, c, -s,
        0, s, c
      ];
      return multiplyMatrix(rot, m);
    };

    const rotateYaw = (m: Matrix3x3, angle: number): Matrix3x3 => {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const rot: Matrix3x3 = [
        c, 0, -s,
        0, 1, 0,
        s, 0, c
      ];
      return multiplyMatrix(rot, m);
    };

    const orthonormalize = (m: Matrix3x3): Matrix3x3 => {
      let r0x = m[0], r0y = m[1], r0z = m[2];
      const l0 = Math.hypot(r0x, r0y, r0z) || 1;
      r0x /= l0; r0y /= l0; r0z /= l0;

      let r1x = m[3], r1y = m[4], r1z = m[5];
      const dot = r1x * r0x + r1y * r0y + r1z * r0z;
      r1x -= dot * r0x; r1y -= dot * r0y; r1z -= dot * r0z;
      const l1 = Math.hypot(r1x, r1y, r1z) || 1;
      r1x /= l1; r1y /= l1; r1z /= l1;

      const r2x = r0y * r1z - r0z * r1y;
      const r2y = r0z * r1x - r0x * r1z;
      const r2z = r0x * r1y - r0y * r1x;

      return [
        r0x, r0y, r0z,
        r1x, r1y, r1z,
        r2x, r2y, r2z
      ];
    };

    const transformPoint = (p: Point3D, m: Matrix3x3): Point3D => ({
      x: m[0] * p.x + m[1] * p.y + m[2] * p.z,
      y: m[3] * p.x + m[4] * p.y + m[5] * p.z,
      z: m[6] * p.x + m[7] * p.y + m[8] * p.z,
    });

    const project = (p: Point3D, cx: number, cy: number) => {
      const cameraDist = 280;
      const scale = cameraDist / Math.max(40, cameraDist + p.z);
      return {
        x: cx + p.x * scale,
        y: cy + p.y * scale,
        z: p.z,
        scale,
      };
    };

    let mat: Matrix3x3 = [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ];
    mat = rotateYaw(mat, 0.45);
    mat = rotatePitch(mat, 0.32);

    let velYaw = 0;
    let velPitch = 0;
    let prevX = 0;
    let prevY = 0;
    let isPointerDown = false;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      setIsDragging(true);
      prevX = e.clientX;
      prevY = e.clientY;
      velYaw = 0;
      velPitch = 0;
      canvas.setPointerCapture(e.pointerId);
      setStatusText("3D_MANUAL_ORBIT");
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      // Unconstrained 360 degree rotation in camera space
      const dYaw = dx * 0.0075;
      const dPitch = dy * 0.0075;

      mat = rotateYaw(mat, dYaw);
      mat = rotatePitch(mat, dPitch);

      velYaw = dYaw;
      velPitch = dPitch;

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

    let time = 0;

    // ================= ANIMATION RENDER LOOP =================
    const render = () => {
      time += 0.018;

      if (isPointerDown) {
        // Direct pointer control
      } else {
        // Smooth inertia
        mat = rotateYaw(mat, velYaw);
        mat = rotatePitch(mat, velPitch);
        velYaw *= 0.93;
        velPitch *= 0.93;

        // Gentle auto-rotation when at rest
        if (Math.hypot(velYaw, velPitch) < 0.0008) {
          mat = rotateYaw(mat, 0.0035);
          mat = rotatePitch(mat, 0.0012);
        }
      }

      mat = orthonormalize(mat);

      ctx.clearRect(0, 0, cssWidth, cssHeight);
      const cx = cssWidth / 2;
      const cy = cssHeight / 2;

      // 1. Ambient Background Core Glow
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

      // 2. Surrounding Ambient Celestial Starfield (3D Stardust Dots around the object)
      ambientStars.forEach((star) => {
        star.driftAngle += 0.0012;
        const worldX = star.orbitRadius * Math.sin(star.altitude) * Math.cos(star.driftAngle);
        const worldY = star.orbitRadius * Math.sin(star.altitude) * Math.sin(star.driftAngle);
        const worldZ = star.orbitRadius * Math.cos(star.altitude);

        const tp = transformPoint({ x: worldX, y: worldY, z: worldZ }, mat);
        const p = project(tp, cx, cy);

        const depthAlpha = Math.max(0.12, Math.min(0.95, (p.z + 200) / 400));
        const twinkle = 0.5 + 0.5 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const alpha = depthAlpha * twinkle;

        ctx.beginPath();
        const renderSize = star.baseSize * p.scale * (0.85 + 0.35 * twinkle);
        ctx.arc(p.x, p.y, Math.max(0.6, renderSize), 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;

        if (p.z > 10 && twinkle > 0.7) {
          ctx.shadowColor = star.color;
          ctx.shadowBlur = 5 * p.scale;
          ctx.fill();

          if (star.baseSize > 1.8 && twinkle > 0.88) {
            ctx.strokeStyle = star.color;
            ctx.lineWidth = 0.6;
            const arm = 3.5 * p.scale;
            ctx.beginPath();
            ctx.moveTo(p.x - arm, p.y);
            ctx.lineTo(p.x + arm, p.y);
            ctx.moveTo(p.x, p.y - arm);
            ctx.lineTo(p.x, p.y + arm);
            ctx.stroke();
          }
        } else {
          ctx.fill();
        }

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      });

      // 3. Inner Counter-Rotating Octahedron Core
      const innerSpinYaw = -time * 0.7;
      const innerSpinPitch = time * 0.45;
      const innerMat = rotatePitch(rotateYaw(mat, innerSpinYaw), innerSpinPitch);

      const projInner = innerBase.map((v) => {
        const breathe = 1 + Math.sin(time * 3 + v.x) * 0.04;
        const tp = transformPoint({ x: v.x * breathe, y: v.y * breathe, z: v.z * breathe }, innerMat);
        return project(tp, cx, cy);
      });

      // Draw Inner Edges (Luminous Indigo/Violet)
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

      // 4. Inner Secondary Star Lattice
      const starSpinYaw = time * 0.6;
      const starSpinPitch = -time * 0.4;
      const starMat = rotatePitch(rotateYaw(mat, starSpinYaw), starSpinPitch);

      const projStar = starBase.map((v) => {
        const tp = transformPoint(v, starMat);
        return project(tp, cx, cy);
      });
      starEdges.forEach(([i, j]) => {
        const p1 = projStar[i];
        const p2 = projStar[j];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = "rgba(45, 212, 191, 0.32)";
        ctx.lineWidth = 0.85 * p1.scale;
        ctx.stroke();
      });

      // 5. Internal Synaptic Plexus (Floating Particles with Dynamic Micro-Filaments)
      particles.forEach((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.z += pt.vz;

        const dist = Math.hypot(pt.x, pt.y, pt.z);
        if (dist > 60) {
          pt.vx *= -1;
          pt.vy *= -1;
          pt.vz *= -1;
        }
      });

      const projParticles = particles.map((pt) => {
        const tp = transformPoint(pt, mat);
        const p = project(tp, cx, cy);
        return {
          ...p,
          hue: pt.hue,
          size: pt.size,
        };
      });

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

      // 6. Outer Geodesic Crystalline Cage
      const outerPulse = 1 + Math.sin(time * 2.2) * 0.025;
      const projOuter = outerBase.map((v) => {
        const tp = transformPoint(
          { x: v.x * outerPulse, y: v.y * outerPulse, z: v.z * outerPulse },
          mat
        );
        return project(tp, cx, cy);
      });

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

      // 7. Traveling Edge Photon Energy Packets
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

      // 8. Outer Cage Nodes / Vertices (with Radiant Bloom)
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
