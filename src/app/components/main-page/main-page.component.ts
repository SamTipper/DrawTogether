import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('colourPreview', { static: false }) colourPreview!: ElementRef<HTMLCanvasElement>;
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D | null;

  currentColourRGB: { R: number, G: number, B: number } = {
    R: 0,
    G: 0,
    B: 0
  };
  
  ngAfterViewInit(): void {
    this.canvas = this.canvasRef.nativeElement;

    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width; // Set canvas width
    this.canvas.height = rect.height; // Set canvas height

    this.ctx = this.canvas.getContext('2d');
    
    if (!this.ctx) {
      console.error("Failed to get canvas context.");
      return;
    }

    // Set drawing styles
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = 'round'; // For rounded line endings

    let isDrawing: boolean = false;
    let lastPoint: { x: number, y: number} | null = null;
  
    this.canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      lastPoint = { x: e.offsetX, y: e.offsetY }; // Store the starting point
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (!isDrawing) return;

      const currentPoint = { x: e.offsetX, y: e.offsetY };

      // Draw a line from the last point to the current point
      this.ctx!.beginPath();
      this.ctx!.moveTo(lastPoint!.x, lastPoint!.y);
      this.ctx!.lineTo(currentPoint.x, currentPoint.y);
      this.ctx!.stroke();

      lastPoint = currentPoint; // Update the last point
    });

    this.canvas.addEventListener('mouseup', () => {
      isDrawing = false;
      lastPoint = null; // Reset the last point
    });

    this.canvas.addEventListener('mouseout', () => {
      isDrawing = false; // Stop drawing if the mouse leaves the canvas
    });
  }

    
  clearCanvas() {
    this.ctx!.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getRGBPreview() {
    return `rgb(${this.currentColourRGB["R"]}, ${this.currentColourRGB["G"]}, ${this.currentColourRGB["B"]})`
  }

  onColorChange() {
    for (const [key, val] of Object.entries(this.currentColourRGB)) {
      const colourKey = key as keyof typeof this.currentColourRGB;

      if (val < 0 || val == null) this.currentColourRGB[colourKey] = 0;
      else if (val > 255) this.currentColourRGB[colourKey] = 255;
    }

    if (this.ctx)
      this.ctx.strokeStyle = `rgb(${this.currentColourRGB["R"]}, ${this.currentColourRGB["G"]}, ${this.currentColourRGB["B"]})`;
  }

}