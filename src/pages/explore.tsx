import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GlitchText from "@/components/GlitchText";
import GlitchButton from "@/components/GlitchButton";
import InteractiveBlock from "@/components/InteractiveBlock";
import SecretCounter from "@/components/SecretCounter";
import CustomCursor from "@/components/CustomCursor";
import MatrixRain from "@/components/MatrixRain";
import { soundController } from "@/utils/soundController";
import { interactionTracker } from "@/utils/interactionTracker";

const ExplorationRoom: React.FC = () => {
  const navigate = useNavigate();
  const [currentRoom, setCurrentRoom] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Game state for mini-game
  const [gameActive, setGameActive] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameTimeLeft, setGameTimeLeft] = useState(15);

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

  // Handle scroll navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isTransitioning || gameActive) return;

      if (e.deltaY > 0 && currentRoom < 7) {
        navigateToRoom(currentRoom + 1);
      } else if (e.deltaY < 0 && currentRoom > 0) {
        navigateToRoom(currentRoom - 1);
      }
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [currentRoom, isTransitioning, gameActive]);

  // Handle key navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning || gameActive) return;

      if (e.key === "ArrowDown" && currentRoom < 7) {
        navigateToRoom(currentRoom + 1);
      } else if (e.key === "ArrowUp" && currentRoom > 0) {
        navigateToRoom(currentRoom - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentRoom, isTransitioning, gameActive]);

  // Game timer
  useEffect(() => {
    if (!gameActive) return;

    const gameInterval = setInterval(() => {
      setGameTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(gameInterval);
          setGameActive(false);

          // Award easter egg if score is high enough
          if (gameScore >= 5) {
            interactionTracker.findEasterEgg("egg3");
            soundController.play("success", { volume: 0.5 });
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(gameInterval);
  }, [gameActive, gameScore]);

  const navigateToRoom = (roomIndex: number) => {
    if (roomIndex === currentRoom || isTransitioning) return;

    setIsTransitioning(true);
    soundController.play("transition", { volume: 0.3 });

    setTimeout(() => {
      setCurrentRoom(roomIndex);
      setIsTransitioning(false);
    }, 500);
  };

  const handleGameBubbleClick = () => {
    if (!gameActive) return;

    setGameScore((prev) => prev + 1);
    soundController.play("click", { volume: 0.2 });
  };

  const startGame = () => {
    setGameActive(true);
    setGameScore(0);
    setGameTimeLeft(15);
    soundController.play("success", { volume: 0.3 });
  };

  const goToResetPage = () => {
    soundController.play("transition", { volume: 0.5 });

    setTimeout(() => {
      navigate("/reset");
    }, 1000);
  };

  // Room content definitions
  const rooms = [
    // Room 1: Audio Mystery
    <InteractiveBlock
      key="audio"
      id="audio"
      title="Audio Transmission"
      easterEggId="egg2"
      selfDestruct={true}
      className="max-w-xl mx-auto"
      onInteraction={() => soundController.play("glitch", { volume: 0.5 })}
    >
      <div className="text-white mb-4">
        <GlitchText
          text="A message has been intercepted. Listen before it disappears forever."
          intensity="low"
        />
      </div>

      <div className="bg-[#2c2c2c] p-4 flex items-center justify-center h-32">
        <div className="w-full">
          <div className="flex justify-center items-center space-x-2">
            <div className="w-1 h-8 bg-[#39ff14] animate-pulse"></div>
            <div className="w-1 h-16 bg-[#39ff14] animate-pulse"></div>
            <div className="w-1 h-12 bg-[#39ff14] animate-pulse"></div>
            <div className="w-1 h-20 bg-[#39ff14] animate-pulse"></div>
            <div className="w-1 h-10 bg-[#39ff14] animate-pulse"></div>
            <div className="w-1 h-14 bg-[#39ff14] animate-pulse"></div>
            <div className="w-1 h-6 bg-[#39ff14] animate-pulse"></div>
          </div>
        </div>
      </div>
    </InteractiveBlock>,

    // Room 2: Surveillance
    <InteractiveBlock
      key="surveillance"
      id="surveillance"
      title="Surveillance Feed"
      className="max-w-xl mx-auto"
    >
      <div className="text-white mb-4">
        <GlitchText
          text="You are being watched. Your data is being collected."
          intensity="medium"
        />
      </div>

      <div className="bg-[#2c2c2c] p-4 relative h-48 overflow-hidden">
        <div className="absolute top-2 right-2 flex items-center">
          <div className="h-2 w-2 rounded-full bg-[#ff0033] animate-pulse mr-2"></div>
          <span className="text-xs text-[#ff0033]">REC</span>
        </div>

        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-32 h-32 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-2">
            <div className="text-[#9b59b6] text-4xl">?</div>
          </div>
          <div className="text-xs text-[#9b59b6]">
            FACIAL RECOGNITION ACTIVE
          </div>
        </div>
      </div>
    </InteractiveBlock>,

    // Room 3: One-time Button
    <InteractiveBlock
      key="button"
      id="button"
      title="System Override"
      easterEggId="egg4"
      selfDestruct={true}
      className="max-w-xl mx-auto"
    >
      <div className="text-white mb-4">
        <GlitchText
          text="Click only once. System will respond accordingly."
          intensity="high"
        />
      </div>

      <div className="bg-[#2c2c2c] p-8 flex items-center justify-center">
        <GlitchButton
          variant="destructive"
          glitchIntensity="high"
          className="text-xl px-8 py-4"
        >
          EXECUTE
        </GlitchButton>
      </div>
    </InteractiveBlock>,

    // Room 4: Mini Game
    <InteractiveBlock
      key="game"
      id="game"
      title="Neural Training"
      easterEggId="egg3"
      className="max-w-xl mx-auto"
      onInteraction={startGame}
    >
      <div className="text-white mb-4">
        <GlitchText
          text="Test your reflexes. Pop 5 glitches in 15 seconds to unlock hidden data."
          intensity="medium"
        />
      </div>

      <div className="bg-[#2c2c2c] p-4 h-64 relative overflow-hidden">
        {gameActive ? (
          <>
            <div className="absolute top-2 right-2 text-xs text-[#39ff14]">
              Time: {gameTimeLeft}s | Score: {gameScore}/5
            </div>

            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-8 h-8 bg-[#9b59b6] rounded-full cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: Math.random() * 0.8 + 0.2,
                  x: Math.random() * 400,
                  y: Math.random() * 200,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                onClick={handleGameBubbleClick}
              />
            ))}
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-[#39ff14] mb-2">
                {gameScore >= 5 ? "ACCESS GRANTED" : "READY TO BEGIN"}
              </div>
              {gameScore >= 5 && (
                <div className="text-[#9b59b6] text-sm mb-4">
                  Neural pattern recognized. Secret unlocked.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </InteractiveBlock>,

    // Room 5: Secret Counter
    <div key="counter" className="max-w-xl mx-auto">
      <SecretCounter className="w-full" />
    </div>,

    // Room 6: Fake Stream
    <InteractiveBlock
      key="stream"
      id="stream"
      title="Live Feed"
      easterEggId="egg5"
      className="max-w-xl mx-auto"
    >
      <div className="text-white mb-4">
        <GlitchText
          text="Thousands of users are trapped in digital loops. You are watching them right now."
          intensity="medium"
        />
      </div>

      <div className="bg-[#2c2c2c] p-2 h-48 overflow-hidden">
        <div className="grid grid-cols-3 gap-2 h-full">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-black relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url(https://api.dicebear.com/7.x/avataaars/svg?seed=user${i})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "grayscale(1)",
                }}
              />
              <div className="absolute bottom-1 left-1 text-[#39ff14] text-xs">
                user_{Math.floor(Math.random() * 10000)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </InteractiveBlock>,

    // Room 7: Matrix
    <InteractiveBlock
      key="matrix"
      id="matrix"
      title="System Core"
      easterEggId="egg6"
      className="max-w-xl mx-auto relative"
    >
      <div className="text-white mb-4">
        <GlitchText
          text="The internet needs to restart. You have the power to initiate the sequence."
          intensity="high"
        />
      </div>

      <div className="relative">
        <MatrixRain className="!absolute inset-0" />

        <div className="bg-black bg-opacity-50 p-8 relative z-10 flex flex-col items-center">
          <GlitchText
            text="SYSTEM CORRUPTION AT 98.2%"
            className="text-[#ff0033] mb-4 text-center"
            intensity="high"
          />

          <GlitchButton
            onClick={() => setShowResetPrompt(true)}
            glitchIntensity="high"
          >
            INITIATE RESET
          </GlitchButton>
        </div>
      </div>
    </InteractiveBlock>,

    // Room 8: Reset Confirmation
    <div
      key="reset-confirm"
      className="max-w-xl mx-auto bg-black border border-[#ff0033] p-6"
    >
      <div className="text-center">
        <GlitchText
          text="WARNING: SYSTEM RESET IMMINENT"
          className="text-[#ff0033] text-xl mb-6"
          intensity="high"
        />

        <div className="text-white mb-8">
          <p>All corrupted data will be purged.</p>
          <p className="mt-2">Are you ready to see what's on the other side?</p>
        </div>

        <div className="flex justify-center space-x-4">
          <GlitchButton variant="outline" onClick={() => setCurrentRoom(6)}>
            CANCEL
          </GlitchButton>

          <GlitchButton
            variant="destructive"
            onClick={goToResetPage}
            glitchIntensity="high"
          >
            CONFIRM RESET
          </GlitchButton>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="bg-black text-white font-mono min-h-screen w-screen overflow-hidden relative">
      <CustomCursor variant="terminal" />

      {/* Navigation indicators */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-20">
        <div className="flex flex-col space-y-2">
          {rooms.slice(0, 7).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full cursor-pointer ${currentRoom === i ? "bg-[#39ff14]" : "bg-[#9b59b6] opacity-50"}`}
              onClick={() => navigateToRoom(i)}
            />
          ))}
        </div>
      </div>

      {/* Room container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRoom}
          ref={containerRef}
          className="min-h-screen w-screen flex items-center justify-center p-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          {showResetPrompt ? rooms[7] : rooms[currentRoom]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ExplorationRoom;
