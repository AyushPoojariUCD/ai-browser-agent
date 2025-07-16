// src/components/Three/LightningCanvas.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Sparkles, OrbitControls } from "@react-three/drei";

const LightningCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 70 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[2, 2, 2]} intensity={1} color="#f97316" />
      <Sparkles count={100} scale={[5, 5, 5]} speed={1.5} size={2} />
    </Canvas>
  );
};

export default LightningCanvas;
