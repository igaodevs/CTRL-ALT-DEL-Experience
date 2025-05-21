import React, { useEffect, useRef } from "react";

interface MatrixRainProps {
  className?: string;
  speed?: number;
  density?: number;
  color?: string;
}

const MatrixRain: React.FC<MatrixRainProps> = ({
  className = "",
  speed = 1,
  density = 1,
  color = "#39ff14",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resizeObserver = new ResizeObserver(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    resizeObserver.observe(document.body);

    // Matrix characters
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$&+,:;=?@#|<>^*()%!-_{}[]~`\\/"'.split(
        "",
      );

    // Add some special characters
    chars.push("░", "▒", "▓", "█", "▄", "▀", "■", "□", "▪", "▫");

    // Columns for the rain
    const fontSize = 14;
    const columns = Math.floor((canvas.width / fontSize) * density);

    // Array to track the y position of each drop
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height);
    }

    // Drawing the characters
    const draw = () => {
      // Black semi-transparent background to create fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      // Loop over each drop
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];

        // x coordinate of the drop
        const x = i * fontSize;
        // y coordinate of the drop
        const y = drops[i] * fontSize;

        // Draw the character
        ctx.fillText(char, x, y);

        // Randomly reset some drops to the top
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move the drop down
        drops[i] += speed * 0.1;
      }
    };

    const interval = setInterval(draw, 33); // ~30fps

    return () => {
      clearInterval(interval);
      resizeObserver.disconnect();
    };
  }, [speed, density, color]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 w-full h-full ${className}`}
      style={{ pointerEvents: "none" }}
    />
  );
};

export default MatrixRain;
