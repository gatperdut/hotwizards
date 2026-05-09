export interface HwCell {
  x: number;
  y: number;
  // TODO don't use strings, move sprite paths to shared?!
  baseSpritePath: string;
  featureSpritePath?: string;
  traversable: boolean;
}
