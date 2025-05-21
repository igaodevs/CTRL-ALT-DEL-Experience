import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { soundController } from "@/utils/soundController";

interface GlitchButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "glitch";
  glitchIntensity?: "low" | "medium" | "high";
  onGlitch?: () => void;
}

const GlitchButton: React.FC<GlitchButtonProps> = ({
  children,
  variant = "glitch",
  glitchIntensity = "medium",
  onGlitch,
  onClick,
  className = "",
  ...props
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  const handleMouseEnter = () => {
    soundController.play("hover", { volume: 0.3 });
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isGlitching) {
      setIsGlitching(true);
      soundController.play("click", { volume: 0.5 });

      if (onGlitch) onGlitch();

      setTimeout(() => {
        setIsGlitching(false);
        if (onClick) onClick(e);
      }, 500);
    }
  };

  // Define glitch animation based on intensity
  const glitchAnimation = {
    low: {
      x: [0, -2, 2, -1, 0],
      y: [0, 1, -1, 0],
    },
    medium: {
      x: [0, -3, 3, -2, 0],
      y: [0, 2, -2, 1, 0],
      filter: [
        "none",
        "brightness(1.2) contrast(1.5)",
        "none",
        "brightness(0.8) contrast(1.2)",
        "none",
      ],
    },
    high: {
      x: [0, -5, 5, -3, 0],
      y: [0, 3, -3, 2, 0],
      filter: [
        "none",
        "brightness(1.5) contrast(2) hue-rotate(10deg)",
        "none",
        "brightness(0.7) contrast(1.5) hue-rotate(-10deg)",
        "none",
      ],
      scale: [1, 1.02, 0.98, 1.01, 1],
    },
  }[glitchIntensity];

  // Custom class for glitch variant
  const glitchClass =
    variant === "glitch"
      ? "bg-black text-[#39ff14] border border-[#9b59b6] hover:bg-[#2c2c2c] hover:text-white hover:border-[#39ff14] transition-all"
      : "";

  return (
    <motion.div
      animate={isGlitching ? glitchAnimation : {}}
      transition={{ duration: 0.2, repeat: isGlitching ? 2 : 0 }}
      className="relative inline-block"
    >
      {isGlitching && (
        <motion.div
          className="absolute inset-0 bg-[#9b59b6] opacity-30"
          animate={{ opacity: [0.3, 0, 0.5, 0] }}
          transition={{ duration: 0.3 }}
        />
      )}
      <Button
        variant={variant === "glitch" ? "default" : variant}
        className={`font-mono relative ${glitchClass} ${className}`}
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        {...props}
      >
        {isGlitching ? (
          <span className="relative">
            <span className="absolute top-0 left-[1px] text-[#9b59b6] opacity-70">
              {children}
            </span>
            <span className="absolute top-0 left-[-1px] text-[#39ff14] opacity-70">
              {children}
            </span>
            <span className="invisible">{children}</span>
          </span>
        ) : (
          children
        )}
      </Button>
    </motion.div>
  );
};

export default GlitchButton;
