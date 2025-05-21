import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { interactionTracker } from "@/utils/interactionTracker";
import { soundController } from "@/utils/soundController";

interface SecretCounterProps {
  className?: string;
  onComplete?: () => void;
}

const SecretCounter: React.FC<SecretCounterProps> = ({
  className = "",
  onComplete,
}) => {
  const [found, setFound] = useState(0);
  const [total, setTotal] = useState(7);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const foundEggs = interactionTracker.getFoundEasterEggs();
    setFound(foundEggs.length);
    setTotal(interactionTracker.getTotalEasterEggs());

    // Check if all secrets are found
    if (
      foundEggs.length === interactionTracker.getTotalEasterEggs() &&
      onComplete
    ) {
      onComplete();
    }

    // Trigger glitch effect occasionally
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.2) {
        setIsGlitching(true);
        soundController.play("glitch", { volume: 0.2 });

        setTimeout(() => {
          setIsGlitching(false);
        }, 500);
      }
    }, 5000);

    return () => clearInterval(glitchInterval);
  }, [onComplete]);

  return (
    <motion.div
      className={`font-mono text-[#39ff14] bg-black border border-[#9b59b6] p-4 ${className}`}
      animate={
        isGlitching
          ? {
              x: [0, -2, 3, -1, 0],
              filter: ["none", "brightness(1.5) contrast(2)", "none"],
            }
          : {}
      }
    >
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider">System Access</div>
        <div className="h-2 w-2 rounded-full bg-[#39ff14] animate-pulse"></div>
      </div>

      <div className="mt-2 text-lg">
        <span className="mr-1">Secrets found:</span>
        <motion.span
          key={found}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold"
        >
          {found}/{total}
        </motion.span>
      </div>

      <div className="mt-2 h-1 bg-[#2c2c2c] w-full">
        <motion.div
          className="h-full bg-[#9b59b6]"
          initial={{ width: 0 }}
          animate={{ width: `${(found / total) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {found > 0 && (
        <motion.div
          className="mt-3 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {found === total ? (
            <span className="text-[#ff0033]">FULL ACCESS GRANTED</span>
          ) : (
            <span>Continue exploration for full access</span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default SecretCounter;
