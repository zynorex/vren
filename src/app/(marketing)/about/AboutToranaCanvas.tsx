"use client";

import { useEffect, useRef, useState } from "react";
// @ts-ignore
import * as THREE_MODULE from "three";
const THREE = THREE_MODULE as any;

/**
 * AboutToranaCanvas:
 * An interactive 3D WebGL visualization representing the Torana Gateway (the ancient Indian sacred threshold)
 * and the Shiroreka (the unifying horizontal bar of Sanskrit typography).
 * Luminous particles flow freely through the gateway, symbolizing permissionless sovereign value flow.
 */
export function AboutToranaCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    let renderer: any;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      setHasWebGL(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 48);

    // Group for the entire Torana structure and particle stream
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Materials
    const goldColor = 0xc9a07c; // Warm Gold
    const charcoalColor = 0x2d2b27;
    const terracottaColor = 0xd97757;

    const goldMaterial = new THREE.MeshBasicMaterial({
      color: goldColor,
      transparent: true,
      opacity: 0.85,
    });

    const structureMaterial = new THREE.MeshBasicMaterial({
      color: charcoalColor,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });

    const accentMaterial = new THREE.MeshBasicMaterial({
      color: terracottaColor,
      transparent: true,
      opacity: 0.6,
    });

    // 1. Torana Gateway Construction (from design.md grid spec)
    // Left pillar
    const pillarGeo = new THREE.BoxGeometry(2.4, 20, 2.4);
    const leftPillar = new THREE.Mesh(pillarGeo, structureMaterial);
    leftPillar.position.set(-8, 0, 0);
    rootGroup.add(leftPillar);

    // Right pillar
    const rightPillar = new THREE.Mesh(pillarGeo, structureMaterial);
    rightPillar.position.set(8, 0, 0);
    rootGroup.add(rightPillar);

    // Shiroreka Crossbar (Unifying horizontal beam - gold)
    const beamGeo = new THREE.BoxGeometry(22, 2.2, 2.6);
    const topBeam = new THREE.Mesh(beamGeo, goldMaterial);
    topBeam.position.set(0, 10, 0);
    rootGroup.add(topBeam);

    // Secondary lower architectural beam
    const subBeamGeo = new THREE.BoxGeometry(20, 0.8, 1.8);
    const subBeam = new THREE.Mesh(subBeamGeo, structureMaterial);
    subBeam.position.set(0, 7.8, 0);
    rootGroup.add(subBeam);

    // Central descending value flow marker (suggesting on-chain transaction)
    const flowLineGeo = new THREE.BoxGeometry(1.0, 8, 1.0);
    const flowLine = new THREE.Mesh(flowLineGeo, accentMaterial);
    flowLine.position.set(0, 4.5, 0);
    rootGroup.add(flowLine);

    // Pillar base pedestals
    const baseGeo = new THREE.BoxGeometry(3.6, 1.2, 3.6);
    const leftBase = new THREE.Mesh(baseGeo, structureMaterial);
    leftBase.position.set(-8, -10, 0);
    rootGroup.add(leftBase);

    const rightBase = new THREE.Mesh(baseGeo, structureMaterial);
    rightBase.position.set(8, -10, 0);
    rootGroup.add(rightBase);

    // 2. Dynamic Value Particles Flowing Through the Gateway
    const particleCount = 220;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleSizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 12; // Focused within pillars
      const y = -12 + Math.random() * 24;
      const z = (Math.random() - 0.5) * 16;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      particleSpeeds[i] = 0.04 + Math.random() * 0.08;
      particleSizes[i] = 1 + Math.random() * 2;
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    // Point cloud with subtle gold and warm embers
    const particleMaterial = new THREE.PointsMaterial({
      color: goldColor,
      size: 0.8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    rootGroup.add(particles);

    // Circular halo / subtle ring around the gateway
    const ringGeo = new THREE.RingGeometry(13, 13.3, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: goldColor,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
    });
    const haloRing = new THREE.Mesh(ringGeo, ringMat);
    haloRing.position.set(0, 1, -2);
    rootGroup.add(haloRing);

    // Mouse tracking for parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = y * 2;
      targetRotY = mouseX * 0.25;
      targetRotX = -mouseY * 0.2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!mount) return;
      width = mount.clientWidth;
      height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = 0;

    const animate = () => {
      clock += 0.015;

      // Gentle continuous rotation + mouse parallax smoothing
      rootGroup.rotation.y += (targetRotY - rootGroup.rotation.y) * 0.04;
      rootGroup.rotation.x += (targetRotX - rootGroup.rotation.x) * 0.04;

      // Subtle breathing float
      rootGroup.position.y = Math.sin(clock * 0.8) * 0.4;
      haloRing.rotation.z += 0.002;

      // Update particle stream (moving upwards through the gate like ascended value)
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3 + 1;
        positions[idx] += particleSpeeds[i];

        // Reset particle if it leaves the top threshold
        if (positions[idx] > 14) {
          positions[idx] = -12;
          positions[i * 3] = (Math.random() - 0.5) * 12;
        }

        // Slight horizontal wave oscillation
        positions[i * 3] += Math.sin(clock + i) * 0.01;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Pulse the central flow line opacity
      flowLine.material.opacity = 0.4 + Math.sin(clock * 2) * 0.3;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex items-center justify-center border border-border-subtle/50 rounded-xl bg-charcoal/5 p-8 text-center">
        <span className="font-mono text-xs uppercase tracking-widest text-text-secondary">
          Torana Gateway Architecture
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Three.js mount point */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Decorative architectural grid overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,var(--color-parchment)_80%)]" />
      
      {/* Subtle coordinate labels */}
      <div className="pointer-events-none absolute bottom-4 left-6 flex items-center gap-3 font-mono text-[11px] text-stone tracking-wider">
        <span>X: TORANA-GATEWAY</span>
        <span className="w-1.5 h-1.5 rounded-full bg-warm-gold animate-ping" />
        <span>POLYGON:137</span>
      </div>

      <div className="pointer-events-none absolute top-4 right-6 font-mono text-[11px] text-stone tracking-wider">
        <span>SHIROREKA // IMMUTABLE FLOW</span>
      </div>
    </div>
  );
}
