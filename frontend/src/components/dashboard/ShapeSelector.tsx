import React from 'react';
import { ShapeType } from '@/utils/drawing/ShapeTool';
 
interface ShapeSelectorProps {
  onSelectShape: (shape: ShapeType) => void;
  onChangeFillMode: (mode: 'regular' | 'solid') => void;
  fillMode: 'regular' | 'solid';
}

const ShapeSelector: React.FC<ShapeSelectorProps> = ({
  onSelectShape,
  onChangeFillMode,
  fillMode,
}) => {
  // We'll control how SVGs should render based on fillMode
  const isSolid = fillMode === 'solid';

  return (
    <div className=" w-[300px] xl:w-[380px] bg-white rounded-xl shadow-dropdown p-4 animate-scale-in border border-gray-100">
      {/* Shapes grid */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {/* Pentagon */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.PENTAGON)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M6.23999 20.64L2.68799 9.69598L12 2.92798L21.312 9.69598L17.76 20.64H6.23999Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#020617"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Rectangle */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.RECTANGLE)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M2 2V22H22V2H2Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#020617"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Diamond */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.DIAMOND)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M11.6 1.59998L18.6 11.6L11.6 21.6L4.59998 11.6L11.6 1.59998Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#020617"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Parallelogram */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.PARALLELOGRAM)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M7 2L2 22H17L22 2H7Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#020617"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Trapezoid */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.TRAPEZOID)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M1.59998 21.6L7.59998 3.59998H15.6L21.6 21.6H1.59998Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#020617"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Frame */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.FRAME)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M18 18V6H6V18H18ZM22 22V2H2V22H22Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#020617"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Hexagon */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.HEXAGON)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M7.224 20.28L2.448 12L7.224 3.71997H16.776L21.552 12L16.776 20.28H7.224Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Octagon */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.OCTAGON)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M8.20803 20.976L2.95203 15.72V8.27999L8.20803 3.02399H15.648L20.904 8.27999V15.72L15.648 20.976H8.20803Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* House */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.HOUSE)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M2.68799 16.8V9.59998L12 2.92798L21.312 9.59998V16.8H2.68799Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Polygon */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.POLYGON)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M2.448 16.8V8.39998L7.224 3.59998H16.776L21.552 8.39998V16.8H2.448Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Triangle */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.TRIANGLE)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M12 5L22 22H2L12 5Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Right Triangle */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.RIGHT_TRIANGLE)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M2 2L22 22H2V2Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Double Triangle */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.DOUBLE_TRIANGLE)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M7.2 19L12 11L16.8 19H7.2ZM2 22L12 5L22 22H2Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Arrow Tip */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.ARROW_TIP)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M13.1238 19.5625H4.5019V11.0581L13.1238 19.5625ZM0.857422 23.223V2.32025L21.9735 23.223H0.857422Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Circle */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.CIRCLE)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M12.48 22.08C17.7819 22.08 22.08 17.7819 22.08 12.48C22.08 7.17807 17.7819 2.88 12.48 2.88C7.17807 2.88 2.88 7.17807 2.88 12.48C2.88 17.7819 7.17807 22.08 12.48 22.08Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Half Circle */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.HALF_CIRCLE)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M2.2782 13.0044C2.9207 9.11502 7.07545 6.19562 11.9999 6.19562C16.9239 6.19562 21.0789 9.11522 21.7217 13.0046L2.2782 13.0044Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Pill */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.PILL)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M2.36841 2.76587H11.5188C16.5725 2.76587 20.6693 6.80861 20.6693 11.7956C20.6693 16.7825 16.5725 20.8253 11.5188 20.8253H2.36841V2.76587Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Rounded Rectangle */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.ROUNDED_RECT)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M4.28809 8.57141H18.7522C20.647 8.57141 22.1831 10.1627 22.1831 12.1256C22.1831 14.0885 20.647 15.6797 18.7522 15.6797H4.28809C2.39325 15.6797 0.857178 14.0885 0.857178 12.1256C0.857178 10.1627 2.39325 8.57141 4.28809 8.57141Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Ring */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.RING)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M1.41174 10.5576C1.41174 5.5065 5.5065 1.41174 10.5576 1.41174C12.9833 1.41174 15.3096 2.37533 17.0248 4.09052C18.74 5.8057 19.7035 8.132 19.7035 10.5576C19.7035 15.6088 15.6088 19.7035 10.5576 19.7035C5.5065 19.7035 1.41174 15.6088 1.41174 10.5576ZM5.98469 10.5576C5.98469 13.0832 8.03207 15.1306 10.5576 15.1306C13.0832 15.1306 15.1306 13.0832 15.1306 10.5576C15.1306 8.03207 13.0832 5.98469 10.5576 5.98469C8.03207 5.98469 5.98469 8.03207 5.98469 10.5576Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Semi Circle */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.SEMI_CIRCLE)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M1.375 21.2463C1.375 13.9306 6.00827 8 11.7237 8C17.4391 8 22.0724 13.9306 22.0724 21.2463H16.8981C16.8981 17.5885 14.5814 14.6232 11.7237 14.6232C8.86599 14.6232 6.54935 17.5885 6.54935 21.2463H1.375Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Star */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.STAR)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M1.59998 11.1723L6.00442 9.78754L2.88242 6.38612L7.38914 7.38914L6.38612 2.88242L9.78754 6.00442L11.1723 1.59998L12.557 6.00442L15.9584 2.88242L14.9554 7.38914L19.4621 6.38612L16.3401 9.78754L20.7445 11.1723L16.3401 12.557L19.4621 15.9584L14.9554 14.9554L15.9584 19.4621L12.557 16.3401L11.1723 20.7445L9.78754 16.3401L6.38612 19.4621L7.38914 14.9554L2.88242 15.9584L6.00442 12.557L1.59998 11.1723Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Heart */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.HEART)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M2.74036 9.7165L9.59286 9.71655L11.7104 2.76923L13.8279 9.71655L20.6804 9.7165L15.1365 14.0101L17.2541 20.9574L11.7104 16.6637L6.16659 20.9574L8.28417 14.0101L2.74036 9.7165Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Star 4 */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.STAR_4)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M1.59998 11.1723L6.00442 9.78754L2.88242 6.38612L7.38914 7.38914L6.38612 2.88242L9.78754 6.00442L11.1723 1.59998L12.557 6.00442L15.9584 2.88242L14.9554 7.38914L19.4621 6.38612L16.3401 9.78754L20.7445 11.1723L16.3401 12.557L19.4621 15.9584L14.9554 14.9554L15.9584 19.4621L12.557 16.3401L13.6497 20.7445L11.7269 15.385L11.1723 20.7445L10.6176 15.385L8.69477 20.4184L9.5462 15.098L6.38612 19.4621L8.58555 14.5433L4.40363 17.9409L7.80121 13.759L2.88242 15.9584L7.24657 12.7983L1.92614 13.6497L6.9595 11.7269L1.59998 11.1723Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Star 5 */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.STAR_5)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M1.59998 11.1723L6.9595 10.6176L1.92614 8.69477L7.24657 9.5462L2.88242 6.38612L7.80121 8.58555L4.40363 4.40363L8.58555 7.80121L6.38612 2.88242L9.5462 7.24657L8.69477 1.92614L10.6176 6.9595L11.1723 1.59998L11.7269 6.9595L13.6497 1.92614L12.7983 7.24657L15.9584 2.88242L13.759 7.80121L17.9409 4.40363L14.5433 8.58555L19.4621 6.38612L15.098 9.5462L20.4184 8.69477L15.385 10.6176L20.7445 11.1723L15.385 11.7269L20.4184 13.6497L15.098 12.7983L19.4621 15.9584L14.5433 13.759L17.9409 17.9409L13.759 14.5433L15.9584 19.4621L12.7983 15.098L13.6497 20.4184L11.7269 15.385L11.1723 20.7445L10.6176 15.385L8.69477 20.4184L9.5462 15.098L6.38612 19.4621L8.58555 14.5433L4.40363 17.9409L7.80121 13.759L2.88242 15.9584L7.24657 12.7983L1.92614 13.6497L6.9595 11.7269L1.59998 11.1723Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Arrow Right */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.ARROW_RIGHT)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M1.71429 9.4218H17.097V6.85712L22.2263 11.9865L17.097 17.1158V14.5512H1.71429V9.4218Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Arrow Bidirectional */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.ARROW_BIDIRECTIONAL)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M1.33337 12.2985L5.01211 8.61975V10.4591H16.0525V8.61975L19.7313 12.2985L16.0525 15.9772V14.1379H5.01211V15.9772L1.33337 12.2985Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Arrow Corner */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.ARROW_CORNER)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M1.60083 15.9584L6.38697 11.1723V13.5653H13.5662V6.38612H11.1731L15.9593 1.59998L20.7454 6.38612H18.3523V18.3515H6.38697V20.7445L1.60083 15.9584Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Arrow Block */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.ARROW_BLOCK)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M1.20068 13.1688L4.79029 9.57924V11.374H9.63328V5.98963H7.83848L11.4281 2.40002L15.0177 5.98963H13.2229V11.374H18.0659V9.57924L21.6555 13.1688L18.0659 16.7584V14.9636H4.79029V16.7584L1.20068 13.1688Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Arrow Cross */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.ARROW_UP_RIGHT)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M1.60083 11.1723L5.90836 8.0829V9.59082H9.59168V5.9075H8.08375L11.1731 1.59998L14.2625 5.9075H12.7546V9.59082H16.4379V8.0829L20.7454 11.1723L16.4379 14.2616V12.7537H12.7546V16.437H14.2625L11.1731 20.7445L8.08375 16.437H9.59168V12.7537H5.90836V14.2616L1.60083 11.1723Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Arrow Left */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.ARROW_LEFT)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M1.51904 15.3367H13.8294V6.39979H11.8745L15.7844 1.93134L19.6943 6.39979H17.7393V19.8052H1.51904L1.51904 15.3367Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Arrow Double */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.ARROW_DOUBLE)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M1.76465 19.9342V9.71388C1.76465 5.32367 5.32361 1.76471 9.71382 1.76471C11.8221 1.76471 13.844 2.60221 15.3347 4.09297C16.8255 5.58372 17.663 7.60563 17.663 9.71388V10.8495H19.9342L15.3918 15.3919L10.8494 10.8495H13.1206V9.71388C13.1206 7.83236 11.5953 6.30709 9.71382 6.30709C7.8323 6.30709 6.30703 7.83236 6.30703 9.71388V19.9342H1.76465Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Speech Bubble */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.SPEECH_BUBBLE)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M1.33337 1.33331H4.76575H9.9143H21.9276V8.36638V11.3806V13.39H9.9143L1.71025 20.4318L4.76575 13.39H1.33337V11.3806V8.36638L1.33337 1.33331Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Thought Bubble */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.THOUGHT_BUBBLE)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M1.47237 20.0476L4.90972 13.3978C0.89075 11.0899 0.159706 7.12432 3.22082 4.23641C6.28194 1.3485 12.1334 0.483351 16.7392 2.2377C21.3449 3.99205 23.1976 7.79176 21.0194 11.016C18.8412 14.2402 13.3449 15.8337 8.32155 14.6974L1.47237 20.0476Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>

        {/* Cloud */}
        <button className="flex items-center justify-center w-6 h-6 xl:w-14 xl:h-14 rounded-lg transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 text-2xl border border-gray-200 dark:border-gray-700" onClick={() => onSelectShape(ShapeType.CLOUD)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path 
              d="M13.2668 14.7218C12.3234 15.9275 10.857 16.7021 9.21015 16.7021C7.54964 16.7021 6.07255 15.9146 5.1301 14.6917C2.55292 14.4067 0.548223 12.216 0.548223 9.55577C0.548223 7.69848 1.52541 6.07005 2.99238 5.15923C3.5349 2.88817 5.57287 1.20001 8.00406 1.20001C9.28028 1.20001 10.4481 1.6652 11.3482 2.4357C12.2483 1.6652 13.4162 1.20001 14.6924 1.20001C17.5385 1.20001 19.8457 3.51352 19.8457 6.36739C19.8457 6.49892 19.8408 6.62931 19.8312 6.75837C20.915 7.70568 21.6 9.10023 21.6 10.6552C21.6 13.5091 19.2928 15.8226 16.4467 15.8226C15.2468 15.8226 14.1427 15.4114 13.2668 14.7218ZM1.15127 20.88C1.7871 20.88 2.30254 20.5601 2.30254 20.1654C2.30254 19.7707 1.7871 19.4507 1.15127 19.4507C0.515441 19.4507 0 19.7707 0 20.1654C0 20.5601 0.515441 20.88 1.15127 20.88ZM3.28934 18.4612C4.43989 18.4612 5.37259 17.8706 5.37259 17.1419C5.37259 16.4133 4.43989 15.8226 3.28934 15.8226C2.13879 15.8226 1.20609 16.4133 1.20609 17.1419C1.20609 17.8706 2.13879 18.4612 3.28934 18.4612Z" 
              fill={isSolid ? "#020617" : "none"} 
              stroke={isSolid ? "none" : "#000"} 
              strokeWidth={isSolid ? "0" : "1.5"} 
            />
          </svg>
        </button>
      </div>
      
      {/* Fill mode selector */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600 dark:text-gray-400">Fill Style</span>
          
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-0.5 rounded-md">
            <button
              className={`${
                fillMode === 'regular'
                  ? 'text-xs px-2 py-1 rounded bg-blue-600 text-white shadow-sm'
                  : 'text-xs px-2 py-1 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => onChangeFillMode('regular')}
            >
              Regular
            </button>
            <button
              className={`${
                fillMode === 'solid'
                  ? 'text-xs px-2 py-1 rounded bg-blue-600 text-white shadow-sm'
                  : 'text-xs px-2 py-1 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              onClick={() => onChangeFillMode('solid')}
            >
              Solid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShapeSelector;
