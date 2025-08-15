import { useState, useCallback } from 'react';
import { Shape } from '../types';

/**
 * Custom hook for managing undo/redo functionality
 */
export const useHistory = () => {
  const [undoStack, setUndoStack] = useState<Shape[][]>([]);
  const [redoStack, setRedoStack] = useState<Shape[][]>([]);

  const pushToHistory = useCallback((shapes: Shape[]) => {
    setUndoStack(prev => [...prev, [...shapes]]);
    setRedoStack([]); // Clear redo stack when new action is performed
  }, []);

  const undo = useCallback((): Shape[] | null => {
    if (undoStack.length === 0) return null;

    const previousState = undoStack[undoStack.length - 1];
    const currentState = undoStack[undoStack.length - 2] || [];

    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, previousState]);

    return currentState;
  }, [undoStack]);

  const redo = useCallback((): Shape[] | null => {
    if (redoStack.length === 0) return null;

    const nextState = redoStack[redoStack.length - 1];

    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, nextState]);

    return nextState;
  }, [redoStack]);

  const canUndo = undoStack.length > 0;
  const canRedo = redoStack.length > 0;

  const clearHistory = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  return {
    pushToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
  };
};
