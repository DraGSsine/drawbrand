import { fabric } from 'fabric';

class LineTool {
  canvas: fabric.Canvas;
  isDrawing: boolean = false;
  startPoint: { x: number, y: number } | null = null;
  tempLine: fabric.Line | null = null;
  strokeWidth: number;

  constructor(canvas: fabric.Canvas, strokeWidth: number = 2) {
    this.canvas = canvas;
    this.strokeWidth = strokeWidth;
  }

  setStrokeWidth(width: number) {
    this.strokeWidth = width;
  }

  activate() {
    this.reset();
    this.canvas.on('mouse:down', this.onClick);
    this.canvas.on('mouse:move', this.onMouseMove);
    this.canvas.defaultCursor = 'crosshair';
  }

  deactivate() {
    this.canvas.off('mouse:down', this.onClick);
    this.canvas.off('mouse:move', this.onMouseMove);
    this.reset();
    this.canvas.defaultCursor = 'default';
  }

  reset() {
    this.isDrawing = false;
    this.startPoint = null;
    
    // Remove temporary line if it exists
    if (this.tempLine) {
      this.canvas.remove(this.tempLine);
      this.tempLine = null;
    }
  }

  onClick = (o: fabric.IEvent) => {
    const pointer = this.canvas.getPointer(o.e);
    
    if (!this.isDrawing) {
      // First click - start drawing
      this.isDrawing = true;
      this.startPoint = { x: pointer.x, y: pointer.y };
      
      // Create the initial line at the starting point
      this.tempLine = new fabric.Line(
        [pointer.x, pointer.y, pointer.x, pointer.y],
        {
          strokeWidth: this.strokeWidth,
          stroke: '#000000',
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false
        }
      );
      
      this.canvas.add(this.tempLine);
    } else {
      // Second click - complete the line
      if (this.startPoint && this.tempLine) {
        // Create the final line
        const finalLine = new fabric.Line(
          [this.startPoint.x, this.startPoint.y, pointer.x, pointer.y],
          {
            strokeWidth: this.strokeWidth,
            stroke: '#000000',
            originX: 'center',
            originY: 'center',
            selectable: true
          }
        );
        
        // Remove the temporary line
        this.canvas.remove(this.tempLine);
        this.tempLine = null;
        
        // Add the completed line
        this.canvas.add(finalLine);
        this.canvas.setActiveObject(finalLine);
        this.canvas.renderAll();
        
        // Reset to start a new line
        this.isDrawing = false;
        this.startPoint = null;
      }
    }
  }
  
  onMouseMove = (o: fabric.IEvent) => {
    // Only update the line if we're in drawing mode
    if (this.isDrawing && this.startPoint && this.tempLine) {
      const pointer = this.canvas.getPointer(o.e);
      
      // Update the temporary line to follow the cursor
      this.tempLine.set({
        x2: pointer.x,
        y2: pointer.y
      });
      
      this.canvas.renderAll();
    }
  }
}

export default LineTool;