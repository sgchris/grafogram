# Grafogram - Online Sketch Board

A comprehensive, intuitive sketch board application for creating diagrams and drawings online. Built with React 19 and TypeScript, featuring multi-board support and advanced drawing tools.

🌐 **Live Demo**: [grafogram.greq.me](https://grafogram.greq.me)

## ✨ Features

### Drawing Tools
- **Shapes**: Rectangles, Arrows, Lines, Ellipses, and Text
- **Rounded Rectangles**: Modern rectangular shapes with rounded corners
- **Angle Snapping**: Automatic 45° angle snapping for precise lines and arrows
- **Eraser Tool**: Remove individual shapes with visual hover feedback
- **Move Tool**: Drag and reposition shapes with visual feedback

### Multi-Board Management
- **Multiple Boards**: Create, manage, and switch between unlimited drawing boards
- **Board Renaming**: Double-click to rename boards inline
- **Board Deletion**: Safe deletion with confirmation modals
- **Persistent Storage**: Boards auto-save and persist across browser sessions
- **Active Board Highlighting**: Clear visual indication of current board

### User Experience
- **Keyboard Shortcuts**: Quick tool selection (1-5 for shapes, E for eraser, M for move)
- **Smart Input Detection**: Shortcuts disabled when typing in text fields
- **Undo/Redo**: Full history management per board
- **Hover Feedback**: Visual shape highlighting for move and erase tools
- **Responsive Design**: Works on desktop and mobile devices

### Technical Features
- **Auto-Save**: Instant saving to localStorage
- **Performance Optimized**: Smooth rendering with HTML5 Canvas
- **Clean UI**: Modern, intuitive interface design
- **PWA Ready**: Progressive Web App capabilities

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000).

## 📋 Available Scripts

- `npm start` - Start development server
- `npm test` - Run tests  
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

## 🎮 Usage

### Drawing Shapes
1. **Select Tool**: Click toolbar buttons or use keyboard shortcuts:
   - `1` - Rectangle
   - `2` - Arrow  
   - `3` - Text
   - `4` - Line
   - `5` - Ellipse
   - `E` - Eraser
   - `M` - Move

2. **Draw**: Click and drag on canvas to create shapes
3. **Text**: Click to place text, then type your content
4. **Angle Snapping**: Hold Shift while drawing lines/arrows for 45° increments

### Board Management
- **New Board**: Click "+" in boards panel
- **Switch Board**: Click board name in right panel
- **Rename Board**: Double-click board name to edit
- **Delete Board**: Click trash icon (requires confirmation)

### Navigation
- **Undo/Redo**: Use Ctrl+Z / Ctrl+Y or toolbar buttons
- **Clear Board**: Use clear button with confirmation
- **Move Shapes**: Select move tool, then drag shapes to reposition

## 🛠 Technology Stack

- **Frontend**: React 19 with TypeScript
- **Rendering**: HTML5 Canvas API
- **State Management**: Custom React hooks
- **Storage**: localStorage for persistence
- **Styling**: CSS Modules with responsive design
- **Build**: Create React App with modern tooling

## 🏗 Architecture

- **Component-Based**: Modular React components
- **Custom Hooks**: Reusable logic for canvas, tools, and boards
- **Service Layer**: Drawing engine and storage abstraction
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized rendering and collision detection

## 📱 Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Android Chrome)

## 🔮 Future Enhancements

- Real-time collaboration
- Cloud storage integration
- Advanced shape properties (colors, stroke styles)
- Layer management
- Export functionality (PNG, SVG, PDF)
- Shape grouping and selection

---

Built with ❤️ using modern React patterns and best practices.
