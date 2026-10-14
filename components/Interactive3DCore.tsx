"use client";

import { useEffect, useRef, useState } from "react";

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

// Screen-space quaternion rotation (identical mechanics to the original 3D model:
// zero gimbal lock, unrestricted 360-degree drag rotation on all axes)
class Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;

  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  setFromAxisAngle(ax: number, ay: number, az: number, angle: number): this {
    const half = angle / 2;
    const s = Math.sin(half);
    this.x = ax * s;
    this.y = ay * s;
    this.z = az * s;
    this.w = Math.cos(half);
    return this;
  }

  premultiply(q: Quaternion): this {
    const qax = q.x,
      qay = q.y,
      qaz = q.z,
      qaw = q.w;
    const qbx = this.x,
      qby = this.y,
      qbz = this.z,
      qbw = this.w;

    this.x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    this.y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this.z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    this.w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
    return this;
  }

  normalize(): this {
    let l = Math.hypot(this.x, this.y, this.z, this.w);
    if (l === 0) {
      this.x = 0;
      this.y = 0;
      this.z = 0;
      this.w = 1;
    } else {
      l = 1 / l;
      this.x *= l;
      this.y *= l;
      this.z *= l;
      this.w *= l;
    }
    return this;
  }

  toMat3(): Float32Array {
    const x = this.x,
      y = this.y,
      z = this.z,
      w = this.w;
    const x2 = x + x,
      y2 = y + y,
      z2 = z + z;
    const xx = x * x2,
      xy = x * y2,
      xz = x * z2;
    const yy = y * y2,
      yz = y * z2,
      zz = z * z2;
    const wx = w * x2,
      wy = w * y2,
      wz = w * z2;

    return new Float32Array([
      1 - (yy + zz),
      xy + wz,
      xz - wy,
      xy - wz,
      1 - (xx + zz),
      yz + wx,
      xz + wy,
      yz - wx,
      1 - (xx + yy),
    ]);
  }

  rotateVector(p: Vec3): Vec3 {
    const qx = this.x,
      qy = this.y,
      qz = this.z,
      qw = this.w;
    const vx = p.x,
      vy = p.y,
      vz = p.z;

    const tx = 2 * (qy * vz - qz * vy);
    const ty = 2 * (qz * vx - qx * vz);
    const tz = 2 * (qx * vy - qy * vx);

    return {
      x: vx + qw * tx + (qy * tz - qz * ty),
      y: vy + qw * ty + (qz * tx - qx * tz),
      z: vz + qw * tz + (qx * ty - qy * tx),
    };
  }
}

interface AmbientStar {
  baseSize: number;
  r: number;
  g: number;
  b: number;
  twinklePhase: number;
  twinkleSpeed: number;
  driftAngle: number;
  orbitRadius: number;
  altitude: number;
  flare: boolean;
}

export default function Interactive3DCore() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const glCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fgCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [statusText, setStatusText] = useState("ASTRA_INTERCEPTOR_ACTIVE");

  useEffect(() => {
    const stage = stageRef.current;
    const bgCanvas = bgCanvasRef.current;
    const glCanvas = glCanvasRef.current;
    const fgCanvas = fgCanvasRef.current;
    if (!stage || !bgCanvas || !glCanvas || !fgCanvas) return;

    const ctx = bgCanvas.getContext("2d");
    const fgCtx = fgCanvas.getContext("2d");
    const gl =
      glCanvas.getContext("webgl2", {
        alpha: true,
        antialias: true,
        depth: true,
        powerPreference: "high-performance",
        premultipliedAlpha: false,
      }) ||
      glCanvas.getContext("webgl", {
        alpha: true,
        antialias: true,
        depth: true,
        powerPreference: "high-performance",
        premultipliedAlpha: false,
      });

    if (!ctx || !fgCtx || !gl) return;

    let animationFrameId = 0;
    let cssWidth = 360;
    let cssHeight = 320;

    // Full-bleed edge-to-edge canvas sizing with 3x supersampling for razor-sharp output
    const resize = () => {
      const rect = stage.getBoundingClientRect();
      cssWidth = Math.max(260, Math.floor(rect.width));
      cssHeight = Math.max(260, Math.floor(rect.height));

      const nativeDpr = window.devicePixelRatio || 1;
      const superDpr = Math.min(3.0, Math.max(2.25, nativeDpr * 1.5));

      const pw = Math.floor(cssWidth * superDpr);
      const ph = Math.floor(cssHeight * superDpr);

      bgCanvas.width = pw;
      bgCanvas.height = ph;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(superDpr, superDpr);

      fgCanvas.width = pw;
      fgCanvas.height = ph;
      fgCtx.setTransform(1, 0, 0, 1, 0, 0);
      fgCtx.scale(superDpr, superDpr);

      glCanvas.width = pw;
      glCanvas.height = ph;
      gl.viewport(0, 0, pw, ph);
    };

    resize();
    window.addEventListener("resize", resize);

    // =========================================================================
    // RAZOR-SHARP PER-PIXEL PROCEDURAL FRAGMENT SHADER
    // Includes Part 7: Cute R2-D2 Astromech Droid seated behind the cockpit!
    // =========================================================================
    const vsSource = `
      attribute vec3 aPos;
      attribute vec3 aNormal;
      attribute vec2 aUV;
      attribute float aPartId;

      uniform mat3 uRot;
      uniform vec2 uAspect;
      uniform float uCamDist;
      uniform vec2 uOffset;
      uniform float uDroidYaw;

      varying vec3 vViewNormal;
      varying vec3 vLocalNormal;
      varying vec2 vUV;
      varying float vPartId;

      void main() {
        vec3 pos = aPos;
        vec3 norm = aNormal;

        // Cute astromech droid head gently swivels left and right around its socket center (0, y, -7.0)
        if (aPartId > 6.5 && aPartId < 8.5) {
          float c = cos(uDroidYaw);
          float s = sin(uDroidYaw);
          float dx = pos.x;
          float dz = pos.z - (-7.0);
          pos.x = c * dx + s * dz;
          pos.z = -7.0 - s * dx + c * dz;

          float nx = norm.x;
          float nz = norm.z;
          norm.x = c * nx + s * nz;
          norm.z = -s * nx + c * nz;
        }

        vec3 worldPos = uRot * pos;
        worldPos.xy += uOffset;
        vLocalNormal = normalize(norm);
        vViewNormal = normalize(uRot * norm);
        vUV = aUV;
        vPartId = aPartId;

        float zDist = max(60.0, uCamDist - worldPos.z);
        float persp = uCamDist / zDist;

        vec2 clipXY = (worldPos.xy * persp) / uAspect;
        float ndcZ = -worldPos.z / 220.0;

        gl_Position = vec4(clipXY, ndcZ, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;

      varying vec3 vViewNormal;
      varying vec3 vLocalNormal;
      varying vec2 vUV;
      varying float vPartId;

      const float PI = 3.14159265359;

      float crispBand(float val, float low, float high, float feather) {
        return smoothstep(low - feather, low + feather, val) *
               (1.0 - smoothstep(high - feather, high + feather, val));
      }

      void main() {
        float u = vUV.x;
        float v = vUV.y;
        float theta = v * PI * 2.0;
        float cosT = cos(theta);
        float sinT = sin(theta);
        float absCos = abs(cosT);
        float absSin = abs(sinT);

        // Palette
        vec3 colTitanium = vec3(0.76, 0.85, 0.95);
        vec3 colSlate    = vec3(0.35, 0.47, 0.64);
        vec3 colDark     = vec3(0.19, 0.27, 0.39);
        vec3 colCanopy   = vec3(0.07, 0.25, 0.48);
        vec3 colCyan     = vec3(0.20, 0.84, 0.99);
        vec3 colTeal     = vec3(0.16, 0.88, 0.78);
        vec3 colCore     = vec3(0.90, 0.98, 1.00);
        vec3 colPlumeOut = vec3(0.22, 0.60, 0.98);
        vec3 colR2White  = vec3(0.92, 0.96, 1.00);
        vec3 colR2Blue   = vec3(0.14, 0.44, 0.88);
        vec3 colR2Eye    = vec3(0.06, 0.10, 0.18);
        vec3 colR2Red    = vec3(0.98, 0.28, 0.36);

        vec3 baseCol = colTitanium;
        float emissive = 0.0;
        float alpha = 1.0;
        float isGlass = 0.0;

        // PART 0: Main Streamlined Fuselage + Integrated Sapphire Canopy
        if (vPartId < 0.5) {
          float cheekMask = crispBand(absSin, 0.30, 0.62, 0.015) *
                            smoothstep(0.07, 0.09, u) *
                            (1.0 - smoothstep(0.86, 0.88, u));
          baseCol = mix(colTitanium, colSlate, cheekMask * 0.88);

          // Razor-sharp sapphire teardrop canopy glass (upper forward dome)
          float canopyU = (u - 0.30) / 0.155;
          float canopyX = cosT / 0.50;
          float canopyDist = canopyU * canopyU + canopyX * canopyX;
          if (sinT > 0.35) {
            float glassMask = 1.0 - smoothstep(0.94, 1.00, canopyDist);
            float rimMask   = crispBand(canopyDist, 0.88, 1.04, 0.025);
            baseCol = mix(baseCol, colCanopy, glassMask);
            baseCol = mix(baseCol, colCyan, rimMask * 0.95);
            isGlass = glassMask * (1.0 - rimMask);
            emissive = max(emissive, rimMask * 0.85);
          }

          // Crisp dorsal & ventral teal reactor conduit line
          float spineMask = crispBand(u, 0.58, 0.91, 0.01) *
                            smoothstep(0.94, 0.96, absSin) *
                            smoothstep(0.11, 0.08, absCos);
          baseCol = mix(baseCol, colTeal, spineMask);
          emissive = max(emissive, spineMask);

          // Razor-sharp cyan chine stripe along the horizontal equator
          float chineMask = smoothstep(0.11, 0.08, absSin) *
                            crispBand(u, 0.03, 0.93, 0.01);
          baseCol = mix(baseCol, colCyan, chineMask);
          emissive = max(emissive, chineMask);

          // Nose sensor tip
          float noseMask = 1.0 - smoothstep(0.022, 0.030, u);
          baseCol = mix(baseCol, colCyan, noseMask);
          emissive = max(emissive, noseMask * 0.9);
        }
        // PART 1: Swept Main Airfoil Wings
        else if (vPartId < 1.5) {
          float slatePanel = crispBand(cosT, -0.35, 0.22, 0.02) *
                             crispBand(u, 0.08, 0.90, 0.02);
          baseCol = mix(colTitanium, colSlate, slatePanel * 0.85);

          float tealRib = crispBand(cosT, 0.34, 0.48, 0.018) *
                          crispBand(u, 0.12, 0.86, 0.02);
          baseCol = mix(baseCol, colTeal, tealRib);
          emissive = max(emissive, tealRib * 0.95);

          float leadEdge = smoothstep(0.88, 0.91, cosT);
          baseCol = mix(baseCol, colCyan, leadEdge);
          emissive = max(emissive, leadEdge * 0.95);
        }
        // PART 2: Wingtip Ion Booster Nacelle Pods
        else if (vPartId < 2.5) {
          if (u < 0.055) {
            baseCol = colCore;
            emissive = 1.0;
          } else if (u < 0.11) {
            baseCol = colCyan;
            emissive = 1.0;
          } else if (u > 0.93) {
            baseCol = colCore;
            emissive = 1.0;
          } else if (u > 0.82) {
            float ring = crispBand(u, 0.84, 0.88, 0.008);
            baseCol = mix(colDark, colCyan, ring);
            emissive = ring;
          } else {
            float collar = crispBand(u, 0.25, 0.29, 0.008);
            float sideLine = smoothstep(0.86, 0.89, absCos) * crispBand(u, 0.15, 0.78, 0.01);
            float cMix = max(collar, sideLine);
            baseCol = mix(colTitanium, colCyan, cMix);
            emissive = cMix;
          }
        }
        // PART 3: Dorsal & Ventral Canted Stabilizer Fins
        else if (vPartId < 3.5) {
          float slateCore = crispBand(sinT, -0.45, 0.45, 0.03) * crispBand(u, 0.10, 0.78, 0.02);
          baseCol = mix(colTitanium, colSlate, slateCore * 0.75);

          float lead = smoothstep(0.82, 0.86, sinT);
          float tip  = smoothstep(0.85, 0.88, u);
          float cMix = max(lead, tip);
          baseCol = mix(baseCol, colCyan, cMix);
          emissive = cMix;
        }
        // PART 4: Rear Hyperdrive & Inboard Thruster Shrouds
        else if (vPartId < 4.5) {
          if (u > 0.83) {
            baseCol = colCore;
            emissive = 1.0;
          } else {
            float ring = crispBand(u, 0.66, 0.75, 0.01);
            baseCol = mix(colDark, colCyan, ring);
            emissive = ring;
          }
        }
        // PART 5: Inner Plasma Plume Core
        else if (vPartId < 5.5) {
          baseCol = mix(colCore, colCyan, u * 0.7);
          emissive = 1.0;
          alpha = 0.95 * (1.0 - u * 0.35);
        }
        // PART 6: Outer Plasma Plume Cone
        else if (vPartId < 6.5) {
          baseCol = mix(colCyan, colPlumeOut, u);
          emissive = 1.0;
          alpha = 0.58 * (1.0 - u * 0.82);
        }
        // PART 7: Cute R2-D2 Astromech Droid Head & Socket Collar!
        else if (vPartId < 7.5) {
          // u = 0 is top of dome, u = 1 is base of cylinder in socket
          // theta: sinT = +1 is forward (+Z), cosT = +1 is starboard (+X)
          baseCol = colR2White;

          // Glowing cyan socket collar ring at the base (u > 0.86)
          float socketRing = smoothstep(0.86, 0.89, u);
          baseCol = mix(baseCol, colCyan, socketRing);
          emissive = max(emissive, socketRing * 0.9);

          // Classic R2-D2 cobalt-blue crown cap + horizontal band + side panels
          float topCap = 1.0 - smoothstep(0.18, 0.21, u);
          float midBand = crispBand(u, 0.64, 0.75, 0.015);
          float sidePanels = crispBand(u, 0.28, 0.56, 0.015) *
                             smoothstep(0.55, 0.60, absCos);
          float blueMask = max(topCap, max(midBand, sidePanels));
          baseCol = mix(baseCol, colR2Blue, blueMask * (1.0 - socketRing));

          // Cute dark optical photoreceptor eye lens on the front of the dome (sinT > 0)
          if (sinT > 0.0) {
            float eyeU = (u - 0.42) / 0.12;
            float eyeX = cosT / 0.26;
            float eyeDist = eyeU * eyeU + eyeX * eyeX;
            float eyeLens = 1.0 - smoothstep(0.85, 1.0, eyeDist);
            // Tiny white-cyan glint inside the eye lens
            float glintU = (u - 0.38) / 0.045;
            float glintX = (cosT - 0.08) / 0.09;
            float glint = 1.0 - smoothstep(0.7, 1.0, glintU * glintU + glintX * glintX);
            baseCol = mix(baseCol, colR2Eye, eyeLens);
            baseCol = mix(baseCol, colCore, glint * eyeLens);
            emissive = max(emissive, glint * eyeLens);

            // Little glowing red/amber status indicator dot next to the eye
            float ledU = (u - 0.54) / 0.055;
            float ledX = (cosT + 0.32) / 0.11;
            float ledMask = 1.0 - smoothstep(0.75, 1.0, ledU * ledU + ledX * ledX);
            baseCol = mix(baseCol, colR2Red, ledMask);
            emissive = max(emissive, ledMask);
          }
        }
        // PART 8: Cute Droid Antenna
        else {
          float tipGlow = 1.0 - smoothstep(0.25, 0.35, u);
          baseCol = mix(colR2White, colCyan, tipGlow);
          emissive = tipGlow;
        }

        if (emissive > 0.65) {
          gl_FragColor = vec4(baseCol, alpha);
          return;
        }

        // Camera-locked studio matcap lighting (keeps colors 100% consistent at every spin angle)
        vec3 nView = normalize(vViewNormal);
        vec3 nLocal = normalize(vLocalNormal);

        vec3 camKey  = normalize(vec3(0.24, 0.42, 0.88));
        vec3 camFill = normalize(vec3(-0.35, -0.25, 0.90));
        float keyDiff  = max(0.0, dot(nView, camKey));
        float fillDiff = max(0.0, dot(nView, camFill));
        float localCurve = 0.5 + 0.5 * abs(nLocal.y);

        float shade = 0.64 + 0.28 * keyDiff + 0.08 * fillDiff + 0.05 * localCurve;

        vec3 camHalf = normalize(vec3(0.14, 0.26, 0.95));
        float specPow = isGlass > 0.5 ? 48.0 : 24.0;
        float specStr = isGlass > 0.5 ? 0.42 : 0.14;
        float spec = pow(max(0.0, dot(nView, camHalf)), specPow) * specStr;

        float glassFresnel = isGlass * pow(1.0 - max(0.0, abs(nView.z)), 2.2) * 0.35;

        vec3 rgb = baseCol * shade +
                   vec3(spec * 0.85, spec * 0.95, spec) +
                   colCyan * glassFresnel;

        gl_FragColor = vec4(clamp(rgb, 0.0, 1.0), alpha);
      }
    `;

    const compileShader = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh, );
      return sh;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, vsSource));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // =========================================================================
    // HIGH-DENSITY SMOOTH SPACECRAFT + ASTROMECH DROID GEOMETRY
    // =========================================================================
    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const partIds: number[] = [];
    const opaqueIndices: number[] = [];
    const plumeIndices: number[] = [];
    let vertexCount = 0;

    const smoothstep = (e0: number, e1: number, x: number) => {
      const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return t * t * (3 - 2 * t);
    };

    const mix = (a: number, b: number, t: number) => a + (b - a) * t;

    const addSmoothPart = (
      nu: number,
      nv: number,
      partId: number,
      centerRef: (u: number, v: number) => Vec3,
      evalPos: (u: number, v: number) => Vec3,
      isTransparent = false
    ) => {
      const baseVertex = vertexCount;
      const stride = nv + 1;
      const gridPos: Vec3[][] = [];

      for (let i = 0; i <= nu; i++) {
        const u = i / nu;
        const rowP: Vec3[] = [];
        for (let j = 0; j <= nv; j++) {
          const v = j / nv;
          rowP.push(evalPos(u, v));
        }
        gridPos.push(rowP);
      }

      const vNormals: Vec3[][] = Array.from({ length: nu + 1 }, () =>
        Array.from({ length: nv + 1 }, () => ({ x: 0, y: 0, z: 0 }))
      );

      const accumTri = (
        i0: number,
        j0: number,
        i1: number,
        j1: number,
        i2: number,
        j2: number
      ) => {
        const p0 = gridPos[i0][j0];
        const p1 = gridPos[i1][j1];
        const p2 = gridPos[i2][j2];
        const ux = p1.x - p0.x,
          uy = p1.y - p0.y,
          uz = p1.z - p0.z;
        const vx = p2.x - p0.x,
          vy = p2.y - p0.y,
          vz = p2.z - p0.z;
        const nx = uy * vz - uz * vy;
        const ny = uz * vx - ux * vz;
        const nz = ux * vy - uy * vx;
        vNormals[i0][j0].x += nx;
        vNormals[i0][j0].y += ny;
        vNormals[i0][j0].z += nz;
        vNormals[i1][j1].x += nx;
        vNormals[i1][j1].y += ny;
        vNormals[i1][j1].z += nz;
        vNormals[i2][j2].x += nx;
        vNormals[i2][j2].y += ny;
        vNormals[i2][j2].z += nz;
      };

      for (let i = 0; i < nu; i++) {
        for (let j = 0; j < nv; j++) {
          accumTri(i, j, i + 1, j, i + 1, j + 1);
          accumTri(i, j, i + 1, j + 1, i, j + 1);
        }
      }

      for (let i = 0; i <= nu; i++) {
        const n0 = vNormals[i][0];
        const n1 = vNormals[i][nv];
        const sx = n0.x + n1.x,
          sy = n0.y + n1.y,
          sz = n0.z + n1.z;
        n0.x = n1.x = sx;
        n0.y = n1.y = sy;
        n0.z = n1.z = sz;
      }

      for (let i = 0; i <= nu; i++) {
        const u = i / nu;
        for (let j = 0; j <= nv; j++) {
          const v = j / nv;
          const p = gridPos[i][j];
          const n = vNormals[i][j];
          const ref = centerRef(u, v);
          const ox = p.x - ref.x;
          const oy = p.y - ref.y;
          const oz = p.z - ref.z;
          const sign = n.x * ox + n.y * oy + n.z * oz < 0 ? -1 : 1;
          const l = Math.hypot(n.x, n.y, n.z) || 1;
          positions.push(p.x, p.y, p.z);
          normals.push((n.x / l) * sign, (n.y / l) * sign, (n.z / l) * sign);
          uvs.push(u, v);
          partIds.push(partId);
          vertexCount++;
        }
      }

      const targetIndices = isTransparent ? plumeIndices : opaqueIndices;
      for (let i = 0; i < nu; i++) {
        for (let j = 0; j < nv; j++) {
          const a = baseVertex + i * stride + j;
          const b = baseVertex + (i + 1) * stride + j;
          const c = baseVertex + (i + 1) * stride + (j + 1);
          const d = baseVertex + i * stride + (j + 1);
          targetIndices.push(a, b, c, a, c, d);
        }
      }
    };

    // 1. Central Fuselage + Teardrop Canopy (Part 0)
    addSmoothPart(
      88,
      72,
      0,
      (u) => ({ x: 0, y: 0, z: mix(90, -58, u) }),
      (u, v) => {
        const z = mix(90, -58, u);
        const theta = v * Math.PI * 2;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        const absSin = Math.abs(sinT);

        const noseCurve = Math.pow(
          Math.sin(Math.min(1, u * 1.18) * Math.PI * 0.5),
          0.68
        );
        const tailCurve = 1.0 - 0.38 * smoothstep(0.62, 1.0, u);
        const env = noseCurve * tailCurve;

        const chineFlare = 1.0 + 0.24 * Math.exp(-Math.pow(sinT * 2.6, 2.0));
        const rx = 13.2 * env * chineFlare;
        const ry = 9.5 * env * (sinT >= 0 ? 1.0 : 0.86);

        const canopyLong =
          smoothstep(0.14, 0.25, u) * (1.0 - smoothstep(0.40, 0.52, u));
        const upperDome = Math.max(0, sinT);
        const centerMask = Math.exp(-Math.pow(cosT * 2.1, 2.0));
        const canopyLift =
          6.2 * canopyLong * Math.pow(upperDome, 1.5) * centerMask;

        const ventralLong =
          smoothstep(0.24, 0.36, u) * (1.0 - smoothstep(0.65, 0.80, u));
        const lowerDome = Math.max(0, -sinT);
        const ventralLift =
          -2.6 * ventralLong * Math.pow(lowerDome, 1.6) * centerMask;

        const spineLong =
          smoothstep(0.54, 0.62, u) * (1.0 - smoothstep(0.86, 0.96, u));
        const spineOffset =
          2.2 *
          spineLong *
          Math.pow(absSin, 2.2) *
          centerMask *
          (sinT >= 0 ? 1 : -0.65);

        return {
          x: cosT * rx,
          y: sinT * ry + canopyLift + ventralLift + spineOffset,
          z,
        };
      }
    );

    // 2. Sculpted Swept Main Wings (Part 1)
    const addWing = (side: 1 | -1) => {
      addSmoothPart(
        44,
        44,
        1,
        (u) => ({
          x: mix(10.5, 54.0, u) * side,
          y: 0,
          z: mix(-2.0, -26.0, Math.pow(u, 1.12)),
        }),
        (u, v) => {
          const theta = v * Math.PI * 2;
          const cosT = Math.cos(theta);
          const sinT = Math.sin(theta);

          const spanX = mix(10.5, 54.0, u) * side;
          const rootFillet = Math.exp(-u * 4.5);
          const halfChord = mix(28.0, 12.5, u) + 6.0 * rootFillet;
          const centerZ = mix(-2.0, -26.0, Math.pow(u, 1.12));

          const chordShift = 0.15 * (1.0 - cosT * cosT);
          const halfThick =
            (mix(4.2, 2.0, u) + 1.8 * rootFillet) * (1.0 + 0.22 * cosT);

          return {
            x: spanX,
            y: sinT * halfThick,
            z: centerZ + (cosT + chordShift) * halfChord,
          };
        }
      );
    };
    addWing(1);
    addWing(-1);

    // 3. Wingtip Ion Booster Nacelle Pods (Part 2)
    const addPod = (side: 1 | -1) => {
      const podX = 54.0 * side;
      addSmoothPart(
        48,
        36,
        2,
        (u) => ({ x: podX, y: 0, z: mix(8.0, -56.0, u) }),
        (u, v) => {
          const theta = v * Math.PI * 2;
          const z = mix(8.0, -56.0, u);
          const frontTap = Math.pow(
            Math.sin(Math.min(1, u * 3.2) * Math.PI * 0.5),
            0.55
          );
          const rearTap = 1.0 - 0.35 * smoothstep(0.75, 1.0, u);
          const r = 4.6 * frontTap * rearTap;
          return {
            x: podX + Math.cos(theta) * r,
            y: Math.sin(theta) * r,
            z,
          };
        }
      );
    };
    addPod(1);
    addPod(-1);

    // 4. Dorsal V-Tails & Ventral Stabilizer Strakes (Part 3)
    const addFin = (side: 1 | -1, verticalDir: 1 | -1) => {
      const heightScale = verticalDir === 1 ? 18.5 : 10.5;
      const baseY = verticalDir === 1 ? 4.2 : -3.8;
      addSmoothPart(
        28,
        24,
        3,
        (u) => ({
          x: (8.5 + u * 9.5) * side,
          y: baseY + u * heightScale * verticalDir,
          z: -28.0 - u * 14.0,
        }),
        (u, v) => {
          const theta = v * Math.PI * 2;
          const tipCap = Math.sqrt(Math.max(0.001, 1.0 - Math.pow(u, 3.0)));
          const halfChord = mix(14.0, 4.8, u) * tipCap;
          const halfThick = mix(1.6, 0.5, u) * tipCap;
          return {
            x: (8.5 + u * 9.5) * side + Math.cos(theta) * halfThick,
            y: baseY + u * heightScale * verticalDir,
            z: -28.0 - u * 14.0 + Math.sin(theta) * halfChord,
          };
        }
      );
    };
    addFin(1, 1);
    addFin(-1, 1);
    addFin(1, -1);
    addFin(-1, -1);

    // 5. Rear Engine Shrouds (Part 4) + 3D Plasma Plumes (Parts 5 & 6)
    const addShroud = (
      cx: number,
      cy: number,
      zStart: number,
      zEnd: number,
      rFront: number,
      rBack: number
    ) => {
      addSmoothPart(
        24,
        32,
        4,
        (u) => ({ x: cx, y: cy, z: mix(zStart, zEnd, u) }),
        (u, v) => {
          const theta = v * Math.PI * 2;
          const z = u > 0.83 ? zEnd + 0.5 : mix(zStart, zEnd, u);
          const r =
            u <= 0.83
              ? mix(rFront, rBack, u / 0.83)
              : mix(rBack, 0.15, (u - 0.83) / 0.17);
          return {
            x: cx + Math.cos(theta) * r,
            y: cy + Math.sin(theta) * r * 0.92,
            z,
          };
        }
      );
    };
    addShroud(0, 0, -42, -64, 7.8, 6.2);
    addShroud(9.6, 0, -40, -61, 4.6, 3.8);
    addShroud(-9.6, 0, -40, -61, 4.6, 3.8);

    const addPlume = (
      cx: number,
      cy: number,
      zStart: number,
      length: number,
      rBase: number
    ) => {
      addSmoothPart(
        18,
        24,
        5,
        (u) => ({ x: cx, y: cy, z: zStart - u * length * 0.62 }),
        (u, v) => {
          const theta = v * Math.PI * 2;
          const r = rBase * 0.62 * Math.pow(1.0 - u, 0.72);
          return {
            x: cx + Math.cos(theta) * r,
            y: cy + Math.sin(theta) * r,
            z: zStart - u * length * 0.62,
          };
        },
        true
      );
      addSmoothPart(
        22,
        28,
        6,
        (u) => ({ x: cx, y: cy, z: zStart - u * length }),
        (u, v) => {
          const theta = v * Math.PI * 2;
          const env =
            Math.sin(Math.min(1, u * 1.4) * Math.PI * 0.5) * (1.0 - u);
          const r = rBase * (0.88 * (1.0 - u) + 0.48 * env);
          return {
            x: cx + Math.cos(theta) * r,
            y: cy + Math.sin(theta) * r,
            z: zStart - u * length,
          };
        },
        true
      );
    };
    addPlume(0, 0, -63.5, 32.0, 5.5);
    addPlume(9.6, 0, -60.5, 22.0, 3.4);
    addPlume(-9.6, 0, -60.5, 22.0, 3.4);
    addPlume(54.0, 0, -55.5, 24.0, 3.3);
    addPlume(-54.0, 0, -55.5, 24.0, 3.3);

    // -------------------------------------------------------------------------
    // 6. CUTE R2-D2 ASTROMECH DROID IN THE DORSAL SOCKET BEHIND THE COCKPIT!
    //    Seated at (x = 0, y = 8.4..15.8, z = -7.0) right behind the canopy
    // -------------------------------------------------------------------------
    const DROID_Z = -7.0;
    const DROID_BASE_Y = 8.4;
    const DROID_RADIUS = 5.0;

    // Astromech Dome Head + Cylindrical Socket Shoulder (Part 7)
    addSmoothPart(
      28,
      36,
      7,
      (u) => ({ x: 0, y: mix(DROID_BASE_Y + 5.6, DROID_BASE_Y, u), z: DROID_Z }),
      (u, v) => {
        const theta = v * Math.PI * 2;
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);

        // u in [0, 0.72]: hemispherical R2 dome
        // u in [0.72, 1.0]: short cylindrical body + socket collar
        if (u <= 0.72) {
          const phi = (u / 0.72) * (Math.PI * 0.48);
          const r = Math.max(0.04, DROID_RADIUS * Math.sin(phi));
          const y = DROID_BASE_Y + 1.8 + DROID_RADIUS * 0.94 * Math.cos(phi);
          return {
            x: cosT * r,
            y,
            z: DROID_Z + sinT * r,
          };
        } else {
          const t = (u - 0.72) / 0.28;
          const r = DROID_RADIUS * (1.0 + 0.08 * smoothstep(0.5, 1.0, t));
          const y = mix(DROID_BASE_Y + 1.8, DROID_BASE_Y - 0.5, t);
          return {
            x: cosT * r,
            y,
            z: DROID_Z + sinT * r,
          };
        }
      }
    );

    // Cute Little Droid Antenna on top of the dome (Part 8)
    addSmoothPart(
      12,
      14,
      8,
      (u) => ({ x: -1.2, y: mix(DROID_BASE_Y + 8.6, DROID_BASE_Y + 6.0, u), z: DROID_Z - 0.8 }),
      (u, v) => {
        const theta = v * Math.PI * 2;
        const isBall = u < 0.28;
        const r = isBall
          ? 0.58 * Math.sin(Math.max(0.08, (u / 0.28) * Math.PI))
          : 0.24;
        const y = mix(DROID_BASE_Y + 8.6, DROID_BASE_Y + 6.0, u);
        return {
          x: -1.2 + Math.cos(theta) * r,
          y,
          z: DROID_Z - 0.8 + Math.sin(theta) * r,
        };
      }
    );

    // Upload buffers
    const createBuf = (data: Float32Array) => {
      const b = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      return b;
    };

    const posBuf = createBuf(new Float32Array(positions));
    const normBuf = createBuf(new Float32Array(normals));
    const uvBuf = createBuf(new Float32Array(uvs));
    const partBuf = createBuf(new Float32Array(partIds));

    const opaqueIdxBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, opaqueIdxBuf);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(opaqueIndices),
      gl.STATIC_DRAW
    );

    const plumeIdxBuf = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plumeIdxBuf);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(plumeIndices),
      gl.STATIC_DRAW
    );

    const bindAttr = (buf: WebGLBuffer, name: string, size: number) => {
      const loc = gl.getAttribLocation(prog, name);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    };

    bindAttr(posBuf, "aPos", 3);
    bindAttr(normBuf, "aNormal", 3);
    bindAttr(uvBuf, "aUV", 2);
    bindAttr(partBuf, "aPartId", 1);

    const uRotLoc = gl.getUniformLocation(prog, "uRot");
    const uAspectLoc = gl.getUniformLocation(prog, "uAspect");
    const uCamDistLoc = gl.getUniformLocation(prog, "uCamDist");
    const uOffsetLoc = gl.getUniformLocation(prog, "uOffset");
    const uDroidYawLoc = gl.getUniformLocation(prog, "uDroidYaw");

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    // =========================================================================
    // FULL-BLEED COSMIC STARFIELD (Spans the entire card edge-to-edge)
    // =========================================================================
    const ambientStars: AmbientStar[] = [];
    const starPalette: [number, number, number][] = [
      [56, 189, 248],
      [45, 212, 191],
      [129, 140, 248],
      [255, 255, 255],
      [192, 132, 252],
      [103, 232, 249],
    ];
    for (let i = 0; i < 120; i++) {
      const frac = (i + 0.5) / 120;
      const c = starPalette[i % starPalette.length];
      ambientStars.push({
        baseSize: i % 9 === 0 ? 1.85 : 0.75 + (i % 4) * 0.25,
        r: c[0],
        g: c[1],
        b: c[2],
        twinklePhase: i * 1.7,
        twinkleSpeed: 1.5 + (i % 5) * 0.35,
        driftAngle: i * 2.39996,
        orbitRadius: 145 + (i % 12) * 16,
        altitude: Math.acos(1 - 2 * frac),
        flare: i % 9 === 0,
      });
    }

    // =========================================================================
    // QUATERNION ROTATION ENGINE
    // =========================================================================
    const rootQuat = new Quaternion();
    rootQuat.premultiply(new Quaternion().setFromAxisAngle(0, 1, 0, -0.65));
    rootQuat.premultiply(new Quaternion().setFromAxisAngle(1, 0, 0, 0.38));
    rootQuat.premultiply(new Quaternion().setFromAxisAngle(0, 0, 1, -0.12));

    let isPointerDown = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let velX = 0;
    let velY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let tiltX = 0;
    let tiltY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDown = true;
      setIsDragging(true);
      setStatusText("VECTOR_THRUST_LOCKED");
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      velX = 0;
      velY = 0;
      try {
        glCanvas.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = glCanvas.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      targetTiltX = normY * 0.15;
      targetTiltY = normX * 0.15;

      if (!isPointerDown) return;

      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;

      const speed = 0.0055;
      velY = dx * speed;
      velX = dy * speed;

      const qY = new Quaternion().setFromAxisAngle(0, 1, 0, velY);
      const qX = new Quaternion().setFromAxisAngle(1, 0, 0, velX);

      rootQuat.premultiply(qY);
      rootQuat.premultiply(qX);
    };

    const onPointerUp = (e: PointerEvent) => {
      isPointerDown = false;
      setIsDragging(false);
      setStatusText("ASTRA_INTERCEPTOR_ACTIVE");
      try {
        glCanvas.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    glCanvas.addEventListener("pointerdown", onPointerDown);
    glCanvas.addEventListener("pointermove", onPointerMove);
    glCanvas.addEventListener("pointerup", onPointerUp);
    glCanvas.addEventListener("pointercancel", onPointerUp);

    const CAM_DIST = 320;
    const VIEW_SCALE = 1.48;

    const projectWorld = (p: Vec3, cx: number, cy: number) => {
      const scale = (CAM_DIST / Math.max(60, CAM_DIST - p.z)) * VIEW_SCALE;
      return {
        x: cx + p.x * scale,
        y: cy - p.y * scale,
        z: p.z,
        s: scale,
      };
    };

    let time = 0;

    // =========================================================================
    // RENDER LOOP
    // =========================================================================
    const render = () => {
      time += 0.016;

      if (!isPointerDown) {
        if (Math.abs(velX) > 0.00008 || Math.abs(velY) > 0.00008) {
          const qY = new Quaternion().setFromAxisAngle(0, 1, 0, velY);
          const qX = new Quaternion().setFromAxisAngle(1, 0, 0, velX);
          rootQuat.premultiply(qY);
          rootQuat.premultiply(qX);
          velX *= 0.945;
          velY *= 0.945;
        } else {
          const idleQ = new Quaternion().setFromAxisAngle(0, 1, 0, 0.003);
          rootQuat.premultiply(idleQ);
        }
        tiltX += (targetTiltX - tiltX) * 0.05;
        tiltY += (targetTiltY - tiltY) * 0.05;
      }
      rootQuat.normalize();

      const bobX = Math.cos(time * 0.9) * 1.2;
      const bobY = Math.sin(time * 1.4) * 2.0;

      const cx = cssWidth / 2 + tiltY * 6;
      const cy = cssHeight / 2 + tiltX * 6;

      // =======================================================================
      // 1. FULL-BLEED DEEP-SPACE COSMIC BACKGROUND (Edge-to-Edge of Whole Card)
      // =======================================================================
      const spaceGrad = ctx.createLinearGradient(0, 0, cssWidth, cssHeight);
      spaceGrad.addColorStop(0, "#040814");
      spaceGrad.addColorStop(0.5, "#081124");
      spaceGrad.addColorStop(1, "#050b18");
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Layered drifting nebula clouds spanning edge-to-edge
      const neb1X = cssWidth * 0.25 + Math.cos(time * 0.35) * 18;
      const neb1Y = cssHeight * 0.28 + Math.sin(time * 0.4) * 12;
      const neb1 = ctx.createRadialGradient(neb1X, neb1Y, 4, neb1X, neb1Y, cssWidth * 0.65);
      neb1.addColorStop(0, "rgba(56, 189, 248, 0.14)");
      neb1.addColorStop(0.45, "rgba(99, 102, 241, 0.08)");
      neb1.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = neb1;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      const neb2X = cssWidth * 0.78 + Math.sin(time * 0.3) * 16;
      const neb2Y = cssHeight * 0.74 + Math.cos(time * 0.38) * 12;
      const neb2 = ctx.createRadialGradient(neb2X, neb2Y, 4, neb2X, neb2Y, cssWidth * 0.6);
      neb2.addColorStop(0, "rgba(45, 212, 191, 0.12)");
      neb2.addColorStop(0.5, "rgba(59, 130, 246, 0.06)");
      neb2.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = neb2;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Subtle tactical orbital star-chart rings in deep background
      ctx.save();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.07)";
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 8]);
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(cssWidth, cssHeight) * 0.43, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Central core halo behind the spacecraft
      const bgGlow = ctx.createRadialGradient(cx, cy, 6, cx, cy, 130);
      bgGlow.addColorStop(0, "rgba(56, 189, 248, 0.19)");
      bgGlow.addColorStop(0.45, "rgba(99, 102, 241, 0.08)");
      bgGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 130, 0, Math.PI * 2);
      ctx.fill();

      // Full-bleed 3D rotating starfield (fills the entire card right up to the outer rounded border)
      for (const star of ambientStars) {
        star.driftAngle += 0.0009;
        const wx =
          star.orbitRadius *
          Math.sin(star.altitude) *
          Math.cos(star.driftAngle);
        const wy =
          star.orbitRadius *
          Math.sin(star.altitude) *
          Math.sin(star.driftAngle);
        const wz = star.orbitRadius * Math.cos(star.altitude);
        const rp = rootQuat.rotateVector({ x: wx, y: wy, z: wz });
        const p = projectWorld(rp, cx, cy);
        const depthAlpha = Math.max(0.15, Math.min(0.92, (rp.z + 240) / 480));
        const twinkle =
          0.6 + 0.4 * Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const alpha = depthAlpha * twinkle;
        const rad = Math.max(0.55, star.baseSize * (p.s / VIEW_SCALE));

        ctx.beginPath();
        ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${alpha.toFixed(2)})`;
        ctx.fill();

        // Crisp 4-point diamond flare on bright stars
        if (star.flare && twinkle > 0.78) {
          const arm = rad * 2.6;
          ctx.strokeStyle = `rgba(${star.r}, ${star.g}, ${star.b}, ${(
            alpha * 0.55
          ).toFixed(2)})`;
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          ctx.moveTo(p.x - arm, p.y);
          ctx.lineTo(p.x + arm, p.y);
          ctx.moveTo(p.x, p.y - arm);
          ctx.lineTo(p.x, p.y + arm);
          ctx.stroke();
        }
      }

      // =======================================================================
      // 2. RENDER SUPERSAMPLED SMOOTH 3D SPACECRAFT + R2 DROID IN WEBGL
      // =======================================================================
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const droidYaw = Math.sin(time * 2.2) * 0.48;
      gl.uniformMatrix3fv(uRotLoc, false, rootQuat.toMat3());
      gl.uniform2f(
        uAspectLoc,
        (cssWidth * 0.5) / VIEW_SCALE,
        (cssHeight * 0.5) / VIEW_SCALE
      );
      gl.uniform1f(uCamDistLoc, CAM_DIST);
      gl.uniform2f(uOffsetLoc, bobX + tiltY * 6, bobY - tiltX * 6);
      gl.uniform1f(uDroidYawLoc, droidYaw);

      // Opaque hull + astromech droid pass
      gl.disable(gl.BLEND);
      gl.depthMask(true);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, opaqueIdxBuf);
      gl.drawElements(gl.TRIANGLES, opaqueIndices.length, gl.UNSIGNED_SHORT, 0);

      // Translucent 3D plasma plumes pass
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.depthMask(false);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, plumeIdxBuf);
      gl.drawElements(gl.TRIANGLES, plumeIndices.length, gl.UNSIGNED_SHORT, 0);
      gl.depthMask(true);

      // =======================================================================
      // 3. CUTE "beep boop" SPEECH BUBBLE ANCHORED TO THE R2 ASTROMECH DROID!
      // =======================================================================
      fgCtx.clearRect(0, 0, cssWidth, cssHeight);
      {
        const headLocal: Vec3 = {
          x: 0,
          y: DROID_BASE_Y + 7.2,
          z: DROID_Z,
        };
        const headWorld = rootQuat.rotateVector(headLocal);
        headWorld.x += bobX + tiltY * 6;
        headWorld.y += bobY - tiltX * 6;

        // Dorsal up vector in world space to check if the droid is visible
        const dorsalUpW = rootQuat.rotateVector({ x: 0, y: 1, z: 0 });
        const visibility = smoothstep(-0.35, -0.05, dorsalUpW.z);

        if (visibility > 0.02) {
          const anchor = projectWorld(headWorld, cssWidth / 2, cssHeight / 2);
          const floatBounce = Math.sin(time * 3.6) * 2.0;

          fgCtx.save();
          fgCtx.globalAlpha = visibility;
          fgCtx.font = "600 10.5px ui-monospace, SFMono-Regular, Menlo, monospace";

          const label = "beep boop!";
          const textW = fgCtx.measureText(label).width;
          const bw = Math.ceil(textW + 28);
          const bh = 22;
          const rad = 8;

          const bx = Math.max(
            14 + bw / 2,
            Math.min(cssWidth - 14 - bw / 2, anchor.x + 10)
          );
          const by = Math.max(
            42,
            Math.min(cssHeight - 52, anchor.y - 24 + floatBounce)
          );

          const left = bx - bw / 2;
          const right = bx + bw / 2;
          const top = by - bh / 2;
          const bottom = by + bh / 2;

          const tailBaseX = Math.max(
            left + rad + 5,
            Math.min(right - rad - 5, anchor.x + 2)
          );
          const tailTipX = anchor.x;
          const tailTipY = Math.max(bottom + 4, Math.min(bottom + 9, anchor.y - 2));

          // Single unified vector path for speech bubble + pointer tail (no inner seam!)
          fgCtx.beginPath();
          fgCtx.moveTo(left + rad, top);
          fgCtx.lineTo(right - rad, top);
          fgCtx.quadraticCurveTo(right, top, right, top + rad);
          fgCtx.lineTo(right, bottom - rad);
          fgCtx.quadraticCurveTo(right, bottom, right - rad, bottom);
          fgCtx.lineTo(tailBaseX + 4.5, bottom);
          fgCtx.lineTo(tailTipX, tailTipY);
          fgCtx.lineTo(tailBaseX - 4.5, bottom);
          fgCtx.lineTo(left + rad, bottom);
          fgCtx.quadraticCurveTo(left, bottom, left, bottom - rad);
          fgCtx.lineTo(left, top + rad);
          fgCtx.quadraticCurveTo(left, top, left + rad, top);
          fgCtx.closePath();

          fgCtx.fillStyle = "rgba(8, 18, 38, 0.92)";
          fgCtx.shadowColor = "rgba(56, 189, 248, 0.42)";
          fgCtx.shadowBlur = 10;
          fgCtx.fill();
          fgCtx.shadowBlur = 0;

          fgCtx.strokeStyle = "rgba(103, 232, 249, 0.88)";
          fgCtx.lineWidth = 1.2;
          fgCtx.stroke();

          // Cute blinking cyan/teal LED dot + "beep boop!" text centered inside
          fgCtx.beginPath();
          fgCtx.arc(left + 10.5, by, 2.4, 0, Math.PI * 2);
          fgCtx.fillStyle = Math.sin(time * 8) > 0 ? "#38bdf8" : "#2dd4bf";
          fgCtx.fill();

          fgCtx.fillStyle = "#e0f2fe";
          fgCtx.textBaseline = "middle";
          fgCtx.fillText(label, left + 17.5, by + 0.5);

          fgCtx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      glCanvas.removeEventListener("pointerdown", onPointerDown);
      glCanvas.removeEventListener("pointermove", onPointerMove);
      glCanvas.removeEventListener("pointerup", onPointerUp);
      glCanvas.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="relative w-full h-[310px] sm:h-[340px] flex flex-col justify-between p-3.5 sm:p-4 group select-none bg-[#050914] rounded-2xl border border-cyan-500/25 shadow-2xl overflow-hidden"
    >
      {/* Full-Bleed Edge-to-Edge Canvas Layers (No inner box clipping!) */}
      <canvas
        ref={bgCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      <canvas
        ref={glCanvasRef}
        className={`absolute inset-0 w-full h-full touch-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
      />
      <canvas
        ref={fgCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Cyber Corner Brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60 pointer-events-none z-10" />
      <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 pointer-events-none z-10" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60 pointer-events-none z-10" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60 pointer-events-none z-10" />

      {/* Top HUD Bar (Floats cleanly over the full-bleed cosmic scene) */}
      <div className="relative z-10 w-full flex items-center justify-between text-[10px] font-mono text-cyan-400/90 tracking-widest px-1.5 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-slate-950/55 backdrop-blur-sm px-2.5 py-1 rounded-full border border-cyan-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>SYS.3D // {statusText}</span>
        </div>
        <span className="text-slate-300 text-[9px] bg-slate-950/65 backdrop-blur-sm px-2.5 py-1 rounded-full border border-slate-700/70">
          DRAG TO ROTATE
        </span>
      </div>

      {/* Bottom Telemetry Bar (Floats cleanly over the full-bleed cosmic scene) */}
      <div className="relative z-10 w-full flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-slate-300 px-3 py-1.5 rounded-xl bg-slate-950/60 backdrop-blur-sm border border-cyan-500/20 gap-1 pointer-events-none">
        <span className="text-cyan-300 truncate">SHIP: ASTRA-IX CRUISER</span>
        <span className="text-indigo-300 truncate">DROID: R2-UNIT ONLINE</span>
        <span className="text-emerald-400 shrink-0">HULL: 100%</span>
      </div>
    </div>
  );
}
