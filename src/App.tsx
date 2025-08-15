import React, { useState } from 'react';
import { TopBar, ConfirmationModal } from './components/UI';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { useDrawingTool, useCanvas } from './hooks';
import './App.css';

const App: React.FC = () => {
  const { selectedTool, selectTool } = useDrawingTool();
  const [showClearModal, setShowClearModal] = useState(false);
  
  const {
    canvasRef,
    textInput,
    canUndo,
    canRedo,
    hasUnsavedChanges,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTextSubmit,
    handleUndo,
    handleRedo,
    clearCanvas,
  } = useCanvas(selectedTool);

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
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClearCanvas}
        canUndo={canUndo}
        canRedo={canRedo}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      
      <div className="main-content">
        <Toolbar
          selectedTool={selectedTool}
          onToolSelect={selectTool}
        />
        
        <Canvas
          canvasRef={canvasRef}
          selectedTool={selectedTool}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          textInput={textInput}
          onTextSubmit={handleTextSubmit}
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
