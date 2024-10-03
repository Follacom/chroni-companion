export enum CrystalColor {
  Blue = 1 << 1,
  Red = 1 << 2,
  Yellow = 1 << 3,
}

export const CRYSTALCOLOR_TO_BACKGROUND: Record<CrystalColor | number, string> =
  {
    [CrystalColor.Blue]: "bg-blue-500",
    [CrystalColor.Red]: "bg-red-500",
    [CrystalColor.Yellow]: "bg-yellow-500",
  };

export enum CrystalPosition {
  A1,
  A2,
  A3,
  B1,
  B2,
  B3,
  C1,
  C2,
  C3,
}

export enum ResolvingStepsPosition {
  L1 = "l-t",
  L2 = "l-m",
  L3 = "l-b",
  T1 = "t-l",
  T2 = "t-m",
  T3 = "t-r",
  R1 = "r-t",
  R2 = "r-m",
  R3 = "r-b",
  B1 = "b-l",
  B2 = "b-m",
  B3 = "b-r",
}

export const POSITION_TO_GRID: Record<ResolvingStepsPosition, string> = {
  [ResolvingStepsPosition.B1]: "col-start-2 row-start-5",
  [ResolvingStepsPosition.B2]: "col-start-3 row-start-5",
  [ResolvingStepsPosition.B3]: "col-start-4 row-start-5",
  [ResolvingStepsPosition.L1]: "col-start-1 row-start-2",
  [ResolvingStepsPosition.L2]: "col-start-1 row-start-3",
  [ResolvingStepsPosition.L3]: "col-start-1 row-start-4",
  [ResolvingStepsPosition.R1]: "col-start-5 row-start-2",
  [ResolvingStepsPosition.R2]: "col-start-5 row-start-3",
  [ResolvingStepsPosition.R3]: "col-start-5 row-start-4",
  [ResolvingStepsPosition.T1]: "col-start-2 row-start-1",
  [ResolvingStepsPosition.T2]: "col-start-3 row-start-1",
  [ResolvingStepsPosition.T3]: "col-start-4 row-start-1",
};
