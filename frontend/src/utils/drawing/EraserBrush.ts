import { fabric } from 'fabric';
import ErasedGroup from './ErasedGroup';

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

    const objects: fabric.Object[] = this.canvas.getObjects().filter((obj: fabric.Object) => {
      if (!obj.intersectsWithObject(path)) return false;
      return true;
    });

    if (objects.length > 0) {
      const mergedGroup = new fabric.Group(objects);
      const newPath = new ErasedGroup(mergedGroup, path);

      const left = newPath.left;
      const top = newPath.top;
      
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

export default EraserBrush;