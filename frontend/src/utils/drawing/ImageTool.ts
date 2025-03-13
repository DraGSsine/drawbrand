import { fabric } from 'fabric';

class ImageTool {
  canvas: fabric.Canvas;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  // No activate/deactivate needed as this is triggered by file input

  addImageFromFile(file: File) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (!e.target?.result) return;
      
      fabric.Image.fromURL(e.target.result.toString(), (img) => {
        // Scale image if it's too large
        const maxSize = 300;
        if (img.width && img.height) {
          if (img.width > maxSize || img.height > maxSize) {
            const scale = Math.min(maxSize / img.width, maxSize / img.height);
            img.scale(scale);
          }
        }
        
        // Center image in canvas
        img.set({
          left: this.canvas.width! / 2,
          top: this.canvas.height! / 2,
          originX: 'center',
          originY: 'center'
        });
        
        this.canvas.add(img);
        this.canvas.setActiveObject(img);
        this.canvas.renderAll();
      });
    };
    
    reader.readAsDataURL(file);
  }
}

export default ImageTool;