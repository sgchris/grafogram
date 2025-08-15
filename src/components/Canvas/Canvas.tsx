import React, { useState, useRef, useEffect } from 'react';
import { Point, ShapeType } from '../../types';
import './Canvas.css';

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  selectedTool: ShapeType;
  onMouseDown: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseMove: (event: React.MouseEvent<HTMLCanvasElement>) => void;
  onMouseUp: () => void;
  textInput: { position: Point; visible: boolean };
  onTextSubmit: (text: string) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  selectedTool,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  textInput,
  onTextSubmit,
}) => {
  const [textValue, setTextValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when text input becomes visible
  useEffect(() => {
    if (textInput.visible && textareaRef.current) {
      textareaRef.current.focus();
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

  const handleTextKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      handleTextSubmit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      handleTextCancel();
    }
  };

  const handleTextSubmit = () => {
    if (textValue.trim()) {
      onTextSubmit(textValue);
    } else {
      onTextSubmit('');
    }
    setTextValue('');
  };

  const handleTextCancel = () => {
    onTextSubmit('');
    setTextValue('');
  };

  const handleTextBlur = () => {
    handleTextSubmit();
  };

  // Calculate modal position to ensure it stays within viewport
  const getModalPosition = (clickPosition: Point) => {
    const modalWidth = 250;
    const modalHeight = 80;
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let left = clickPosition.x;
    let top = clickPosition.y;

    // Adjust if modal would go off-screen
    if (left + modalWidth > viewport.width) {
      left = viewport.width - modalWidth - 10;
    }
    if (top + modalHeight > viewport.height) {
      top = viewport.height - modalHeight - 10;
    }

    // Ensure minimum distance from edges
    left = Math.max(10, left);
    top = Math.max(10, top);

    return { left, top };
  };

  const modalPosition = textInput.visible ? getModalPosition(textInput.position) : { left: 0, top: 0 };

  return (
    <div className="canvas-container" data-tool={selectedTool}>
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      />
      
      {textInput.visible && (
        <div 
          className="text-modal"
          style={{
            position: 'absolute',
            left: modalPosition.left,
            top: modalPosition.top,
            zIndex: 1000,
          }}
        >
          <div className="text-modal-content">
            <textarea
              ref={textareaRef}
              className="text-textarea"
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              onKeyDown={handleTextKeyDown}
              onBlur={handleTextBlur}
              placeholder="Enter text... (Ctrl+Enter to confirm)"
              rows={2}
              autoFocus
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
