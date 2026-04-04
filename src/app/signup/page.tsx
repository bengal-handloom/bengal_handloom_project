import { Box } from "@mantine/core";
import { SignupLayout } from "@/components/auth/SignupLayout";
import { SignupStep1Form } from "@/components/auth/SignupStep1Form";
import { SignupStepSwitcher } from "@/components/auth/SignupStepSwitcher";

export const metadata = {
  title: "Artisan Account Registration - The Atelier",
  description: "Apply to join our exclusive network of master artisans.",
};

export default function SignupPage() {
  return (
    <Box className="relative flex min-h-screen flex-col overflow-hidden bg-[#0a0a0a] font-sans text-white selection:bg-[#C5A059]/30 selection:text-white">
      <SignupLayout maxWidth="600px">
        <SignupStepSwitcher />
      </SignupLayout>
    </Box>
  );
}