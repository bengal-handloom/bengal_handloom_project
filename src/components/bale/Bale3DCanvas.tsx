"use client";

import dynamic from "next/dynamic";

const Canvas = dynamic(
  () => import("@react-three/fiber").then((m) => m.Canvas),
  { ssr: false }
);

const Bale3DScene = dynamic(() => import("./Bale3DScene").then((m) => m.Bale3DScene), {
  ssr: false,
});

export function Bale3DCanvas() {
  return (
    <div className="h-full w-full max-w-lg aspect-square rounded-xl overflow-hidden bg-[#1A1A1A]">
      <Canvas
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="h-full w-full"
      >
        <Bale3DScene />
      </Canvas>
    </div>
  );
}