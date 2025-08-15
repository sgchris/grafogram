export interface Point {
  x: number;
  y: number;
}

export interface ShapeStyle {
  color: string;
  strokeWidth: number;
  fillColor?: string;
}

export type ShapeType = 'rectangle' | 'arrow' | 'text' | 'line' | 'circle' | 'eraser';

export interface Shape {
  id: string;
  type: ShapeType;
  startPoint: Point;
  endPoint: Point;
  style: ShapeStyle;
  text?: string; // for text shapes
}

export interface SketchData {
  id: string;
  name: string;
  shapes: Shape[];
  createdAt: Date;
  updatedAt: Date;
  canvasSize: { width: number; height: number };
}

export interface SketchMetadata {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CanvasState {
  shapes: Shape[];
  selectedTool: ShapeType;
  isDrawing: boolean;
  currentShape: Shape | null;
  canvasSize: { width: number; height: number };
}

export interface HistoryState {
  undoStack: Shape[][];
  redoStack: Shape[][];
  canUndo: boolean;
  canRedo: boolean;
}
