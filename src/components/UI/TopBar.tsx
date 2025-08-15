import React from 'react';
import './TopBar.css';

interface TopBarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onUndo, onRedo, onClear, canUndo, canRedo }) => {
  return (
    <div className="top-bar">
      <div className="app-title">
        <h1>Online Sketch Board</h1>
      </div>
      
      <div className="controls">
        <button
          className={`control-btn ${!canUndo ? 'disabled' : ''}`}
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>
        
        <button
          className={`control-btn ${!canRedo ? 'disabled' : ''}`}
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          ↷ Redo
        </button>
        
        <button
          className="control-btn clear-btn"
          onClick={onClear}
          title="Clear Canvas"
        >
          🗑️ Clear
        </button>
      </div>
    </div>
  );
};

export default TopBar;
