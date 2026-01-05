
import React, { useState, useRef } from 'react';
import { Info } from 'lucide-react';

interface KpiInfoProps {
  definition: {
    label: string;
    meaning: string;
    calculation: string;
  };
  className?: string;
}

export const KpiInfo: React.FC<KpiInfoProps> = ({ definition, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Calculate coordinates relative to viewport
      setCoords({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
      setIsVisible(true);
    }
  };

  return (
    <div 
      ref={triggerRef}
      className={`relative inline-block leading-none ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
    >
      <Info className="w-3.5 h-3.5 text-gray-400 hover:text-blue-500 transition-colors cursor-help" />
      
      {isVisible && (
        <div 
          style={{ 
            position: 'fixed',
            left: `${coords.x}px`,
            top: `${coords.y - 8}px`,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'none'
          }}
          className="z-[9999] w-72 p-4 bg-gray-900 text-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-[12px] animate-in fade-in zoom-in-95 duration-200 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-blue-500 rounded-full" />
            <p className="font-bold text-blue-400 uppercase tracking-wider">{definition.label}</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-gray-400 text-[10px] uppercase font-bold mb-0.5">Meaning</p>
              <p className="leading-relaxed opacity-95">{definition.meaning}</p>
            </div>
            
            <div className="pt-2 border-t border-gray-800">
              <p className="text-gray-400 text-[10px] uppercase font-bold mb-0.5">Calculation Logic</p>
              <p className="leading-relaxed italic text-gray-300">{definition.calculation}</p>
            </div>
          </div>
          
          {/* Tooltip Arrow */}
          <div 
            className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900" 
          />
        </div>
      )}
    </div>
  );
};
