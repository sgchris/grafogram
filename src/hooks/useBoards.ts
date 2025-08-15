import { useState, useCallback, useEffect } from 'react';
import { Board, Shape } from '../types';
import { generateId } from '../utils';

const BOARDS_STORAGE_KEY = 'sketch-boards';
const ACTIVE_BOARD_STORAGE_KEY = 'sketch-active-board-id';

/**
 * Custom hook for managing boards
 */
export const useBoards = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [activeBoard, setActiveBoard] = useState<Board | null>(null);

  // Load boards from localStorage on mount
  useEffect(() => {
    try {
      const savedBoards = localStorage.getItem(BOARDS_STORAGE_KEY);
      const activeBoardId = localStorage.getItem(ACTIVE_BOARD_STORAGE_KEY);
      
      if (savedBoards) {
        const parsedBoards: Board[] = JSON.parse(savedBoards).map((board: any) => ({
          ...board,
          createdAt: new Date(board.createdAt),
          updatedAt: new Date(board.updatedAt),
        }));
        
        setBoards(parsedBoards);
        
        // Set active board
        if (activeBoardId) {
          const foundBoard = parsedBoards.find(b => b.id === activeBoardId);
          if (foundBoard) {
            setActiveBoard(foundBoard);
          } else {
            // If active board not found, select first board
            setActiveBoard(parsedBoards[0] || null);
          }
        } else {
          setActiveBoard(parsedBoards[0] || null);
        }
      } else {
        // Create default board if none exist
        const defaultBoard = createDefaultBoard();
        setBoards([defaultBoard]);
        setActiveBoard(defaultBoard);
      }
    } catch (error) {
      console.error('Error loading boards from localStorage:', error);
      // Create default board on error
      const defaultBoard = createDefaultBoard();
      setBoards([defaultBoard]);
      setActiveBoard(defaultBoard);
    }
  }, []);

  // Save boards to localStorage whenever boards change
  useEffect(() => {
    if (boards.length > 0) {
      try {
        localStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(boards));
      } catch (error) {
        console.error('Error saving boards to localStorage:', error);
      }
    }
  }, [boards]);

  // Save active board ID to localStorage whenever it changes
  useEffect(() => {
    if (activeBoard) {
      try {
        localStorage.setItem(ACTIVE_BOARD_STORAGE_KEY, activeBoard.id);
      } catch (error) {
        console.error('Error saving active board to localStorage:', error);
      }
    }
  }, [activeBoard]);

  const createDefaultBoard = (): Board => ({
    id: generateId(),
    name: 'Board 1',
    shapes: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const createBoard = useCallback(() => {
    const newBoard: Board = {
      id: generateId(),
      name: `Board ${boards.length + 1}`,
      shapes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setBoards(prev => [...prev, newBoard]);
    setActiveBoard(newBoard);
    return newBoard;
  }, [boards.length]);

  const selectBoard = useCallback((board: Board) => {
    setActiveBoard(board);
  }, []);

  const renameBoard = useCallback((boardId: string, newName: string) => {
    setBoards(prev => prev.map(board => 
      board.id === boardId 
        ? { ...board, name: newName, updatedAt: new Date() }
        : board
    ));
    
    // Update active board if it's the one being renamed
    if (activeBoard?.id === boardId) {
      setActiveBoard(prev => prev ? { ...prev, name: newName, updatedAt: new Date() } : null);
    }
  }, [activeBoard]);

  const deleteBoard = useCallback((boardId: string) => {
    if (boards.length <= 1) {
      return; // Don't delete if it's the only board
    }
    
    setBoards(prev => prev.filter(board => board.id !== boardId));
    
    // If deleting active board, switch to another board
    if (activeBoard?.id === boardId) {
      const remainingBoards = boards.filter(board => board.id !== boardId);
      setActiveBoard(remainingBoards[0] || null);
    }
  }, [boards, activeBoard]);

  const updateBoardShapes = useCallback((boardId: string, shapes: Shape[]) => {
    setBoards(prev => prev.map(board => 
      board.id === boardId 
        ? { ...board, shapes, updatedAt: new Date() }
        : board
    ));
  }, []);

  return {
    boards,
    activeBoard,
    createBoard,
    selectBoard,
    renameBoard,
    deleteBoard,
    updateBoardShapes,
  };
};
