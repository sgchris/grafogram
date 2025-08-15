import React from 'react';
import { TopBar } from './components/UI';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { useDrawingTool, useCanvas } from './hooks';
import './App.css';

const App: React.FC = () => {
  const { selectedTool, selectTool } = useDrawingTool();
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

  return (
    <div className="app">
      <TopBar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={clearCanvas}
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
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          textInput={textInput}
          onTextSubmit={handleTextSubmit}
        />
      </div>
    </div>
  );
};

export default App;
