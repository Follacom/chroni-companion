"use client";

import { createPuzzleStore, PuzzleStoreInstance } from "@/stores/puzzleStore";
import { createContext, PropsWithChildren, useRef } from "react";

export const PuzzleStoreContext = createContext<PuzzleStoreInstance | null>(null);

type PuzzleStoreProviderProps = PropsWithChildren

export default function PuzzleStoreProvider({ children }: PuzzleStoreProviderProps) {
    const storeRef = useRef<ReturnType<typeof createPuzzleStore>>();
    if (!storeRef.current) {
        storeRef.current = createPuzzleStore({});
    }

    return (
        <>
            <PuzzleStoreContext.Provider value={storeRef.current}>
                {children}
            </PuzzleStoreContext.Provider>
        </>
    )
}