import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GlitchText from "@/components/GlitchText";
import GlitchButton from "@/components/GlitchButton";
import CustomCursor from "@/components/CustomCursor";
import { soundController } from "@/utils/soundController";
import { interactionTracker } from "@/utils/interactionTracker";

const BootScreen: React.FC = () => {
  const navigate = useNavigate();
  const [bootStage, setBootStage] = useState(0);
  const [showCtrlAltDel, setShowCtrlAltDel] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Record<string, boolean>>({
    Control: false,
    Alt: false,
    Delete: false,
  });
  const [bootText, setBootText] = useState<string[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Initialize sound controller
  useEffect(() => {
    soundController.loadSounds();
    interactionTracker.init();

    // Play ambient sound
    const ambientSound = soundController.play("ambient", {
      volume: 0.2,
      loop: true,
    });

    return () => {
      if (ambientSound) ambientSound.stop();
    };
  }, []);

  // Boot sequence
  useEffect(() => {
    const bootSequence = [
      "Initializing system...",
      "Loading kernel modules...",
      "ERROR: Memory corruption detected",
      "Attempting recovery...",
      "WARNING: System integrity compromised",
      "Loading emergency protocols...",
      "ERROR: Critical system failure",
      "Initiating emergency boot sequence...",
      "ALERT: Unauthorized access detected",
      "System locked. Press CTRL+ALT+DEL to continue",
    ];

    let timeout: number;

    if (bootStage < bootSequence.length) {
      timeout = window.setTimeout(
        () => {
          setBootText((prev) => [...prev, bootSequence[bootStage]]);
          setBootStage((prev) => prev + 1);

          // Play glitch sound at specific points
          if (bootStage === 2 || bootStage === 4 || bootStage === 6) {
            soundController.play("error", { volume: 0.4 });
          } else {
            soundController.play("click", { volume: 0.2 });
          }

          // Update loading progress
          setLoadingProgress(((bootStage + 1) / bootSequence.length) * 100);

          // Show CTRL+ALT+DEL prompt at the end
          if (bootStage === bootSequence.length - 1) {
            setShowCtrlAltDel(true);
          }
        },
        bootStage === 0 ? 1000 : Math.random() * 1000 + 500,
      );
    }

    return () => clearTimeout(timeout);
  }, [bootStage]);

  // Handle key presses for CTRL+ALT+DEL
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.key === "Alt" || e.key === "Delete") {
        setKeysPressed((prev) => ({ ...prev, [e.key]: true }));
        soundController.play("hover", { volume: 0.3 });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Control" || e.key === "Alt" || e.key === "Delete") {
        setKeysPressed((prev) => ({ ...prev, [e.key]: false }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Check if all keys are pressed
  useEffect(() => {
    if (
      keysPressed.Control &&
      keysPressed.Alt &&
      keysPressed.Delete &&
      showCtrlAltDel
    ) {
      handleEnterSystem();
    }
  }, [keysPressed, showCtrlAltDel]);

  const handleEnterSystem = () => {
    soundController.play("transition", { volume: 0.5 });

    // Find easter egg if user used keyboard shortcut
    if (keysPressed.Control && keysPressed.Alt && keysPressed.Delete) {
      interactionTracker.findEasterEgg("egg1");
    }

    // Navigate to explore page after transition effect
    setTimeout(() => {
      navigate("/explore");
    }, 1000);
  };

  return (
    <div className="bg-black text-[#39ff14] font-mono h-screen w-screen overflow-hidden flex flex-col justify-center items-center relative">
      <CustomCursor />

      {/* Background static/noise effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-white"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-2xl p-8">
        {/* Boot text */}
        <div className="mb-8">
          {bootText.map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-2 ${text.includes("ERROR") ? "text-[#ff0033]" : text.includes("WARNING") || text.includes("ALERT") ? "text-[#9b59b6]" : ""}`}
            >
              <GlitchText
                text={`> ${text}`}
                intensity={
                  text.includes("ERROR")
                    ? "high"
                    : text.includes("WARNING")
                      ? "medium"
                      : "low"
                }
              />
            </motion.div>
          ))}
        </div>

        {/* Loading bar */}
        <div className="w-full h-2 bg-[#2c2c2c] mb-6">
          <motion.div
            className="h-full bg-[#39ff14]"
            initial={{ width: 0 }}
            animate={{ width: `${loadingProgress}%` }}
          />
        </div>

        {/* CTRL+ALT+DEL prompt */}
        {showCtrlAltDel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-8"
          >
            <div className="mb-6">
              <GlitchText
                text="CTRL//ALT//DEL to begin"
                className="text-2xl md:text-4xl font-bold"
                intensity="medium"
                speed="medium"
              />
            </div>

            <div className="flex justify-center space-x-4 mt-4">
              <div
                className={`border ${keysPressed.Control ? "border-[#39ff14] bg-[#39ff14] bg-opacity-20" : "border-[#9b59b6]"} px-4 py-2`}
              >
                CTRL
              </div>
              <div
                className={`border ${keysPressed.Alt ? "border-[#39ff14] bg-[#39ff14] bg-opacity-20" : "border-[#9b59b6]"} px-4 py-2`}
              >
                ALT
              </div>
              <div
                className={`border ${keysPressed.Delete ? "border-[#39ff14] bg-[#39ff14] bg-opacity-20" : "border-[#9b59b6]"} px-4 py-2`}
              >
                DEL
              </div>
            </div>

            <div className="mt-8">
              <GlitchButton onClick={handleEnterSystem}>
                FORCE ENTRY
              </GlitchButton>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BootScreen;
