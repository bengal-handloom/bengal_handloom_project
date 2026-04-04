"use client";

import { useSignupStore } from "@/stores/useSignupStore";
import { SignupStep1Form } from "./SignupStep1Form";
import { SignupStep2Form } from "./SignupStep2Form";
import { SignupStep3Form } from "./SignupStep3Form";
import SignupVerificationSent from "./SignupVerificationSent";

export function SignupStepSwitcher() {
  const currentStep = useSignupStore((s) => s.currentStep);

  if (currentStep === 1) return <SignupStep1Form />;
  if (currentStep === 2) return <SignupStep2Form />;
  if (currentStep === 3) return <SignupStep3Form />;
  if (currentStep === 4) return <SignupVerificationSent />;
  return <SignupStep1Form />;
}