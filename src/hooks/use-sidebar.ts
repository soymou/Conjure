"use client";

import { create } from "zustand";

interface SidebarState {
  open: boolean;
  toggle: () => void;
}

export const useSidebar = create<SidebarState>((set) => ({
  open: false,
  toggle: () => set((s) => ({ open: !s.open })),
}));
