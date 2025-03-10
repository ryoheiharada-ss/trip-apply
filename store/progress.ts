import { create } from 'zustand'

interface ProgressState {
  progress: number
  setProgress: (progress: number) => void
}

export const useProgressStore = create<ProgressState>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress }),
}))
