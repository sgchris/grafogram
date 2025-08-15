import React from 'react';
import { ShapeType } from '../../types';
import './Toolbar.css';

interface ToolsToolbarProps {
  selectedTool: ShapeType;
  onToolSelect: (tool: ShapeType) => void;
}

const tools: { type: ShapeType; icon: string; label: string; key: string }[] = [
  { type: 'eraser', icon: '🧽', label: 'Eraser', key: 'E' },
  { type: 'move', icon: '✋', label: 'Move', key: 'M' },
];

const ToolsToolbar: React.FC<ToolsToolbarProps> = ({ selectedTool, onToolSelect }) => {
  return (
    <div className="toolbar tools-toolbar">
      <div className="toolbar-title">Tools</div>
      {tools.map((tool) => (
        <button
          key={tool.type}
          className={`tool-btn ${selectedTool === tool.type ? 'active' : ''}`}
          onClick={() => onToolSelect(tool.type)}
          title={`${tool.label} (${tool.key})`}
        >
          <span className="tool-icon">{tool.icon}</span>
          <span className="tool-label">{tool.label}</span>
          <span className="tool-key">{tool.key}</span>
        </button>
      ))}
    </div>
  );
};

export default ToolsToolbar;
