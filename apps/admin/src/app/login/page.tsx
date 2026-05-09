"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button, Input, Label, Checkbox } from "@hms/ui";
import Link from "next/link";
import { Hotel, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useBranding } from "@/components/providers/tenant-provider";

const loginSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
  password: z.string().min(6, "La contraseña requiere al menos 6 caracteres"),
  rememberMe: z.boolean(),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Obtenemos los datos del hotel del contexto centralizado
  const { hotelName, branding, slug } = useBranding();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const onValidationError = (errors: FieldErrors) => {
    // Prefer showing the first field error as a toast

      toast.error(
        <div className="p-2 rounded-md">
          <div className="font-semibold text-sm">Correo inválido</div>
          <div className="text-xs text-primary/80">Ingrese un correo válido (ej: nombre@dominio.com)</div>
        </div>
      );

    if (errors.password) {
      toast.error(
        <div className="p-2 rounded-md">
          <div className="font-semibold text-sm">Contraseña inválida</div>
          <div className="text-xs text-primary/80">La contraseña debe tener al menos 6 caracteres</div>
        </div>
      );
      return;
    }
  };

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-tenant-slug": slug || ""
        },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = data?.message || 'Credenciales inválidas';
        toast.error(
          <div className="p-2 rounded-md">
            <div className="font-semibold text-sm">Error de autenticación</div>
            <div className="text-xs text-primary/80">{msg}</div>
          </div>
        );
        return;
      }

      Cookies.set("hms_session", data.access_token, { expires: values.rememberMe ? 30 : 7, path: "/" });
      toast.success(
        <div className="p-2 rounded-md bg-primary text-primary-foreground">
          <div className="font-semibold text-sm">Acceso concedido</div>
          <div className="text-xs text-primary-foreground/90">Bienvenido a {hotelName}</div>
        </div>
      );
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error("Error al iniciar sesión", { description: err instanceof Error ? err.message : "Error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* LADO IZQUIERDO: DINÁMICO (VISUAL) */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--color-primary),transparent)]" />
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070')] bg-cover bg-center opacity-40 grayscale" />

        <div className="relative z-10 flex items-center gap-3">
          {branding?.url_logo ? (
             <div
               role="img"
               aria-label="Logo"
               className="h-10 w-28 bg-contain bg-left bg-no-repeat"
               style={{ backgroundImage: `url(${branding.url_logo})` }}
             />
          ) : (
             <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
               <Hotel className="h-7 w-7" />
             </div>
          )}
          <span className="text-2xl font-bold tracking-tight uppercase">
            {hotelName} <span className="font-light text-primary">Platform</span>
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <blockquote className="space-y-2">
            <p className="text-4xl font-light leading-tight tracking-tight">
              &ldquo;La hospitalidad se encuentra con <br />
              <span className="font-bold text-primary italic text-5xl">la eficiencia absoluta.&rdquo;</span>
            </p>
          </blockquote>
          <div className="flex items-center gap-4 text-zinc-400 text-sm">
            <div className="h-1 w-12 bg-primary rounded-full" />
            <span>Gestión Administrativa {hotelName}</span>
          </div>
        </div>
        <div className="relative z-10 text-xs text-zinc-500 font-medium tracking-widest uppercase">
          © 2026 {hotelName} • All Rights Reserved
        </div>
      </div>

      {/* LADO DERECHO: FORMULARIO (FONDO = COLOR SECUNDARIO) */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-24 bg-secondary">
        <div className="w-full max-w-sm space-y-10">
          <div className="space-y-3">
            {/* TEXTO = COLOR PRIMARIO */}
            <h1 className="text-4xl font-extrabold tracking-tighter text-primary">Bienvenido</h1>
            <p className="text-primary/80 text-sm">
              Acceso administrativo para <strong>{hotelName}</strong>.
            </p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit, onValidationError)} className="space-y-6">
             <div className="space-y-4">
                <div className="space-y-2">
                   {/* LABEL = COLOR PRIMARIO */}
                   <Label htmlFor="email" className="text-primary font-semibold text-xs uppercase tracking-wider ml-1">Correo Electrónico</Label>
                   {/* INPUT TEXT = COLOR PRIMARIO */}
                   <Input 
                      {...form.register("email")} 
                      id="email" 
                      type="email" 
                      placeholder="admin@hotel.com" 
                     className="h-12 border-primary text-primary rounded-2xl px-6 focus:border-primary focus:ring-primary/20 transition-all bg-white/10" 
                   />
                   {form.formState.errors.email && (
                     <p className="text-xs text-red-500 font-medium ml-1">{String(form.formState.errors.email.message)}</p>
                   )}
                </div>
                <div className="space-y-2">
                   <div className="flex items-center justify-between ml-1">
                      <Label htmlFor="password" className="text-primary font-semibold text-xs uppercase tracking-wider">Contraseña</Label>
                      <Link href="/forgot-password" className="text-[12px] font-bold text-primary hover:underline italic">¿Olvidaste tu clave?</Link>
                   </div>
                   <div className="relative">
                      <Input 
                        {...form.register("password")} 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                      className="h-12 border-primary text-primary rounded-2xl pr-12 px-6 focus:border-primary focus:ring-primary/20 transition-all bg-white/10" 
                      />
                      {form.formState.errors.password && (
                        <p className="text-xs text-red-500 font-medium ml-1">{String(form.formState.errors.password.message)}</p>
                      )}
                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 cursor-pointer text-primary/50 hover:text-primary transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                   </div>
                </div>
             </div>

             <div className="flex items-center space-x-3 group cursor-pointer select-none ml-1 py-1 px-2 rounded-xl transition-colors hover:bg-white/5">
                <Checkbox 
                  id="rememberMe" 
                  className="h-5 w-5 rounded border-2 border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
                  onCheckedChange={(checked) => form.setValue("rememberMe", checked as boolean)} 
                />
                <label htmlFor="rememberMe" className="text-sm font-semibold text-primary/70 group-hover:text-primary cursor-pointer transition-colors leading-none tracking-tight">
                    Mantener sesión iniciada
                </label>
             </div>

             <Button 
                type="submit" 
                disabled={isSubmitting} 
               className="group relative w-full h-12 overflow-hidden rounded-full bg-primary text-primary-foreground text-sm font-semibold tracking-wide shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
             >
                {isSubmitting ? (
                   <div className="flex items-center justify-center gap-3"><Loader2 className="h-4 w-4 animate-spin" /><span className="animate-pulse text-primary-foreground">Verificando...</span></div>
                ) : (
                   <div className="flex items-center justify-center gap-2"><span>Entrar al Sistema</span><ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" /></div>
                )}
             </Button>
          </form>

          {/* Footer de seguridad */}
          <div className="flex flex-col items-center justify-center gap-4 pt-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="h-px w-full bg-primary/20" />
             <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Seguridad Encriptada AES-256</p>
          </div>
        </div>
      </div>
    </div>
  );
}