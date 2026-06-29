import { create } from "zustand";
import type { BookingStep, BookingWizardState } from "@/types/booking";

interface BookingActions {
  setStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setService: (service: BookingWizardState["selectedService"]) => void;
  setEmployee: (
    employee: BookingWizardState["selectedEmployee"],
    anyEmployee: boolean,
  ) => void;
  setDateTime: (date: string, slot: BookingWizardState["selectedSlot"]) => void;
  setCustomerDetails: (details: {
    name: string;
    email: string;
    phone: string;
    note: string;
  }) => void;
  reset: () => void;
}

const initialState: BookingWizardState = {
  currentStep: 1,
  selectedService: null,
  selectedEmployee: null,
  anyEmployee: false,
  selectedDate: null,
  selectedSlot: null,
  customerName: "",
  customerEmail: "",
  customerPhone: "",
  customerNote: "",
};

export const useBookingStore = create<BookingWizardState & BookingActions>(
  (set, get) => ({
    ...initialState,

    setStep(step) {
      set({ currentStep: step });
    },

    nextStep() {
      const current = get().currentStep;
      if (current < 5) {
        set({ currentStep: (current + 1) as BookingStep });
      }
    },

    prevStep() {
      const current = get().currentStep;
      if (current > 1) {
        set({ currentStep: (current - 1) as BookingStep });
      }
    },

    setService(service) {
      set({
        selectedService: service,
        // Reset downstream selections when service changes
        selectedEmployee: null,
        anyEmployee: false,
        selectedDate: null,
        selectedSlot: null,
      });
    },

    setEmployee(employee, anyEmployee) {
      set({
        selectedEmployee: employee,
        anyEmployee,
        // Reset downstream when barber changes
        selectedDate: null,
        selectedSlot: null,
      });
    },

    setDateTime(date, slot) {
      set({ selectedDate: date, selectedSlot: slot });
    },

    setCustomerDetails({ name, email, phone, note }) {
      set({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerNote: note,
      });
    },

    reset() {
      set(initialState);
    },
  }),
);