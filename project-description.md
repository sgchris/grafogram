# Grafogram - Online Sketch Board

A comprehensive online sketch board and diagram creation tool that enables users to create, manage, and organize multiple drawing boards with advanced shape tools.

🌐 **Live Application**: [grafogram.greq.me](https://grafogram.greq.me)

## Description

Grafogram is a feature-rich sketchboard application, similar to a digital whiteboard, where users can draw various shapes, add text, and create diagrams. The application supports multiple boards for organizing different projects or ideas, with each board maintaining its own set of drawings and history.

### Core Drawing Features
- **Shapes**: Rectangles (with rounded corners), ellipses, lines, arrows, and text insertion
- **Advanced Tools**: Eraser for removing individual shapes, move tool for repositioning elements
- **Precision Features**: Automatic 45° angle snapping for lines and arrows when holding Shift
- **Interactive Feedback**: Visual highlighting when hovering over shapes with move or erase tools
- **History Management**: Complete undo/redo capabilities with separate history per board

### Multi-Board System
- **Unlimited Boards**: Create and manage multiple drawing boards
- **Board Management**: Rename boards (double-click), delete boards (with confirmation), add new boards
- **Persistent Storage**: All boards and their content automatically save to browser storage
- **Active Board Tracking**: Visual indication of current board, persists across sessions
- **Individual Histories**: Each board maintains its own undo/redo history

## The Website Interface

### Layout Structure
- **Top Bar**: Dark navigation bar with app title, undo/redo controls, and clear canvas option
- **Left Toolbars**: 
  - **Shapes Toolbar**: Rectangle, Arrow, Text, Line, Ellipse tools (shortcuts 1-5)
  - **Tools Toolbar**: Eraser (shortcut E) and Move (shortcut M) tools
- **Right Panel**: Boards management with scrollable list, add/delete/rename functionality
- **Main Canvas**: Light grey background where shapes are drawn in dark grey

### User Interaction
- **Shape Creation**: Press and hold left mouse button, drag to resize/position, release to create
- **Text Input**: Click to place text cursor, type content, press Enter or click outside to confirm
- **Shape Manipulation**: Use move tool to drag shapes, eraser tool to delete individual shapes
- **Smart Shortcuts**: Keyboard shortcuts work globally but are disabled when typing in text fields
- **Visual Feedback**: Shapes highlight in blue (move tool) or red (eraser tool) when hovered

### Board Management Interface
- **Board List**: Scrollable panel showing all boards with shape counts
- **Active Indication**: Current board highlighted with blue background
- **Inline Editing**: Double-click board names to rename with immediate feedback
- **Safe Deletion**: Trash icon with confirmation modal to prevent accidental loss
- **Add Button**: Prominent "+" button to create new boards instantly

## Technology Stack

### Frontend Architecture
- **React 19**: Latest React with functional components and modern hooks
- **TypeScript**: Full type safety and enhanced development experience
- **Custom Hooks**: Modular logic for canvas management, drawing tools, board management
- **HTML5 Canvas**: High-performance rendering for smooth drawing experience

### State Management
- **Board System**: Custom useBoards hook managing multiple board states
- **Canvas Management**: useCanvas hook handling drawing operations and shape management
- **Tool Selection**: useDrawingTool hook managing active tool and keyboard shortcuts
- **History Management**: useHistory hook providing undo/redo functionality per board

### Storage & Persistence
- **localStorage**: Client-side storage for boards, shapes, and user preferences
- **Auto-Save**: Immediate persistence of all changes without user intervention
- **Session Persistence**: Active board and all content restored on page reload

### Performance Features
- **Optimized Rendering**: Efficient canvas updates with minimal redraws
- **Collision Detection**: Fast shape detection for move and erase operations
- **Memory Management**: Proper cleanup and ref management to prevent memory leaks
- **Responsive Design**: Adaptive layout for desktop and mobile devices

### Development Features
- **Modern Build System**: Create React App with latest tooling
- **Code Organization**: Modular component structure with separation of concerns
- **Type Safety**: Comprehensive TypeScript interfaces and type definitions
- **Development Tools**: Hot reloading, source maps, and debugging support

## Project Structure

```
src/
├── components/          # React components
│   ├── Canvas/         # Drawing canvas and related UI
│   ├── Toolbar/        # Shape and tool selection toolbars
│   ├── BoardsPanel/    # Board management interface
│   └── UI/             # Reusable UI components
├── hooks/              # Custom React hooks
│   ├── useCanvas.ts    # Canvas state and drawing logic
│   ├── useBoards.ts    # Board management and persistence
│   ├── useDrawingTool.ts # Tool selection and shortcuts
│   └── useHistory.ts   # Undo/redo functionality
├── services/           # Business logic
│   ├── DrawingEngine.ts # Canvas rendering and shape drawing
│   └── storage/        # Storage abstraction layer
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
└── styles/             # CSS modules and global styles
```

## Development Setup

- **Node.js/npm**: Modern JavaScript runtime and package management
- **Git**: Version control with comprehensive .gitignore
- **React Ecosystem**: Latest React patterns and methodologies
- **TypeScript**: Enhanced development experience with type safety
- **CSS Modules**: Scoped styling with responsive design principles

