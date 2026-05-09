"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button, Input, Label } from "@hms/ui";
import { Hotel, ArrowLeft, Loader2, Send } from "lucide-react";
import { useBranding } from "@/components/providers/tenant-provider";

const forgotSchema = z.object({
  email: z.string().email("Correo electrónico no válido"),
});

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Extraemos los datos del contexto dinámico
  const { hotelName, branding, slug } = useBranding();

  const form = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: z.infer<typeof forgotSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        "http://localhost:3000/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-slug": slug || "", // Enviamos por Header
          },
          body: JSON.stringify({ email: values.email }), // Ya no enviamos tenant en el body
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg = data?.message || "No pudimos procesar tu solicitud.";
        // Si el backend responde 404 o indica que el correo no está registrado,
        // mostramos un mensaje genérico de credenciales incorrectas.
        if (response.status === 404 || /no est(a|á) registrado/i.test(msg)) {
          toast.error(
            <div className="p-2 rounded-md">
              <div className="font-semibold text-sm">
                Credenciales incorrectas
              </div>
              <div className="text-xs text-primary/80">
                El correo no pertenece a esta tienda
              </div>
            </div>,
          );
        } else {
          toast.error(
            <div className="p-2 rounded-md">
              <div className="font-semibold text-sm">Error</div>
              <div className="text-xs text-primary/80">{msg}</div>
            </div>,
          );
        }
        return;
      }

      const successMsg =
        data?.message ||
        `Si el correo existe en ${hotelName}, recibirás instrucciones.`;
      toast.success(
        <div className="p-2 rounded-md ">
          <div className="font-semibold text-sm">Correo enviado</div>
          <div className="text-xs ">{successMsg}</div>
        </div>,
      );
    } catch (err: unknown) {
      toast.error("Error", {
        description: err instanceof Error ? err.message : "Error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onValidationError = (errors: FieldErrors) => {
    if (errors.email) {
      toast.error(
        <div className="p-2 rounded-md">
          <div className="font-semibold text-sm">Correo inválido</div>
          <div className="text-xs text-primary/80">
            Ingrese un correo válido (ej: nombre@dominio.com)
          </div>
        </div>,
      );
    }
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* LADO IZQUIERDO: DINÁMICO */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-zinc-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_center,var(--color-primary),transparent)]" />
        <div className="absolute inset-0 z-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070')] bg-cover bg-center opacity-40 grayscale" />

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
          <p className="text-4xl font-light leading-tight tracking-tight italic">
            Recupera el acceso a <br />
            <span className="font-bold text-primary not-italic text-5xl">
              tu centro de mando.
            </span>
          </p>
        </div>
        <div className="relative z-10 text-xs text-zinc-500 font-medium tracking-widest uppercase">
          © 2026 {hotelName} • Secure Gateway
        </div>
      </div>

      {/* LADO DERECHO: FORMULARIO (FONDO = COLOR SECUNDARIO) */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-24 bg-secondary">
        <div className="w-full max-w-sm space-y-10">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 text-sm font-bold text-primary/60 hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Volver al login
          </button>

          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold tracking-tighter text-primary text-balance">
              ¿Olvidaste tu clave?
            </h1>
            <p className="text-primary/70 text-sm">
              Escribe tu correo de <strong>{hotelName}</strong> y te enviaremos
              un link para restablecerla.
            </p>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit, onValidationError)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-primary font-semibold ml-1 text-xs uppercase tracking-wider"
              >
                Correo Electrónico
              </Label>
              <Input
                {...form.register("email")}
                id="email"
                placeholder="admin@hotel.com"
                className="h-12 border-primary text-primary rounded-2xl px-6 bg-white/10 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500 font-medium ml-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg cursor-pointer hover:scale-[1.02] disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Enviar instrucciones <Send size={16} />
                </div>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
