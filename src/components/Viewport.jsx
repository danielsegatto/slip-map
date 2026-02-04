import { useState, useRef } from 'react';
import Node from './Node'; // Import our new component

export default function Viewport() {
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  
  // STATE: Store our list of nodes
  const [nodes, setNodes] = useState([]);

  const lastMousePos = useRef({ x: 0, y: 0 });

  // --- MATH HELPER: Screen Pixels -> World Coordinates ---
  const screenToWorld = (screenX, screenY) => {
    return {
      x: (screenX - view.x) / view.scale,
      y: (screenY - view.y) / view.scale,
    };
  };

  // --- INTERACTION: Create Node ---
  const handleDoubleClick = (e) => {
    // 1. Get exact world coordinates of the click
    const { x, y } = screenToWorld(e.clientX, e.clientY);

    // 2. Create a new node object
    const newNode = {
      id: Date.now(), // Simple unique ID
      x: x,
      y: y,
    };

    // 3. Add to state
    setNodes(prev => [...prev, newNode]);
  };

  // --- PANNING LOGIC ---
  const handleMouseDown = (e) => {
    // Only drag if clicking the background (not a node)
    if (e.target.closest('.node-container')) return;

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
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-brutal-white cursor-crosshair select-none touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick} // ADDED: Trigger creation
    >
      {/* THE WORLD */}
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

        {/* RENDER NODES */}
        {nodes.map(node => (
          <div key={node.id} className="node-container absolute top-0 left-0">
             <Node x={node.x} y={node.y} id={node.id} />
          </div>
        ))}

        {/* ORIGIN MARKER */}
        <div className="absolute top-0 left-0 w-4 h-4 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* DEBUG HUD */}
      <div className="fixed bottom-4 left-4 p-2 border border-brutal-black bg-white font-mono text-xs pointer-events-none select-none">
        NODES: {nodes.length} | X: {Math.round(view.x)} Y: {Math.round(view.y)} Z: {view.scale.toFixed(2)}
      </div>
    </div>
  );
}