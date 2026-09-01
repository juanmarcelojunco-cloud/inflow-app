"use client";
import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    tipo_ingreso: "variable",
    sueldo_fijo_monto: "",
    moneda_preferida: "MXN",
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("Por favor, inicia sesión primero.");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          nombre_usuario: formData.nombre_usuario,
          tipo_ingreso: formData.tipo_ingreso,
          sueldo_fijo_monto: parseFloat(formData.sueldo_fijo_monto) || 0,
          moneda_preferida: formData.moneda_preferida,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      alert("¡Perfil guardado con éxito!");
      router.push("/chat");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      alert("Error al guardar el perfil: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif font-medium text-primary">inFlow</h1>
          <p className="text-muted text-sm font-sans">Configurando tu flujo financiero premium</p>
        </div>

        <div className="bg-card border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted block">¿Cómo te llamas?</label>
                <input
                  type="text"
                  placeholder="Tu nombre..."
                  className="w-full bg-background border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={formData.nombre_usuario}
                  onChange={(e) => setFormData({...formData, nombre_usuario: e.target.value})}
                />
              </div>
              <button
                onClick={nextStep}
                disabled={!formData.nombre_usuario}
                className="w-full bg-primary text-background font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted block">Naturaleza de tus ingresos</label>
                <div className="grid grid-cols-2 gap-3">
                  {["variable", "mensual", "quincenal", "semanal"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({...formData, tipo_ingreso: type})}
                      className={`p-3 rounded-xl border transition-all capitalize ${
                        formData.tipo_ingreso === type
                        ? "bg-primary text-background border-primary"
                        : "bg-background border-white/10 text-foreground hover:border-primary/50"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={prevStep} className="flex-1 py-3 text-muted hover:text-foreground transition-colors">Volver</button>
                <button
                  onClick={nextStep}
                  className="flex-[2] bg-primary text-background font-bold py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted block">
                  {formData.tipo_ingreso === 'variable'
                    ? "Si tienes un sueldo base, indícalo aquí (opcional)"
                    : "Monto de tu ingreso fijo"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">{formData.moneda_preferida}</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-background border border-white/10 rounded-xl p-3 pl-12 focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.sueldo_fijo_monto}
                    onChange={(e) => setFormData({...formData, sueldo_fijo_monto: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={prevStep} className="flex-1 py-3 text-muted hover:text-foreground transition-colors">Volver</button>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="flex-[2] bg-primary text-background font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Finalizar Setup"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
