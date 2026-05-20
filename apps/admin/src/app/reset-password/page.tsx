"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button, Input, Label } from "@hms/ui";
import { Hotel, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useBranding } from "@/components/providers/tenant-provider";

const resetSchema = z
  .object({
    password: z.string().min(6, "La contraseña requiere al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const { hotelName, branding } = useBranding();

  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const onValidationError = (errors: FieldErrors) => {
    if (errors.password) {
      toast.error(
        <div className="p-2 rounded-md">
          <div className="font-semibold text-sm">Contraseña inválida</div>
          <div className="text-xs text-primary/80">La contraseña debe tener al menos 6 caracteres</div>
        </div>
      );
      return;
    }
    if (errors.confirmPassword) {
      toast.error(
        <div className="p-2 rounded-md">
          <div className="font-semibold text-sm">Las contraseñas no coinciden</div>
          <div className="text-xs text-primary/80">Verifica que ambas contraseñas coincidan</div>
        </div>
      );
    }
  };
  const onSubmit = async (values: z.infer<typeof resetSchema>) => {
    if (!token) {
      toast.error('Token ausente');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: values.password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = data?.message || 'No se pudo actualizar la clave.';
        toast.error('Error', { description: msg });
        return;
      }

      const successMsg = data?.message || 'Contraseña actualizada correctamente';
      toast.success(successMsg);
      router.push('/login');
    } catch {
      toast.error('Error', { description: 'No se pudo actualizar la clave.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* LADO IZQUIERDO: DINÁMICO */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--color-primary),transparent)]" />
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2080')] bg-cover bg-center opacity-40 grayscale" />

        <div className="relative z-10 flex items-center gap-3">
          {branding?.url_logo ? (
            <div
              className="h-10 w-28 bg-contain bg-left bg-no-repeat"
              style={{ backgroundImage: `url(${branding.url_logo})` }}
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
              <Hotel className="h-7 w-7" />
            </div>
          )}
          <span className="text-2xl font-bold tracking-tight uppercase">
            {hotelName}{" "}
            <span className="font-light text-primary">Security</span>
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote className="space-y-2">
            <p className="text-4xl font-light leading-tight tracking-tight italic">
              &ldquo;Protegiendo la integridad de <br />
              <span className="font-bold text-primary not-italic text-5xl">tus operaciones hoteleras.&rdquo;</span>
            </p>
          </blockquote>
        </div>
        <div className="relative z-10 text-xs text-zinc-500 font-medium tracking-widest uppercase">
          © 2026 {hotelName} • Secure Auth
        </div>
      </div>

      {/* LADO DERECHO: FORMULARIO (FONDO = COLOR SECUNDARIO) */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-24 bg-secondary">
        <div className="w-full max-w-sm space-y-10">
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tighter text-primary">Nueva Clave</h1>
            <p className="text-primary/70 text-sm">Crea una nueva contraseña segura para <strong>{hotelName}</strong>.</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit, onValidationError)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-primary font-semibold ml-1 text-xs uppercase tracking-wider">Nueva Contraseña</Label>
                <div className="relative">
                  <Input
                    {...form.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-12 border-primary text-primary rounded-2xl px-6 bg-white/10 focus:border-primary transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 cursor-pointer text-primary/50">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-primary font-semibold ml-1 text-xs uppercase tracking-wider">Confirmar Contraseña</Label>
                <Input
                  {...form.register("confirmPassword")}
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-primary text-primary rounded-2xl px-6 bg-white/10 focus:border-primary transition-all"
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg cursor-pointer hover:scale-[1.02] disabled:cursor-not-allowed transition-all">
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="flex items-center justify-center gap-2">Actualizar Contraseña <CheckCircle2 size={18} /></div>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-zinc-950">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
