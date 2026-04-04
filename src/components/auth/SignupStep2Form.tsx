"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TextInput, Button, Box, Stack, Title, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSignupStore } from "@/stores/useSignupStore";
import { StepIndicator } from "./StepIndicator";

const inputClass =
  "rounded border border-[#2a2824] bg-[#11100e] px-4 py-3.5 font-sans text-white placeholder:text-[#3a3832] focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/50 outline-none transition-all duration-300";
const labelClass =
  "mb-2 block pl-1 text-xs font-medium uppercase tracking-wider text-white/40 font-sans transition-colors group-focus-within/input:text-[#C5A059]";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPT = ".pdf,.jpg,.jpeg,.png";

type Step2Values = {
  taxId: string;
  businessLicenseFile: File | null;
};

export function SignupStep2Form() {
  const router = useRouter();
  const { step2, setStep2, nextStep, prevStep } = useSignupStore();

  const form = useForm<Step2Values>({
    mode: "uncontrolled",
    initialValues: {
      taxId: step2.taxId,
      businessLicenseFile: step2.businessLicenseFile,
    },
    validate: {
      taxId: (value) => (value?.trim() ? null : "VAT / Tax ID is required"),
      businessLicenseFile: (value) => {
        if (!value) return "Please upload your business license";
        if (value.size > MAX_FILE_SIZE) return "File must be 10MB or less";
        return null;
      },
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    form.setFieldValue("businessLicenseFile", chosen ?? null);
    form.clearFieldError("businessLicenseFile");
    if (chosen && chosen.size > MAX_FILE_SIZE) {
      form.setFieldError("businessLicenseFile", "File must be 10MB or less");
    }
  };

  const handleSubmit = form.onSubmit((values) => {
    setStep2({ businessLicenseFile: values.businessLicenseFile!, taxId: values.taxId });
    nextStep();
  });

  return (
    <>
      <Stack gap="xs" align="center" className="px-10 pt-10 pb-4 text-center">
        <StepIndicator currentStep={2} />
        <Box className="mb-5 text-[#C5A059]/80 animate-pulse" style={{ animationDuration: "3000ms" }}>
          <span className="material-symbols-outlined text-[32px]">diamond</span>
        </Box>
        <Text size="xs" className="font-sans uppercase tracking-[0.3em] text-white/40">
          Registration Step 2
        </Text>
        <Title order={1} className="font-serif text-3xl font-medium leading-tight tracking-tight text-white text-shadow-gold md:text-4xl">
          Business Credentials
        </Title>
        <Text size="sm" className="mx-auto mt-2 max-w-sm font-sans leading-relaxed text-[#8e8b85]">
          Please provide your tax information and upload a valid business license to verify your artisan status.
        </Text>
      </Stack>

      <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-5 px-10 pb-8 pt-4">
        <Box className="group/upload relative">
          <label className={labelClass}>Business License PDF</label>
          <Box
            component="label"
            htmlFor="business-license-upload"
            className="relative flex w-full cursor-pointer flex-col items-center justify-center rounded border border-dashed border-[#3a3832] bg-[#11100e]/50 py-8 px-4 transition-all duration-300 hover:border-[#C5A059]/40 hover:bg-[#1a1816]/80 hover:shadow-[0_0_20px_rgba(194,163,91,0.05)]"
          >
            <input
              id="business-license-upload"
              type="file"
              accept={ACCEPT}
              className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
              onChange={handleFileChange}
            />
            <Box className="mb-3 rounded-full bg-[#C5A059]/10 p-3 transition-transform duration-300 group-hover/upload:scale-110">
              <span className="material-symbols-outlined text-2xl text-[#C5A059]">cloud_upload</span>
            </Box>
            <Text size="sm" className="mb-1 font-sans font-medium text-white/90">
              {form.values.businessLicenseFile
                ? form.values.businessLicenseFile.name
                : "Click to upload or drag and drop"}
            </Text>
            <Text size="xs" className="font-sans text-white/30">
              PDF, JPG or PNG (Max 10MB)
            </Text>
          </Box>
          {form.errors.businessLicenseFile && (
            <Text size="xs" className="mt-1 text-red-400">{form.errors.businessLicenseFile}</Text>
          )}
        </Box>

        <Box className="group/input relative">
          <TextInput
            id="tax-id"
            label="VAT / Tax ID"
            placeholder="Enter your identification number"
            autoComplete="off"
            required
            key={form.key("taxId")}
            {...form.getInputProps("taxId")}
            classNames={{ label: labelClass, input: inputClass }}
            rightSection={<span className="material-symbols-outlined text-sm text-white/20">badge</span>}
          />
        </Box>

        <Stack gap="md" className="mt-2">
          <Button
            type="submit"
            fullWidth
            className="group/btn relative flex items-center justify-center gap-2 overflow-hidden rounded bg-[#C5A059] py-4 text-sm font-bold tracking-wide text-black shadow-[0_4px_20px_rgba(194,163,91,0.15)] transition-all duration-300 hover:bg-[#d4b56a] hover:shadow-[0_4px_25px_rgba(194,163,91,0.25)] active:scale-[0.99]"
          >
            <span className="relative z-10">Submit Verification Documents</span>
            <span className="material-symbols-outlined relative z-10 text-lg transition-transform group-hover/btn:translate-x-1">
              arrow_forward
            </span>
            <span className="absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover/btn:translate-x-full" />
          </Button>
          <Box className="flex cursor-help items-center justify-center gap-2 pt-2 opacity-60 transition-opacity hover:opacity-100">
            <span className="material-symbols-outlined text-[14px] text-white/40">lock_person</span>
            <Text size="xs" className="font-sans font-light tracking-wide text-white/40">
              Security & Privacy: Your data is encrypted and secure.
            </Text>
          </Box>
          <Text size="xs" className="pt-2 text-center font-sans text-white/30">
            <Link
              href="/signup"
              onClick={(e) => {
                e.preventDefault();
                prevStep();
              }}
              className="border-b border-transparent pb-0.5 transition-colors hover:border-[#C5A059]/50 hover:text-[#C5A059]"
            >
              Back to step 1
            </Link>
          </Text>
        </Stack>
      </Box>
    </>
  );
}