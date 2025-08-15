import { StorageClient } from './StorageClient';
import { SketchData, SketchMetadata } from '../../types';

/**
 * LocalStorage implementation of the StorageClient interface
 */
export class LocalStorageClient implements StorageClient {
  private readonly SKETCHES_KEY = 'sketch_app_sketches';
  private readonly CURRENT_SKETCH_KEY = 'sketch_app_current';

  async saveSketch(sketchId: string, data: SketchData): Promise<void> {
    try {
      const sketches = await this.getAllSketches();
      sketches[sketchId] = data;
      localStorage.setItem(this.SKETCHES_KEY, JSON.stringify(sketches));
    } catch (error) {
      console.error('Failed to save sketch:', error);
      throw new Error('Failed to save sketch to local storage');
    }
  }

  async loadSketch(sketchId: string): Promise<SketchData | null> {
    try {
      const sketches = await this.getAllSketches();
      const sketchData = sketches[sketchId];
      
      if (!sketchData) {
        return null;
      }

      // Parse dates
      return {
        ...sketchData,
        createdAt: new Date(sketchData.createdAt),
        updatedAt: new Date(sketchData.updatedAt),
      };
    } catch (error) {
      console.error('Failed to load sketch:', error);
      return null;
    }
  }

  async deleteSketch(sketchId: string): Promise<void> {
    try {
      const sketches = await this.getAllSketches();
      delete sketches[sketchId];
      localStorage.setItem(this.SKETCHES_KEY, JSON.stringify(sketches));
    } catch (error) {
      console.error('Failed to delete sketch:', error);
      throw new Error('Failed to delete sketch from local storage');
    }
  }

  async listSketches(): Promise<SketchMetadata[]> {
    try {
      const sketches = await this.getAllSketches();
      return Object.values(sketches).map((sketch) => ({
        id: sketch.id,
        name: sketch.name,
        createdAt: new Date(sketch.createdAt),
        updatedAt: new Date(sketch.updatedAt),
      }));
    } catch (error) {
      console.error('Failed to list sketches:', error);
      return [];
    }
  }

  async getCurrentSketch(): Promise<SketchData | null> {
    try {
      const currentSketchJson = localStorage.getItem(this.CURRENT_SKETCH_KEY);
      if (!currentSketchJson) {
        return null;
      }

      const sketchData = JSON.parse(currentSketchJson);
      return {
        ...sketchData,
        createdAt: new Date(sketchData.createdAt),
        updatedAt: new Date(sketchData.updatedAt),
      };
    } catch (error) {
      console.error('Failed to load current sketch:', error);
      return null;
    }
  }

  async saveCurrentSketch(data: SketchData): Promise<void> {
    try {
      localStorage.setItem(this.CURRENT_SKETCH_KEY, JSON.stringify(data));
      // Also save to the main sketches collection
      await this.saveSketch(data.id, data);
    } catch (error) {
      console.error('Failed to save current sketch:', error);
      throw new Error('Failed to save current sketch to local storage');
    }
  }

  private async getAllSketches(): Promise<Record<string, SketchData>> {
    try {
      const sketchesJson = localStorage.getItem(this.SKETCHES_KEY);
      return sketchesJson ? JSON.parse(sketchesJson) : {};
    } catch (error) {
      console.error('Failed to parse sketches from storage:', error);
      return {};
    }
  }
}

// Export a singleton instance
export const localStorageClient = new LocalStorageClient();
