import { Suspense } from "react";
import { Box } from "@mantine/core";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Wholesale Customer Login - The Atelier",
  description: "Sign in to access your wholesale account.",
};

export default function LoginPage() {
  return (
    <Box className="flex min-h-screen flex-col overflow-hidden bg-[#0a0a0a] font-sans text-white selection:bg-[#C5A059]/30 selection:text-white">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </Box>
  );
}