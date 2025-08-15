import React, { useState, useEffect, useRef } from 'react';
import './TextInput.css';

interface TextInputProps {
  position: { x: number; y: number };
  visible: boolean;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  position,
  visible,
  onSubmit,
  onCancel,
}) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [visible]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(text);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel?.();
      setText('');
    }
  };

  if (!visible) return null;

  return (
    <div
      className="text-input-overlay"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter text..."
          className="text-input"
        />
      </form>
    </div>
  );
};
