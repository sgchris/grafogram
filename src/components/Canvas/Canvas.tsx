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
    if (event.key === 'Enter') {
      onTextSubmit(inputValue);
      setInputValue('');
    } else if (event.key === 'Escape') {
      onTextSubmit('');
      setInputValue('');
    }
  };

  const handleTextBlur = () => {
    onTextSubmit(inputValue);
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
            left: textInput.position.x,
            top: textInput.position.y,
          }}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleTextKeyDown}
          onBlur={handleTextBlur}
          placeholder="Enter text..."
        />
      )}
    </div>
  );
};

export default Canvas;
