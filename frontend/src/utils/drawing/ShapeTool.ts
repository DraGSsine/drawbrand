import { fabric } from 'fabric';

export enum ShapeType {
  PENTAGON = "PENTAGON",
  RECTANGLE = "RECTANGLE",
  DIAMOND = "DIAMOND",
  PARALLELOGRAM = "PARALLELOGRAM",
  TRAPEZOID = "TRAPEZOID",
  FRAME = "FRAME",
  HEXAGON = "HEXAGON",
  OCTAGON = "OCTAGON",
  HOUSE = "HOUSE",
  POLYGON = "POLYGON",
  TRIANGLE = "TRIANGLE",
  RIGHT_TRIANGLE = "RIGHT_TRIANGLE",
  DOUBLE_TRIANGLE = "DOUBLE_TRIANGLE",
  ARROW_TIP = "ARROW_TIP",
  CIRCLE = "CIRCLE",
  HALF_CIRCLE = "HALF_CIRCLE",
  PILL = "PILL",
  ROUNDED_RECT = "ROUNDED_RECT",
  RING = "RING",
  SEMI_CIRCLE = "SEMI_CIRCLE",
  STAR = "STAR",
  HEART = "HEART",
  STAR_4 = "STAR_4",
  STAR_5 = "STAR_5",
  ARROW_RIGHT = "ARROW_RIGHT",
  ARROW_BIDIRECTIONAL = "ARROW_BIDIRECTIONAL",
  ARROW_CORNER = "ARROW_CORNER",
  ARROW_BLOCK = "ARROW_BLOCK",
  ARROW_UP_RIGHT = "ARROW_UP_RIGHT",
  ARROW_LEFT = "ARROW_LEFT",
  ARROW_DOUBLE = "ARROW_DOUBLE",
  SPEECH_BUBBLE = "SPEECH_BUBBLE",
  THOUGHT_BUBBLE = "THOUGHT_BUBBLE",
  CLOUD = "CLOUD"
}

class ShapeTool {
  canvas: fabric.Canvas;
  shapeType: ShapeType = ShapeType.RECTANGLE;
  strokeWidth: number = 2;
  fillMode: 'regular' | 'solid' = 'regular';

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  setShapeType(type: ShapeType) {
    this.shapeType = type;
  }

  setStrokeWidth(width: number) {
    this.strokeWidth = width;
  }
  
  setFillMode(mode: 'regular' | 'solid') {
    this.fillMode = mode;
  }

  // Add a shape to the center of the canvas
  addShape() {
    if (!this.canvas) return;
    
    const canvasWidth = this.canvas.getWidth() || 800;
    const canvasHeight = this.canvas.getHeight() || 600;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    const shape = this.createShape(centerX, centerY);
    
    if (shape) {
      this.canvas.add(shape);
      this.canvas.setActiveObject(shape);
      this.canvas.renderAll();
    }
  }
  
  createShape(x: number, y: number): fabric.Object | null {
    let shape: fabric.Object | null = null;
    // Make sure the fill is completely transparent when regular, and solid black when solid
    const fill = this.fillMode === 'regular' ? 'rgba(0,0,0,0)' : '#020617';
    const stroke = this.fillMode === 'regular' ? '#020617' : 'rgba(0,0,0,0)';
    
    // Standard size for most shapes - make this larger
    const standardSize = 150; // Increased from previous value
    
    switch (this.shapeType) {
      case ShapeType.RECTANGLE:
        shape = new fabric.Rect({
          left: x,
          top: y,
          width: standardSize,
          height: standardSize * 0.8, // Keep aspect ratio
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
        });
        break;
        
      case ShapeType.CIRCLE:
        shape = new fabric.Circle({
          left: x,
          top: y,
          radius: standardSize / 2, // Half the standard size for radius
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
        });
        break;
        
      case ShapeType.TRIANGLE:
        // Create a triangle using fabric.Path with SVG path data
        shape = new fabric.Path('M 12 5 L 22 22 L 2 22 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.PENTAGON:
        // Create a pentagon using fabric.Path with SVG path data
        shape = new fabric.Path('M 6.23999 20.64 L 2.68799 9.69598 L 12 2.92798 L 21.312 9.69598 L 17.76 20.64 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;

      case ShapeType.DIAMOND:
        // Create a diamond using fabric.Path with SVG path data
        shape = new fabric.Path('M 11.6 1.59998 L 18.6 11.6 L 11.6 21.6 L 4.59998 11.6 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.PARALLELOGRAM:
        // Create a parallelogram using fabric.Path with SVG path data
        shape = new fabric.Path('M 7 2 L 2 22 H 17 L 22 2 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.TRAPEZOID:
        // Create a trapezoid using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.59998 21.6 L 7.59998 3.59998 H 15.6 L 21.6 21.6 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.FRAME:
        // Create a frame using fabric.Path with SVG path data
        shape = new fabric.Path('M 18 18 V 6 H 6 V 18 H 18 Z M 22 22 V 2 H 2 V 22 H 22 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.HEXAGON:
        // Create a hexagon using fabric.Path with SVG path data
        shape = new fabric.Path('M 7.224 20.28 L 2.448 12 L 7.224 3.71997 H 16.776 L 21.552 12 L 16.776 20.28 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.OCTAGON:
        // Create an octagon using fabric.Path with SVG path data
        shape = new fabric.Path('M 8.20803 20.976 L 2.95203 15.72 V 8.27999 L 8.20803 3.02399 H 15.648 L 20.904 8.27999 V 15.72 L 15.648 20.976 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
      
      case ShapeType.HOUSE:
        // Create a house using fabric.Path with SVG path data
        shape = new fabric.Path('M 2.68799 16.8 V 9.59998 L 12 2.92798 L 21.312 9.59998 V 16.8 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.POLYGON:
        // Create a polygon using fabric.Path with SVG path data
        shape = new fabric.Path('M 2.448 16.8 V 8.39998 L 7.224 3.59998 H 16.776 L 21.552 8.39998 V 16.8 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;

      case ShapeType.RIGHT_TRIANGLE:
        // Create a right triangle using fabric.Path with SVG path data
        shape = new fabric.Path('M 2 2 L 22 22 H 2 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.DOUBLE_TRIANGLE:
        // Create a double triangle using fabric.Path with SVG path data
        shape = new fabric.Path('M 7.2 19 L 12 11 L 16.8 19 H 7.2 Z M 2 22 L 12 5 L 22 22 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.ARROW_TIP:
        // Create an arrow tip using fabric.Path with SVG path data
        shape = new fabric.Path('M 13.1238 19.5625 H 4.5019 V 11.0581 L 13.1238 19.5625 Z M 0.857422 23.223 V 2.32025 L 21.9735 23.223 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.HEART:
        // Create a heart using fabric.Path with SVG path data
        shape = new fabric.Path('M 2.74036 9.7165 L 9.59286 9.71655 L 11.7104 2.76923 L 13.8279 9.71655 L 20.6804 9.7165 L 15.1365 14.0101 L 17.2541 20.9574 L 11.7104 16.6637 L 6.16659 20.9574 L 8.28417 14.0101 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.HALF_CIRCLE:
        // Create a half circle using fabric.Path with SVG path data
        shape = new fabric.Path('M 2.2782 13.0044 C 2.9207 9.11502 7.07545 6.19562 11.9999 6.19562 C 16.9239 6.19562 21.0789 9.11522 21.7217 13.0046 L 2.2782 13.0044 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.PILL:
        // Create a pill using fabric.Path with SVG path data
        shape = new fabric.Path('M 2.36841 2.76587 H 11.5188 C 16.5725 2.76587 20.6693 6.80861 20.6693 11.7956 C 20.6693 16.7825 16.5725 20.8253 11.5188 20.8253 H 2.36841 V 2.76587 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.ROUNDED_RECT:
        // Create a rounded rectangle using fabric.Path with SVG path data
        shape = new fabric.Path('M 4.28809 8.57141 H 18.7522 C 20.647 8.57141 22.1831 10.1627 22.1831 12.1256 C 22.1831 14.0885 20.647 15.6797 18.7522 15.6797 H 4.28809 C 2.39325 15.6797 0.857178 14.0885 0.857178 12.1256 C 0.857178 10.1627 2.39325 8.57141 4.28809 8.57141 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.RING:
        // Create a ring using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.41174 10.5576 C 1.41174 5.5065 5.5065 1.41174 10.5576 1.41174 C 12.9833 1.41174 15.3096 2.37533 17.0248 4.09052 C 18.74 5.8057 19.7035 8.132 19.7035 10.5576 C 19.7035 15.6088 15.6088 19.7035 10.5576 19.7035 C 5.5065 19.7035 1.41174 15.6088 1.41174 10.5576 Z M 5.98469 10.5576 C 5.98469 13.0832 8.03207 15.1306 10.5576 15.1306 C 13.0832 15.1306 15.1306 13.0832 15.1306 10.5576 C 15.1306 8.03207 13.0832 5.98469 10.5576 5.98469 C 8.03207 5.98469 5.98469 8.03207 5.98469 10.5576 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.SEMI_CIRCLE:
        // Create a semi-circle using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.375 21.2463 C 1.375 13.9306 6.00827 8 11.7237 8 C 17.4391 8 22.0724 13.9306 22.0724 21.2463 H 16.8981 C 16.8981 17.5885 14.5814 14.6232 11.7237 14.6232 C 8.86599 14.6232 6.54935 17.5885 6.54935 21.2463 H 1.375 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.STAR:
        // Create a star using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.59998 9.89226 L 8.42638 8.42638 L 9.89226 1.59998 L 11.3581 8.42638 L 18.1845 9.89226 L 11.3581 11.3581 L 9.89226 18.1845 L 8.42638 11.3581 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.STAR_4:
        // Create a 4-point star using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.59998 11.1723 L 6.00442 9.78754 L 2.88242 6.38612 L 7.38914 7.38914 L 6.38612 2.88242 L 9.78754 6.00442 L 11.1723 1.59998 L 12.557 6.00442 L 15.9584 2.88242 L 14.9554 7.38914 L 19.4621 6.38612 L 16.3401 9.78754 L 20.7445 11.1723 L 16.3401 12.557 L 19.4621 15.9584 L 14.9554 14.9554 L 15.9584 19.4621 L 12.557 16.3401 L 11.1723 20.7445 L 9.78754 16.3401 L 6.38612 19.4621 L 7.38914 14.9554 L 2.88242 15.9584 L 6.00442 12.557 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.STAR_5:
        // Create a 5-point star using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.59998 11.1723 L 6.9595 10.6176 L 1.92614 8.69477 L 7.24657 9.5462 L 2.88242 6.38612 L 7.80121 8.58555 L 4.40363 4.40363 L 8.58555 7.80121 L 6.38612 2.88242 L 9.5462 7.24657 L 8.69477 1.92614 L 10.6176 6.9595 L 11.1723 1.59998 L 11.7269 6.9595 L 13.6497 1.92614 L 12.7983 7.24657 L 15.9584 2.88242 L 13.759 7.80121 L 17.9409 4.40363 L 14.5433 8.58555 L 19.4621 6.38612 L 15.098 9.5462 L 20.4184 8.69477 L 15.385 10.6176 L 20.7445 11.1723 L 15.385 11.7269 L 20.4184 13.6497 L 15.098 12.7983 L 19.4621 15.9584 L 14.5433 13.759 L 17.9409 17.9409 L 13.759 14.5433 L 15.9584 19.4621 L 12.7983 15.098 L 13.6497 20.4184 L 11.7269 15.385 L 11.1723 20.7445 L 10.6176 15.385 L 8.69477 20.4184 L 9.5462 15.098 L 6.38612 19.4621 L 8.58555 14.5433 L 4.40363 17.9409 L 7.80121 13.759 L 2.88242 15.9584 L 7.24657 12.7983 L 1.92614 13.6497 L 6.9595 11.7269 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.ARROW_RIGHT:
        // Create an arrow right using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.71429 9.4218 H 17.097 V 6.85712 L 22.2263 11.9865 L 17.097 17.1158 V 14.5512 H 1.71429 V 9.4218 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.ARROW_BIDIRECTIONAL:
        // Create a bidirectional arrow using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.33337 12.2985 L 5.01211 8.61975 V 10.4591 H 16.0525 V 8.61975 L 19.7313 12.2985 L 16.0525 15.9772 V 14.1379 H 5.01211 V 15.9772 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.ARROW_CORNER:
        // Create a corner arrow using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.60083 15.9584 L 6.38697 11.1723 V 13.5653 H 13.5662 V 6.38612 H 11.1731 L 15.9593 1.59998 L 20.7454 6.38612 H 18.3523 V 18.3515 H 6.38697 V 20.7445 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.ARROW_BLOCK:
        // Create a block arrow using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.20068 13.1688 L 4.79029 9.57924 V 11.374 H 9.63328 V 5.98963 H 7.83848 L 11.4281 2.40002 L 15.0177 5.98963 H 13.2229 V 11.374 H 18.0659 V 9.57924 L 21.6555 13.1688 L 18.0659 16.7584 V 14.9636 H 4.79029 V 16.7584 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.ARROW_UP_RIGHT:
        // Create an up right arrow using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.60083 11.1723 L 5.90836 8.0829 V 9.59082 H 9.59168 V 5.9075 H 8.08375 L 11.1731 1.59998 L 14.2625 5.9075 H 12.7546 V 9.59082 H 16.4379 V 8.0829 L 20.7454 11.1723 L 16.4379 14.2616 V 12.7537 H 12.7546 V 16.437 H 14.2625 L 11.1731 20.7445 L 8.08375 16.437 H 9.59168 V 12.7537 H 5.90836 V 14.2616 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.ARROW_LEFT:
        // Create a left arrow using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.51904 15.3367 H 13.8294 V 6.39979 H 11.8745 L 15.7844 1.93134 L 19.6943 6.39979 H 17.7393 V 19.8052 H 1.51904 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.ARROW_DOUBLE:
        // Create a double arrow using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.76465 19.9342 V 9.71388 C 1.76465 5.32367 5.32361 1.76471 9.71382 1.76471 C 11.8221 1.76471 13.844 2.60221 15.3347 4.09297 C 16.8255 5.58372 17.663 7.60563 17.663 9.71388 V 10.8495 H 19.9342 L 15.3918 15.3919 L 10.8494 10.8495 H 13.1206 V 9.71388 C 13.1206 7.83236 11.5953 6.30709 9.71382 6.30709 C 7.8323 6.30709 6.30703 7.83236 6.30703 9.71388 V 19.9342 H 1.76465 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.SPEECH_BUBBLE:
        // Create a speech bubble using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.33337 1.33331 H 4.76575 H 9.9143 H 21.9276 V 8.36638 V 11.3806 V 13.39 H 9.9143 L 1.71025 20.4318 L 4.76575 13.39 H 1.33337 V 11.3806 V 8.36638 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.THOUGHT_BUBBLE:
        // Create a thought bubble using fabric.Path with SVG path data
        shape = new fabric.Path('M 1.47237 20.0476 L 4.90972 13.3978 C 0.89075 11.0899 0.159706 7.12432 3.22082 4.23641 C 6.28194 1.3485 12.1334 0.483351 16.7392 2.2377 C 21.3449 3.99205 23.1976 7.79176 21.0194 11.016 C 18.8412 14.2402 13.3449 15.8337 8.32155 14.6974 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      case ShapeType.CLOUD:
        // Create a cloud using fabric.Path with SVG path data
        shape = new fabric.Path('M 13.2668 14.7218 C 12.3234 15.9275 10.857 16.7021 9.21015 16.7021 C 7.54964 16.7021 6.07255 15.9146 5.1301 14.6917 C 2.55292 14.4067 0.548223 12.216 0.548223 9.55577 C 0.548223 7.69848 1.52541 6.07005 2.99238 5.15923 C 3.5349 2.88817 5.57287 1.20001 8.00406 1.20001 C 9.28028 1.20001 10.4481 1.6652 11.3482 2.4357 C 12.2483 1.6652 13.4162 1.20001 14.6924 1.20001 C 17.5385 1.20001 19.8457 3.51352 19.8457 6.36739 C 19.8457 6.49892 19.8408 6.62931 19.8312 6.75837 C 20.915 7.70568 21.6 9.10023 21.6 10.6552 C 21.6 13.5091 19.2928 15.8226 16.4467 15.8226 C 15.2468 15.8226 14.1427 15.4114 13.2668 14.7218 Z M 1.15127 20.88 C 1.7871 20.88 2.30254 20.5601 2.30254 20.1654 C 2.30254 19.7707 1.7871 19.4507 1.15127 19.4507 C 0.515441 19.4507 0 19.7707 0 20.1654 C 0 20.5601 0.515441 20.88 1.15127 20.88 Z M 3.28934 18.4612 C 4.43989 18.4612 5.37259 17.8706 5.37259 17.1419 C 5.37259 16.4133 4.43989 15.8226 3.28934 15.8226 C 2.13879 15.8226 1.20609 16.4133 1.20609 17.1419 C 1.20609 17.8706 2.13879 18.4612 3.28934 18.4612 Z', {
          left: x,
          top: y,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
        break;
        
      default:
        // Default to rectangle if shape not implemented
        shape = new fabric.Rect({
          left: x,
          top: y,
          width: 100,
          height: 100,
          strokeWidth: this.strokeWidth,
          stroke,
          fill,
          originX: 'center',
          originY: 'center',
          scaleX: 5, // Scale up significantly
          scaleY: 5
        });
    }
    
    return shape;
  }
}

export default ShapeTool;
