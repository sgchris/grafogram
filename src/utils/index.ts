import { Point } from '../types';
import type { Shape } from '../types';

/**
 * Generate a unique ID for shapes and sketches
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Calculate distance between two points
 */
export const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

/**
 * Calculate angle between two points in radians
 */
export const angle = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.atan2(y2 - y1, x2 - x1);
};

/**
 * Get mouse position relative to canvas
 */
export const getMousePos = (canvas: HTMLCanvasElement, event: MouseEvent) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Snap angle to nearest round number (in degrees)
 * Snaps to nearest 5-degree increment for better line alignment
 */
export const snapAngle = (angleRad: number): number => {
  // Convert radians to degrees
  let degrees = (angleRad * 180) / Math.PI;
  
  // Normalize to 0-360 range
  degrees = ((degrees % 360) + 360) % 360;
  
  // Snap to nearest 5-degree increment
  const snapIncrement = 5;
  const snappedDegrees = Math.round(degrees / snapIncrement) * snapIncrement;
  
  // Convert back to radians
  return (snappedDegrees * Math.PI) / 180;
};

/**
 * Calculate new endpoint based on snapped angle and original distance
 */
export const getSnappedEndpoint = (start: Point, end: Point): Point => {
  const originalAngle = angle(start.x, start.y, end.x, end.y);
  const originalDistance = distance(start.x, start.y, end.x, end.y);
  const snappedAngle = snapAngle(originalAngle);
  
  return {
    x: start.x + originalDistance * Math.cos(snappedAngle),
    y: start.y + originalDistance * Math.sin(snappedAngle)
  };
};

/**
 * Check if a point is near a line segment within a tolerance
 */
export const isPointNearLine = (point: Point, lineStart: Point, lineEnd: Point, tolerance: number = 5): boolean => {
  const A = point.x - lineStart.x;
  const B = point.y - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  
  if (lenSq === 0) return distance(point.x, point.y, lineStart.x, lineStart.y) <= tolerance;
  
  let param = dot / lenSq;
  param = Math.max(0, Math.min(1, param));
  
  const closestX = lineStart.x + param * C;
  const closestY = lineStart.y + param * D;
  
  return distance(point.x, point.y, closestX, closestY) <= tolerance;
};

/**
 * Check if a point is inside a rectangle
 */
export const isPointInRectangle = (point: Point, rectStart: Point, rectEnd: Point, tolerance: number = 5): boolean => {
  const minX = Math.min(rectStart.x, rectEnd.x) - tolerance;
  const maxX = Math.max(rectStart.x, rectEnd.x) + tolerance;
  const minY = Math.min(rectStart.y, rectEnd.y) - tolerance;
  const maxY = Math.max(rectStart.y, rectEnd.y) + tolerance;
  
  // Check if point is on the border (within tolerance of any edge)
  const onLeftEdge = Math.abs(point.x - minX) <= tolerance && point.y >= minY && point.y <= maxY;
  const onRightEdge = Math.abs(point.x - maxX) <= tolerance && point.y >= minY && point.y <= maxY;
  const onTopEdge = Math.abs(point.y - minY) <= tolerance && point.x >= minX && point.x <= maxX;
  const onBottomEdge = Math.abs(point.y - maxY) <= tolerance && point.x >= minX && point.x <= maxX;
  
  return onLeftEdge || onRightEdge || onTopEdge || onBottomEdge;
};

/**
 * Check if a point is near a circle's circumference
 */
export const isPointNearCircle = (point: Point, circleStart: Point, circleEnd: Point, tolerance: number = 5): boolean => {
  const centerX = (circleStart.x + circleEnd.x) / 2;
  const centerY = (circleStart.y + circleEnd.y) / 2;
  const radius = Math.sqrt(
    Math.pow(circleEnd.x - circleStart.x, 2) + Math.pow(circleEnd.y - circleStart.y, 2)
  ) / 2;
  
  const distFromCenter = distance(point.x, point.y, centerX, centerY);
  return Math.abs(distFromCenter - radius) <= tolerance;
};

/**
 * Check if a point is near text (simple bounding box check)
 */
export const isPointNearText = (point: Point, textPosition: Point, text: string, tolerance: number = 10): boolean => {
  if (!text) return false;
  
  // Rough text dimensions - could be improved with actual text measurement
  const lines = text.split('\n');
  const lineHeight = 20;
  const charWidth = 8; // approximate character width
  const maxLineLength = Math.max(...lines.map(line => line.length));
  
  const textWidth = maxLineLength * charWidth;
  const textHeight = lines.length * lineHeight;
  
  return point.x >= textPosition.x - tolerance &&
         point.x <= textPosition.x + textWidth + tolerance &&
         point.y >= textPosition.y - tolerance &&
         point.y <= textPosition.y + textHeight + tolerance;
};

/**
 * Check if a point collides with a shape
 */
export const isPointCollidingWithShape = (point: Point, shape: Shape): boolean => {
  switch (shape.type) {
    case 'line':
      return isPointNearLine(point, shape.startPoint, shape.endPoint);
    case 'arrow':
      // Check both the main line and arrow head
      if (isPointNearLine(point, shape.startPoint, shape.endPoint)) return true;
      
      // Check arrow head (simplified - just the end point area)
      return distance(point.x, point.y, shape.endPoint.x, shape.endPoint.y) <= 15;
    case 'rectangle':
      return isPointInRectangle(point, shape.startPoint, shape.endPoint);
    case 'circle':
      return isPointNearCircle(point, shape.startPoint, shape.endPoint);
    case 'text':
      return isPointNearText(point, shape.startPoint, shape.text || '');
    default:
      return false;
  }
};
