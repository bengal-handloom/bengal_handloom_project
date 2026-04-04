"use client";

import Link from "next/link";
import { Box, Stack, Title, Text } from "@mantine/core";

const SignupVerificationSent = () => {
  const handleResend = () => {
    // TODO: call your resend verification API / Firebase resend
  };

  return (
    <>
      <Stack gap="xs" align="center" className="px-10 pt-14 pb-4 text-center">
        <Box className="mb-8 relative flex items-center justify-center">
          <Box
            className="absolute inset-0 rounded-full scale-125 bg-[#C5A059]/20 blur-2xl animate-pulse"
            style={{ animationDuration: "4000ms" }}
          />
          <span className="material-symbols-outlined relative z-10 text-[72px]! text-[#C5A059] icon-glow">
            mail
          </span>
        </Box>
        <Text size="xs" className="font-sans uppercase tracking-[0.2em] text-white/60">
          Digital Loom
        </Text>
        <Title
          order={1}
          className="font-display text-3xl font-medium leading-tight tracking-tight text-white text-shadow-gold md:text-4xl"
        >
          Verification Sent
        </Title>
      </Stack>

      <Box className="px-10 pb-8 text-center">
        <Text size="sm" className="font-sans leading-relaxed text-[#8e8b85] max-w-xs mx-auto">
          A verification link has been sent to your business email.
        </Text>
      </Box>

      <Stack gap="md" className="px-10 p-10">
        <button
          type="button"
          onClick={handleResend}
          className="group/btn relative flex w-full items-center justify-center gap-2 rounded border border-[#C5A059]/40 bg-transparent py-4 font-sans text-sm font-bold tracking-wide text-[#C5A059] transition-all duration-300 hover:bg-[#C5A059]/5 active:scale-[0.99] overflow-hidden"
        >
          <span className="relative z-10">Resend Link</span>
          <span className="material-symbols-outlined relative z-10 text-lg transition-transform duration-500 group-hover/btn:rotate-180">
            refresh
          </span>
          <span className="absolute inset-0 z-0 bg-[#C5A059]/5 transition-transform duration-300 ease-out translate-y-full group-hover/btn:translate-y-0" />
        </button>
        <Box className="text-center">
          <Link
            href="/login"
            className="font-sans text-[11px] uppercase tracking-widest text-white/20 transition-colors hover:text-white/60 border-b border-transparent hover:border-white/20 pb-0.5"
          >
            Return to Login
          </Link>
        </Box>
      </Stack>
    </>
  );
};

export default SignupVerificationSent;