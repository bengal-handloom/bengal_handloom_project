"use client";

import Link from "next/link";
import { Button, Box, Stack, Title, Text, Textarea, TextInput, Alert } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { useSignupStore } from "@/stores/useSignupStore";
import { StepIndicator } from "./StepIndicator";

const inputClass =
  "rounded border border-[#2a2824] bg-[#11100e] px-4 py-3.5 font-sans text-white placeholder:text-[#3a3832] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/50 outline-none transition-all duration-300";
const labelClass =
  "mb-2 block pl-1 text-xs font-medium uppercase tracking-wider text-white/40 font-sans transition-colors group-focus-within/input:text-[#C5A059]";

type Step3Values = {
  expectedYardage: string;
  preferredFabricType: string;
  brandVision: string;
};

export function SignupStep3Form() {
  const { step1, step2, step3, setStep3, prevStep, setCurrentStep } = useSignupStore();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<Step3Values>({
    mode: "uncontrolled",
    initialValues: {
      expectedYardage: step3.expectedYardage,
      preferredFabricType: step3.preferredFabricType,
      brandVision: step3.brandVision,
    },
    validate: {
      expectedYardage: (value) => (value.trim() ? null : "Expected yardage is required"),
      preferredFabricType: (value) => (value.trim() ? null : "Preferred fabric type is required"),
      brandVision: (value) => (value.trim() ? null : "Brand vision is required"),
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setSubmitError(null);
    setSubmitting(true);

    try {
      // Keep store in sync
      setStep3(values);

      if (!step2.businessLicenseFile) {
        throw new Error("Business license file is missing. Please go back to step 2 and re-upload.");
      }

      const fd = new FormData();

      // step1
      fd.append("fullName", step1.fullName);
      fd.append("jobTitle", step1.jobTitle);
      fd.append("companyName", step1.companyName);
      fd.append("websiteUrl", step1.websiteUrl);
      fd.append("email", step1.email);

      // step2
      fd.append("taxId", step2.taxId);
      fd.append("businessLicenseFile", step2.businessLicenseFile);

      // step3
      fd.append("expectedYardage", values.expectedYardage);
      fd.append("preferredFabricType", values.preferredFabricType);
      fd.append("brandVision", values.brandVision);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Registration failed. Please try again.");
      }

      // Show step-4 success state in the current signup flow
      setCurrentStep(4);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <>
      <Stack gap="xs" align="center" className="px-10 pt-10 pb-4 text-center">
        <StepIndicator currentStep={3} />
        <Box className="mb-5 text-[#C5A059]/80 animate-pulse" style={{ animationDuration: "3000ms" }}>
          <span className="material-symbols-outlined text-[32px]">checkroom</span>
        </Box>
        <Text size="xs" className="font-sans uppercase tracking-[0.3em] text-white/40">
          Registration Step 3 of 3
        </Text>
        <Title
          order={1}
          className="font-serif text-3xl font-medium leading-tight tracking-tight text-white text-shadow-gold md:text-4xl"
        >
          Brand Aesthetics
        </Title>
        <Text size="sm" className="mx-auto mt-2 max-w-sm font-sans leading-relaxed text-[#8e8b85]">
          To better serve your needs, please detail your volume requirements and fabric preferences.
        </Text>
      </Stack>

      <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-5 px-10 pb-8 pt-4">
        {submitError && (
          <Alert color="red" variant="light">
            {submitError}
          </Alert>
        )}

        <Box className="group/input relative">
          <TextInput
            id="monthly-yardage"
            label="Expected Monthly Yardage"
            placeholder="e.g. 500-1000 meters"
            autoComplete="off"
            required
            key={form.key("expectedYardage")}
            {...form.getInputProps("expectedYardage")}
            classNames={{ label: labelClass, input: inputClass }}
            rightSection={<span className="material-symbols-outlined text-sm text-white/20">badge</span>}
          />
        </Box>

        <Box className="group/input relative">
          <TextInput
            id="preferred-fabric-type"
            label="Preferred Fabric Type"
            placeholder="e.g. Linen, Cotton, Silk blends"
            autoComplete="off"
            required
            key={form.key("preferredFabricType")}
            {...form.getInputProps("preferredFabricType")}
            classNames={{ label: labelClass, input: inputClass }}
            rightSection={<span className="material-symbols-outlined text-sm text-white/20">texture</span>}
          />
        </Box>

        <Box className="group/input relative">
          <Textarea
            id="brand-vision"
            label="Tell us about your brand vision"
            placeholder="Describe your aesthetic and sourcing needs..."
            autoComplete="off"
            required
            minRows={4}
            key={form.key("brandVision")}
            {...form.getInputProps("brandVision")}
            classNames={{ label: labelClass, input: inputClass }}
          />
        </Box>

        <Stack gap="md" className="mt-2">
          <Button
            type="submit"
            fullWidth
            loading={submitting}
            disabled={submitting}
            className="group/btn relative flex items-center justify-center gap-2 overflow-hidden rounded bg-[#C5A059] py-4 text-sm font-bold tracking-wide text-black shadow-[0_4px_20px_rgba(194,163,91,0.15)] transition-all duration-300 hover:bg-[#d4b56a] hover:shadow-[0_4px_25px_rgba(194,163,91,0.25)] active:scale-[0.99]"
          >
            <span className="relative z-10">Submit Application</span>
            <span className="material-symbols-outlined relative z-10 text-lg transition-transform group-hover/btn:translate-x-1">
              arrow_forward
            </span>
            <span className="absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover/btn:translate-x-full" />
          </Button>

          <Text size="xs" className="pt-2 text-center font-sans text-white/30">
            <Link
              href="/signup"
              onClick={(e) => {
                e.preventDefault();
                prevStep();
              }}
              className="border-b border-transparent pb-0.5 transition-colors hover:border-[#C5A059]/50 hover:text-[#C5A059]"
            >
              Back to step 2
            </Link>
          </Text>
        </Stack>
      </Box>
    </>
  );
}