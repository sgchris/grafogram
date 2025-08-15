import React from 'react';
import { ShapeType } from '../../types';
import './Toolbar.css';

interface ShapesToolbarProps {
  selectedTool: ShapeType;
  onToolSelect: (tool: ShapeType) => void;
}

const shapes: { type: ShapeType; icon: string; label: string; key: string }[] = [
  { type: 'rectangle', icon: '▭', label: 'Rectangle', key: '1' },
  { type: 'arrow', icon: '➡️', label: 'Arrow', key: '2' },
  { type: 'text', icon: 'T', label: 'Text', key: '3' },
  { type: 'line', icon: '📏', label: 'Line', key: '4' },
  { type: 'ellipse', icon: '⭕', label: 'Ellipse', key: '5' },
];

const ShapesToolbar: React.FC<ShapesToolbarProps> = ({ selectedTool, onToolSelect }) => {
  return (
    <div className="toolbar">
      <div className="toolbar-title">Shapes</div>
      {shapes.map((shape) => (
        <button
          key={shape.type}
          className={`tool-btn ${selectedTool === shape.type ? 'active' : ''}`}
          onClick={() => onToolSelect(shape.type)}
          title={`${shape.label} (${shape.key})`}
        >
          <span className="tool-icon">{shape.icon}</span>
          <span className="tool-label">{shape.label}</span>
          <span className="tool-key">{shape.key}</span>
        </button>
      ))}
    </div>
  );
};

export default ShapesToolbar;
