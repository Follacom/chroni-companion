import PuzzleStoreProvider from "@/components/providers/puzzle";
import Puzzle from "@/components/puzzle";

export default function Page() {
    return (
        <>
            <PuzzleStoreProvider>
                <Puzzle />
            </PuzzleStoreProvider>
        </>
    )
}