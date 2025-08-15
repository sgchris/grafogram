import { Shape, Point, ShapeType } from '../types';
import { angle } from '../utils';

/**
 * Drawing engine for rendering shapes on canvas
 */
export class DrawingEngine {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  /**
   * Clear the entire canvas
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  /**
   * Draw all shapes
   */
  drawShapes(shapes: Shape[]): void {
    this.clear();
    shapes.forEach(shape => this.drawShape(shape));
  }

  /**
   * Draw a single shape
   */
  drawShape(shape: Shape): void {
    this.ctx.save();
    this.ctx.strokeStyle = shape.style.color;
    this.ctx.lineWidth = shape.style.strokeWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    switch (shape.type) {
      case 'line':
        this.drawLine(shape.startPoint, shape.endPoint);
        break;
      case 'arrow':
        this.drawArrow(shape.startPoint, shape.endPoint);
        break;
      case 'rectangle':
        this.drawRectangle(shape.startPoint, shape.endPoint);
        break;
      case 'circle':
        this.drawCircle(shape.startPoint, shape.endPoint);
        break;
      case 'text':
        this.drawText(shape.text || '', shape.startPoint);
        break;
    }

    this.ctx.restore();
  }

  /**
   * Draw a line
   */
  private drawLine(start: Point, end: Point): void {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
  }

  /**
   * Draw an arrow
   */
  private drawArrow(start: Point, end: Point): void {
    // Draw the line
    this.drawLine(start, end);

    // Draw arrow head
    const headLength = 20;
    const headAngle = Math.PI / 6;
    const lineAngle = angle(start.x, start.y, end.x, end.y);

    this.ctx.beginPath();
    this.ctx.moveTo(end.x, end.y);
    this.ctx.lineTo(
      end.x - headLength * Math.cos(lineAngle - headAngle),
      end.y - headLength * Math.sin(lineAngle - headAngle)
    );
    this.ctx.moveTo(end.x, end.y);
    this.ctx.lineTo(
      end.x - headLength * Math.cos(lineAngle + headAngle),
      end.y - headLength * Math.sin(lineAngle + headAngle)
    );
    this.ctx.stroke();
  }

  /**
   * Draw a rectangle
   */
  private drawRectangle(start: Point, end: Point): void {
    const width = end.x - start.x;
    const height = end.y - start.y;
    
    this.ctx.beginPath();
    this.ctx.rect(start.x, start.y, width, height);
    this.ctx.stroke();
  }

  /**
   * Draw a circle
   */
  private drawCircle(start: Point, end: Point): void {
    const centerX = (start.x + end.x) / 2;
    const centerY = (start.y + end.y) / 2;
    const radius = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    ) / 2;

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  /**
   * Draw text (supports multi-line)
   */
  private drawText(text: string, position: Point): void {
    this.ctx.font = '16px Arial';
    this.ctx.fillStyle = this.ctx.strokeStyle;
    this.ctx.textBaseline = 'top';
    
    const lines = text.split('\n');
    const lineHeight = 20;
    
    lines.forEach((line, index) => {
      this.ctx.fillText(line, position.x, position.y + (index * lineHeight));
    });
  }
}
