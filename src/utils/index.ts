import { Point } from '../types';

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
