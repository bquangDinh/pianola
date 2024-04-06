import { GameObject } from "./game-object";

export class Staff extends GameObject {
  protected _id = "staff";

  public init(): void | Promise<void> {
    //
  }

  public render(): void | Promise<void> {
    const distPerLine = 10;

    const canvas = this.game.canvas;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let y = this.y;

    for (let i = 0; i < 5; ++i) {
      // Define a new path
      ctx.beginPath();

      // Set a start-point
      ctx.moveTo(0, y);

      // Set an end-point
      ctx.lineTo(canvas.width, y);

      ctx.lineWidth = 2;

      ctx.strokeStyle = "#6D6E6E";

      // Stroke it (Do the Drawing)
      ctx.stroke();

      y += distPerLine;
    }

    // Reset stroke style
    ctx.strokeStyle = "black";
  }

  public update(): void | Promise<void> {
    //
  }

  public destroy(): void | Promise<void> {
    //
  }
}
