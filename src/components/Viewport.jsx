import { useState, useRef } from 'react';

export default function Viewport() {
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // --- PANNING LOGIC ---
  const handleMouseDown = (e) => {
    // CRITICAL: Stop browser from thinking we are selecting text or dragging an image
    e.preventDefault(); 
    e.stopPropagation();
    
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    e.preventDefault();

    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;

    setView(prev => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy
    }));

    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // --- ZOOM LOGIC ---
  const handleWheel = (e) => {
    const zoomSensitivity = 0.001;
    const newScale = view.scale - (e.deltaY * zoomSensitivity * view.scale);
    const clampedScale = Math.min(Math.max(newScale, 0.1), 5);

    setView(prev => ({
      ...prev,
      scale: clampedScale
    }));
  };

  return (
    <div 
      // WRAPPER: Fixed to the screen, captures all events
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-brutal-white cursor-grab active:cursor-grabbing select-none touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* THE WORLD: 
         This is now a 0x0 pixel point. It cannot be "dragged" by the browser 
         because it has no dimension. It simply anchors our content.
      */}
      <div 
        className="absolute top-0 left-0 w-0 h-0 overflow-visible"
        style={{ 
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* GRID LAYER */}
        <div 
          className="absolute top-[-5000px] left-[-5000px] w-[10000px] h-[10000px] pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* ORIGIN MARKER (0,0) */}
        <div className="absolute top-0 left-0 w-4 h-4 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-0 left-4 text-xs font-mono text-brutal-gray pointer-events-none">
          ORIGIN (0,0)
        </div>
      </div>

      {/* DEBUG HUD */}
      <div className="fixed bottom-4 left-4 p-2 border border-brutal-black bg-white font-mono text-xs pointer-events-none select-none">
        X: {Math.round(view.x)} Y: {Math.round(view.y)} Z: {view.scale.toFixed(2)}
      </div>
    </div>
  );
}