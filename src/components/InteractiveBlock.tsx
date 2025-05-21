import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { soundController } from "@/utils/soundController";
import { interactionTracker } from "@/utils/interactionTracker";
import GlitchButton from "./GlitchButton";
import GlitchText from "./GlitchText";

interface InteractiveBlockProps {
  id: string;
  title: string;
  children: React.ReactNode;
  easterEggId?: string;
  selfDestruct?: boolean;
  className?: string;
  onInteraction?: () => void;
}

const InteractiveBlock: React.FC<InteractiveBlockProps> = ({
  id,
  title,
  children,
  easterEggId,
  selfDestruct = false,
  className = "",
  onInteraction,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);

  useEffect(() => {
    // Check if this room should be destroyed based on previous interactions
    if (selfDestruct && interactionTracker.isRoomDestroyed(id)) {
      setIsDestroyed(true);
      setIsVisible(false);
    }

    // Mark room as visited
    interactionTracker.visitRoom(id);
  }, [id, selfDestruct]);

  const handleInteraction = () => {
    if (isDestroyed) return;

    // Track the interaction
    interactionTracker.trackInteraction(id, "primary");
    setHasInteracted(true);

    // Play sound
    soundController.play("click", { volume: 0.4 });

    // Check for easter egg
    if (easterEggId && interactionTracker.findEasterEgg(easterEggId)) {
      soundController.play("success", { volume: 0.5 });
    }

    // Self-destruct if needed
    if (selfDestruct) {
      setTimeout(() => {
        setIsVisible(false);
        interactionTracker.destroyRoom(id);
        setIsDestroyed(true);
      }, 5000);
    }

    if (onInteraction) onInteraction();
  };

  if (isDestroyed) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        className={`bg-[#2c2c2c] border border-[#2c2c2c] p-6 text-center ${className}`}
      >
        <div className="text-[#9b59b6] opacity-50 font-mono text-sm">
          [CONTENT DELETED]
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={`bg-black border border-[#9b59b6] p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <GlitchText
          text={title}
          className="text-[#39ff14] font-bold uppercase tracking-wider"
          intensity="low"
        />
        <div className="flex space-x-2">
          <div className="h-2 w-2 rounded-full bg-[#ff0033]"></div>
          <div className="h-2 w-2 rounded-full bg-[#9b59b6]"></div>
          <div className="h-2 w-2 rounded-full bg-[#39ff14]"></div>
        </div>
      </div>

      <div className="mb-4">{children}</div>

      {selfDestruct && hasInteracted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[#ff0033] text-xs font-mono mt-2"
        >
          [WARNING: CONTENT WILL SELF-DESTRUCT]
        </motion.div>
      )}

      <div className="mt-4 flex justify-end">
        <GlitchButton onClick={handleInteraction}>INTERACT</GlitchButton>
      </div>
    </motion.div>
  );
};

export default InteractiveBlock;
