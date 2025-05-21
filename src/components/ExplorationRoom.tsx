import React from "react";
import { useNavigate } from "react-router-dom";
import GlitchButton from "./GlitchButton";

const ExplorationRoom = () => {
  const navigate = useNavigate();

  const goToExplore = () => {
    navigate("/explore");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white font-mono p-4">
      <h1 className="text-2xl mb-6 text-[#39ff14]">CTRL//ALT//DEL</h1>
      <p className="mb-8 text-center max-w-md">
        An immersive digital experience with glitch aesthetics, non-linear
        storytelling, and sensory engagement.
      </p>
      <GlitchButton onClick={goToExplore}>ENTER EXPERIENCE</GlitchButton>
    </div>
  );
};

export default ExplorationRoom;
