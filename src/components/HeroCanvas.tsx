"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Three.js waving wireframe grid — subtle decorative background for the hero section.
 * Responds to mouse movement with gentle camera parallax.
 */
export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let W = mount.clientWidth;
    let H = mount.clientHeight;

    // Bail silently if WebGL is unavailable
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 1000);
    camera.position.set(0, 5, 90);

    // Waving wireframe plane
    const SEGS = 48;
    const geometry = new THREE.PlaneGeometry(200, 140, SEGS, SEGS);
    const material = new THREE.MeshBasicMaterial({
      color: 0x191918,
      wireframe: true,
      transparent: true,
      opacity: 0.05,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 5;
    mesh.position.y = -12;
    scene.add(mesh);

    // Cache base Z values to apply wave on top
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const baseZ = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) {
      baseZ[i] = posAttr.getZ(i);
    }

    // Mouse parallax tracking
    let mx = 0;
    let my = 0;
    const onMouse = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    // Resize handler
    const onResize = () => {
      W = mount.clientWidth;
      H = mount.clientHeight;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    // Render loop
    let rafId: number;
    let t = 0;

    const animate = () => {
      t += 0.006;

      // Animate each vertex with a compound sine wave
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const wave =
          Math.sin(x * 0.07 + t) * Math.cos(y * 0.05 + t * 0.6) * 7 +
          Math.sin(x * 0.03 - t * 0.8) * 3;
        posAttr.setZ(i, baseZ[i] + wave);
      }
      posAttr.needsUpdate = true;

      // Gentle camera parallax following mouse
      camera.position.x += (mx * 10 - camera.position.x) * 0.025;
      camera.position.y += (-my * 5 + 5 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  );
}
