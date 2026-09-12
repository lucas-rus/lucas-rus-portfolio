"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Interactive3DCore() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [statusText, setStatusText] = useState("QUANTUM_CORE_ONLINE");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 6.2);

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

    // 3. Dynamic Studio Cyber Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x0a101d, 1.8);
    scene.add(ambientLight);

    // Key Light: High-intensity cyan
    const keyLight = new THREE.PointLight(0x38bdf8, 4.5, 18);
    keyLight.position.set(3.8, 3.2, 4.5);
    scene.add(keyLight);

    // Fill Light: Deep indigo/violet
    const fillLight = new THREE.PointLight(0x818cf8, 3.2, 16);
    fillLight.position.set(-3.8, -2.8, -3.5);
    scene.add(fillLight);

    // Top Rim Light: Crisp teal
    const rimLight = new THREE.PointLight(0x2dd4bf, 2.5, 12);
    rimLight.position.set(0, 4.5, -2);
    scene.add(rimLight);

    // Interior Pulsing Singularity Light
    const coreLight = new THREE.PointLight(0x38bdf8, 4.0, 7);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 4. Root Interactive Group (Oriented via Quaternions to prevent Gimbal Lock)
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- Outer Crystal Assembly ---
    const outerGroup = new THREE.Group();
    rootGroup.add(outerGroup);

    // Outer Geodesic Icosahedron Shield
    const outerRadius = 1.6;
    const outerGeo = new THREE.IcosahedronGeometry(outerRadius, 0);
    const outerMat = new THREE.MeshPhysicalMaterial({
      color: 0x081326,
      emissive: 0x0369a1,
      emissiveIntensity: 0.22,
      roughness: 0.12,
      metalness: 0.88,
      transmission: 0.38,
      thickness: 0.8,
      transparent: true,
      opacity: 0.58,
      reflectivity: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    outerGroup.add(outerMesh);

    // Laser-cut glowing edges
    const outerEdgesGeo = new THREE.EdgesGeometry(outerGeo);
    const outerEdgesMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.85,
    });
    const outerEdges = new THREE.LineSegments(outerEdgesGeo, outerEdgesMat);
    outerGroup.add(outerEdges);

    // Vertex Nodes: Radiant diamond pips at every icosahedron vertex
    const vertexPositions = outerGeo.getAttribute("position");
    const vertexPipsGroup = new THREE.Group();
    const pipGeo = new THREE.OctahedronGeometry(0.055, 0);
    const pipMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.2,
      roughness: 0.1,
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

    // Edge Photons: Energy packets traveling along outer edges
    const edgePoints: [THREE.Vector3, THREE.Vector3][] = [];
    const edgeAttr = outerEdgesGeo.getAttribute("position");
    for (let i = 0; i < edgeAttr.count; i += 2) {
      edgePoints.push([
        new THREE.Vector3(edgeAttr.getX(i), edgeAttr.getY(i), edgeAttr.getZ(i)),
        new THREE.Vector3(edgeAttr.getX(i + 1), edgeAttr.getY(i + 1), edgeAttr.getZ(i + 1)),
      ]);
    }

    const packetCount = 8;
    const packetGeo = new THREE.SphereGeometry(0.045, 12, 12);
    const packetMatCyan = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const packetMatTeal = new THREE.MeshBasicMaterial({ color: 0x2dd4bf });

    interface PacketData {
      mesh: THREE.Mesh;
      edgeIndex: number;
      progress: number;
      speed: number;
    }

    const packets: PacketData[] = [];
    for (let i = 0; i < packetCount; i++) {
      const pMesh = new THREE.Mesh(packetGeo, i % 2 === 0 ? packetMatCyan : packetMatTeal);
      const edgeIdx = Math.floor(Math.random() * edgePoints.length);
      const pData: PacketData = {
        mesh: pMesh,
        edgeIndex: edgeIdx,
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.01,
      };
      outerGroup.add(pMesh);
      packets.push(pData);
    }

    // --- Inner Counter-Rotating Core (Nested Quantum Singularity) ---
    const innerGroup = new THREE.Group();
    rootGroup.add(innerGroup);

    // Inner Primary Octahedron
    const innerGeo = new THREE.OctahedronGeometry(0.78, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.85,
      roughness: 0.15,
      metalness: 0.85,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerGroup.add(innerMesh);

    // Inner Inverted Secondary Octahedron (Forms a Stellated Merkaba Star)
    const starGeo = new THREE.OctahedronGeometry(0.78, 0);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0x0d9488,
      emissive: 0x2dd4bf,
      emissiveIntensity: 0.75,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
    });
    const starMesh = new THREE.Mesh(starGeo, starMat);
    starMesh.rotation.y = Math.PI / 4;
    starMesh.rotation.z = Math.PI / 4;
    innerGroup.add(starMesh);

    // Core Wireframe Filaments
    const innerWireGeo = new THREE.WireframeGeometry(innerGeo);
    const innerWireMat = new THREE.LineBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.95,
    });
    const innerWireMesh = new THREE.LineSegments(innerWireGeo, innerWireMat);
    innerGroup.add(innerWireMesh);

    // Internal Synaptic Connectors (Beams connecting center to outer cage)
    const beamPositions = new Float32Array(uniqueVertices.length * 6);
    for (let i = 0; i < uniqueVertices.length; i++) {
      const v = uniqueVertices[i];
      beamPositions[i * 6] = 0;
      beamPositions[i * 6 + 1] = 0;
      beamPositions[i * 6 + 2] = 0;
      beamPositions[i * 6 + 3] = v.x;
      beamPositions[i * 6 + 4] = v.y;
      beamPositions[i * 6 + 5] = v.z;
    }
    const beamGeo = new THREE.BufferGeometry();
    beamGeo.setAttribute("position", new THREE.BufferAttribute(beamPositions, 3));
    const beamMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.2,
    });
    const beamLines = new THREE.LineSegments(beamGeo, beamMat);
    rootGroup.add(beamLines);

    // Ambient Particulate Field
    const particleCount = 85;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 1.8 + Math.random() * 1.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePos[i * 3 + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.04,
      transparent: true,
      opacity: 0.65,
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

    // --- True Quaternion Screen-Space Rotation & Inertia (Zero Gimbal Lock) ---
    let isPointerDown = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let velX = 0; // angular delta around world X
    let velY = 0; // angular delta around world Y
    let targetTiltX = 0;
    let targetTiltY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      setIsDragging(true);
      setStatusText("CORE_CALIBRATION_ACTIVE");
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

      targetTiltX = normY * 0.2;
      targetTiltY = normX * 0.2;

      if (!isPointerDown) return;

      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;

      // Sensitivity: positive dx turns right around world Y, positive dy tilts down around world X
      const speed = 0.006;
      velY = dx * speed;
      velX = dy * speed;

      // Screen-space World Rotation: premultiply with world axes
      const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), velY);
      const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), velX);

      rootGroup.quaternion.premultiply(qY);
      rootGroup.quaternion.premultiply(qX);
    };

    const onPointerUp = (e: PointerEvent) => {
      isPointerDown = false;
      setIsDragging(false);
      setStatusText("QUANTUM_CORE_ONLINE");
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

      // World-space Inertia & Idle Motion
      if (!isPointerDown) {
        if (Math.abs(velX) > 0.0001 || Math.abs(velY) > 0.0001) {
          const qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), velY);
          const qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), velX);
          rootGroup.quaternion.premultiply(qY);
          rootGroup.quaternion.premultiply(qX);

          velX *= 0.94;
          velY *= 0.94;
        } else {
          // Smooth idle rotation around world Y
          const idleQ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.0035);
          rootGroup.quaternion.premultiply(idleQ);
        }

        // Camera hover parallax
        camera.position.x += (targetTiltY * 0.45 - camera.position.x) * 0.05;
        camera.position.y += (-targetTiltX * 0.45 - camera.position.y) * 0.05;
        camera.lookAt(0, 0, 0);
      }

      // 1. Outer Crystal subtle breathing pulse
      const outerPulse = 1.0 + Math.sin(elapsed * 2.0) * 0.02;
      outerGroup.scale.set(outerPulse, outerPulse, outerPulse);

      // 2. Inner Singularity Core counter-rotation and deep breathing
      const corePulse = 1.0 + Math.sin(elapsed * 3.2) * 0.09;
      innerGroup.scale.set(corePulse, corePulse, corePulse);
      innerGroup.rotation.y -= 0.015;
      innerGroup.rotation.x += 0.009;
      starMesh.rotation.z -= 0.012;

      // Pulse interior light with the core
      coreLight.intensity = 3.5 + Math.sin(elapsed * 3.2) * 1.5;

      // 3. Photon packets traveling along outer edges
      packets.forEach((pkt) => {
        pkt.progress += pkt.speed;
        if (pkt.progress >= 1.0) {
          pkt.progress = 0;
          pkt.edgeIndex = Math.floor(Math.random() * edgePoints.length);
        }
        const [p1, p2] = edgePoints[pkt.edgeIndex];
        pkt.mesh.position.lerpVectors(p1, p2, pkt.progress);
      });

      // 4. Subtle beam line opacity oscillation
      beamMat.opacity = 0.18 + Math.sin(elapsed * 2.5) * 0.08;

      // 5. Particulate drift
      particles.rotation.y += 0.001;

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
      packetGeo.dispose();
      packetMatCyan.dispose();
      packetMatTeal.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      innerWireGeo.dispose();
      innerWireMat.dispose();
      beamGeo.dispose();
      beamMat.dispose();
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
