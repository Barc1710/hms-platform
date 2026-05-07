"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button, Input, Label, Checkbox, Separator } from "@hms/ui";
import {
  Hotel,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  KeyRound,
} from "lucide-react";
import { useTenant } from "@/hooks/use-tenant";
import Home from "../page";

// Esquema de validación estricto
const loginSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(6, "La contraseña requiere al menos 6 caracteres"),
  rememberMe: z.boolean(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const tenantSlug = useTenant();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          tenant: tenantSlug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenciales inválidas");
      }

      // Guardar token en cookie
      Cookies.set("hms_session", data.access_token, {
        expires: values.rememberMe ? 30 : 7,
        path: "/",
      });

      toast.success("Acceso concedido", {
        description: "Redirigiendo al panel de control...",
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error de conexión";
      toast.error("Error al iniciar sesión", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-white">
      {/* --- LADO IZQUIERDO: BRANDING & VISUAL (Oculto en móviles) --- */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white overflow-hidden">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070')] bg-cover bg-center opacity-40 grayscale" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <Hotel className="h-7 w-27" />
          </div>
          <span className="text-2xl font-bold tracking-tight uppercase">
            HMS <span className="font-light text-primary">Platform</span>
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote className="space-y-2">
            <p className="text-4xl font-light leading-tight tracking-tight">
              &ldquo;La hospitalidad se encuentra con <br />
              <span className="font-bold text-primary italic text-5xl">
                la eficiencia absoluta.&rdquo;
              </span>
            </p>
          </blockquote>
          <div className="flex items-center gap-4 text-zinc-400 text-sm">
            <div className="h-1 w-12 bg-primary rounded-full" />
            <span>Gestión Administrativa HMS v2.0</span>
          </div>
        </div>

        <div className="relative z-10 text-xs text-zinc-500 font-medium tracking-widest uppercase">
          © 2026 HMS Platform • All Rights Reserved
        </div>
      </div>

      {/* --- LADO DERECHO: FORMULARIO --- */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-sm space-y-10">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tighter text-zinc-900">
              Bienvenido
            </h1>
            <p className="text-zinc-500 text-sm">
              Ingresa tus credenciales para acceder al panel de control de tu
              propiedad.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {/* Campo Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-zinc-700 font-semibold ml-1 text-xs uppercase tracking-wider"
                >
                  Correo Electrónico
                </Label>
                <Input
                  {...form.register("email")}
                  id="email"
                  type="email"
                  placeholder="admin@hotel.com"
                  className="h-12 border-zinc-200 text-black rounded-2xl px-6 focus:ring-primary/20 focus:border-primary transition-all bg-zinc-50/50"
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              {/* Campo Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label
                    htmlFor="password"
                    className="text-zinc-700 font-semibold text-xs uppercase tracking-wider"
                  >
                    Contraseña
                  </Label>
                  <button
                    type="button"
                    className="text-[12px] font-bold text-zinc-600 cursor-pointer text-primary hover:underline"
                  >
                    ¿Olvidaste tu clave?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    {...form.register("password")}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className="h-12 border-zinc-200 pr-12  text-black rounded-2xl px-6 focus:ring-primary/20 focus:border-primary transition-all bg-zinc-50/50"
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
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-3 group cursor-pointer select-none ml-1 py-1 px-2 rounded-xl transition-colors hover:bg-zinc-50">
              <Checkbox
                id="rememberMe"
                className="h-5 w-5 rounded border-2 border-zinc-300 data-[state=checked]:bg-zinc-950 data-[state=checked]:border-zinc-950 transition-all duration-200 shadow-sm focus-visible:ring-offset-2 focus-visible:ring-2 focus-visible:ring-zinc-950"
                onCheckedChange={(checked) =>
                  form.setValue("rememberMe", checked as boolean)
                }
              />
              <label
                htmlFor="rememberMe"
                className="text-sm font-semibold text-zinc-500 group-hover:text-zinc-950 cursor-pointer transition-colors leading-none tracking-tight"
              >
                Mantener sesión iniciada
              </label>
            </div>
            {/* Botón Principal */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full h-12 overflow-hidden rounded-full bg-zinc-950 text-white text-sm font-semibold tracking-wide shadow-lg shadow-zinc-950/10 transition-all duration-300 hover:shadow-zinc-950/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {/* Capa de brillo sutil sobre el negro */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />

              {isSubmitting ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="animate-pulse">Verificando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Entrar al Sistema</span>
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              )}
            </Button>
          </form>

          <div className="space-y-6 pt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-bold">
                <span className="bg-white px-4 text-zinc-400">
                  Seguridad Encriptada
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-zinc-400 opacity-60 grayscale">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  SSL Verified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <KeyRound size={16} />
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  AES-256 Auth
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
