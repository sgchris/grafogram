import { useState, useCallback, useRef, useEffect } from "react";
import { Shape, Point, ShapeType } from "../types";
import { DrawingEngine } from "../services/DrawingEngine";
import {
	generateId,
	getMousePos,
	debounce,
	getSnappedEndpoint,
	isPointCollidingWithShape,
	findShapeAtPoint,
	moveShape,
} from "../utils";
import { localStorageClient } from "../services/storage";
import { useHistory } from "./useHistory";

/**
 * Custom hook for managing canvas state and drawing operations
 */
export const useCanvas = (selectedTool: ShapeType) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [shapes, setShapes] = useState<Shape[]>([]);
	const [isDrawing, setIsDrawing] = useState(false);
	const [currentShape, setCurrentShape] = useState<Shape | null>(null);
	const [drawingEngine, setDrawingEngine] = useState<DrawingEngine | null>(
		null
	);
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isErasing, setIsErasing] = useState(false);
	const [isMoving, setIsMoving] = useState(false);
	const [selectedShape, setSelectedShape] = useState<Shape | null>(null);
	const [hoveredShape, setHoveredShape] = useState<Shape | null>(null);
	const [dragOffset, setDragOffset] = useState<Point>({ x: 0, y: 0 });
	const [textInput, setTextInput] = useState<{
		position: Point;
		visible: boolean;
	}>({
		position: { x: 0, y: 0 },
		visible: false,
	});

	const { pushToHistory, undo, redo, canUndo, canRedo, clearHistory } =
		useHistory();

	// Initialize drawing engine when canvas is ready
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				setDrawingEngine(new DrawingEngine(ctx));
			}
		}
	}, []);

	// Load saved sketch on mount
	useEffect(() => {
		const loadSavedSketch = async () => {
			try {
				const savedSketch = await localStorageClient.getCurrentSketch();
				if (savedSketch && savedSketch.shapes) {
					setShapes(savedSketch.shapes);
				}
			} catch (error) {
				console.error("Failed to load saved sketch:", error);
			}
		};

		loadSavedSketch();
	}, []);

	// Redraw canvas when shapes change
	useEffect(() => {
		if (drawingEngine) {
			drawingEngine.drawShapes(shapes, hoveredShape, selectedTool);
			if (currentShape) {
				drawingEngine.drawShape(currentShape, false, selectedTool);
			}
		}
	}, [shapes, currentShape, drawingEngine, hoveredShape, selectedTool]);

	// Clear hover state when tool changes
	useEffect(() => {
		if (selectedTool !== "move" && selectedTool !== "eraser") {
			setHoveredShape(null);
		}
	}, [selectedTool]);

	// Debounced save function
	const debouncedSave = useCallback(
		debounce(async (shapesToSave: Shape[]) => {
			try {
				setIsSaving(true);
				const sketchData = {
					id: "current-sketch",
					name: "Current Sketch",
					shapes: shapesToSave,
					createdAt: new Date(),
					updatedAt: new Date(),
					canvasSize: {
						width: canvasRef.current?.width || 800,
						height: canvasRef.current?.height || 600,
					},
				};
				await localStorageClient.saveCurrentSketch(sketchData);
				setHasUnsavedChanges(false);
				setIsSaving(false);
			} catch (error) {
				console.error("Failed to save sketch:", error);
				setIsSaving(false);
			}
		}, 500),
		[]
	);

	// Save shapes when they change
	useEffect(() => {
		if (shapes.length > 0) {
			setHasUnsavedChanges(true);
			debouncedSave(shapes);
		} else {
			setHasUnsavedChanges(false);
			setIsSaving(false);
		}
	}, [shapes, debouncedSave]);

	const handleMouseDown = useCallback(
		(event: React.MouseEvent<HTMLCanvasElement>) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const mousePos = getMousePos(canvas, event.nativeEvent);

			if (selectedTool === "text") {
                
                event.stopPropagation();
                event.preventDefault();
				setTextInput({
					position: mousePos,
					visible: true,
				});

				// Prevent other mouse handling for text tool
				return;
			}

			if (selectedTool === "eraser") {
				setIsErasing(true);
				// Find and delete shapes under cursor
				const shapesToDelete = shapes.filter(shape => 
					isPointCollidingWithShape(mousePos, shape)
				);
				
				if (shapesToDelete.length > 0) {
					pushToHistory(shapes);
					setShapes(prev => prev.filter(shape => 
						!shapesToDelete.some(toDelete => toDelete.id === shape.id)
					));
				}
				return;
			}

			if (selectedTool === "move") {
				// Find the shape to move
				const shapeToMove = findShapeAtPoint(mousePos, shapes);
				if (shapeToMove) {
					setIsMoving(true);
					setSelectedShape(shapeToMove);
					// Calculate offset from mouse to shape's start point
					setDragOffset({
						x: mousePos.x - shapeToMove.startPoint.x,
						y: mousePos.y - shapeToMove.startPoint.y
					});
					pushToHistory(shapes);
				}
				return;
			}

			setIsDrawing(true);
			const newShape: Shape = {
				id: generateId(),
				type: selectedTool,
				startPoint: mousePos,
				endPoint: mousePos,
				style: {
					color: "#2c3e50",
					strokeWidth: 2,
				},
			};
			setCurrentShape(newShape);
		},
		[selectedTool, shapes, pushToHistory]
	);

		const handleMouseMove = useCallback(
		(event: React.MouseEvent<HTMLCanvasElement>) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const mousePos = getMousePos(canvas, event.nativeEvent);
			
			// Handle move tool hover detection
			if (selectedTool === "move" && !isMoving) {
				const shapeUnderCursor = findShapeAtPoint(mousePos, shapes);
				setHoveredShape(shapeUnderCursor);
			}
			
			// Handle eraser tool hover detection
			if (selectedTool === "eraser" && !isErasing) {
				const shapeUnderCursor = findShapeAtPoint(mousePos, shapes);
				setHoveredShape(shapeUnderCursor);
			}
			
			// Handle eraser drag
			if (isErasing && selectedTool === "eraser") {
				const shapesToDelete = shapes.filter(shape => 
					isPointCollidingWithShape(mousePos, shape)
				);
				
				if (shapesToDelete.length > 0) {
					setShapes(prev => prev.filter(shape => 
						!shapesToDelete.some(toDelete => toDelete.id === shape.id)
					));
				}
				return;
			}

			// Handle move drag
			if (isMoving && selectedShape && selectedTool === "move") {
				// Calculate new position based on mouse position and drag offset
				const newStartPoint = {
					x: mousePos.x - dragOffset.x,
					y: mousePos.y - dragOffset.y
				};
				
				// Calculate the offset from the original position
				const offsetX = newStartPoint.x - selectedShape.startPoint.x;
				const offsetY = newStartPoint.y - selectedShape.startPoint.y;
				
				// Update the shape position
				const movedShape = moveShape(selectedShape, offsetX, offsetY);
				
				// Update shapes array with the moved shape
				setShapes(prev => prev.map(shape => 
					shape.id === selectedShape.id ? movedShape : shape
				));
				
				// Update selectedShape to the new position
				setSelectedShape(movedShape);
				return;
			}

			if (!isDrawing || !currentShape) return;

			setCurrentShape((prev) =>
				prev ? { ...prev, endPoint: mousePos } : null
			);
		},
		[isDrawing, currentShape, isErasing, selectedTool, shapes, isMoving, selectedShape, dragOffset]
	);	const handleMouseUp = useCallback(() => {
		if (isErasing) {
			setIsErasing(false);
			return;
		}

		if (isMoving) {
			setIsMoving(false);
			setSelectedShape(null);
			setDragOffset({ x: 0, y: 0 });
			return;
		}

		if (!isDrawing || !currentShape) return;

		setIsDrawing(false);

		let finalShape = { ...currentShape };

		// Apply angle snapping for lines and arrows
		if (currentShape.type === "line" || currentShape.type === "arrow") {
			const snappedEndpoint = getSnappedEndpoint(
				currentShape.startPoint,
				currentShape.endPoint
			);
			finalShape.endPoint = snappedEndpoint;
		}

		pushToHistory(shapes);
		setShapes((prev) => [...prev, finalShape]);
		setCurrentShape(null);
	}, [isDrawing, currentShape, shapes, pushToHistory, isErasing, isMoving]);

	const handleTextSubmit = useCallback(
		(text: string) => {
			if (text.trim()) {
				const textShape: Shape = {
					id: generateId(),
					type: "text",
					startPoint: textInput.position,
					endPoint: textInput.position,
					style: {
						color: "#2c3e50",
						strokeWidth: 2,
					},
					text: text.trim(),
				};

				pushToHistory(shapes);
				setShapes((prev) => [...prev, textShape]);
			}

			// close the window with delay\
			setTextInput({ position: { x: 0, y: 0 }, visible: false });
		},
		[textInput.position, shapes, pushToHistory]
	);

	const handleUndo = useCallback(() => {
		const previousShapes = undo();
		if (previousShapes !== null) {
			setShapes(previousShapes);
		}
	}, [undo]);

	const handleRedo = useCallback(() => {
		const nextShapes = redo();
		if (nextShapes !== null) {
			setShapes(nextShapes);
		}
	}, [redo]);

	const clearCanvas = useCallback(() => {
		pushToHistory(shapes);
		setShapes([]);
		clearHistory();
	}, [shapes, pushToHistory, clearHistory]);

	// Handle keyboard shortcuts for undo/redo
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey || event.metaKey) {
				if (event.key === "z" && !event.shiftKey) {
					event.preventDefault();
					handleUndo();
				} else if (
					event.key === "y" ||
					(event.key === "z" && event.shiftKey)
				) {
					event.preventDefault();
					handleRedo();
				}
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleUndo, handleRedo]);

	return {
		canvasRef,
		shapes,
		isDrawing,
		currentShape,
		textInput,
		canUndo,
		canRedo,
		hasUnsavedChanges: hasUnsavedChanges || isSaving,
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		handleTextSubmit,
		handleUndo,
		handleRedo,
		clearCanvas,
		selectedShape,
		hoveredShape,
	};
};
