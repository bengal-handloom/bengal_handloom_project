"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TextInput, Button, Box, Stack, Title, Text, Grid } from "@mantine/core";
import { useForm } from "@mantine/form";
import { StepIndicator } from "./StepIndicator";
import { useSignupStore } from "@/stores/useSignupStore";

const inputClass =
  "rounded border border-[#2a2824] bg-[#11100e] px-3 py-3.5 text-sm font-sans text-white placeholder:text-[#3a3832] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/50 outline-none transition-all duration-300";
const labelClass =
  "mb-1.5 block pl-1 text-[10px] font-bold uppercase tracking-widest text-white/40 font-sans transition-colors group-focus-within/input:text-[#C5A059]";

type Step1Values = {
  fullName: string;
  jobTitle: string;
  companyName: string;
  websiteUrl: string;
  email: string;

};

export function SignupStep1Form() {
  const router = useRouter();
  const { step1, setStep1, nextStep } = useSignupStore();

  const form = useForm<Step1Values>({
    mode: "uncontrolled",
    initialValues: {
      fullName: step1.fullName,
      jobTitle: step1.jobTitle,
      companyName: step1.companyName,
      websiteUrl: step1.websiteUrl,
      email: step1.email,

    },
    validate: {
      fullName: (value) => (value.trim() ? null : "Full name is required"),
      jobTitle: (value) => (value.trim() ? null : "Job title is required"),
      companyName: (value) => (value.trim() ? null : "Company name is required"),
      websiteUrl: (value) => {
        if (!value?.trim()) return null;
        try {
          new URL(value);
          return null;
        } catch {
          return "Please enter a valid URL";
        }
      },
      email: (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
          ? null
          : "Please enter a valid business email",
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    setStep1(values);
    nextStep();
  });

  return (
    <>
      <Stack gap="xs" align="center" className="px-10 pt-10 pb-4 text-center">
        <StepIndicator currentStep={1} />
        <Text size="xs" className="font-sans uppercase tracking-[0.25em] text-white/50">
          Registration Step 1
        </Text>
        <Title order={1} className="font-serif text-3xl font-medium leading-tight tracking-wide text-white text-shadow-gold md:text-4xl">
          Personal & Business Identity
        </Title>
        <Text size="sm" className="mx-auto mt-2 max-w-sm font-sans leading-relaxed text-[#8e8b85]">
          Begin your application to join our exclusive network of master artisans.
        </Text>
      </Stack>

      <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-5 p-8 pt-4 md:px-12 md:pb-12">
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Full Name"
              placeholder="John Doe"
              autoComplete="name"
              required
              key={form.key("fullName")}
              {...form.getInputProps("fullName")}
              classNames={{ label: labelClass, input: inputClass }}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Job Title"
              placeholder="Creative Director"
              autoComplete="organization-title"
              required
              key={form.key("jobTitle")}
              {...form.getInputProps("jobTitle")}
              classNames={{ label: labelClass, input: inputClass }}
            />
          </Grid.Col>
        </Grid>
        <Box className="group/input">
          <TextInput
            label="Business Email"
            placeholder="name@company.com"
            autoComplete="email"
            required
            key={form.key("email")}
            {...form.getInputProps("email")}
            classNames={{ label: labelClass, input: inputClass }}
            rightSection={<span className="material-symbols-outlined text-sm text-white/20">mail</span>}
          />
        </Box>
        <Box className="group/input">
          <TextInput
            label="Company Name"
            placeholder="e.g. Atelier Noir"
            autoComplete="organization"
            required
            key={form.key("companyName")}
            {...form.getInputProps("companyName")}
            classNames={{ label: labelClass, input: inputClass }}
            rightSection={<span className="material-symbols-outlined text-sm text-white/20">storefront</span>}
          />
        </Box>

        <Box className="group/input">
          <TextInput
            label="Website URL"
            placeholder="https://"
            type="url"
            autoComplete="url"
            key={form.key("websiteUrl")}
            {...form.getInputProps("websiteUrl")}
            classNames={{ label: labelClass, input: inputClass }}
            rightSection={<span className="material-symbols-outlined text-sm text-white/20">globe</span>}
          />
        </Box>

        <Stack gap="md" className="mt-6">
          <Button
            type="submit"
            fullWidth
            className="group/btn relative flex items-center justify-center gap-2 overflow-hidden rounded bg-[#C5A059] py-4 text-sm font-bold tracking-wide text-black transition-all duration-300 hover:bg-[#d4b56a] active:scale-[0.99]"
          >
            <span className="relative z-10">Next Step</span>
            <span className="material-symbols-outlined relative z-10 text-lg transition-transform group-hover/btn:translate-x-1">
              arrow_forward
            </span>
            <span className="absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover/btn:translate-x-full" />
          </Button>
          <Text size="xs" className="pt-2 text-center font-sans text-white/30">
            <Link
              href="/login"
              className="border-b border-transparent pb-0.5 transition-colors hover:border-[#C5A059]/50 hover:text-[#C5A059]"
            >
              Already have an account? Login here
            </Link>
          </Text>
        </Stack>
      </Box>
    </>
  );
}