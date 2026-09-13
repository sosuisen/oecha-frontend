export interface DrawLine {
  draw(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    color: number,
  ): void;
}
