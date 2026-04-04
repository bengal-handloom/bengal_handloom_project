import { create } from "zustand";

export interface SignupStep1Data {
  fullName: string;
  jobTitle: string;
  companyName: string;
  websiteUrl: string;
  email: string;   // <- add this
}

export interface SignupStep2Data {
  businessLicenseFile: File | null;
  taxId: string;
}
export interface SignupStep3Data {
  expectedYardage: string;
  preferredFabricType: string;
  brandVision: string;
}

interface SignupState {
  currentStep: number;
  step1: SignupStep1Data;
  step2: SignupStep2Data;
  step3: SignupStep3Data;
  setStep1: (data: Partial<SignupStep1Data>) => void;
  setStep2: (data: Partial<SignupStep2Data>) => void;
  setStep3: (data: Partial<SignupStep3Data>) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const defaultStep1: SignupStep1Data = {
  fullName: "",
  jobTitle: "",
  companyName: "",
  websiteUrl: "",
  email:""
};

const defaultStep2: SignupStep2Data = {
  businessLicenseFile: null,
  taxId: "",
};
const defaultStep3: SignupStep3Data = {
  expectedYardage: "",
  preferredFabricType: "",
  brandVision: "",
};

export const useSignupStore = create<SignupState>((set) => ({
  currentStep: 1,
  step1: defaultStep1,
  step2: defaultStep2,
  step3: defaultStep3,
  setStep1: (data) =>
    set((state) => ({ step1: { ...state.step1, ...data } })),
  setStep2: (data) =>
    set((state) => ({ step2: { ...state.step2, ...data } })),
  setStep3: (data) =>
    set((state) => ({ step3: { ...state.step3, ...data } })),
  setCurrentStep: (currentStep) => set({ currentStep }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),
}));