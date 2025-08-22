import { Board, Shape } from '../types';

export interface GrafogramFile {
  version: string;
  board: {
    id: string;
    name: string;
    shapes: Shape[];
    createdAt: string;
    updatedAt: string;
    canvasSize: {
      width: number;
      height: number;
    };
  };
  metadata: {
    exportedAt: string;
    exportedBy: string;
    formatVersion: string;
  };
}

export class GrafogramFileService {
  private static readonly FORMAT_VERSION = '1.0.0';
  private static readonly EXPORTED_BY = 'Grafogram Online Sketch Board';
  
  // UI Layout constants - safe zones to avoid toolbar overlaps
  private static readonly LEFT_TOOLBAR_SAFE_ZONE = 220; // 20px margin + 180px toolbar + 20px spacing
  private static readonly RIGHT_BOARDS_SAFE_ZONE = 290; // 20px margin + 250px panel + 20px spacing
  private static readonly TOP_HEADER_SAFE_ZONE = 80; // Top bar height + spacing

  /**
   * Exports a board to a JSON file and triggers download
   */
  static exportToFile(board: Board, canvasWidth: number = 800, canvasHeight: number = 600): void {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const filename = `grafogram_${board.name.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.json`;

      const grafogramFile: GrafogramFile = {
        version: this.FORMAT_VERSION,
        board: {
          id: board.id,
          name: board.name,
          shapes: board.shapes,
          createdAt: board.createdAt.toISOString(),
          updatedAt: board.updatedAt.toISOString(),
          canvasSize: {
            width: canvasWidth,
            height: canvasHeight,
          },
        },
        metadata: {
          exportedAt: new Date().toISOString(),
          exportedBy: this.EXPORTED_BY,
          formatVersion: this.FORMAT_VERSION,
        },
      };

      const jsonString = JSON.stringify(grafogramFile, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log(`Exported board "${board.name}" to ${filename}`);
    } catch (error) {
      console.error('Error exporting board:', error);
      throw new Error('Failed to export board. Please try again.');
    }
  }

  /**
   * Imports a board from a JSON file
   */
  static async importFromFile(file: File): Promise<Board> {
    try {
      const fileContent = await this.readFileContent(file);
      const grafogramFile = this.parseGrafogramFile(fileContent);
      
      return this.createBoardFromFile(grafogramFile);
    } catch (error) {
      console.error('Error importing board:', error);
      throw new Error(`Failed to import board: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Reads file content as text
   */
  private static readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('Failed to read file content'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error reading file'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Parses and validates the Grafogram file format
   */
  private static parseGrafogramFile(content: string): GrafogramFile {
    try {
      const parsed = JSON.parse(content);
      
      // Validate required structure
      if (!parsed.board) {
        throw new Error('Invalid file format: missing board data');
      }

      if (!parsed.board.name || !parsed.board.shapes || !Array.isArray(parsed.board.shapes)) {
        throw new Error('Invalid file format: incomplete board data');
      }

      // Validate shapes structure
      for (const shape of parsed.board.shapes) {
        if (!shape.id || !shape.type || !shape.startPoint || !shape.endPoint || !shape.style) {
          throw new Error('Invalid file format: incomplete shape data');
        }
      }

      return parsed as GrafogramFile;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Invalid JSON format');
      }
      throw error;
    }
  }

  /**
   * Creates a Board object from the imported file with coordinate adjustments
   */
  private static createBoardFromFile(grafogramFile: GrafogramFile): Board {
    const boardData = grafogramFile.board;
    
    // Adjust shapes coordinates to avoid toolbar overlaps
    const adjustedShapes = this.adjustShapeCoordinates(boardData.shapes);
    
    return {
      id: boardData.id,
      name: boardData.name,
      shapes: adjustedShapes,
      createdAt: new Date(boardData.createdAt),
      updatedAt: new Date(boardData.updatedAt),
    };
  }

  /**
   * Adjusts shape coordinates to ensure they don't overlap with UI toolbars
   */
  private static adjustShapeCoordinates(shapes: Shape[]): Shape[] {
    if (shapes.length === 0) return shapes;

    // Find the bounding box of all shapes
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;

    shapes.forEach(shape => {
      const startX = Math.min(shape.startPoint.x, shape.endPoint.x);
      const startY = Math.min(shape.startPoint.y, shape.endPoint.y);
      const endX = Math.max(shape.startPoint.x, shape.endPoint.x);
      const endY = Math.max(shape.startPoint.y, shape.endPoint.y);

      minX = Math.min(minX, startX);
      minY = Math.min(minY, startY);
      maxX = Math.max(maxX, endX);
      maxY = Math.max(maxY, endY);
    });

    // Calculate adjustments needed
    let offsetX = 0;
    let offsetY = 0;

    // Check if shapes are too close to left toolbar
    if (minX < this.LEFT_TOOLBAR_SAFE_ZONE) {
      offsetX = this.LEFT_TOOLBAR_SAFE_ZONE - minX;
    }

    // Check if shapes are too close to top
    if (minY < this.TOP_HEADER_SAFE_ZONE) {
      offsetY = this.TOP_HEADER_SAFE_ZONE - minY;
    }

    // Check if shapes extend too far to the right (need canvas width for this)
    const currentCanvas = document.querySelector('canvas');
    if (currentCanvas) {
      const canvasWidth = currentCanvas.width;
      const availableWidth = canvasWidth - this.RIGHT_BOARDS_SAFE_ZONE;
      
      if (maxX + offsetX > availableWidth) {
        // If shapes would extend beyond available width, prioritize left margin
        // and let shapes extend to the right (user can scroll if needed)
        console.warn('Imported shapes extend beyond available canvas width');
      }
    }

    // Apply offset to all shapes if needed
    if (offsetX > 0 || offsetY > 0) {
      console.log(`Adjusting imported shapes by offset: x=${offsetX}, y=${offsetY}`);
      return shapes.map(shape => ({
        ...shape,
        startPoint: {
          x: shape.startPoint.x + offsetX,
          y: shape.startPoint.y + offsetY
        },
        endPoint: {
          x: shape.endPoint.x + offsetX,
          y: shape.endPoint.y + offsetY
        }
      }));
    }

    return shapes;
  }

  /**
   * Validates if a file is a valid Grafogram file
   */
  static async validateFile(file: File): Promise<boolean> {
    try {
      if (!file.name.toLowerCase().endsWith('.json')) {
        return false;
      }

      const content = await this.readFileContent(file);
      this.parseGrafogramFile(content);
      return true;
    } catch {
      return false;
    }
  }
}
