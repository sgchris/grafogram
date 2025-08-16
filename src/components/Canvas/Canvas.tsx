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
  hoveredShape?: any;
  isMoving?: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  canvasRef,
  selectedTool,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  textInput,
  onTextSubmit,
  hoveredShape,
  isMoving = false,
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
    
    // Enter creates new line (default behavior)
    // Shift+Enter also creates new line (default behavior) 
    // Escape finishes editing
    if (event.key === 'Escape') {
      event.preventDefault();
      handleTextSubmit(); // Changed from cancel to submit - save what's typed
    }
    // Ctrl+Enter also finishes editing for backward compatibility
    else if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      handleTextSubmit();
    }
  };

  const handleTextSubmit = () => {
    // Always submit, even if empty (let parent handle empty text)
    onTextSubmit(textValue);
    setTextValue('');
  };

  const handleTextCancel = () => {
    onTextSubmit('');
    setTextValue('');
  };

  // Changed from onBlur to onDoubleClick for better UX
  const handleBackgroundDoubleClick = (event: React.MouseEvent) => {
    if (textInput.visible && event.target === event.currentTarget) {
      handleTextSubmit();
    }
  };

  // Auto-resize textarea based on content
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setTextValue(value);
    
    // Auto-resize textarea
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.max(24, textarea.scrollHeight) + 'px';
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

  // Generate dynamic canvas classes
  const getCanvasClasses = () => {
    let classes = "drawing-canvas";
    if (selectedTool === "move") {
      if (isMoving) {
        classes += " is-moving";
      } else if (hoveredShape) {
        classes += " can-move";
      }
    } else if (selectedTool === "eraser") {
      if (hoveredShape) {
        classes += " can-erase";
      }
    }
    return classes;
  };

  return (
    <div className="canvas-container" data-tool={selectedTool}>
      <canvas
        ref={canvasRef}
        className={getCanvasClasses()}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      />
      
      {textInput.visible && (
        <div 
          className="text-modal-overlay"
          onDoubleClick={handleBackgroundDoubleClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
        >
          <div 
            className="text-modal"
            style={{
              position: 'absolute',
              left: modalPosition.left,
              top: modalPosition.top,
              zIndex: 1000,
            }}
            onClick={(e) => e.stopPropagation()} // Prevent overlay click
          >
            <div className="text-modal-content">
              <textarea
                ref={textareaRef}
                className="text-textarea"
                value={textValue}
                onChange={handleTextChange}
                onKeyDown={handleTextKeyDown}
                placeholder="Type your text here... (Enter for new line, Escape to finish)"
                autoFocus
                style={{
                  minHeight: '24px',
                  height: 'auto',
                }}
              />
              <div className="text-modal-hint">
                Press <kbd>Enter</kbd> for new line • <kbd>Escape</kbd> to finish
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
