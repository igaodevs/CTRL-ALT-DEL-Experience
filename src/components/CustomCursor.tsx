import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CustomCursorProps {
  variant?: "default" | "terminal" | "glitch";
}

const CustomCursor: React.FC<CustomCursorProps> = ({
  variant = "terminal",
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    // Hide the default cursor
    document.body.style.cursor = "none";

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setHidden(false);
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    // Occasionally trigger glitch effect
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 3000);

    // Hide cursor when it leaves the window
    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.body.style.cursor = "auto";
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      clearInterval(glitchInterval);
    };
  }, []);

  // Different cursor styles based on variant
  const getCursorContent = () => {
    switch (variant) {
      case "terminal":
        return (
          <>
            <div className="h-5 w-3 bg-[#39ff14] opacity-70"></div>
            {clicked && (
              <div className="absolute top-0 left-0 h-5 w-5 rounded-full bg-[#39ff14] opacity-20"></div>
            )}
          </>
        );

      case "glitch":
        return (
          <>
            <div className="h-5 w-3 bg-[#9b59b6] opacity-70"></div>
            <div className="absolute top-[-1px] left-[1px] h-5 w-3 bg-[#39ff14] opacity-50"></div>
            {clicked && (
              <div className="absolute top-0 left-0 h-6 w-6 rounded-full bg-[#ff0033] opacity-20"></div>
            )}
          </>
        );

      default:
        return (
          <div className="h-5 w-5 rounded-full border-2 border-white flex items-center justify-center">
            {clicked && <div className="h-2 w-2 rounded-full bg-white"></div>}
          </div>
        );
    }
  };

  if (hidden) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference"
      style={{
        x: position.x - 2,
        y: position.y - 2,
      }}
      animate={
        isGlitching
          ? {
              x: [position.x - 2, position.x + 2, position.x - 4, position.x],
              y: [position.y - 2, position.y + 2, position.y - 1, position.y],
            }
          : {}
      }
      transition={{ duration: 0.1 }}
    >
      {getCursorContent()}
    </motion.div>
  );
};

export default CustomCursor;
