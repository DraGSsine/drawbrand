import { fabric } from 'fabric';

// Define available icons
export enum IconType {
  STAR = 'star',
  HEART = 'heart',
  ARROW = 'arrow',
  CHECK = 'check'
}

class IconTool {
  canvas: fabric.Canvas;
  selectedIcon: IconType = IconType.STAR;

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  setSelectedIcon(icon: IconType) {
    this.selectedIcon = icon;
  }

  // No longer need the activate/deactivate methods
  activate() {
    // Empty - no longer using canvas click events
  }

  deactivate() {
    // Empty - no longer using canvas click events
  }

  // Add icon directly to the center of the canvas
  addIcon() {
    if (!this.canvas) return;
    
    const canvasWidth = this.canvas.width || 800;
    const canvasHeight = this.canvas.height || 600;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    this.addIconToCanvas(centerX, centerY);
  }

  addIconToCanvas(x: number, y: number) {
    let iconText = '';
    let color = '';
    
    switch (this.selectedIcon) {
      case IconType.STAR:
        iconText = '★';
        color = '#FFD700';
        break;
      case IconType.HEART:
        iconText = '❤';
        color = '#FF0000';
        break;
      case IconType.ARROW:
        iconText = '➜';
        color = '#000000';
        break;
      case IconType.CHECK:
        iconText = '✓';
        color = '#008000';
        break;
    }
    
    const icon = new fabric.Text(iconText, {
      left: x,
      top: y,
      fontSize: 50,
      fill: color,
      originX: 'center',
      originY: 'center'
    });
    
    this.canvas.add(icon);
    this.canvas.setActiveObject(icon);
    this.canvas.renderAll();
  }
}

export default IconTool;