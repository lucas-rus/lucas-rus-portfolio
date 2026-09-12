"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Interactive3DCore() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [statusText, setStatusText] = useState("CORE_RESONANCE_ACTIVE");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Scene & Perspective Camera with Artistic Depth
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 0, 6.4);

    // 2. High-Performance WebGL Renderer with Filmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    // 3. Cinematic Cyber-Prism Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x060f1e, 2.2);
    scene.add(ambientLight);

    // Key Light: Radiant electric cyan
    const keyLight = new THREE.PointLight(0x38bdf8, 5.0, 20);
    keyLight.position.set(3.8, 3.5, 4.8);
    scene.add(keyLight);

    // Fill Light: Celestial violet/indigo
    const fillLight = new THREE.PointLight(0x818cf8, 3.8, 18);
    fillLight.position.set(-3.8, -3.0, -3.8);
    scene.add(fillLight);

    // Rim Light: Shimmering aqua teal
    const rimLight = new THREE.PointLight(0x2dd4bf, 3.2, 14);
    rimLight.position.set(0, 4.8, -2.5);
    scene.add(rimLight);

    // Interior Singularity Pulse Light
    const coreLight = new THREE.PointLight(0x06b6d4, 4.5, 8);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 4. Root Interactive Group (Zero Gimbal Lock via Quaternions)
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- Outer Sculptural Crystal Assembly ---
    const outerGroup = new THREE.Group();
    rootGroup.add(outerGroup);

    // A. Faceted Obsidian-Cyan Crystal Shell (Icosahedron)
    const outerRadius = 1.58;
    const outerGeo = new THREE.IcosahedronGeometry(outerRadius, 0);
    const outerMat = new THREE.MeshPhysicalMaterial({
      color: 0x051329,
      emissive: 0x0284c7,
      emissiveIntensity: 0.18,
      roughness: 0.08,
      metalness: 0.25,
      transmission: 0.42,
      thickness: 0.9,
      transparent: true,
      opacity: 0.62,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    outerGroup.add(outerMesh);

    // B. Laser-Etched Luminous Edges (Fine Hairline Filament)
    const outerEdgesGeo = new THREE.EdgesGeometry(outerGeo);
    const outerEdgesMat = new THREE.LineBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.85,
    });
    const outerEdges = new THREE.LineSegments(outerEdgesGeo, outerEdgesMat);
    outerGroup.add(outerEdges);

    // C. Crystalline Vertex Pips (Miniature Octahedra catching highlights)
    const vertexPositions = outerGeo.getAttribute("position");
    const vertexPipsGroup = new THREE.Group();
    const pipGeo = new THREE.OctahedronGeometry(0.048, 0);
    const pipMat = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.4,
      roughness: 0.08,
      metalness: 0.9,
    });

    const uniqueVertices: THREE.Vector3[] = [];
    for (let i = 0; i < vertexPositions.count; i++) {
      const v = new THREE.Vector3(
        vertexPositions.getX(i),
        vertexPositions.getY(i),
        vertexPositions.getZ(i)
      );
      if (!uniqueVertices.some((uv) => uv.distanceTo(v) < 0.01)) {
        uniqueVertices.push(v);
        const pipMesh = new THREE.Mesh(pipGeo, pipMat);
        pipMesh.position.copy(v);
        vertexPipsGroup.add(pipMesh);
      }
    }
    outerGroup.add(vertexPipsGroup);

    // --- Inner Celestial Heart (Sculptural Dual Core) ---
    const innerGroup = new THREE.Group();
    rootGroup.add(innerGroup);

    // A. The Celestial Dodecahedron (Sacred Dual of the Icosahedron)
    const dodecaRadius = 0.82;
    const dodecaGeo = new THREE.DodecahedronGeometry(dodecaRadius, 0);
    const dodecaMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.65,
      roughness: 0.12,
      metalness: 0.8,
      transmission: 0.25,
      transparent: true,
      opacity: 0.7,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const dodecaMesh = new THREE.Mesh(dodecaGeo, dodecaMat);
    innerGroup.add(dodecaMesh);

    // Dodecahedron fine wireframe lattice
    const dodecaEdgesGeo = new THREE.EdgesGeometry(dodecaGeo);
    const dodecaEdgesMat = new THREE.LineBasicMaterial({
      color: 0xa5f3fc,
      transparent: true,
      opacity: 0.9,
    });
    const dodecaEdges = new THREE.LineSegments(dodecaEdgesGeo, dodecaEdgesMat);
    innerGroup.add(dodecaEdges);

    // B. The Singularity Core (Incandescent Star Octahedron suspended inside)
    const starGeo = new THREE.OctahedronGeometry(0.38, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xf0fdf4,
      emissive: 0x2dd4bf,
      emissiveIntensity: 1.6,
      roughness: 0.05,
      metalness: 0.95,
    });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    innerGroup.add(starMesh);

    // Star wireframe halo
    const starWireGeo = new THREE.WireframeGeometry(starGeo);
    const starWireMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });
    const starWire = new THREE.LineSegments(starWireGeo, starWireMat);
    starMesh.add(starWire);

    // --- Organic Atmospheric Nebula Field (Luminous Stardust) ---
    const particleCount = 95;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const cCyan = new THREE.Color(0x38bdf8);
    const cTeal = new THREE.Color(0x2dd4bf);
    const cIndigo = new THREE.Color(0x818cf8);

    for (let i = 0; i < particleCount; i++) {
      const r = 1.65 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePos[i * 3 + 2] = r * Math.cos(phi);

      const col = i % 3 === 0 ? cCyan : i % 3 === 1 ? cTeal : cIndigo;
      particleColors[i * 3] = col.r;
      particleColors[i * 3 + 1] = col.g;
      particleColors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
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

    // --- True Quaternion Screen-Space Interaction (Zero Gimbal Lock) ---
    let isPointerDown = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let velX = 0; // delta around screen-horizontal axis (world X)
    let velY = 0; // delta around screen-vertical axis (world Y)
    let targetTiltX = 0;
    let targetTiltY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      setIsDragging(true);
      setStatusText("ART_CALIBRATION_ACTIVE");
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

      targetTiltX = normY * 0.18;
      targetTiltY = normX * 0.18;

      if (!isPointerDown) return;

      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;

      const speed = 0.0055;
      velY = dx * speed;
      velX = dy * speed;

      // Screen-space world quaternion rotation
      const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), velY);
      const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), velX);

      rootGroup.quaternion.premultiply(qY);
      rootGroup.quaternion.premultiply(qX);
    };

    const onPointerUp = (e: PointerEvent) => {
      isPointerDown = false;
      setIsDragging(false);
      setStatusText("CORE_RESONANCE_ACTIVE");
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

      // World-space Inertia & Gentle Drift
      if (!isPointerDown) {
        if (Math.abs(velX) > 0.00008 || Math.abs(velY) > 0.00008) {
          const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), velY);
          const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), velX);
          rootGroup.quaternion.premultiply(qY);
          rootGroup.quaternion.premultiply(qX);

          velX *= 0.945;
          velY *= 0.945;
        } else {
          // Slow, hypnotic idle rotation around world Y
          const idleQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.003);
          rootGroup.quaternion.premultiply(idleQ);
        }

        // Tactile camera hover parallax
        camera.position.x += (targetTiltY * 0.4 - camera.position.x) * 0.05;
        camera.position.y += (-targetTiltX * 0.4 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
      }

      // 1. Outer Crystal: subtle breathing expansion
      const outerScale = 1.0 + Math.sin(elapsed * 1.8) * 0.018;
      outerGroup.scale.set(outerScale, outerScale, outerScale);

      // 2. Inner Dodecahedron: smooth counter-rotation and harmonic breath
      const innerScale = 1.0 + Math.sin(elapsed * 2.6) * 0.06;
      innerGroup.scale.set(innerScale, innerScale, innerScale);
      dodecaMesh.rotation.y -= 0.011;
      dodecaMesh.rotation.x += 0.006;
      dodecaEdges.rotation.y = dodecaMesh.rotation.y;
      dodecaEdges.rotation.x = dodecaMesh.rotation.x;

      // 3. Singularity Star: off-axis spin & luminous heartbeat
      starMesh.rotation.z += 0.018;
      starMesh.rotation.y -= 0.014;
      const starPulse = 1.0 + Math.sin(elapsed * 4.0) * 0.12;
      starMesh.scale.set(starPulse, starPulse, starPulse);

      // 4. Center Light: breathing luminescence
      coreLight.intensity = 4.2 + Math.sin(elapsed * 3.0) * 1.8;

      // 5. Ambient Stardust: slow celestial drift
      particles.rotation.y += 0.0009;
      particles.rotation.z += 0.0004;

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

      // WebGL disposal
      renderer.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      outerEdgesGeo.dispose();
      outerEdgesMat.dispose();
      pipGeo.dispose();
      pipMat.dispose();
      dodecaGeo.dispose();
      dodecaMat.dispose();
      dodecaEdgesGeo.dispose();
      dodecaEdgesMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      starWireGeo.dispose();
      starWireMat.dispose();
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
