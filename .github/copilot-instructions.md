# GitHub Copilot Instructions for Online Sketch Project

## Project Overview

This is a React-based online sketch board application that allows users to draw shapes (lines, arrows, rectangles, circles) and add text on a canvas. The application includes undo/redo functionality and stores data in the browser's localStorage.

## Technology Stack

- **Frontend Framework**: React.js with modern patterns and methodologies
- **Build Tool**: Create React App or Vite
- **Package Manager**: npm
- **Storage**: Browser localStorage (client-side only)
- **Version Control**: Git
- **Future**: Node.js server will be added later

## Project Structure

```
src/
├── components/          # React components
│   ├── Canvas/         # Canvas-related components
│   ├── Toolbar/        # Drawing tools and shape selection
│   ├── UI/             # General UI components
├── hooks/              # Custom React hooks
├── services/           # Business logic and services
│   ├── storage/        # Storage client library
│   ├── drawing/        # Drawing logic and shape management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── styles/             # CSS/styling files
└── __tests__/          # Test files
```

## Key Features to Implement

### Drawing Capabilities
- **Shape Drawing**: Lines, arrows, rectangles, circles, text
- **Interaction**: Mouse press-drag-release pattern for shape creation
- **Keyboard Shortcuts**: Numbers 1-5 for shape selection
- **Undo/Redo**: History management for all drawing operations

### UI Design
- **Top Bar**: Dark background with application controls
- **Toolbar**: Left top corner with shape selection tools
- **Canvas**: Light grey background with dark grey shapes
- **Responsive**: Modern, clean interface

### Storage System
- **localStorage Integration**: Client-side data persistence
- **Storage Client Library**: Abstracted storage interface for future server integration
- **Data Serialization**: Efficient sketch data storage and retrieval

## Code Guidelines

### React Patterns
- Use functional components with hooks
- Implement custom hooks for drawing logic and state management
- Use Context API for global state (canvas, tools, history)
- Follow component composition patterns
- Implement proper prop types or TypeScript interfaces

### Storage Client Library
```javascript
// Example storage interface
interface StorageClient {
  saveSketch(sketchId: string, data: SketchData): Promise<void>;
  loadSketch(sketchId: string): Promise<SketchData | null>;
  deleteSketch(sketchId: string): Promise<void>;
  listSketches(): Promise<SketchMetadata[]>;
}
```

### State Management
- Canvas state (current shapes, active tool, drawing mode)
- History state (undo/redo stack)
- UI state (selected tool, canvas dimensions)
- Storage state (saved sketches, loading states)

## Development Commands

### Setup and Installation
```bash
# Initialize new React project
npx create-react-app sketch-app --template typescript
# or
npm create vite@latest sketch-app -- --template react-ts

# Install dependencies
npm install

# Add additional packages as needed
npm install @types/node
npm install canvas-lib  # if using external canvas library
```

### Development Workflow
```bash
# Start development server
npm start

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage

# Build for production
npm run build

# Lint code
npm run lint

# Format code
npm run format
```

### Git Workflow
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial commit"

# Feature development
git checkout -b feature/canvas-drawing
git add .
git commit -m "Add canvas drawing functionality"
```

## Testing Strategy

### Unit Tests
- Component rendering and props
- Custom hooks behavior
- Storage client library functions
- Utility functions

### Integration Tests
- Canvas drawing interactions
- Tool selection and switching
- Undo/redo functionality
- Data persistence

### Example Test Structure
```javascript
describe('Canvas Component', () => {
  it('should render drawing canvas', () => {});
  it('should handle mouse events for drawing', () => {});
  it('should switch between drawing tools', () => {});
});

describe('Storage Client', () => {
  it('should save sketch to localStorage', () => {});
  it('should load sketch from localStorage', () => {});
  it('should handle storage errors gracefully', () => {});
});
```

## Key Components to Create

### Core Components
1. **App**: Main application component with layout
2. **Canvas**: Drawing surface with mouse event handling
3. **Toolbar**: Tool selection and shape buttons
4. **TopBar**: Application header with actions
5. **HistoryControls**: Undo/redo buttons

### Service Classes
1. **StorageClient**: Abstract storage interface
2. **LocalStorageClient**: localStorage implementation
3. **DrawingEngine**: Shape creation and manipulation
4. **HistoryManager**: Undo/redo functionality

### Custom Hooks
1. **useCanvas**: Canvas state and drawing logic
2. **useDrawingTool**: Tool selection and switching
3. **useHistory**: Undo/redo functionality
4. **useStorage**: Data persistence operations

## Data Models

### Shape Types
```typescript
interface Shape {
  id: string;
  type: 'line' | 'arrow' | 'rectangle' | 'circle' | 'text';
  startPoint: Point;
  endPoint: Point;
  style: ShapeStyle;
  text?: string; // for text shapes
}

interface Point {
  x: number;
  y: number;
}

interface ShapeStyle {
  color: string;
  strokeWidth: number;
  fillColor?: string;
}
```

### Sketch Data
```typescript
interface SketchData {
  id: string;
  name: string;
  shapes: Shape[];
  createdAt: Date;
  updatedAt: Date;
  canvasSize: { width: number; height: number };
}
```

## Best Practices

### Code Quality
- Write clean, readable, and well-documented code
- Use meaningful variable and function names
- Implement proper error handling
- Follow React best practices and patterns
- Use TypeScript for type safety

### Performance
- Optimize canvas rendering for smooth drawing
- Implement efficient shape collision detection
- Use React.memo for expensive components
- Debounce storage operations

### Accessibility
- Provide keyboard navigation support
- Add ARIA labels for tools and buttons
- Ensure proper focus management
- Support screen readers where applicable

## Future Considerations

### Server Integration
- Design storage client to easily switch from localStorage to API calls
- Implement authentication and user management
- Add real-time collaboration features
- Support cloud storage and syncing

### Feature Enhancements
- Multiple font sizes and colors
- Layer management
- Shape grouping and selection
- Export to image formats
- Import/export sketch files

## CLI Permissions

GitHub Copilot has full permissions to:
- Execute npm commands for package management
- Run build and test commands
- Install additional development tools
- Execute git commands for version control
- Generate and modify configuration files
- Create and structure project directories

## Notes for GitHub Copilot

When suggesting code:
1. Prioritize modern React patterns (hooks, functional components)
2. Consider performance implications for canvas operations
3. Ensure storage abstraction for future server integration
4. Follow the established project structure
5. Include appropriate error handling and loading states
6. Write testable code with clear separation of concerns
7. Use TypeScript for better code documentation and safety
