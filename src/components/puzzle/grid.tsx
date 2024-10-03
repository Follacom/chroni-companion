import { cn } from "@/lib/utils"
import { PropsWithChildren } from "react"

type PuzzleGridProps = PropsWithChildren<{
    className?: string
}>

export default function PuzzleGrid({ children, className }: PuzzleGridProps) {
    return (
        <>
            <div className={cn('grid grid-cols-3 grid-rows-3', className)}>
                {children}
            </div>
        </>
    )
}