import React, { useState, useCallback } from 'react';
import { TopBar, ConfirmationModal } from './components/UI';
import { ShapesToolbar, ToolsToolbar } from './components/Toolbar';
import { BoardsPanel } from './components/BoardsPanel';
import { Canvas } from './components/Canvas';
import { useDrawingTool, useCanvas, useBoards } from './hooks';
import './App.css';

const App: React.FC = () => {
  const { selectedTool, selectTool } = useDrawingTool();
  const [showClearModal, setShowClearModal] = useState(false);
  
  const {
    boards,
    activeBoard,
    createBoard,
    selectBoard,
    renameBoard,
    deleteBoard,
    updateBoardShapes,
    exportCurrentBoard,
    importBoard,
  } = useBoards();

  const handleBoardShapesChange = useCallback((shapes: any[]) => {
    if (activeBoard) {
      updateBoardShapes(activeBoard.id, shapes);
    }
  }, [activeBoard?.id, updateBoardShapes]); // Use only the ID instead of the whole object

  const handleImport = async () => {
    try {
      await importBoard();
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import file. Please check the file format and try again.');
    }
  };

  const handleExport = () => {
    try {
      exportCurrentBoard();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export board. Please try again.');
    }
  };
  
  const {
    canvasRef,
    textInput,
    canUndo,
    canRedo,
    hasUnsavedChanges,
    isSaving,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTextSubmit,
    handleUndo,
    handleRedo,
    clearCanvas,
    hoveredShape,
    selectedShape,
    isMoving,
  } = useCanvas(selectedTool, activeBoard?.shapes || [], handleBoardShapesChange);

  const handleClearCanvas = () => {
    setShowClearModal(true);
  };

  const handleConfirmClear = () => {
    clearCanvas();
    setShowClearModal(false);
  };

  const handleCancelClear = () => {
    setShowClearModal(false);
  };

  return (
    <div className="app">
      <TopBar
        onImport={handleImport}
        onExport={handleExport}
        onClear={handleClearCanvas}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
      />
      
      <div className="main-content">
        <ShapesToolbar
          selectedTool={selectedTool}
          onToolSelect={selectTool}
        />
        
        <ToolsToolbar
          selectedTool={selectedTool}
          onToolSelect={selectTool}
        />
        
        <BoardsPanel
          boards={boards}
          activeBoard={activeBoard}
          onBoardSelect={selectBoard}
          onBoardRename={renameBoard}
          onBoardDelete={deleteBoard}
          onBoardCreate={createBoard}
        />
        
        <Canvas
          canvasRef={canvasRef}
          selectedTool={selectedTool}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          textInput={textInput}
          onTextSubmit={handleTextSubmit}
          hoveredShape={hoveredShape}
          isMoving={isMoving}
        />
      </div>

      {showClearModal && (
        <ConfirmationModal
          title="Clear Canvas"
          message="Are you sure you want to clear the entire canvas? This action cannot be undone."
          onConfirm={handleConfirmClear}
          onCancel={handleCancelClear}
          confirmText="Clear"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};

export default App;
