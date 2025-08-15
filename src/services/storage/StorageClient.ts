import { SketchData, SketchMetadata } from '../../types';

/**
 * Abstract storage client interface for sketch data persistence
 */
export interface StorageClient {
  /**
   * Save a sketch to storage
   */
  saveSketch(sketchId: string, data: SketchData): Promise<void>;
  
  /**
   * Load a sketch from storage
   */
  loadSketch(sketchId: string): Promise<SketchData | null>;
  
  /**
   * Delete a sketch from storage
   */
  deleteSketch(sketchId: string): Promise<void>;
  
  /**
   * List all available sketches
   */
  listSketches(): Promise<SketchMetadata[]>;
  
  /**
   * Get the current sketch being worked on
   */
  getCurrentSketch(): Promise<SketchData | null>;
  
  /**
   * Save the current sketch state
   */
  saveCurrentSketch(data: SketchData): Promise<void>;
}
