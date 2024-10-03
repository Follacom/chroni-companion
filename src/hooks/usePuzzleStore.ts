import { PuzzleStoreContext } from "@/components/providers/puzzle";
import { useContext } from "react";

export function usePuzzleStore() {
  const context = useContext(PuzzleStoreContext);
  if (!context) {
    throw Error("useStore must be used within a MobX Provider");
  }

  return context;
}
