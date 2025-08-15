import { useState, useCallback, useEffect } from 'react';
import { ShapeType } from '../types';

/**
 * Custom hook for managing drawing tool selection
 */
export const useDrawingTool = () => {
  const [selectedTool, setSelectedTool] = useState<ShapeType>('rectangle');

  // Handle keyboard shortcuts for tool selection
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Handle number keys 1-5 for shapes
      const key = event.key;
      if (key >= '1' && key <= '5') {
        event.preventDefault();
        const toolMap: Record<string, ShapeType> = {
          '1': 'rectangle',
          '2': 'arrow',
          '3': 'text',
          '4': 'line',
          '5': 'ellipse',
        };
        setSelectedTool(toolMap[key]);
      }
      // Handle letter keys for tools
      else if (key.toLowerCase() === 'e') {
        event.preventDefault();
        setSelectedTool('eraser');
      }
      else if (key.toLowerCase() === 'm') {
        event.preventDefault();
        setSelectedTool('move');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const selectTool = useCallback((tool: ShapeType) => {
    setSelectedTool(tool);
  }, []);

  return {
    selectedTool,
    selectTool,
  };
};
