import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HackerMap from "@/components/HackerMap";
import GlitchText from "@/components/GlitchText";
import GlitchButton from "@/components/GlitchButton";
import CustomCursor from "@/components/CustomCursor";
import { soundController } from "@/utils/soundController";

interface SimulationStats {
  mitigated: number;
  timeElapsed: number;
}

const HackerMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [stats, setStats] = useState<SimulationStats | null>(null);

  const handleSimulationComplete = (simulationStats: SimulationStats) => {
    setStats(simulationStats);
    setShowResults(true);
    soundController.play("success", { volume: 0.3 });
  };

  const handleRetry = () => {
    setShowResults(false);
    soundController.play("transition", { volume: 0.3 });
  };

  const handleExplore = () => {
    soundController.play("transition", { volume: 0.3 });
    setTimeout(() => {
      navigate("/explore");
    }, 500);
  };

  return (
    <div className="bg-black text-white font-mono min-h-screen w-screen overflow-hidden relative">
      <CustomCursor variant="terminal" />

      {!showResults ? (
        <HackerMap
          onComplete={handleSimulationComplete}
          initialCountdown={60}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen w-screen flex items-center justify-center p-4"
        >
          <div className="max-w-xl w-full bg-black border border-[#39ff14] p-8">
            <GlitchText
              text="SIMULATION RESULTS"
              className="text-[#39ff14] text-3xl mb-6 text-center"
              intensity="medium"
            />

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border border-[#39ff14] p-4 text-center">
                <div className="text-[#9b59b6] text-sm mb-2">
                  THREATS MITIGATED
                </div>
                <div className="text-[#39ff14] text-4xl">
                  {stats?.mitigated || 0}
                </div>
              </div>

              <div className="border border-[#39ff14] p-4 text-center">
                <div className="text-[#9b59b6] text-sm mb-2">RESPONSE TIME</div>
                <div className="text-[#39ff14] text-4xl">
                  {stats?.timeElapsed || 0}s
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <div className="text-[#9b59b6] mb-2">PERFORMANCE ASSESSMENT</div>
              <div className="text-white">
                {stats && stats.mitigated > 10
                  ? "EXCEPTIONAL - Security expertise confirmed"
                  : stats && stats.mitigated > 5
                    ? "SATISFACTORY - Basic security protocols followed"
                    : "NEEDS IMPROVEMENT - Additional training recommended"}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <GlitchButton
                onClick={handleRetry}
                variant="outline"
                className="border-[#39ff14] text-[#39ff14]"
              >
                RUN SIMULATION AGAIN
              </GlitchButton>

              <GlitchButton onClick={handleExplore} glitchIntensity="medium">
                CONTINUE EXPLORATION
              </GlitchButton>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default HackerMapPage;
