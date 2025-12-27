import { create } from "zustand";

interface GlobalState {
    title: string,
    setTitle: (title: string) => void,
    userName: string,
    setUserName: (userName: string) => void,
    showHint: boolean,
    setShowHint: (showHint: boolean) => void

    hideFooter: boolean,
    setHideFooter: (hideFooter: boolean) => void
}

export const useGlobalState = create<GlobalState>()((set) => ({
    title: "",
    setTitle: (title: string) => set({ title }),
    userName: "",
    setUserName: (userName: string) => set({ userName }),
    showHint: false,
    setShowHint: (showHint: boolean) => set({ showHint }),
    hideFooter: false,
    setHideFooter: (hideFooter: boolean) => set({ hideFooter })
}))