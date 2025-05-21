import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: "low" | "medium" | "high";
  speed?: "slow" | "medium" | "fast";
  onGlitch?: () => void;
}

const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = "",
  intensity = "medium",
  speed = "medium",
  onGlitch,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  // Define glitch parameters based on intensity and speed
  const glitchChance = {
    low: 0.01,
    medium: 0.03,
    high: 0.08,
  }[intensity];

  const glitchInterval = {
    slow: 500,
    medium: 250,
    fast: 100,
  }[speed];

  const glitchDuration = {
    slow: 1500,
    medium: 800,
    fast: 400,
  }[speed];

  // Characters to use for glitch effect
  const glitchChars = '!@#$%^&*()_+-=[]{}|;:"<>,.?/\\`~░▒▓█▄▀■□▪▫';

  useEffect(() => {
    let intervalId: number;

    const startGlitching = () => {
      if (Math.random() < glitchChance) {
        setIsGlitching(true);
        if (onGlitch) onGlitch();

        let glitchCount = 0;
        const maxGlitches = 5;

        const glitchEffect = () => {
          if (glitchCount < maxGlitches) {
            const glitchedText = text
              .split("")
              .map((char) => {
                if (Math.random() < 0.3) {
                  return glitchChars[
                    Math.floor(Math.random() * glitchChars.length)
                  ];
                }
                return char;
              })
              .join("");

            setDisplayText(glitchedText);
            glitchCount++;
          } else {
            setDisplayText(text);
            setIsGlitching(false);
            clearInterval(glitchIntervalId);
          }
        };

        const glitchIntervalId = window.setInterval(glitchEffect, 100);

        setTimeout(() => {
          clearInterval(glitchIntervalId);
          setDisplayText(text);
          setIsGlitching(false);
        }, glitchDuration);
      }
    };

    intervalId = window.setInterval(startGlitching, glitchInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [text, glitchChance, glitchInterval, glitchDuration, onGlitch]);

  return (
    <motion.span
      className={`font-mono ${className}`}
      animate={{
        x: isGlitching ? [0, -2, 3, -1, 0] : 0,
        opacity: isGlitching ? [1, 0.8, 1, 0.9, 1] : 1,
      }}
      transition={{ duration: 0.2 }}
    >
      {displayText}
    </motion.span>
  );
};

export default GlitchText;
