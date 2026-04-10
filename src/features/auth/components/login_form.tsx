"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { motion } from "framer-motion";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [shake, setShake] = useState(false);
  const [isOauthPending, setIsOauthPending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signInGithub = async () => {
    if (isOauthPending) return;
    setIsOauthPending(true);
    try {
      await authClient.signIn.social(
        {
          provider: "github",
          callbackURL: "/workflows",
        },
        {
          onSuccess: () => {
            router.push("/workflows");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Something went wrong");
            setIsOauthPending(false);
          },
        }
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "OAuth failed");
      setIsOauthPending(false);
    }
  };

  const isPending = form.formState.isSubmitting;

  const onSubmit = async (values: LoginFormValues) => {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: "/workflows",
      },
      {
        onSuccess: () => router.push("/workflows"),
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setShake(true);
          setTimeout(() => setShake(false), 400);
        },
      }
    );
  };

  return (
    <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          x: shake ? [-6, 6, -4, 4, 0] : 0,
        }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Card — solid, matching homepage */}
        <div className="rounded-2xl bg-[#0c0c10] border border-[#1a1a22] overflow-hidden">
          {/* Header */}
          <div className="text-center pt-10 pb-2 px-8">
            {/* Fluxion Logo */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center gap-2.5 mb-6"
            >
              <Image
                src="/logos/logo2.svg"
                alt="Fluxion"
                width={32}
                height={32}
              />
              <span className="text-xl font-bold tracking-tight text-[#f0f0f5]">
                Fluxion
              </span>
            </motion.div>

            <h1 className="text-2xl font-bold text-[#f0f0f5] tracking-tight mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-[#7a7a8e] font-medium">
              Log in to continue building automations
            </p>
          </div>

          {/* Content */}
          <div className="px-8 pt-8 pb-10">
            {/* GitHub OAuth */}
            <div className="mb-8">
              <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={signInGithub}
                  type="button"
                  disabled={isPending || isOauthPending}
                  className="flex w-full h-12 items-center justify-center gap-3 border border-[#1a1a22] bg-[#111116] text-[#f0f0f5] hover:bg-[#1a1a20] hover:border-[#262630] hover:text-white transition-all rounded-xl font-semibold"
                >
                  <Image
                    alt="Github"
                    src="/logos/github.svg"
                    width={20}
                    height={20}
                    className="brightness-0 invert opacity-80"
                  />
                  Continue with Github
                </Button>
              </motion.div>
            </div>

            {/* Divider */}
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#1a1a22]" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-widest font-bold text-[#4a4a5a]">
                <span className="bg-[#0c0c10] px-3">Or continue with</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#7a7a8e] font-semibold ml-1 text-xs">
                        Email address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="name@example.com"
                          className="h-12 bg-[#111116] border-[#1a1a22] text-[#f0f0f5] placeholder:text-[#4a4a5a] rounded-xl focus:border-[#a78bfa] transition-all"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-400 ml-1 text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-[#7a7a8e] font-semibold text-xs">
                          Password
                        </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="h-12 bg-[#111116] border-[#1a1a22] text-[#f0f0f5] placeholder:text-[#4a4a5a] rounded-xl focus:border-[#a78bfa] transition-all"
                        />
                      </FormControl>
                      <FormMessage className="text-rose-400 ml-1 text-xs" />
                    </FormItem>
                  )}
                />

                <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="pt-2">
                  <Button
                    type="submit"
                    disabled={isPending || isOauthPending}
                    className="w-full h-12 rounded-xl text-[15px] font-bold text-white bg-[var(--landing-accent)] hover:bg-[var(--landing-accent-hover)] transition-colors duration-300"
                  >
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>

            {/* Sign up link */}
            <p className="mt-8 text-center text-sm text-[#4a4a5a] font-medium">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-[var(--landing-accent-text)] font-bold hover:text-[#c4b5fd] transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
