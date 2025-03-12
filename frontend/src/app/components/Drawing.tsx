import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Pencil, MousePointer, Eraser } from 'lucide-react';

type Tool = 'pencil' | 'select' | 'eraser';

// Custom ErasedGroup class for handling erased objects
const ErasedGroup = fabric.util.createClass(fabric.Group, {
  original: null,
  erasedPath: null,
  initialize: function(original: fabric.Object, erasedPath: fabric.Object, options: any, isAlreadyGrouped: boolean) {
    this.original = original;
    this.erasedPath = erasedPath;
    this.callSuper('initialize', [this.original, this.erasedPath], options, isAlreadyGrouped);
  },

  _calcBounds: function(onlyWidthHeight: boolean) {
    const aX: number[] = [];
    const aY: number[] = [];
    const props = ['tr', 'br', 'bl', 'tl'];
    const ignoreZoom = true;

    const o = this.original;
    o.setCoords(ignoreZoom);
    for (let j = 0; j < props.length; j++) {
      const prop = props[j];
      aX.push(o.oCoords[prop].x);
      aY.push(o.oCoords[prop].y);
    }

    this._getBounds(aX, aY, onlyWidthHeight);
  },
});

// Custom EraserBrush class for proper erasing functionality
const EraserBrush = fabric.util.createClass(fabric.PencilBrush, {
  _finalizeAndAddPath: function() {
    const ctx = this.canvas.contextTop;
    ctx.closePath();
    
    if (this.decimate) {
      this._points = this.decimatePoints(this._points, this.decimate);
    }
    
    const pathData = this.convertPointsToSVGPath(this._points).join('');
    if (pathData === 'M 0 0 Q 0 0 0 0 L 0 0') {
      this.canvas.requestRenderAll();
      return;
    }

    const path = this.createPath(pathData);
    path.globalCompositeOperation = 'destination-out';
    path.selectable = false;
    path.evented = false;
    path.absolutePositioned = true;

    const objects = this.canvas.getObjects().filter((obj) => {
      if (!obj.intersectsWithObject(path)) return false;
      return true;
    });

    if (objects.length > 0) {
      const mergedGroup = new fabric.Group(objects);
      const newPath = new ErasedGroup(mergedGroup, path);

      const left = newPath.left;
      const top = newPath.top;

      // IMPORTANT: Don't clear the top context yet to avoid flickering
      // Keep the visual appearance of the eraser effect while we prepare the new object
      
      // Temporarily disable all rendering
      this.canvas._isRendering = true;
      
      const newData = newPath.toDataURL({
        withoutTransform: true
      });
      
      fabric.Image.fromURL(newData, (fabricImage) => {
        fabricImage.set({
          left: left,
          top: top,
        });

        // Only now clear the top context, right before we apply the changes
        this.canvas.clearContext(this.canvas.contextTop);
        
        // Completely disable rendering during our operation
        const originalRenderOnAddRemove = this.canvas.renderOnAddRemove;
        this.canvas.renderOnAddRemove = false;
        
        // Add the new image first, then remove the old objects in one atomic operation
        this.canvas.add(fabricImage);
        this.canvas.remove(...objects);
        
        // Re-enable rendering and force a render
        this.canvas.renderOnAddRemove = originalRenderOnAddRemove;
        this.canvas._isRendering = false;
        this.canvas.renderAll();
      });
    } else {
      this.canvas.clearContext(this.canvas.contextTop);
      this.canvas.renderAll();
    }
    
    this._resetShadow();
  }
});

const Sketch: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const [tool, setTool] = useState<Tool>('pencil');
  const eraserBrushRef = useRef<any>(null);

  useEffect(() => {
    if (canvasRef.current && !fabricRef.current) {
      canvasRef.current.width = 800;
      canvasRef.current.height = 600;

      const canvas = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        isDrawingMode: true
      });

      fabricRef.current = canvas;

      // Initialize the eraser brush
      eraserBrushRef.current = new EraserBrush(canvas);
      eraserBrushRef.current.width = 10;
      eraserBrushRef.current.color = "#ffffff";

      // Set up initial pencil brush settings
      canvas.freeDrawingBrush.width = 2;
      canvas.freeDrawingBrush.color = '#000000';
    }

    return () => {
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    switch (tool) {
      case 'pencil':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = 2;
        canvas.freeDrawingBrush.color = '#000000';
        break;
      case 'eraser':
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = eraserBrushRef.current;
        break;
      case 'select':
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
    }
  }, [tool]);

  const handleToolChange = (newTool: Tool) => {
    setTool(newTool);
    
    if (fabricRef.current) {
      fabricRef.current.discardActiveObject();
      fabricRef.current.requestRenderAll();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-4 p-4 bg-white rounded-lg shadow-md">
        <button
          className={`p-2 rounded ${tool === 'pencil' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => handleToolChange('pencil')}
        >
          <Pencil size={24} />
        </button>
        <button
          className={`p-2 rounded ${tool === 'select' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => handleToolChange('select')}
        >
          <MousePointer size={24} />
        </button>
        <button
          className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => handleToolChange('eraser')}
        >
          <Eraser size={24} />
        </button>
      </div>
      
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        <canvas ref={canvasRef} id="fabric-canvas" />
      </div>
    </div>
  );
};

export default Sketch;