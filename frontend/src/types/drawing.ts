export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'ellipse' | 'polygon' | 'star' | 'heart' | 'arrow';
export type Tool = 'pencil' | 'select' | 'eraser' | 'line' | 'shape';

export interface ShapeOptionProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}