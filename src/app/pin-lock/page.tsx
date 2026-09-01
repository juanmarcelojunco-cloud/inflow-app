"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PinLockPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        validatePin(newPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const validatePin = async (finalPin: string) => {
    // Simulación de validación de PIN (En producción se valida contra Supabase o almacenamiento seguro)
    if (finalPin === "1234") {
      router.push("/chat");
    } else {
      setError(true);
      setTimeout(() => setPin(""), 500);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="w-full max-w-xs space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-serif font-medium text-primary">Acceso Seguro</h1>
          <p className="text-muted text-sm font-sans">Ingresa tu PIN de 4 dígitos</p>
        </div>

        {/* PIN Dots */}
        <div className="flex justify-center gap-4 my-8">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                pin.length > i
                ? "bg-primary border-primary scale-110"
                : "bg-background border-white/20"
              } ${error ? "border-red-500 animate-shake" : ""}`}
            />
          ))}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="w-16 h-16 rounded-full bg-card border border-white/10 text-xl font-medium hover:bg-white/5 active:scale-95 transition-all"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeyPress("0")}
            className="w-16 h-16 rounded-full bg-card border border-white/10 text-xl font-medium hover:bg-white/5 active:scale-95 transition-all"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-16 h-16 rounded-full bg-card border border-white/10 text-muted hover:text-foreground active:scale-95 transition-all"
          >
            ⌫
          </button>
        </div>
      </div>
    </main>
  );
}
