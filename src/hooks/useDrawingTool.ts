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
      // Only handle number keys 1-7
      const key = event.key;
      if (key >= '1' && key <= '7') {
        event.preventDefault();
        const toolMap: Record<string, ShapeType> = {
          '1': 'rectangle',
          '2': 'arrow',
          '3': 'text',
          '4': 'line',
          '5': 'ellipse',
          '6': 'eraser',
          '7': 'move',
        };
        setSelectedTool(toolMap[key]);
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
