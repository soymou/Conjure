"use client";

import { create } from "zustand";

type ToastType = "success" | "error";

type ToastStore = {
  show: (message: string, type?: ToastType) => void;
};

export const useToastStore = create<ToastStore>(() => ({
  show: (_message: string, _type: ToastType = "success") => {
    // Placeholder store to keep hook API stable even when no toast renderer is mounted.
  },
}));
