"use client";

import { cn } from "@/lib/utils";
import PuzzleGrid from "./grid";
import { usePuzzleStore } from "@/hooks/usePuzzleStore";
import { useEffect } from "react";
import { CrystalColor, POSITION_TO_GRID, ResolvingStepsPosition } from "@/lib/puzzle";
import { observer } from "mobx-react";
import CrystalSlot from "./crystalSlot";
import { Button } from "../ui/button";
import { CheckIcon, ShuffleIcon } from "lucide-react";

function Puzzle() {
    const { grid, results, currentStep, solving, randomizeGrid, solve, activateStep, isValid, isSolved } = usePuzzleStore()

    useEffect(() => {
        randomizeGrid()
    }, [randomizeGrid])

    return (
        <>
            <div className={cn('grid grid-cols-5 grid-rows-5 w-full h-full max-w-xl max-h-96 gap-2')}>
                {
                    Array.from(results.values())
                        .map(({ position, step }) => {
                            return (
                                <div
                                    key={position}
                                    className={
                                        cn(
                                            'flex justify-center items-center',
                                            POSITION_TO_GRID[position as ResolvingStepsPosition]
                                        )
                                    }
                                >
                                    <Button
                                        disabled={!step.includes(currentStep)}
                                        onClick={() => {
                                            activateStep(currentStep);
                                        }}
                                    >
                                        {step.join(' / ')}
                                    </Button>
                                </div>
                            )
                        })
                }

                <PuzzleGrid className={cn('col-start-2 row-start-2 col-span-3 row-span-3 gap-2')}>
                    {
                        grid.map(
                            (crystal, index) => (
                                <CrystalSlot
                                    key={index}
                                    crystal={crystal}
                                />
                            )
                        )
                    }
                </PuzzleGrid>
            </div>
            <div className={cn('flex mt-4 space-x-2')}>
                <Button
                    disabled={!isValid || isSolved || solving}
                    onClick={() => solve()}
                >
                    <CheckIcon />
                </Button>
                <Button
                    disabled={solving}
                    onClick={() => {
                        randomizeGrid()
                    }}
                >
                    <ShuffleIcon />
                </Button>
            </div>
        </>
    )
}

export default observer(Puzzle)