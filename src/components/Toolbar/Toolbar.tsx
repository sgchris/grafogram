import React from 'react';
import { ShapeType } from '../../types';
import './Toolbar.css';

interface ToolbarProps {
  selectedTool: ShapeType;
  onToolSelect: (tool: ShapeType) => void;
}

const tools: { type: ShapeType; icon: string; label: string; key: string }[] = [
    { type: 'rectangle', icon: '▭', label: 'Rectangle', key: '1' },
    { type: 'arrow', icon: '➡️', label: 'Arrow', key: '2' },
    { type: 'text', icon: 'T', label: 'Text', key: '3' },
  { type: 'line', icon: '📏', label: 'Line', key: '4' },
  { type: 'circle', icon: '○', label: 'Circle', key: '5' },
];

const Toolbar: React.FC<ToolbarProps> = ({ selectedTool, onToolSelect }) => {
  return (
    <div className="toolbar">
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

export default Toolbar;
