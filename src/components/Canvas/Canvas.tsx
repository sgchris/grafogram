import React, { useState, useRef, useEffect } from 'react';
import { Point } from '../../types';
import './Canvas.css';

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  textInput: { position: Point; visible: boolean };
  onTextSubmit: (text: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  textInput,
  onTextSubmit,
}) => {
  const [inputValue, setInputValue] = useState('');
  const textInputRef = useRef<HTMLInputElement>(null);

  // Focus text input when it becomes visible
  useEffect(() => {
    if (textInput.visible && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [textInput.visible]);

  // Set canvas size on mount and resize
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [canvasRef]);

  const handleTextKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation(); // Prevent interference with other keyboard shortcuts
    if (event.key === 'Enter') {
      onTextSubmit(inputValue);
      setInputValue('');
    } else if (event.key === 'Escape') {
      onTextSubmit('');
      setInputValue('');
    }
  };

  const handleTextBlur = () => {
    // Only submit if there's actual text content
    if (inputValue.trim()) {
      onTextSubmit(inputValue);
    } else {
      onTextSubmit('');
    }
    setInputValue('');
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      />
      
      {textInput.visible && (
        <input
          ref={textInputRef}
          type="text"
          className="text-input"
          style={{
            position: 'absolute',
            left: Math.max(0, Math.min(textInput.position.x, window.innerWidth - 200)),
            top: Math.max(0, Math.min(textInput.position.y, window.innerHeight - 100)),
            zIndex: 1000,
          }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleTextKeyDown}
          onBlur={handleTextBlur}
          placeholder="Enter text..."
          autoFocus
        />
      )}
    </div>
  );
};

export default Canvas;
