"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TextInput, PasswordInput, Button, Box, Stack, Title, Text, Alert } from "@mantine/core";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

const LOGIN_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDovQIccC1wEqq4OyO9loqjiO4odjt2_zX5mLVlpo0itXfh-IpGkIttux3Pc1pN3t6NLddmEF1Vomqg-sIi3bKmY5fnaSqD6Bfjt8N7EFJHdYkS1_YsFZTOhVWXCKGa0q-vS6wdfdiq1qaEmWf2JLCFbG9LcPV-6dkb5VvcRnFzGRdBLPJ4cQ6rhNcRQgLPrUmvzzmn255SB-6O0VJIiLCfz5kSGbDDr1lU7C_SMbgdGpHoeYyFKsX64hewZhfSlAC23QcwEYPVFyLP";

function mapFirebaseError(code?: string) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again in a few minutes.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return "Unable to sign in right now. Please try again.";
  }
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
      const idToken = await userCred.user.getIdToken();
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Login failed.");
      }

      const next = searchParams.get("next");
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;

      // Unified fallback entry
      router.push(safeNext ?? data?.redirectTo ?? "/");
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "code" in err
          ? mapFirebaseError(String((err as { code?: string }).code))
          : err instanceof Error
            ? err.message
            : "Login failed.";
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Box className="absolute inset-0 z-0">
        <Box
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage: `url('${LOGIN_BG}')`,
            filter: "blur(8px) brightness(0.4)",
          }}
        />
        <Box
          className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
          }}
        />
        <Box className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
      </Box>

      <Box component="main" className="relative z-10 flex min-h-screen flex-1 flex-col items-center justify-center p-4">
        <Box
          className="glass-panel-auth w-full max-w-[500px] overflow-hidden rounded-lg border border-white/5 duration-700 ease-out animate-fade-in-up relative group"
          style={{ animationDuration: "0.8s" }}
        >
          <Stack gap="xs" align="center" className="px-10 pt-12 pb-2 text-center">
            <Box className="mb-6 text-[#C5A059]/80 animate-pulse" style={{ animationDuration: "3000ms" }}>
              <span className="material-symbols-outlined text-[40px]">diamond</span>
            </Box>
            <Text size="xs" className="font-sans tracking-[0.2em] uppercase text-white/60">
              Digital Loom
            </Text>
            <Title
              order={1}
              className="text-4xl font-medium tracking-tight leading-tight text-white text-shadow-gold md:text-5xl font-serif"
            >
              Welcome Back
            </Title>
            <Text size="sm" className="mt-2 font-sans text-[#8e8b85]">
              Please sign in to access your wholesale account.
            </Text>
          </Stack>

          <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-5 px-10 pt-8 pb-10">
            {errorMsg && (
              <Alert color="red" variant="light">
                {errorMsg}
              </Alert>
            )}

            <TextInput
              label="Business Email"
              placeholder="name@company.com"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              classNames={{
                label: "text-xs font-sans font-medium text-white/40 uppercase tracking-wider pl-1 mb-2 block",
                input:
                  "bg-[#11100e] border-[#2a2824] rounded text-white px-4 py-3.5 font-sans placeholder:text-[#3a3832] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/50",
              }}
              rightSection={<span className="material-symbols-outlined text-sm text-white/20">mail</span>}
            />

            <Box className="group/input">
              <Box className="mb-2 flex items-end justify-between pl-1">
                <label
                  htmlFor="password"
                  className="block text-xs font-sans font-medium uppercase tracking-wider text-white/40 transition-colors group-focus-within/input:text-[#C5A059]"
                >
                  Password
                </label>
                <Link href="#" className="text-xs font-sans text-[#C5A059]/70 transition-colors hover:text-[#C5A059]">
                  Forgot Password?
                </Link>
              </Box>

              <PasswordInput
                id="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                classNames={{
                  input:
                    "bg-[#11100e] border border-[#2a2824] rounded text-white px-4 py-3.5 font-sans placeholder:text-[#3a3832] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/50",
                }}
                rightSection={<span className="material-symbols-outlined text-sm text-white/20">lock</span>}
              />
            </Box>

            <Stack gap="md" className="mt-4">
              <Button
                type="submit"
                fullWidth
                loading={submitting}
                disabled={submitting}
                className="group/btn relative overflow-hidden rounded bg-[#C5A059] py-4 text-sm font-bold tracking-wide text-black transition-all duration-300 hover:bg-[#d4b56a] active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <span className="relative z-10">Sign In</span>
                <span className="material-symbols-outlined relative z-10 text-lg transition-transform group-hover/btn:translate-x-1">
                  login
                </span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover/btn:translate-x-full z-0" />
              </Button>

              <Text size="xs" className="pt-2 text-center font-sans text-white/30">
                <Link
                  href="/signup"
                  className="border-b border-transparent pb-0.5 transition-colors hover:border-[#C5A059]/50 hover:text-[#C5A059]"
                >
                  Not a member yet? Apply for access
                </Link>
              </Text>
            </Stack>
          </Box>

          <Box
            className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"
            aria-hidden
          />
        </Box>

        <Box className="absolute bottom-6 flex gap-4 font-sans text-[10px] tracking-widest uppercase text-white/10">
          <span>© 2024 The Atelier</span>
          <span>•</span>
          <Link href="#" className="hover:text-white/20">
            Privacy Policy
          </Link>
        </Box>
      </Box>
    </>
  );
}