import React from 'react';
import './TopBar.css';

interface TopBarProps {
  onImport: () => void;
  onExport: () => void;
  onClear: () => void;
  hasUnsavedChanges: boolean;
  isSaving?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onImport, onExport, onClear, hasUnsavedChanges, isSaving = false }) => {
  return (
    <div className="top-bar">
      <div className="app-title">
        <h1><u>G</u>rafogram - Online Sketch Board</h1>
        {isSaving && (
          <div className="save-indicator">
            <span className="save-status">●</span>
            <span className="save-text">Saving...</span>
          </div>
        )}
      </div>
      
      <div className="controls">
        <button
          className="control-btn"
          onClick={onImport}
          title="Import JSON file"
        >
          📁 Import
        </button>
        
        <button
          className="control-btn"
          onClick={onExport}
          title="Export to JSON file"
        >
          💾 Export
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
