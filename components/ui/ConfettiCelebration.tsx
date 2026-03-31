"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface ConfettiCelebrationProps {
  trigger: boolean;
}

export default function ConfettiCelebration({ trigger }: ConfettiCelebrationProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (trigger && !firedRef.current) {
      firedRef.current = true;

      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 9999 };

      const colors = ["#00b4ff", "#00e5a0", "#f5a623", "#ffffff", "#7dd3fc"];

      const randomInRange = (min: number, max: number) =>
        Math.random() * (max - min) + min;

      const interval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors,
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors,
        });
      }, 250);

      return () => clearInterval(interval);
    }

    if (!trigger) {
      firedRef.current = false;
    }
  }, [trigger]);

  return null;
}
