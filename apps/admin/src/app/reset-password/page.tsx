"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button, Input, Label, Separator } from "@hms/ui";
import {
  Hotel,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

// Esquema de validación con coincidencia de contraseñas
const resetSchema = z.object({
  password: z.string().min(6, "La contraseña requiere al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetFormValues) => {
    if (!token) {
      toast.error("Token ausente", { 
        description: "El enlace no es válido. Solicita uno nuevo." 
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:3000/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Error al actualizar");

      toast.success("Contraseña actualizada", {
        description: "Ya puedes acceder con tus nuevas credenciales.",
      });

      router.push("/login");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error al actualizar la contraseña.";
      toast.error("Error", { description: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white font-sans">
      
      {/* --- LADO IZQUIERDO: BRANDING (Igual al Login) --- */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080')] bg-cover bg-center opacity-40 grayscale" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <Hotel className="h-7 w-7" />
          </div>
          <span className="text-2xl font-bold tracking-tight uppercase">
            HMS <span className="font-light text-primary">Security</span>
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote className="space-y-2">
            <p className="text-4xl font-light leading-tight tracking-tight">
              &ldquo;Protegiendo la integridad de <br />
              <span className="font-bold text-primary italic text-5xl">
                tus operaciones hoteleras.&rdquo;
              </span>
            </p>
          </blockquote>
          <div className="flex items-center gap-4 text-zinc-400 text-sm">
            <div className="h-1 w-12 bg-primary rounded-full" />
            <span>Actualización de Credenciales HMS</span>
          </div>
        </div>

        <div className="relative z-10 text-xs text-zinc-500 font-medium tracking-widest uppercase">
          © 2026 HMS Platform • Secure Auth Module
        </div>
      </div>

      {/* --- LADO DERECHO: FORMULARIO --- */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-sm space-y-10">
          
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tighter text-zinc-900">
              Nueva Clave
            </h1>
            <p className="text-zinc-500 text-sm">
              Ingresa tu nueva contraseña para recuperar el acceso total al sistema.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              
              {/* Campo Contraseña Nueva */}
              <div className="space-y-2">
                <Label className="text-zinc-700 font-semibold ml-1 text-xs uppercase tracking-wider">
                  Nueva Contraseña
                </Label>
                <div className="relative">
                  <Input
                    {...form.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 border-zinc-200 text-black rounded-2xl px-6 focus:ring-primary/20 focus:border-primary transition-all bg-zinc-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-400 hover:text-zinc-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Campo Confirmar Contraseña */}
              <div className="space-y-2">
                <Label className="text-zinc-700 font-semibold ml-1 text-xs uppercase tracking-wider">
                  Confirmar Contraseña
                </Label>
                <Input
                  {...form.register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-zinc-200 text-black rounded-2xl px-6 focus:ring-primary/20 focus:border-primary transition-all bg-zinc-50/50"
                />
                {form.formState.errors.confirmPassword && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Botón Principal */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full h-12 overflow-hidden rounded-full bg-zinc-950 text-white text-sm font-semibold tracking-wide shadow-lg shadow-zinc-950/10 transition-all duration-300 hover:shadow-zinc-950/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="animate-pulse">Actualizando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Actualizar Contraseña</span>
                  <CheckCircle2 size={18} className="transition-transform duration-300 group-hover:scale-110" />
                </div>
              )}
            </Button>
          </form>

          {/* Footer de Seguridad */}
          <div className="space-y-6 pt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                <span className="bg-white px-4 text-zinc-400">
                  Verificación de Identidad
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-zinc-400 opacity-60 grayscale">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  End-to-End Encrypted
                </span>
              </div>
              <div className="flex items-center gap-2">
                <KeyRound size={16} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  Secure Recovery
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Exportación con Suspense (Requerido por Next.js al usar useSearchParams)
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}