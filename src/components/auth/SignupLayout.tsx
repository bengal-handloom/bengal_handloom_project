"use client";

import { Box } from "@mantine/core";

const SIGNUP_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDovQIccC1wEqq4OyO9loqjiO4odjt2_zX5mLVlpo0itXfh-IpGkIttux3Pc1pN3t6NLddmEF1Vomqg-sIi3bKmY5fnaSqD6Bfjt8N7EFJHdYkS1_YsFZTOhVWXCKGa0q-vS6wdfdiq1qaEmWf2JLCFbG9LcPV-6dkb5VvcRnFzGRdBLPJ4cQ6rhNcRQgLPrUmvzzmn255SB-6O0VJIiLCfz5kSGbDDr1lU7C_SMbgdGpHoeYyFKsX64hewZhfSlAC23QcwEYPVFyLP";

const NOISE_SVG =
  "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E";

interface SignupLayoutProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export function SignupLayout({ children, maxWidth = "600px" }: SignupLayoutProps) {

  
  return (
    <>
      <Box className="absolute inset-0 z-0">
        <Box
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url('${SIGNUP_BG}')`, filter: "blur(8px) brightness(0.4)" }}
        />
        <Box
          className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay"
          style={{ backgroundImage: `url("${NOISE_SVG}")` }}
        />
        <Box className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
      </Box>
      <Box
        component="main"
        className="relative z-10 flex min-h-screen flex-1 flex-col items-center justify-center p-4"
      >
        <Box
          className="glass-panel-auth group relative w-full overflow-hidden rounded-lg border border-white/5 animate-fade-in-up"
          style={{ maxWidth }}
        >
          {children}
          <Box
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent"
            aria-hidden
          />
        </Box>
        <Box className="absolute bottom-6 flex gap-4 font-sans text-[10px] uppercase tracking-widest text-white/10">
          <span>© {new Date().getFullYear()} The Atelier</span>
          <span>•</span>
          <a href="#" className="hover:text-white/20">
            Privacy Policy
          </a>
        </Box>
      </Box>
    </>
  );
}