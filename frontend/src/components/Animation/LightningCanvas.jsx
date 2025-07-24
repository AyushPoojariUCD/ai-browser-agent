import { Canvas } from "@react-three/fiber";
import { Sparkles, OrbitControls } from "@react-three/drei";
import { useTypewriter, Cursor } from "react-simple-typewriter";

const LightningCanvas = () => {
  const [text] = useTypewriter({
    words: ['“Go to Spotify and play Ed Sheeran”'],
    loop: false,
    typeSpeed: 100,
    deleteSpeed: 90,
    delaySpeed: 2500,
  });

  return (
    <div className="relative relative w-full h-full rounded-3xl p-[3px] bg-gradient-to-r from-orange-500 via-purple-600 to-pink-500 shadow-2xl">
      {/* Inner dark container */}
      <div className="relative relative w-full h-full rounded-3xl bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#0f0f0f] overflow-hidden">
        {/* 3D Sparkle Canvas */}
        <Canvas camera={{ position: [0, 0, 5], fov: 70 }} className="rounded-3xl h-[500px] w-full">
          <ambientLight intensity={0.5} />
          <pointLight position={[2, 2, 2]} intensity={1.5} color="#FFD700" />
          <Sparkles
            count={100}
            scale={[5, 5, 5]}
            speed={1.2}
            size={2.5}
            color="#FFD700" // gold stars
          />
          <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={false} />
        </Canvas>

        {/* Overlayed Text */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 text-white pointer-events-none">
          <h1 className="text-4xl sm:text-5xl md:text-5xl font-bold drop-shadow-md">
            AI Browser Automation
          </h1>
          <p className="mt-4 text-lg sm:text-xl max-w-xl text-white/80">
            Give natural instructions like{" "}
            <span className="italic font-medium text-white">
              {text}
              <Cursor cursorStyle="|" />
            </span>{" "}
            and watch the agent automate your browser.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LightningCanvas;
