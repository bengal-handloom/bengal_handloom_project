"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useBaleStore } from "@/stores/useBaleStore";

const METERS_PER_PIECE = 50;
const CLOTH_HEIGHT = 0.08;
const PALLET_HEIGHT = 0.3;

function WoodenPallet() {
  return (
    <group position={[0, -0.5, 0]}>
      <mesh position={[0, PALLET_HEIGHT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, PALLET_HEIGHT, 0.8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} metalness={0.1} />
      </mesh>
    </group>
  );
}

function ClothPiece({
  index,
  color,
  delay = 0,
}: {
  index: number;
  color: string;
  delay?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const yBase = PALLET_HEIGHT + index * CLOTH_HEIGHT;

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime - delay;
    const drop = t < 0.6 ? 1 - Math.pow(1 - t / 0.6, 2) : 1;
    ref.current.position.y = yBase + (1 - drop) * 0.5;
  });

  return (
    <mesh ref={ref} position={[0, yBase, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.9, CLOTH_HEIGHT, 0.6]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
    </mesh>
  );
}

function hexFromImageUrl(url: string, index: number): string {
  const hues = [0.12, 0.55, 0.85, 0.33, 0.07];
  const h = hues[index % hues.length];
  const s = 0.4;
  const l = 0.35;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 1 / 6) { r = c; g = x; } else if (h < 2 / 6) { r = x; g = c; } else if (h < 3 / 6) { g = c; b = x; } else if (h < 4 / 6) { g = x; b = c; } else if (h < 5 / 6) { r = x; b = c; } else { r = c; b = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function Bale3DScene() {
  const lines = useBaleStore((s) => s.lines);
  const pieceList = useMemo(() => {
    const out: { index: number; color: string; delay: number }[] = [];
    let idx = 0;
    lines.forEach((line, lineIdx) => {
      const count = Math.floor(line.meters / METERS_PER_PIECE);
      const color = hexFromImageUrl(
      line.fabric.imageSmallUrl || line.fabric.imageLargeUrl,
        lineIdx
      );      for (let i = 0; i < count; i++) {
        out.push({ index: idx, color, delay: lineIdx * 0.2 + i * 0.1 });
        idx++;
      }
    });
    return out;
  }, [lines]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <pointLight position={[-3, 4, 2]} intensity={0.5} />
      <WoodenPallet />
      {pieceList.map((p, i) => (
        <ClothPiece key={i} index={p.index} color={p.color} delay={p.delay} />
      ))}
      <OrbitControls enableDamping dampingFactor={0.05} />
    </>
  );
}