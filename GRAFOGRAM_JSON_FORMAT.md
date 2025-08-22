# Grafogram JSON File Format Documentation

## Overview

Grafogram uses a structured JSON format to store and exchange drawing board data. This format is designed to be **human-readable** and **AI-friendly**, making it easy for both humans and artificial intelligence systems to create, read, and modify Grafogram files.

## File Extension

All Grafogram files use the `.json` extension.

## Filename Convention

When exporting, files are automatically named using this pattern:
```
grafogram_<board_name>_<datetime>.json
```

Examples:
- `grafogram_My_Sketch_2025-08-22T14-30-45.json`
- `grafogram_System_Architecture_2025-08-22T09-15-32.json`

## JSON Structure

### Root Level

```json
{
  "version": "1.0.0",
  "board": { ... },
  "metadata": { ... }
}
```

#### Fields

- **`version`** (string, required): Format version number (current: "1.0.0")
- **`board`** (object, required): Contains the drawing board data
- **`metadata`** (object, required): Contains export metadata

### Board Object

```json
{
  "id": "board_12345",
  "name": "My Sketch",
  "shapes": [ ... ],
  "createdAt": "2025-08-22T14:30:45.123Z",
  "updatedAt": "2025-08-22T14:35:20.456Z",
  "canvasSize": {
    "width": 800,
    "height": 600
  }
}
```

#### Fields

- **`id`** (string, required): Unique identifier for the board
- **`name`** (string, required): Display name of the board
- **`shapes`** (array, required): Array of shape objects (see Shape Object section)
- **`createdAt`** (string, required): ISO 8601 timestamp when board was created
- **`updatedAt`** (string, required): ISO 8601 timestamp when board was last modified
- **`canvasSize`** (object, required): Canvas dimensions
  - **`width`** (number, required): Canvas width in pixels
  - **`height`** (number, required): Canvas height in pixels

### Shape Object

Each shape in the `shapes` array follows this structure:

```json
{
  "id": "shape_67890",
  "type": "rectangle",
  "startPoint": {
    "x": 100,
    "y": 150
  },
  "endPoint": {
    "x": 300,
    "y": 250
  },
  "style": {
    "color": "#3498db",
    "strokeWidth": 2,
    "fillColor": "#ecf0f1"
  },
  "text": "Optional text content"
}
```

#### Common Fields (All Shapes)

- **`id`** (string, required): Unique identifier for the shape
- **`type`** (string, required): Shape type (see Shape Types section)
- **`startPoint`** (object, required): Starting coordinate
  - **`x`** (number, required): X coordinate in pixels
  - **`y`** (number, required): Y coordinate in pixels
- **`endPoint`** (object, required): Ending coordinate
  - **`x`** (number, required): X coordinate in pixels
  - **`y`** (number, required): Y coordinate in pixels
- **`style`** (object, required): Visual styling properties
  - **`color`** (string, required): Stroke color (hex format: "#RRGGBB")
  - **`strokeWidth`** (number, required): Line thickness in pixels (1-10)
  - **`fillColor`** (string, optional): Fill color for closed shapes (hex format: "#RRGGBB")

#### Optional Fields

- **`text`** (string, optional): Text content (required for text shapes, ignored for others)

## Shape Types

### 1. Rectangle
- **Type**: `"rectangle"`
- **Description**: Rectangular shape
- **Coordinates**: `startPoint` = top-left corner, `endPoint` = bottom-right corner
- **Style**: Supports both stroke and fill colors

### 2. Line
- **Type**: `"line"`
- **Description**: Straight line
- **Coordinates**: `startPoint` = line start, `endPoint` = line end
- **Style**: Only stroke color, no fill

### 3. Arrow
- **Type**: `"arrow"`
- **Description**: Line with arrowhead
- **Coordinates**: `startPoint` = arrow tail, `endPoint` = arrow head
- **Style**: Only stroke color, no fill

### 4. Ellipse (Circle)
- **Type**: `"ellipse"`
- **Description**: Elliptical or circular shape
- **Coordinates**: `startPoint` = top-left of bounding box, `endPoint` = bottom-right of bounding box
- **Style**: Supports both stroke and fill colors

### 5. Text
- **Type**: `"text"`
- **Description**: Text element
- **Coordinates**: `startPoint` = text position, `endPoint` = same as startPoint
- **Style**: Only stroke color (text color)
- **Special**: Requires `text` field with actual text content

## Metadata Object

```json
{
  "exportedAt": "2025-08-22T14:30:45.123Z",
  "exportedBy": "Grafogram Online Sketch Board",
  "formatVersion": "1.0.0"
}
```

#### Fields

- **`exportedAt`** (string, required): ISO 8601 timestamp when file was exported
- **`exportedBy`** (string, required): Application name that created the file
- **`formatVersion`** (string, required): Format version used for export

## Complete Example

```json
{
  "version": "1.0.0",
  "board": {
    "id": "board_abc123",
    "name": "System Architecture",
    "shapes": [
      {
        "id": "shape_001",
        "type": "rectangle",
        "startPoint": { "x": 250, "y": 100 },
        "endPoint": { "x": 400, "y": 170 },
        "style": {
          "color": "#2c3e50",
          "strokeWidth": 2,
          "fillColor": "#ecf0f1"
        }
      },
      {
        "id": "shape_002",
        "type": "text",
        "startPoint": { "x": 325, "y": 135 },
        "endPoint": { "x": 325, "y": 135 },
        "style": {
          "color": "#2c3e50",
          "strokeWidth": 2
        },
        "text": "Web Server"
      },
      {
        "id": "shape_003",
        "type": "arrow",
        "startPoint": { "x": 400, "y": 135 },
        "endPoint": { "x": 480, "y": 135 },
        "style": {
          "color": "#e74c3c",
          "strokeWidth": 3
        }
      },
      {
        "id": "shape_004",
        "type": "ellipse",
        "startPoint": { "x": 480, "y": 100 },
        "endPoint": { "x": 580, "y": 170 },
        "style": {
          "color": "#27ae60",
          "strokeWidth": 2,
          "fillColor": "#d5f4e6"
        }
      },
      {
        "id": "shape_005",
        "type": "line",
        "startPoint": { "x": 325, "y": 170 },
        "endPoint": { "x": 325, "y": 230 },
        "style": {
          "color": "#8e44ad",
          "strokeWidth": 2
        }
      }
    ],
    "createdAt": "2025-08-22T09:00:00.000Z",
    "updatedAt": "2025-08-22T14:30:45.123Z",
    "canvasSize": {
      "width": 800,
      "height": 600
    }
  },
  "metadata": {
    "exportedAt": "2025-08-22T14:30:45.123Z",
    "exportedBy": "Grafogram Online Sketch Board",
    "formatVersion": "1.0.0"
  }
}
```

## AI Generation Guidelines

When creating Grafogram files programmatically:

1. **Always include all required fields** - Missing required fields will cause import failures
2. **Use valid coordinates** - Ensure x,y values are positive numbers within canvas bounds
3. **Follow color format** - Use hex colors with # prefix (e.g., "#3498db")
4. **Generate unique IDs** - Each shape must have a unique identifier
5. **Respect shape constraints**:
   - Text shapes must include `text` field
   - Rectangle/ellipse shapes can use `fillColor`
   - Lines/arrows should not include `fillColor`
6. **Use appropriate stroke widths** - Recommended range: 1-10 pixels
7. **Set logical coordinates**:
   - Rectangle: startPoint = top-left, endPoint = bottom-right
   - Line/Arrow: startPoint = beginning, endPoint = end
   - Ellipse: startPoint = bounding box top-left, endPoint = bounding box bottom-right
   - Text: startPoint = text position, endPoint = same as startPoint

## Canvas Layout & Safe Zones

When generating coordinates for shapes, consider the Grafogram UI layout to ensure shapes don't overlap with toolbars:

### UI Layout
- **Top Bar**: Height of ~60px containing app title and controls
- **Left Toolbars**: Two stacked toolbars on the left side for shape and tool selection
- **Right Panel**: Boards management panel on the right side
- **Canvas**: The main drawing area in the center

### Safe Zones (Recommended Coordinate Boundaries)

To ensure imported shapes are visible and don't overlap with UI elements:

- **Left Boundary**: `x ≥ 220` pixels
  - Accounts for: 20px margin + 180px toolbar width + 20px spacing
  - Shapes with x-coordinates less than 220 may be covered by shape/tool toolbars

- **Top Boundary**: `y ≥ 80` pixels  
  - Accounts for: 60px top bar height + 20px spacing
  - Shapes with y-coordinates less than 80 may be covered by the top navigation bar

- **Right Boundary**: `x ≤ (canvas_width - 290)` pixels
  - Accounts for: 250px boards panel width + 20px margin + 20px spacing
  - Shapes extending beyond this may be covered by the boards panel

### Automatic Coordinate Adjustment

**Import Behavior**: When importing files, Grafogram automatically adjusts coordinates if shapes would overlap with UI elements:

1. **Left Adjustment**: If any shape has x-coordinates < 220px, all shapes are shifted right
2. **Top Adjustment**: If any shape has y-coordinates < 80px, all shapes are shifted down  
3. **Preservation**: Shape relationships and relative positions are maintained during adjustment
4. **Logging**: Coordinate adjustments are logged to the browser console for debugging

### Recommended Coordinate Ranges

For optimal compatibility across different screen sizes:

- **Minimum coordinates**: `x: 220, y: 80`
- **Maximum coordinates**: `x: 800, y: 600` (for typical 1200px wide canvas)
- **Safe drawing area**: 580px wide × 520px tall (accounting for all UI elements)

## Validation Rules

The importer validates:
- JSON syntax correctness
- Presence of all required fields
- Proper data types for all fields
- Valid shape type values
- Coordinate number formats
- Color format compliance
- Array structure for shapes

## Error Handling

Common import errors:
- **"Invalid JSON format"** - File is not valid JSON
- **"Invalid file format: missing board data"** - Missing board object
- **"Invalid file format: incomplete board data"** - Missing required board fields
- **"Invalid file format: incomplete shape data"** - Shape missing required properties

## Version Compatibility

- **Current Version**: 1.0.0
- **Future versions** will maintain backward compatibility
- **Version mismatches** may generate warnings but should still import successfully
- **Breaking changes** will increment the major version number

## Import Behavior

When importing a Grafogram file:

1. **File validation** - Checks JSON syntax and required structure
2. **Coordinate adjustment** - Automatically adjusts shapes if they would overlap with UI toolbars:
   - **Left adjustment**: Shifts all shapes right if any x-coordinate < 220px
   - **Top adjustment**: Shifts all shapes down if any y-coordinate < 80px
   - **Relationship preservation**: Maintains relative positions between shapes
   - **Console logging**: Reports any coordinate adjustments made
3. **Name conflict resolution**:
   - If board name exists: **Overrides** existing board's shapes
   - If board name is new: **Creates** new board
4. **Board activation** - Imported/updated board becomes the active board
5. **Persistence** - Changes are automatically saved to localStorage

### Testing Coordinate Adjustment

To test the automatic coordinate adjustment feature, create a JSON file with shapes that have coordinates outside the safe zones (e.g., x < 220 or y < 80). When imported, these shapes will be automatically repositioned to avoid overlapping with the UI toolbars while maintaining their relative layout.

This format enables AI systems to easily generate diagrams for various use cases like system architecture, flowcharts, wireframes, and more.
