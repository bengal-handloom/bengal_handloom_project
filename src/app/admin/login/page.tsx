"use client";

import { FormEvent, useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  // If already logged in as admin, redirect directly to /admin
  useEffect(() => {
    let mounted = true;

    async function checkAdminSession() {
      try {
        const res = await fetch("/api/admin/session", { method: "GET" });
        if (!mounted) return;

        if (res.ok) {
          router.replace("/admin");
          return;
        }
      } catch {
        // Ignore: user probably not logged in yet
      } finally {
        if (mounted) setCheckingSession(false);
      }
    }

    checkAdminSession();
    return () => {
      mounted = false;
    };
  }, [router]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Step 1: Firebase Auth login with admin email/password
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);

      // Step 2: Fetch fresh ID token
      const idToken = await cred.user.getIdToken(true);

      // Step 3: Exchange ID token for secure HttpOnly admin session cookie
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Admin login failed");
        return;
      }

      router.replace(typeof data.redirectTo === "string" ? data.redirectTo : "/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="min-h-screen grid place-items-center bg-[#0b0b0b] text-[#bdb29e]">
        <p className="text-sm">Checking admin session...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-[#bdb29e] flex items-center justify-center p-6">
      <section className="w-full max-w-md rounded-2xl border border-[#2c2c2c] bg-[#111111] p-6 shadow-xl">
        <h1 className="text-2xl font-semibold text-[#c5a059]">Admin Login</h1>
        <p className="mt-1 text-sm text-[#9d9589]">
          Sign in with your admin credentials to access the dashboard.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-[#cfc6b8]">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-[#343434] bg-[#171717] px-3 py-2 text-sm outline-none focus:border-[#c5a059]"
              placeholder="admin@digitalloom.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-[#cfc6b8]">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-[#343434] bg-[#171717] px-3 py-2 text-sm outline-none focus:border-[#c5a059]"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <p className="rounded-md border border-red-900/50 bg-red-950/30 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#c5a059] px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in as Admin"}
          </button>
        </form>
      </section>
    </main>
  );
}