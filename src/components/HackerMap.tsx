import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import GlitchText from "./GlitchText";
import GlitchButton from "./GlitchButton";
import { soundController } from "@/utils/soundController";

// Mapbox token - replace with your own from mapbox.com
mapboxgl.accessToken =
  "pk.eyJ1IjoidGVtcG9sYWJzYWkiLCJhIjoiY2x3ZGJtZnRrMGJvMzJrcGFtcnJxZnRwZCJ9.Oo6Kz1XPrjVbcBo-FMlXcQ";

interface AttackPoint {
  id: string;
  lngLat: [number, number];
  status: "active" | "mitigated";
  origin: string;
  ip: string;
}

interface HackerMapProps {
  onComplete?: (stats: { mitigated: number; timeElapsed: number }) => void;
  initialCountdown?: number;
}

const MESSAGES = [
  "INTRUSION DETECTED!",
  "FIREWALL BREACH",
  "TRACEBACK INITIATED",
  "SECURITY COMPROMISED",
  "MALICIOUS PAYLOAD DETECTED",
  "ENCRYPTION FAILURE",
  "SYSTEM INTEGRITY COMPROMISED",
  "UNAUTHORIZED ACCESS",
  "DATA BREACH IN PROGRESS",
  "CRITICAL VULNERABILITY EXPLOITED",
];

const ORIGINS = [
  "Shanghai, China",
  "Moscow, Russia",
  "Seoul, South Korea",
  "New York, USA",
  "London, UK",
  "Tokyo, Japan",
  "Berlin, Germany",
  "Sydney, Australia",
  "Rio de Janeiro, Brazil",
  "Mumbai, India",
];

const generateRandomIP = () => {
  return `${Math.floor(Math.random() * 256)}.${Math.floor(
    Math.random() * 256,
  )}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
};

const HackerMap: React.FC<HackerMapProps> = ({
  onComplete,
  initialCountdown = 60,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [attackPoints, setAttackPoints] = useState<AttackPoint[]>([]);
  const [currentMessage, setCurrentMessage] = useState(MESSAGES[0]);
  const [countdown, setCountdown] = useState(initialCountdown);
  const [isRunning, setIsRunning] = useState(false);
  const [isMitigating, setIsMitigating] = useState(false);
  const [showMitigatedMessage, setShowMitigatedMessage] = useState(false);
  const [stats, setStats] = useState({ mitigated: 0, timeElapsed: 0 });
  const [showHelp, setShowHelp] = useState(false);
  const attackInterval = useRef<number | null>(null);
  const messageInterval = useRef<number | null>(null);
  const countdownInterval = useRef<number | null>(null);
  const attackSourceRef = useRef<mapboxgl.Marker | null>(null);
  const attackLinesRef = useRef<{ [key: string]: any }>({});

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 20],
      zoom: 1.5,
      projection: { name: "globe" },
    });

    map.current.on("load", () => {
      if (!map.current) return;

      // Add atmosphere and glow to the globe
      map.current.setFog({
        color: "rgba(0, 0, 0, 0.8)",
        "high-color": "#000",
        "horizon-blend": 0.1,
        "space-color": "#000",
        "star-intensity": 0.15,
      });

      // Add the attack source point (hacker base)
      const attackSource = new mapboxgl.Marker({
        element: createAttackSourceElement(),
      })
        .setLngLat([0, 0])
        .addTo(map.current);

      attackSourceRef.current = attackSource;

      // Add attack source glow
      map.current.addSource("attack-source-glow", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [0, 0],
          },
          properties: {},
        },
      });

      map.current.addLayer({
        id: "attack-source-glow-layer",
        type: "circle",
        source: "attack-source-glow",
        paint: {
          "circle-radius": 20,
          "circle-color": "#ff0000",
          "circle-opacity": 0.3,
          "circle-blur": 1,
        },
      });

      // Initialize attack lines source
      map.current.addSource("attack-lines", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });

      map.current.addLayer({
        id: "attack-lines-layer",
        type: "line",
        source: "attack-lines",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff0033",
          "line-width": 2,
          "line-opacity": 0.8,
          "line-dasharray": [0, 2, 1],
        },
      });

      // Add glow effect to lines
      map.current.addLayer({
        id: "attack-lines-glow",
        type: "line",
        source: "attack-lines",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff0033",
          "line-width": 4,
          "line-opacity": 0.4,
          "line-blur": 2,
        },
      });

      // Add shield effect source
      map.current.addSource("shield-effect", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [0, 0],
          },
          properties: {},
        },
      });

      map.current.addLayer({
        id: "shield-effect-layer",
        type: "circle",
        source: "shield-effect",
        paint: {
          "circle-radius": 0,
          "circle-color": "#39ff14",
          "circle-opacity": 0,
          "circle-blur": 1,
        },
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Create attack source element
  const createAttackSourceElement = () => {
    const el = document.createElement("div");
    el.className = "attack-source";
    el.style.width = "20px";
    el.style.height = "20px";
    el.style.borderRadius = "50%";
    el.style.backgroundColor = "#ff0033";
    el.style.boxShadow = "0 0 10px 2px #ff0033";
    return el;
  };

  // Create attack point element
  const createAttackPointElement = (id: string) => {
    const el = document.createElement("div");
    el.className = `attack-point attack-point-${id}`;
    el.style.width = "12px";
    el.style.height = "12px";
    el.style.borderRadius = "50%";
    el.style.backgroundColor = "#ff0033";
    el.style.boxShadow = "0 0 8px 2px #ff0033";
    el.style.animation = "pulse 1.5s infinite";

    // Add pulse animation
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes pulse {
        0% {
          transform: scale(0.8);
          opacity: 0.8;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
        100% {
          transform: scale(0.8);
          opacity: 0.8;
        }
      }
    `;
    document.head.appendChild(style);

    return el;
  };

  // Generate random attack point
  const generateAttackPoint = () => {
    const id = `attack-${Date.now()}`;
    const lng = Math.random() * 360 - 180;
    const lat = Math.random() * 140 - 70;
    const origin = ORIGINS[Math.floor(Math.random() * ORIGINS.length)];
    const ip = generateRandomIP();

    const newPoint: AttackPoint = {
      id,
      lngLat: [lng, lat],
      status: "active",
      origin,
      ip,
    };

    setAttackPoints((prev) => [...prev, newPoint]);

    if (map.current) {
      // Add marker
      const el = createAttackPointElement(id);
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ closeButton: false, offset: 15 }).setHTML(
            `<div style="font-family: monospace; color: #ff0033; background: rgba(0,0,0,0.8); padding: 8px; border: 1px solid #ff0033;">
              <div>IP: ${ip}</div>
              <div>Origin: ${origin}</div>
              <div>Status: ACTIVE</div>
            </div>`,
          ),
        )
        .addTo(map.current);

      // Add attack line
      if (attackSourceRef.current) {
        const sourceLngLat = attackSourceRef.current.getLngLat();
        const lineFeature = {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [sourceLngLat.lng, sourceLngLat.lat],
              [lng, lat],
            ],
          },
          properties: { id },
        };

        attackLinesRef.current[id] = { marker, feature: lineFeature };

        // Update the attack lines source
        updateAttackLines();
      }
    }

    // Play sound
    soundController.play("error", { volume: 0.2 });
  };

  // Update attack lines
  const updateAttackLines = () => {
    if (!map.current) return;

    const features = Object.values(attackLinesRef.current).map(
      (item: any) => item.feature,
    );

    const source = map.current.getSource(
      "attack-lines",
    ) as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: "FeatureCollection",
        features,
      });
    }
  };

  // Animate attack lines
  useEffect(() => {
    if (!map.current || !isRunning) return;

    const animateLines = () => {
      if (!map.current) return;

      const lineLayer = map.current.getLayer("attack-lines-layer");
      if (lineLayer) {
        const dashArray = map.current.getPaintProperty(
          "attack-lines-layer",
          "line-dasharray",
        ) as number[];

        if (dashArray) {
          const newDashArray = [dashArray[2], dashArray[0], dashArray[1]];
          map.current.setPaintProperty(
            "attack-lines-layer",
            "line-dasharray",
            newDashArray,
          );
        }
      }
    };

    const interval = setInterval(animateLines, 150);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Start generating attack points
  useEffect(() => {
    if (!isRunning) return;

    // Generate initial attack points
    for (let i = 0; i < 5; i++) {
      setTimeout(() => generateAttackPoint(), i * 500);
    }

    // Set up interval for new attack points
    attackInterval.current = window.setInterval(() => {
      generateAttackPoint();
    }, 3000);

    return () => {
      if (attackInterval.current) {
        clearInterval(attackInterval.current);
        attackInterval.current = null;
      }
    };
  }, [isRunning]);

  // Cycle through messages
  useEffect(() => {
    if (!isRunning) return;

    messageInterval.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * MESSAGES.length);
      setCurrentMessage(MESSAGES[randomIndex]);
      soundController.play("hover", { volume: 0.1 });
    }, 4000);

    return () => {
      if (messageInterval.current) {
        clearInterval(messageInterval.current);
        messageInterval.current = null;
      }
    };
  }, [isRunning]);

  // Countdown timer
  useEffect(() => {
    if (!isRunning) return;

    countdownInterval.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          handleLockdown();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
        countdownInterval.current = null;
      }
    };
  }, [isRunning]);

  // Format countdown time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle start simulation
  const handleStart = () => {
    setIsRunning(true);
    soundController.play("transition", { volume: 0.3 });
  };

  // Handle mitigate attack
  const handleMitigate = () => {
    if (isMitigating) return;

    setIsMitigating(true);
    soundController.play("success", { volume: 0.5 });

    // Animate shield effect
    if (map.current) {
      const shieldSource = map.current.getSource(
        "shield-effect",
      ) as mapboxgl.GeoJSONSource;

      if (shieldSource) {
        // Reset shield
        map.current.setPaintProperty("shield-effect-layer", "circle-radius", 0);
        map.current.setPaintProperty(
          "shield-effect-layer",
          "circle-opacity",
          0.7,
        );

        // Animate shield expansion
        let radius = 0;
        const maxRadius = 800;
        const shieldInterval = setInterval(() => {
          radius += 20;
          map.current?.setPaintProperty(
            "shield-effect-layer",
            "circle-radius",
            radius,
          );

          if (radius >= maxRadius) {
            clearInterval(shieldInterval);
            map.current?.setPaintProperty(
              "shield-effect-layer",
              "circle-opacity",
              0,
            );
          }
        }, 30);
      }
    }

    // Mitigate attacks one by one
    const mitigatedCount = attackPoints.filter(
      (point) => point.status === "active",
    ).length;

    attackPoints.forEach((point, index) => {
      if (point.status === "active") {
        setTimeout(() => {
          // Remove marker and line
          const attackLine = attackLinesRef.current[point.id];
          if (attackLine && attackLine.marker) {
            attackLine.marker.remove();
            delete attackLinesRef.current[point.id];
            updateAttackLines();
          }

          // Update attack point status
          setAttackPoints((prev) =>
            prev.map((p) =>
              p.id === point.id ? { ...p, status: "mitigated" } : p,
            ),
          );

          // If last point, show mitigated message
          if (index === attackPoints.length - 1) {
            setShowMitigatedMessage(true);
            setTimeout(() => {
              setShowMitigatedMessage(false);
              setIsMitigating(false);
              setStats({
                mitigated: mitigatedCount,
                timeElapsed: initialCountdown - countdown,
              });
            }, 3000);
          }
        }, index * 300);
      }
    });
  };

  // Handle lockdown
  const handleLockdown = () => {
    // Stop all intervals
    if (attackInterval.current) clearInterval(attackInterval.current);
    if (messageInterval.current) clearInterval(messageInterval.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);

    setIsRunning(false);
    soundController.play("glitch", { volume: 0.5 });

    // Flash the screen
    const container = document.querySelector(".hacker-map-container");
    if (container) {
      container.classList.add("lockdown");
      setTimeout(() => {
        container.classList.remove("lockdown");

        // Complete the simulation
        if (onComplete) {
          onComplete({
            mitigated: attackPoints.filter(
              (point) => point.status === "mitigated",
            ).length,
            timeElapsed: initialCountdown,
          });
        }
      }, 2000);
    }
  };

  // Render binary code background
  const renderBinaryBackground = () => {
    const lines = [];
    for (let i = 0; i < 10; i++) {
      let line = "";
      for (let j = 0; j < 50; j++) {
        line += Math.random() > 0.5 ? "1" : "0";
      }
      lines.push(line);
    }

    return (
      <div className="binary-background">
        {lines.map((line, index) => (
          <div key={index} className="binary-line">
            {line}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="hacker-map-container relative w-full h-full bg-black">
      <style jsx>{`
        .hacker-map-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }

        .map-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          pointer-events: none;
          z-index: 10;
        }

        .binary-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.1;
          color: #39ff14;
          font-family: monospace;
          font-size: 12px;
          overflow: hidden;
          pointer-events: none;
          z-index: 5;
        }

        .binary-line {
          white-space: nowrap;
          animation: scrollBinary 20s linear infinite;
          opacity: 0.5;
          margin: 5px 0;
        }

        @keyframes scrollBinary {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-100%);
          }
        }

        .message-container {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 20;
          pointer-events: none;
        }

        .countdown-container {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 20;
          pointer-events: none;
        }

        .mitigate-button {
          position: absolute;
          bottom: 20px;
          right: 20px;
          z-index: 20;
        }

        .help-button {
          position: absolute;
          top: 20px;
          right: 120px;
          z-index: 20;
        }

        .lockdown {
          animation: lockdownFlash 0.2s ease-in-out 5;
        }

        @keyframes lockdownFlash {
          0% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(2) invert(0.2);
          }
          100% {
            filter: brightness(1);
          }
        }

        .start-screen,
        .help-modal {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.9);
          z-index: 30;
          padding: 20px;
        }

        .help-modal {
          z-index: 40;
        }
      `}</style>

      {/* Map container */}
      <div ref={mapContainer} className="map-container" />

      {/* Binary code background */}
      {renderBinaryBackground()}

      {/* Overlay */}
      <div className="overlay" />

      {/* Start screen */}
      {!isRunning && countdown === initialCountdown && (
        <div className="start-screen">
          <div className="max-w-lg text-center">
            <GlitchText
              text="HACKER ATTACK SIMULATION"
              className="text-[#ff0033] text-3xl mb-6"
              intensity="high"
            />

            <div className="text-[#39ff14] mb-8 font-mono">
              <p className="mb-4">
                A global cyber attack is imminent. Your mission is to monitor
                and mitigate incoming threats before the system lockdown.
              </p>
              <p>
                Click the "Mitigate Attack" button to neutralize threats. Work
                quickly before the countdown reaches zero.
              </p>
            </div>

            <GlitchButton
              onClick={handleStart}
              glitchIntensity="medium"
              className="mt-4"
            >
              INITIATE SIMULATION
            </GlitchButton>
          </div>
        </div>
      )}

      {/* Help modal */}
      {showHelp && (
        <div className="help-modal">
          <div className="max-w-lg text-center">
            <GlitchText
              text="SIMULATION GUIDE"
              className="text-[#ff0033] text-2xl mb-6"
              intensity="medium"
            />

            <div className="text-[#39ff14] mb-8 font-mono text-left">
              <p className="mb-2">• Red dots represent attack points</p>
              <p className="mb-2">
                • Hover over attack points to see attack details
              </p>
              <p className="mb-2">
                • Click "Mitigate Attack" to neutralize all threats
              </p>
              <p className="mb-2">
                • Watch the countdown - system lockdown occurs at zero
              </p>
              <p className="mb-2">
                • Your performance is measured by response time and threats
                mitigated
              </p>
            </div>

            <GlitchButton
              onClick={() => setShowHelp(false)}
              variant="outline"
              className="mt-4"
            >
              CLOSE
            </GlitchButton>
          </div>
        </div>
      )}

      {/* Message container */}
      {isRunning && (
        <div className="message-container">
          <GlitchText
            text={currentMessage}
            className="text-[#ff0033] text-xl font-mono"
            intensity="medium"
          />
        </div>
      )}

      {/* Countdown container */}
      {isRunning && (
        <div className="countdown-container">
          <GlitchText
            text={`LOCKDOWN IN: ${formatTime(countdown)}`}
            className="text-[#ff0033] text-xl font-mono"
            intensity="low"
          />
        </div>
      )}

      {/* Help button */}
      {isRunning && (
        <div className="help-button">
          <GlitchButton
            onClick={() => setShowHelp(true)}
            variant="outline"
            className="text-sm"
          >
            HELP
          </GlitchButton>
        </div>
      )}

      {/* Mitigate button */}
      {isRunning && (
        <div className="mitigate-button">
          <GlitchButton
            onClick={handleMitigate}
            disabled={isMitigating}
            glitchIntensity="high"
          >
            MITIGATE ATTACK
          </GlitchButton>
        </div>
      )}

      {/* Mitigated message */}
      <AnimatePresence>
        {showMitigatedMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <GlitchText
              text="ATTACK MITIGATED"
              className="text-[#39ff14] text-4xl font-mono"
              intensity="high"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HackerMap;
