import {
  CrystalColor,
  CrystalPosition,
  ResolvingStepsPosition,
} from "@/lib/puzzle";
import { Instance, SnapshotIn, types } from "mobx-state-tree";

export const Crystal = types
  .model({
    position: types.number,
    color: types.number,
  })
  .actions((self) => ({
    changeColor(newColor: CrystalColor) {
      self.color = newColor;
    },
  }));
export type CrystalInstance = Instance<typeof Crystal>;

export const PuzzleStore = types
  .model("PuzzleStore", {
    grid: types.array(Crystal),
    results: types.map(
      types.model({
        position: types.identifier,
        step: types.array(types.number),
      })
    ),
    currentStep: types.number,
    solving: types.boolean,
  })
  .views((self) => ({
    get isValid() {
      const totalWeight =
        CrystalColor.Blue * 3 + CrystalColor.Red * 3 + CrystalColor.Yellow * 3;
      return (
        self.grid.reduce((acc, current) => acc + current.color, 0) ===
        totalWeight
      );
    },
    get isSolved() {
      if (!(self.grid.length > 0)) return false;
      return (
        (new Set([self.grid[0].color, self.grid[1].color, self.grid[2].color])
          .size === 1 &&
          new Set([self.grid[3].color, self.grid[4].color, self.grid[5].color])
            .size === 1 &&
          new Set([self.grid[6].color, self.grid[7].color, self.grid[8].color])
            .size === 1) ||
        (new Set([self.grid[0].color, self.grid[3].color, self.grid[6].color])
          .size === 1 &&
          new Set([self.grid[1].color, self.grid[4].color, self.grid[7].color])
            .size === 1 &&
          new Set([self.grid[2].color, self.grid[5].color, self.grid[8].color])
            .size === 1)
      );
    },
  }))
  .actions((self) => {
    function clearResults() {
      self.currentStep = 1;
      self.results.clear();
    }

    return {
      randomizeGrid() {
        clearResults();
        const available = Array.from({ length: 9 }, (_, index) => {
          switch (Math.floor(index / 3)) {
            case 0:
              return CrystalColor.Blue;
            case 1:
              return CrystalColor.Red;
            case 2:
              return CrystalColor.Yellow;
            default:
              throw new Error("Error when randomizing the puzzle");
          }
        });

        const nextGrid: CrystalInstance[] = [];

        do {
          const randomIndex = Math.floor(
            Math.random() * Math.floor(available.length - 1)
          );
          nextGrid.push(
            Crystal.create({
              position: nextGrid.length,
              color: available.splice(randomIndex, 1)[0],
            })
          );
        } while (available.length > 0);

        self.grid.replace(nextGrid);
      },
      changeCrystalColor(position: number, newColor: CrystalColor) {
        clearResults();
        self.grid[position].changeColor(newColor);
      },
      solve() {
        self.solving = true;
        clearResults();

        function shiftRow(
          grid: number[][],
          index: number,
          direction: "left" | "right"
        ) {
          const newGrid = grid.map((row) => [...row]);
          if (direction === "left") {
            newGrid[index].push(newGrid[index].shift()!);
          }
          if (direction === "right") {
            newGrid[index].unshift(newGrid[index].pop()!);
          }
          return newGrid;
        }
        function shiftCol(
          grid: number[][],
          index: number,
          direction: "up" | "down"
        ) {
          const newGrid = grid.map((row) => [...row]);
          if (direction === "up") {
            const top = newGrid[0][index];
            for (let row = 0; row < 2; row++) {
              newGrid[row][index] = newGrid[row + 1][index];
            }
            newGrid[2][index] = top;
          }
          if (direction === "down") {
            const bottom = newGrid[2][index];
            for (let row = 2; row > 0; row--) {
              newGrid[row][index] = newGrid[row - 1][index];
            }
            newGrid[0][index] = bottom;
          }
          return newGrid;
        }

        function misalignedCount(line: number[]) {
          return new Set(line).size - 1;
        }

        function heuristic(grid: number[][]) {
          let minMisalignedRows = Infinity,
            minMisalignedCols = Infinity;

          for (let row = 0; row < 3; row++) {
            minMisalignedRows = Math.min(
              minMisalignedRows,
              misalignedCount(grid[row])
            );
          }
          for (let col = 0; col < 3; col++) {
            minMisalignedCols = Math.min(
              minMisalignedCols,
              misalignedCount([grid[0][col], grid[1][col], grid[2][col]])
            );
          }
          return Math.min(minMisalignedCols, minMisalignedRows);
        }

        function generateMoves(grid: number[][]) {
          const states: { state: number[][]; step: ResolvingStepsPosition }[] =
            [];

          for (let row = 0; row < 3; row++) {
            states.push({
              state: shiftRow(grid, row, "left"),
              // @ts-expect-error
              step: ResolvingStepsPosition[`L${row + 1}`],
            });
            states.push({
              state: shiftRow(grid, row, "right"),
              // @ts-expect-error
              step: ResolvingStepsPosition[`R${row + 1}`],
            });
          }

          for (let col = 0; col < 3; col++) {
            states.push({
              state: shiftCol(grid, col, "up"),
              // @ts-expect-error
              step: ResolvingStepsPosition[`T${col + 1}`],
            });
            states.push({
              state: shiftCol(grid, col, "down"),
              // @ts-expect-error
              step: ResolvingStepsPosition[`B${col + 1}`],
            });
          }

          return states;
        }

        function matrixToString(grid: number[][]): string {
          return grid.map((row) => row.join("")).join("");
        }

        // Check if any row or column is fully aligned
        function isSolved(grid: number[][]): boolean {
          let rowsAligned = true,
            colsAligned = true;

          // Check rows
          for (let row = 0; row < 3; row++) {
            rowsAligned = rowsAligned && new Set(grid[row]).size === 1;
          }

          // Check columns
          for (let col = 0; col < 3; col++) {
            const columnElements = [grid[0][col], grid[1][col], grid[2][col]];
            colsAligned = colsAligned && new Set(columnElements).size === 1;
          }

          return rowsAligned || colsAligned;
        }

        const openSet = new Map<
            string,
            { state: number[][]; g: number; step: ResolvingStepsPosition[] }
          >(),
          closedSet = new Set<string>(),
          cameFrom = new Map<string, number[][]>();

        const grid = [
          self.grid.slice(0, 3).map((cell) => cell.color),
          self.grid.slice(3, 6).map((cell) => cell.color),
          self.grid.slice(6, 9).map((cell) => cell.color),
        ];
        openSet.set(matrixToString(grid), { state: [...grid], g: 0, step: [] });

        while (openSet.size > 0) {
          // Get the node with the lowest f = g + h
          const currentEntry = Array.from(openSet.values()).reduce(
            (best, entry) => {
              const h = heuristic(entry.state);
              return best.g + heuristic(best.state) > entry.g + h
                ? entry
                : best;
            }
          );

          const currentState = currentEntry.state;
          const currentKey = matrixToString(currentState);

          // If current state has aligned rows/columns, return the solution
          if (isSolved(currentState)) {
            currentEntry.step.forEach((step, index) => {
              if (self.results.has(step)) {
                self.results.get(step)!.step.push(index + 1);
              } else {
                self.results.set(step, { position: step, step: [index + 1] });
              }
            });
            console.log(1);
            self.solving = false;
            return;
          }

          // Remove current from openSet and add to closedSet
          openSet.delete(currentKey);
          closedSet.add(currentKey);

          // Generate neighbors (valid moves)
          const neighbors = generateMoves(currentState);
          for (const neighbor of neighbors) {
            const neighborKey = matrixToString(neighbor.state);

            if (closedSet.has(neighborKey)) {
              continue;
            }

            const tentative_g = currentEntry.g + 1; // Every move costs 1

            if (
              !openSet.has(neighborKey) ||
              tentative_g < openSet.get(neighborKey)!.g
            ) {
              cameFrom.set(neighborKey, currentState);
              openSet.set(neighborKey, {
                state: neighbor.state,
                g: tentative_g,
                step: [...currentEntry.step, neighbor.step],
              });
            }
          }
        }
      },
      activateStep(step: number) {
        const moveNeeded = Array.from(self.results.values()).find((res) =>
          res.step.includes(step)
        );

        if (moveNeeded) {
          let colorPivot;
          switch (moveNeeded.position) {
            case ResolvingStepsPosition.B1:
              colorPivot = self.grid[CrystalPosition.C1].color;
              self.grid[CrystalPosition.C1].changeColor(
                self.grid[CrystalPosition.B1].color
              );
              self.grid[CrystalPosition.B1].changeColor(
                self.grid[CrystalPosition.A1].color
              );
              self.grid[CrystalPosition.A1].changeColor(colorPivot);
              break;
            case ResolvingStepsPosition.B2:
              colorPivot = self.grid[CrystalPosition.C2].color;
              self.grid[CrystalPosition.C2].changeColor(
                self.grid[CrystalPosition.B2].color
              );
              self.grid[CrystalPosition.B2].changeColor(
                self.grid[CrystalPosition.A2].color
              );
              self.grid[CrystalPosition.A2].changeColor(colorPivot);
              break;
            case ResolvingStepsPosition.B3:
              colorPivot = self.grid[CrystalPosition.C3].color;
              self.grid[CrystalPosition.C3].changeColor(
                self.grid[CrystalPosition.B3].color
              );
              self.grid[CrystalPosition.B3].changeColor(
                self.grid[CrystalPosition.A3].color
              );
              self.grid[CrystalPosition.A3].changeColor(colorPivot);
              break;
            case ResolvingStepsPosition.R1:
              colorPivot = self.grid[CrystalPosition.A3].color;
              self.grid[CrystalPosition.A3].changeColor(
                self.grid[CrystalPosition.A2].color
              );
              self.grid[CrystalPosition.A2].changeColor(
                self.grid[CrystalPosition.A1].color
              );
              self.grid[CrystalPosition.A1].changeColor(colorPivot);
              break;
            case ResolvingStepsPosition.R2:
              colorPivot = self.grid[CrystalPosition.B3].color;
              self.grid[CrystalPosition.B3].changeColor(
                self.grid[CrystalPosition.B2].color
              );
              self.grid[CrystalPosition.B2].changeColor(
                self.grid[CrystalPosition.B1].color
              );
              self.grid[CrystalPosition.B1].changeColor(colorPivot);
              break;
            case ResolvingStepsPosition.R3:
              colorPivot = self.grid[CrystalPosition.C3].color;
              self.grid[CrystalPosition.C3].changeColor(
                self.grid[CrystalPosition.C2].color
              );
              self.grid[CrystalPosition.C2].changeColor(
                self.grid[CrystalPosition.C1].color
              );
              self.grid[CrystalPosition.C1].changeColor(colorPivot);
              break;
            case ResolvingStepsPosition.L1:
              colorPivot = self.grid[CrystalPosition.A1].color;
              self.grid[CrystalPosition.A1].changeColor(
                self.grid[CrystalPosition.A2].color
              );
              self.grid[CrystalPosition.A2].changeColor(
                self.grid[CrystalPosition.A3].color
              );
              self.grid[CrystalPosition.A3].changeColor(colorPivot);
              break;
            case ResolvingStepsPosition.L2:
              colorPivot = self.grid[CrystalPosition.B1].color;
              self.grid[CrystalPosition.B1].changeColor(
                self.grid[CrystalPosition.B2].color
              );
              self.grid[CrystalPosition.B2].changeColor(
                self.grid[CrystalPosition.B3].color
              );
              self.grid[CrystalPosition.B3].changeColor(colorPivot);
              break;
            case ResolvingStepsPosition.L3:
              colorPivot = self.grid[CrystalPosition.C1].color;
              self.grid[CrystalPosition.C1].changeColor(
                self.grid[CrystalPosition.C2].color
              );
              self.grid[CrystalPosition.C2].changeColor(
                self.grid[CrystalPosition.C3].color
              );
              self.grid[CrystalPosition.C3].changeColor(colorPivot);
              break;
            case ResolvingStepsPosition.T1:
              colorPivot = self.grid[CrystalPosition.A1].color;
              self.grid[CrystalPosition.A1].changeColor(
                self.grid[CrystalPosition.B1].color
              );
              self.grid[CrystalPosition.B1].changeColor(
                self.grid[CrystalPosition.C1].color
              );
              self.grid[CrystalPosition.C1].changeColor(colorPivot);
              break;
            case ResolvingStepsPosition.T2:
              colorPivot = self.grid[CrystalPosition.A2].color;
              self.grid[CrystalPosition.A2].changeColor(
                self.grid[CrystalPosition.B2].color
              );
              self.grid[CrystalPosition.B2].changeColor(
                self.grid[CrystalPosition.C2].color
              );
              self.grid[CrystalPosition.C2].changeColor(colorPivot);
              break;
            case ResolvingStepsPosition.T3:
              colorPivot = self.grid[CrystalPosition.A3].color;
              self.grid[CrystalPosition.A3].changeColor(
                self.grid[CrystalPosition.B3].color
              );
              self.grid[CrystalPosition.B3].changeColor(
                self.grid[CrystalPosition.C3].color
              );
              self.grid[CrystalPosition.C3].changeColor(colorPivot);
              break;
          }
          self.currentStep = step + 1;
        }
      },
    };
  });

export type PuzzleStoreInstance = Instance<typeof PuzzleStore>;
export type PuzzleProps = SnapshotIn<PuzzleStoreInstance>;

const initialProps: PuzzleProps = {
  currentStep: 1,
  solving: false,
};

export const createPuzzleStore: (
  data: Partial<PuzzleProps>
) => PuzzleStoreInstance = (data = {}) =>
  PuzzleStore.create({ ...initialProps, ...data });
