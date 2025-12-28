import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FileState {
  text: string,
  file: File | null,
  setText: (newText: string) => void,
  setFile: (file: File | null) => void,
  resetText: () => void,
}

export const FileStore = create<FileState>()(
  persist(
    (set) => ({
      text: "",
      file: null,
      setText: (newText: string) => set({ text: newText }),
      setFile: (file: File | null) => set({file: file}),
      resetText: () => set({text: "", file: null})
    }),
    {
      name: "editor"
    }
  )
)