"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Play, RotateCcw, ShieldCheck, Zap, Sparkles } from "lucide-react";

interface NodePoint {
  id: string;
  name: string;
  subname: string;
  x: number;
  y: number;
  role: "subscriber" | "protocol" | "creator" | "credential" | "treasury";
  color: string;
  accent: string;
  details: {
    address: string;
    contract?: string;
    action: string;
    metrics: string;
    latency: string;
  };
}

interface Particle {
  x: number;
  y: number;
  progress: number;
  speed: number;
  fromNodeId: string;
  toNodeId: string;
  color: string;
  size: number;
  label?: string;
}

interface PulseWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  opacity: number;
}

export function HowItWorksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string>("protocol");
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeTx, setActiveTx] = useState<string | null>(null);
  const [txCount, setTxCount] = useState<number>(1420);

  // Animation refs to avoid re-renders during 60fps loop
  const particlesRef = useRef<Particle[]>([]);
  const wavesRef = useRef<PulseWave[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const hoveredNodeRef = useRef<string | null>(null);

  // Nodes definition relative to 1000x500 virtual canvas
  const getNodes = useCallback((): NodePoint[] => {
    return [
      {
        id: "subscriber",
        name: "Subscriber Wallet",
        subname: "End User (0x71...3A9b)",
        x: 180,
        y: 250,
        role: "subscriber",
        color: "#191918",
        accent: "#6a9bcc",
        details: {
          address: "0x71C4...3A9b",
          action: "Approves USDC & signs subscribe(appId, planId)",
          metrics: "Balance: 450.00 USDC · Polygon PoS",
          latency: "Signature: ~450ms",
        },
      },
      {
        id: "protocol",
        name: "Artha Engine",
        subname: "VrenSubscription.sol",
        x: 500,
        y: 250,
        role: "protocol",
        color: "#d97757",
        accent: "#c9a07c",
        details: {
          address: "0xA35b...8291 (Chain ID 137)",
          contract: "VrenSubscription.sol (v0.8.24)",
          action: "Pulls USDC, validates plan, mints NFT & splits funds atomically",
          metrics: "Gas: 68,412 units (~$0.0028) · ReentrancyGuard",
          latency: "Block Finality: ~2.1 sec",
        },
      },
      {
        id: "creator",
        name: "Creator Payout Wallet",
        subname: "Developer (0x8F...412c)",
        x: 820,
        y: 150,
        role: "creator",
        color: "#788c5d",
        accent: "#788c5d",
        details: {
          address: "0x8F92...412c",
          action: "Receives 98.5% of subscription fee directly in wallet",
          metrics: "Payout: 98.50 USDC per 100 USDC · 0 Hold Period",
          latency: "Instant Block Settlement",
        },
      },
      {
        id: "treasury",
        name: "Protocol Treasury",
        subname: "1.5% Immutable Fee Cap",
        x: 820,
        y: 350,
        role: "treasury",
        color: "#c9a07c",
        accent: "#c9a07c",
        details: {
          address: "0x00Ar...FEE1",
          action: "Protocol maintenance, RPC relayers & open-source upkeep",
          metrics: "Exact 1.50 USDC per 100 USDC",
          latency: "Atomic Transfer",
        },
      },
      {
        id: "credential",
        name: "Dynamic Access Pass",
        subname: "ERC-1155 Token #1408",
        x: 500,
        y: 90,
        role: "credential",
        color: "#2d2b27",
        accent: "#d97757",
        details: {
          address: "ERC-1155 Token ID #1408",
          action: "Cryptographic proof of active subscription with on-chain expiry",
          metrics: "Expiry: block.timestamp + 30 days · Non-fungible pass",
          latency: "Verified in 0ms via RPC / Viem",
        },
      },
    ];
  }, []);

  // Trigger a full simulated transaction sequence
  const triggerTransaction = useCallback(() => {
    setActiveTx(`TX-0x${Math.random().toString(16).slice(2, 8).toUpperCase()}`);
    setTxCount((prev) => prev + 1);

    // Spawn burst waves at subscriber
    const nodes = getNodes();
    const sub = nodes.find((n) => n.id === "subscriber");
    const engine = nodes.find((n) => n.id === "protocol");
    const creator = nodes.find((n) => n.id === "creator");
    const treasury = nodes.find((n) => n.id === "treasury");
    const cred = nodes.find((n) => n.id === "credential");

    if (!sub || !engine || !creator || !treasury || !cred) return;

    // Pulse at subscriber
    wavesRef.current.push({
      x: sub.x,
      y: sub.y,
      radius: 10,
      maxRadius: 60,
      color: "#6a9bcc",
      opacity: 0.8,
    });

    // Stream 1: USDC from subscriber to engine
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        particlesRef.current.push({
          x: sub.x,
          y: sub.y,
          progress: 0,
          speed: 0.018 + Math.random() * 0.008,
          fromNodeId: "subscriber",
          toNodeId: "protocol",
          color: "#6a9bcc",
          size: 4 + Math.random() * 2,
          label: "100 USDC",
        });
      }, i * 60);
    }

    // After reaching engine, split
    setTimeout(() => {
      // Pulse at engine
      wavesRef.current.push({
        x: engine.x,
        y: engine.y,
        radius: 15,
        maxRadius: 80,
        color: "#d97757",
        opacity: 0.9,
      });

      // Stream 2: 98.5% to creator
      for (let i = 0; i < 7; i++) {
        setTimeout(() => {
          particlesRef.current.push({
            x: engine.x,
            y: engine.y,
            progress: 0,
            speed: 0.02 + Math.random() * 0.006,
            fromNodeId: "protocol",
            toNodeId: "creator",
            color: "#788c5d",
            size: 4 + Math.random() * 2,
            label: "98.5% USDC",
          });
        }, i * 50);
      }

      // Stream 3: 1.5% to treasury
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          particlesRef.current.push({
            x: engine.x,
            y: engine.y,
            progress: 0,
            speed: 0.022 + Math.random() * 0.005,
            fromNodeId: "protocol",
            toNodeId: "treasury",
            color: "#c9a07c",
            size: 3,
            label: "1.5% Fee",
          });
        }, i * 70);
      }

      // Stream 4: Mint credential up
      particlesRef.current.push({
        x: engine.x,
        y: engine.y,
        progress: 0,
        speed: 0.025,
        fromNodeId: "protocol",
        toNodeId: "credential",
        color: "#d97757",
        size: 5,
        label: "ERC-1155 Mint",
      });

      // Stream 5: Return pass to subscriber
      setTimeout(() => {
        particlesRef.current.push({
          x: cred.x,
          y: cred.y,
          progress: 0,
          speed: 0.016,
          fromNodeId: "credential",
          toNodeId: "subscriber",
          color: "#c9a07c",
          size: 4.5,
          label: "Access Pass",
        });
      }, 350);
    }, 600);

    setTimeout(() => {
      setActiveTx(null);
    }, 2800);
  }, [getNodes]);

  // Main Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = window.devicePixelRatio || 1;

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      const rect = containerRef.current.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const nodes = getNodes();

    // Ambient particles loop
    const ambientTimer = setInterval(() => {
      if (!isPlaying) return;
      // Ambient slow packets
      const rand = Math.random();
      if (rand < 0.4) {
        particlesRef.current.push({
          x: 0,
          y: 0,
          progress: 0,
          speed: 0.008 + Math.random() * 0.005,
          fromNodeId: "subscriber",
          toNodeId: "protocol",
          color: "#6a9bcc",
          size: 2.5,
        });
      } else if (rand < 0.7) {
        particlesRef.current.push({
          x: 0,
          y: 0,
          progress: 0,
          speed: 0.009 + Math.random() * 0.005,
          fromNodeId: "protocol",
          toNodeId: "creator",
          color: "#788c5d",
          size: 2.5,
        });
      } else {
        particlesRef.current.push({
          x: 0,
          y: 0,
          progress: 0,
          speed: 0.007 + Math.random() * 0.004,
          fromNodeId: "credential",
          toNodeId: "subscriber",
          color: "#c9a07c",
          size: 2.5,
        });
      }
    }, 700);

    // Canvas render loop
    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Coordinate scaling factor based on 1000x500 virtual size
      const scaleX = width / 1000;
      const scaleY = height / 500;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle geometric background grid (ancient architectural step pattern)
      ctx.strokeStyle = "rgba(232, 230, 220, 0.5)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw connection channels
      const connections: Array<{ from: string; to: string; style: string; label: string }> = [
        { from: "subscriber", to: "protocol", style: "#6a9bcc", label: "approve() + subscribe() · USDC" },
        { from: "protocol", to: "creator", style: "#788c5d", label: "safeTransferFrom() · 98.5% USDC" },
        { from: "protocol", to: "treasury", style: "#c9a07c", label: "platformFeeBps · 1.5%" },
        { from: "protocol", to: "credential", style: "#d97757", label: "_mint() ERC-1155" },
        { from: "credential", to: "subscriber", style: "#b0aea5", label: "Cryptographic Proof (hasAccess)" },
      ];

      // Render channels
      connections.forEach((conn) => {
        const fromNode = nodes.find((n) => n.id === conn.from);
        const toNode = nodes.find((n) => n.id === conn.to);
        if (!fromNode || !toNode) return;

        const x1 = fromNode.x * scaleX;
        const y1 = fromNode.y * scaleY;
        const x2 = toNode.x * scaleX;
        const y2 = toNode.y * scaleY;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);

        // Slight curvature for elegance
        let cx = (x1 + x2) / 2;
        let cy = (y1 + y2) / 2;
        if (conn.from === "credential" && conn.to === "subscriber") {
          cy -= 40 * scaleY; // curve upwards
        }

        ctx.quadraticCurveTo(cx, cy, x2, y2);
        ctx.strokeStyle = "rgba(176, 174, 165, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.restore();
      });

      // 2. Render pulse waves
      for (let i = wavesRef.current.length - 1; i >= 0; i--) {
        const wave = wavesRef.current[i];
        wave.radius += dt * 45;
        wave.opacity = Math.max(0, 1 - wave.radius / wave.maxRadius);

        ctx.save();
        ctx.beginPath();
        ctx.arc(wave.x * scaleX, wave.y * scaleY, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = wave.color;
        ctx.globalAlpha = wave.opacity * 0.7;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        if (wave.radius >= wave.maxRadius) {
          wavesRef.current.splice(i, 1);
        }
      }

      // 3. Render animated particles along quadratic curves
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.progress += p.speed;

        const fromNode = nodes.find((n) => n.id === p.fromNodeId);
        const toNode = nodes.find((n) => n.id === p.toNodeId);

        if (fromNode && toNode && p.progress <= 1) {
          const x1 = fromNode.x * scaleX;
          const y1 = fromNode.y * scaleY;
          const x2 = toNode.x * scaleX;
          const y2 = toNode.y * scaleY;

          let cx = (x1 + x2) / 2;
          let cy = (y1 + y2) / 2;
          if (p.fromNodeId === "credential" && p.toNodeId === "subscriber") {
            cy -= 40 * scaleY;
          }

          // Quadratic Bezier Formula: B(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
          const t = p.progress;
          const curX = Math.pow(1 - t, 2) * x1 + 2 * (1 - t) * t * cx + Math.pow(t, 2) * x2;
          const curY = Math.pow(1 - t, 2) * y1 + 2 * (1 - t) * t * cy + Math.pow(t, 2) * y2;

          ctx.save();
          // Glow effect
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 8;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(curX, curY, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Particle label if defined
          if (p.label && t > 0.15 && t < 0.85) {
            ctx.font = "600 10px monospace";
            ctx.fillStyle = "#191918";
            ctx.shadowBlur = 0;
            ctx.fillText(p.label, curX + 8, curY - 6);
          }
          ctx.restore();
        }

        if (p.progress >= 1) {
          particlesRef.current.splice(i, 1);
        }
      }

      // 4. Render Nodes
      nodes.forEach((node) => {
        const nx = node.x * scaleX;
        const ny = node.y * scaleY;
        const isSelected = selectedNode === node.id;
        const isHovered = hoveredNodeRef.current === node.id;

        ctx.save();

        // Outer halo / glow for active or selected node
        if (isSelected || isHovered) {
          ctx.beginPath();
          ctx.arc(nx, ny, 36, 0, Math.PI * 2);
          ctx.fillStyle = `${node.accent}18`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(nx, ny, 32, 0, Math.PI * 2);
          ctx.strokeStyle = node.accent;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.stroke();
        }

        // Base node circle
        ctx.beginPath();
        ctx.arc(nx, ny, 24, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = "rgba(25, 25, 24, 0.08)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 4;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(nx, ny, 24, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? node.accent : "#e8e6dc";
        ctx.lineWidth = isSelected ? 2.5 : 1.5;
        ctx.stroke();

        // Inner core
        ctx.beginPath();
        ctx.arc(nx, ny, 9, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node Title & Subtitle Labels
        ctx.font = "600 13px var(--font-anthropic-sans), sans-serif";
        ctx.fillStyle = "#191918";
        ctx.textAlign = "center";
        ctx.shadowBlur = 0;
        ctx.fillText(node.name, nx, ny + 44);

        ctx.font = "400 11px var(--font-anthropic-mono), monospace";
        ctx.fillStyle = "#6b6960";
        ctx.fillText(node.subname, nx, ny + 59);

        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    // Mouse events for node hover and click
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      mousePosRef.current = { x: mouseX, y: mouseY };

      const scaleX = (canvas.width / dpr) / 1000;
      const scaleY = (canvas.height / dpr) / 500;

      let found: string | null = null;
      for (const node of nodes) {
        const nx = node.x * scaleX;
        const ny = node.y * scaleY;
        const dist = Math.hypot(mouseX - nx, mouseY - ny);
        if (dist <= 30) {
          found = node.id;
          break;
        }
      }

      hoveredNodeRef.current = found;
      canvas.style.cursor = found ? "pointer" : "default";
    };

    const handleClick = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const scaleX = (canvas.width / dpr) / 1000;
      const scaleY = (canvas.height / dpr) / 500;

      for (const node of nodes) {
        const nx = node.x * scaleX;
        const ny = node.y * scaleY;
        const dist = Math.hypot(mouseX - nx, mouseY - ny);
        if (dist <= 30) {
          setSelectedNode(node.id);
          break;
        }
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      clearInterval(ambientTimer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [getNodes, isPlaying, selectedNode]);

  const activeNodeData = getNodes().find((n) => n.id === selectedNode);

  return (
    <div className="w-full bg-surface border border-border-subtle rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md">
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-terracotta animate-pulse" />
          <span className="font-mono text-xs font-semibold text-charcoal tracking-wide uppercase">
            Live Protocol Value Stream Simulator
          </span>
          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-cream text-dim">
            Polygon Mainnet (137)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => triggerTransaction()}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-charcoal text-parchment font-ui text-xs font-medium hover:bg-[#2b2a27] transition-colors shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 text-warm-gold" />
            Simulate 1-Click Subscribe
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1.5 rounded-lg border border-border-subtle hover:bg-cream text-charcoal transition-colors"
            title={isPlaying ? "Pause particle streams" : "Resume particle streams"}
          >
            {isPlaying ? <RotateCcw className="w-4 h-4 text-dim" /> : <Play className="w-4 h-4 text-terracotta" />}
          </button>
        </div>
      </div>

      {/* Main Canvas Stage */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/9] min-h-[360px] max-h-[520px] bg-parchment/60 rounded-xl overflow-hidden my-6 border border-border-subtle/80 flex items-center justify-center"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Legend Overlay (bottom left) */}
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-2 rounded-lg border border-border-subtle text-[11px] font-mono text-dim hidden sm:flex items-center gap-4 shadow-sm pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6a9bcc]" />
            <span>USDC (100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#788c5d]" />
            <span>Creator (98.5%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c9a07c]" />
            <span>Treasury (1.5%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97757]" />
            <span>ERC-1155 Pass</span>
          </div>
        </div>

        {/* Active Transaction Toast */}
        {activeTx && (
          <div className="absolute top-4 right-4 bg-charcoal text-parchment px-4 py-2 rounded-lg font-mono text-xs flex items-center gap-2 shadow-lg animate-fade-in border border-warm-gold/40">
            <Sparkles className="w-4 h-4 text-warm-gold animate-spin" />
            <span>Processing Atomic Block: {activeTx}</span>
          </div>
        )}
      </div>

      {/* Selected Node Technical Telemetry Drawer */}
      {activeNodeData && (
        <div className="bg-cream/50 rounded-xl p-4 sm:p-5 border border-border-subtle grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-border-subtle pb-3 md:pb-0 md:pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: activeNodeData.accent }} />
              <h4 className="font-display font-medium text-charcoal text-base">
                {activeNodeData.name}
              </h4>
            </div>
            <p className="font-mono text-xs text-dim truncate">{activeNodeData.details.address}</p>
          </div>

          <div className="md:col-span-2">
            <span className="font-ui text-[11px] uppercase tracking-wider text-text-muted block mb-0.5">
              Protocol Action & Invariant
            </span>
            <p className="font-body text-sm text-charcoal leading-snug">
              {activeNodeData.details.action}
            </p>
          </div>

          <div className="md:col-span-1 bg-white/70 p-3 rounded-lg border border-border-subtle">
            <span className="font-ui text-[10px] uppercase tracking-wider text-text-muted block mb-0.5">
              Execution Metric
            </span>
            <p className="font-mono text-xs text-charcoal font-medium">
              {activeNodeData.details.metrics}
            </p>
            <span className="font-mono text-[10px] text-terracotta mt-0.5 block">
              {activeNodeData.details.latency}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
