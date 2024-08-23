import { create } from 'zustand'

type SettingStore = {
    isOpen: boolean 
    onOpen:()=>void
    toggle:()=>void
    onClose:()=>void
}

export const useSetting= create<SettingStore>((set, get)=> ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    toggle:()=>set({isOpen:!get().isOpen})
}))