import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock canvas context for testing
const mockCanvasContext = {
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  arc: jest.fn(),
  rect: jest.fn(),
  fillText: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  canvas: { width: 800, height: 600 }
} as any;

// Mock HTMLCanvasElement.getContext
HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCanvasContext);

test('renders online sketch board', () => {
  render(<App />);
  const titleElement = screen.getByText(/online sketch board/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders drawing tools', () => {
  render(<App />);
  const toolsElement = screen.getByText(/tools/i);
  expect(toolsElement).toBeInTheDocument();
});

test('renders canvas', () => {
  render(<App />);
  const canvas = document.querySelector('canvas');
  expect(canvas).toBeInTheDocument();
});
