"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Interactive3DCore() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [statusText, setStatusText] = useState("CORE_FUSION_ONLINE");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // 3. Dynamic Multi-Point Cyber Lighting
    const ambientLight = new THREE.AmbientLight(0x0a101d, 2.0);
    scene.add(ambientLight);

    // Key Light: High-intensity cyan
    const keyLight = new THREE.PointLight(0x38bdf8, 4.2, 18);
    keyLight.position.set(3.5, 3.2, 4.5);
    scene.add(keyLight);

    // Fill Light: Soft deep indigo
    const fillLight = new THREE.PointLight(0x818cf8, 2.8, 16);
    fillLight.position.set(-3.5, -2.8, -3.5);
    scene.add(fillLight);

    // Interior Plasma Light
    const coreLight = new THREE.PointLight(0x06b6d4, 3.0, 7);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // Orbiting Satellite 1 Light (Cyan)
    const sat1Light = new THREE.PointLight(0x38bdf8, 3.8, 8);
    scene.add(sat1Light);

    // Orbiting Satellite 2 Light (Violet)
    const sat2Light = new THREE.PointLight(0xa855f7, 3.0, 7);
    scene.add(sat2Light);

    // 4. Root Interactive Group (Subject to Inertial Rotation)
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- Layer A: Central Singularity Core (Faceted Octahedron) ---
    const coreGeo = new THREE.OctahedronGeometry(0.72, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.85,
      roughness: 0.18,
      metalness: 0.85,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreMesh);

    // Core Wireframe Accent
    const coreWireGeo = new THREE.WireframeGeometry(coreGeo);
    const coreWireMat = new THREE.LineBasicMaterial({
      color: 0xbae6fd,
      transparent: true,
      opacity: 0.95,
    });
    const coreWireMesh = new THREE.LineSegments(coreWireGeo, coreWireMat);
    coreMesh.add(coreWireMesh);

    // --- Layer B: Prismatic Faceted Obsidian Crystal Shield (Icosahedron) ---
    const crystalGeo = new THREE.IcosahedronGeometry(1.3, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0x0a101d,
      emissive: 0x0284c7,
      emissiveIntensity: 0.18,
      roughness: 0.12,
      metalness: 0.9,
      transmission: 0.45,
      thickness: 0.75,
      transparent: true,
      opacity: 0.62,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    rootGroup.add(crystalMesh);

    // Laser-cut sharp glowing edges
    const crystalEdgesGeo = new THREE.EdgesGeometry(crystalGeo);
    const crystalEdgesMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.88,
    });
    const crystalEdges = new THREE.LineSegments(crystalEdgesGeo, crystalEdgesMat);
    crystalMesh.add(crystalEdges);

    // --- Layer C: Titanium Gyroscopic Gimbal Rings ---
    // Ring 1: Equatorial (Horizontal Y-plane)
    const ring1Geo = new THREE.TorusGeometry(1.88, 0.026, 16, 96);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      emissive: 0x0f172a,
      roughness: 0.22,
      metalness: 0.95,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2;
    rootGroup.add(ring1);

    // Ring 2: Polar (Inclined at 55 degrees)
    const ring2Geo = new THREE.TorusGeometry(2.14, 0.022, 16, 96);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      emissive: 0x4338ca,
      emissiveIntensity: 0.35,
      roughness: 0.28,
      metalness: 0.9,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    rootGroup.add(ring2);

    // Ring 3: Precessing Outer Ring (Inclined at -40 degrees)
    const ring3Geo = new THREE.TorusGeometry(2.38, 0.018, 16, 96);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0x0d9488,
      emissive: 0x14b8a6,
      emissiveIntensity: 0.4,
      roughness: 0.24,
      metalness: 0.9,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = -Math.PI / 4;
    ring3.rotation.z = Math.PI / 5;
    rootGroup.add(ring3);

    // --- Layer D: Quantum Satellite Beacons ---
    const sat1Geo = new THREE.SphereGeometry(0.085, 16, 16);
    const sat1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const sat1Mesh = new THREE.Mesh(sat1Geo, sat1Mat);
    scene.add(sat1Mesh);

    const sat2Geo = new THREE.SphereGeometry(0.065, 16, 16);
    const sat2Mat = new THREE.MeshBasicMaterial({ color: 0xc084fc });
    const sat2Mesh = new THREE.Mesh(sat2Geo, sat2Mat);
    scene.add(sat2Mesh);

    // --- Layer E: Volumetric 3D Data Dust Field ---
    const particleCount = 110;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const colCyan = new THREE.Color(0x38bdf8);
    const colIndigo = new THREE.Color(0x818cf8);
    const colTeal = new THREE.Color(0x2dd4bf);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.45 + Math.random() * 1.9;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePos[i * 3 + 2] = radius * Math.cos(phi);

      const chosenCol = i % 3 === 0 ? colCyan : i % 3 === 1 ? colIndigo : colTeal;
      particleColors[i * 3] = chosenCol.r;
      particleColors[i * 3 + 1] = chosenCol.g;
      particleColors[i * 3 + 2] = chosenCol.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    rootGroup.add(particles);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // --- Interaction Physics ---
    let isPointerDown = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let velX = 0;
    let velY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      setIsDragging(true);
      setStatusText("MANUAL_CONTROL_ACTIVE");
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      velX = 0;
      velY = 0;
      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      targetTiltX = normY * 0.22;
      targetTiltY = normX * 0.22;

      if (!isPointerDown) return;

      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;

      velX = dy * 0.0055;
      velY = dx * 0.0055;

      rootGroup.rotation.x += velX;
      rootGroup.rotation.y += velY;
    };

    const onPointerUp = (e: PointerEvent) => {
      isPointerDown = false;
      setIsDragging(false);
      setStatusText("CORE_FUSION_ONLINE");
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    // --- Render Loop ---
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Inertia & Parallax
      if (!isPointerDown) {
        rootGroup.rotation.x += velX;
        rootGroup.rotation.y += velY;
        velX *= 0.935;
        velY *= 0.935;

        // Idle gyroscopic rotation
        rootGroup.rotation.y += 0.004;
        rootGroup.rotation.x += 0.0018;

        // Smooth cursor hover parallax
        camera.position.x += (targetTiltY * 0.5 - camera.position.x) * 0.05;
        camera.position.y += (-targetTiltX * 0.5 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
      }

      // 1. Core breathing pulse & counter-rotation
      const corePulse = 1.0 + Math.sin(elapsed * 2.6) * 0.08;
      coreMesh.scale.set(corePulse, corePulse, corePulse);
      coreMesh.rotation.y -= 0.012;
      coreMesh.rotation.x += 0.007;

      // 2. Crystal shield gentle rotation
      crystalMesh.rotation.y += 0.005;
      crystalMesh.rotation.z -= 0.003;

      // 3. Independent gimbal ring motions
      ring1.rotation.z += 0.007;
      ring2.rotation.z -= 0.01;
      ring3.rotation.y += 0.008;

      // 4. Satellite 1 Orbit (Cyan beacon + real-time point light)
      const sat1Angle = elapsed * 1.35;
      const sat1Radius = 2.15;
      const sat1X = Math.cos(sat1Angle) * sat1Radius;
      const sat1Y = Math.sin(sat1Angle * 0.7) * 0.6;
      const sat1Z = Math.sin(sat1Angle) * sat1Radius;
      sat1Mesh.position.set(sat1X, sat1Y, sat1Z);
      sat1Light.position.set(sat1X, sat1Y, sat1Z);

      // 5. Satellite 2 Orbit (Violet beacon + real-time point light)
      const sat2Angle = -elapsed * 1.7 + 2.1;
      const sat2Radius = 2.42;
      const sat2X = Math.sin(sat2Angle * 0.6) * 0.75;
      const sat2Y = Math.cos(sat2Angle) * sat2Radius;
      const sat2Z = Math.sin(sat2Angle) * sat2Radius;
      sat2Mesh.position.set(sat2X, sat2Y, sat2Z);
      sat2Light.position.set(sat2X, sat2Y, sat2Z);

      // 6. Data dust slow precession
      particles.rotation.y += 0.0012;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);

      // Clean GPU memory
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      coreWireGeo.dispose();
      coreWireMat.dispose();
      crystalGeo.dispose();
      crystalMat.dispose();
      crystalEdgesGeo.dispose();
      crystalEdgesMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      sat1Geo.dispose();
      sat1Mat.dispose();
      sat2Geo.dispose();
      sat2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center p-3 sm:p-4 group select-none bg-slate-950/70 rounded-2xl border border-cyan-500/20 backdrop-blur-md shadow-2xl overflow-hidden w-full"
    >
      {/* Decorative Technical HUD Overlay */}
      <div className="w-full flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-cyan-400/85 tracking-widest px-1.5 mb-1">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>SYS.3D // {statusText}</span>
        </div>
        <span className="text-slate-400 text-[8px] sm:text-[9px] bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
          DRAG TO INSPECT
        </span>
      </div>

      {/* Cyber Corner Brackets */}
      <div className="absolute top-2 left-2 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none" />
      <div className="absolute top-2 right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-2 border-l-2 border-cyan-400/60 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none" />

      {/* True WebGL 3D Canvas with High-DPI Support */}
      <canvas
        ref={canvasRef}
        className={`w-full h-[210px] sm:h-[260px] drop-shadow-[0_0_30px_rgba(56,189,248,0.22)] touch-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      />

      {/* Telemetry Status Bar */}
      <div className="w-full flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-slate-400 px-1.5 sm:px-2 pt-2 border-t border-cyan-500/20 mt-1 gap-1">
        <span className="text-cyan-300 truncate">DUCKDB_OLAP</span>
        <span className="text-indigo-300 truncate">1.8M+ ENTITIES</span>
        <span className="text-emerald-400 shrink-0">LATENCY: &lt;4.8ms</span>
      </div>
    </div>
  );
}
