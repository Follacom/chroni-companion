import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePuzzleStore } from "@/hooks/usePuzzleStore"
import { CrystalColor, CRYSTALCOLOR_TO_BACKGROUND, CrystalPosition } from "@/lib/puzzle"
import { cn } from "@/lib/utils"
import { CrystalInstance } from "@/stores/puzzleStore"
import { observer } from "mobx-react"

type CrystalSlotProps = {
    crystal: CrystalInstance
}

function CrystalSlot({ crystal }: CrystalSlotProps) {
    const { changeCrystalColor } = usePuzzleStore()

    return (
        <>
            <Select
                value={crystal.color.toString()}
                onValueChange={(value) => {
                    changeCrystalColor(crystal.position, Number(value));
                }}
            >
                <SelectTrigger
                    className={
                        cn(
                            'h-full w-full rounded border border-foreground transition-colors duration-150',
                            CRYSTALCOLOR_TO_BACKGROUND[crystal.color]
                        )
                    }
                    title={CrystalPosition[crystal.position]}
                >
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={CrystalColor.Blue.toString()}>
                        {CrystalColor[CrystalColor.Blue]}
                    </SelectItem>
                    <SelectItem value={CrystalColor.Red.toString()}>
                        {CrystalColor[CrystalColor.Red]}
                    </SelectItem>
                    <SelectItem value={CrystalColor.Yellow.toString()}>
                        {CrystalColor[CrystalColor.Yellow]}
                    </SelectItem>
                </SelectContent>
            </Select>
        </>
    )
}

export default observer(CrystalSlot)