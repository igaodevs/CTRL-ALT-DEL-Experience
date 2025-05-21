import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GlitchText from "@/components/GlitchText";
import GlitchButton from "@/components/GlitchButton";
import SecretCounter from "@/components/SecretCounter";
import { soundController } from "@/utils/soundController";
import { interactionTracker } from "@/utils/interactionTracker";

const ResetScreen: React.FC = () => {
  const navigate = useNavigate();
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [foundEggs, setFoundEggs] = useState(0);
  const [totalEggs, setTotalEggs] = useState(7);

  useEffect(() => {
    // Initialize
    soundController.loadSounds();
    interactionTracker.init();

    // Get easter egg stats
    const eggs = interactionTracker.getFoundEasterEggs();
    setFoundEggs(eggs.length);
    setTotalEggs(interactionTracker.getTotalEasterEggs());

    // Find the final easter egg
    interactionTracker.findEasterEgg("egg7");

    // Transition to final message after delay
    const timer = setTimeout(() => {
      setShowFinalMessage(true);
      soundController.play("success", { volume: 0.3 });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleReset = () => {
    soundController.play("transition", { volume: 0.5 });
    interactionTracker.resetAllProgress();

    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleExplore = () => {
    // This would typically link to the actual project/product
    soundController.play("success", { volume: 0.5 });

    // For demo purposes, just go back to home
    setTimeout(() => {
      window.location.href = "https://github.com/TempoLabsAI";
    }, 1000);
  };

  return (
    <div className="min-h-screen w-screen bg-white flex flex-col items-center justify-center p-4 transition-all duration-1000">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="max-w-xl w-full"
      >
        {!showFinalMessage ? (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
            >
              <div className="mb-8">
                <SecretCounter className="mx-auto" />
              </div>

              <div className="text-black text-xl mb-4">
                <GlitchText
                  text={`You found ${foundEggs} out of ${totalEggs} secrets`}
                  intensity="low"
                  className="font-bold"
                />
              </div>

              <div className="h-px w-full bg-black my-8 opacity-20" />

              <div className="text-black opacity-70 mb-8">
                <p>System diagnostics complete.</p>
                <p>Preparing final assessment...</p>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-8 text-black">
              <GlitchText
                text="Agora você está pronto para algo real."
                intensity="low"
              />
            </h1>

            <div className="h-px w-full bg-black my-8 opacity-20" />

            <div className="prose text-black opacity-80 mb-12 max-w-md mx-auto">
              <p>A experiência digital acabou, mas a jornada apenas começou.</p>
              <p className="mt-4">
                Você pode reiniciar a simulação ou explorar o novo mundo que
                aguarda.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <GlitchButton
                variant="outline"
                onClick={handleReset}
                className="border-black text-black"
              >
                REINICIAR SIMULAÇÃO
              </GlitchButton>

              <GlitchButton
                onClick={handleExplore}
                className="bg-black text-white border-none"
              >
                EXPLORAR O NOVO MUNDO
              </GlitchButton>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetScreen;
