import { useState, useRef } from 'react';
import Node from './Node';

export default function Viewport() {
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [nodes, setNodes] = useState([]);

  // --- INTERACTION STATES ---
  const [editingNodeId, setEditingNodeId] = useState(null); 
  const [draggedNode, setDraggedNode] = useState(null);     
  const [isPanning, setIsPanning] = useState(false);        

  // --- GESTURE TIMERS ---
  const longPressTimer = useRef(null);
  const clickCountTimer = useRef(null);
  const lastClickTime = useRef(0);
  const gestureStartPos = useRef({ x: 0, y: 0 }); 
  const lastMousePos = useRef({ x: 0, y: 0 }); 

  // --- MATH HELPER ---
  const screenToWorld = (screenX, screenY) => {
    return {
      x: (screenX - view.x) / view.scale,
      y: (screenY - view.y) / view.scale,
    };
  };

  // --- NODE ACTIONS ---
  const updateNode = (id, updates) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const handleNodeBlur = () => {
    setEditingNodeId(null); 
  };

  // --- GESTURE START (Down) ---
  const handleNodeDown = (e, id) => {
    e.stopPropagation();
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    gestureStartPos.current = { x: clientX, y: clientY };

    // Start Timer: If held for 500ms, it becomes a DRAG
    longPressTimer.current = setTimeout(() => {
      const mouseWorld = screenToWorld(clientX, clientY);
      const node = nodes.find(n => n.id === id);
      
      setDraggedNode({
        id: id,
        offsetX: mouseWorld.x - node.x,
        offsetY: mouseWorld.y - node.y,
      });
      setEditingNodeId(null); 
    }, 500);
  };

  // --- GESTURE MOVEMENT ---
  const handleMouseMove = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // CANCEL LONG PRESS if finger moves too much
    if (longPressTimer.current && !draggedNode) {
        const moveDist = Math.hypot(
            clientX - gestureStartPos.current.x, 
            clientY - gestureStartPos.current.y
        );
        if (moveDist > 10) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
            setIsPanning(true); 
            lastMousePos.current = { x: clientX, y: clientY }; 
        }
    }

    if (draggedNode) {
      e.preventDefault(); 
      const mouseWorld = screenToWorld(clientX, clientY);
      setNodes(prev => prev.map(node => {
        if (node.id === draggedNode.id) {
          return {
            ...node,
            x: mouseWorld.x - draggedNode.offsetX,
            y: mouseWorld.y - draggedNode.offsetY
          };
        }
        return node;
      }));
      return;
    }

    if (isPanning) {
      e.preventDefault();
      const dx = clientX - lastMousePos.current.x;
      const dy = clientY - lastMousePos.current.y;
      setView(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: clientX, y: clientY };
    }
  };

  // --- GLOBAL UP (Cleanup) ---
  const handleMouseUp = () => {
    if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
    }
    setDraggedNode(null);
    setIsPanning(false);
  };

  // --- INTELLIGENT CLICK LOGIC (Tap vs Double Tap) ---
  const handleNodeClickLogic = (id) => {
      const now = Date.now();
      const timeSinceLast = now - lastClickTime.current;
      
      if (timeSinceLast < 300) {
          // DOUBLE TAP -> Expand
          if (clickCountTimer.current) clearTimeout(clickCountTimer.current);
          setNodes(prev => prev.map(n => n.id === id ? { ...n, expanded: !n.expanded } : n));
          lastClickTime.current = 0; 
      } else {
          // SINGLE TAP -> Edit (Wait 300ms to confirm it's not a double)
          lastClickTime.current = now;
          clickCountTimer.current = setTimeout(() => {
             setEditingNodeId(id);
          }, 300);
      }
  };

  // --- NODE UP (End of interaction on a specific node) ---
  const handleNodeInteractionEnd = (e, id) => {
      // If we were dragging or panning, this wasn't a "Click"
      if (draggedNode || isPanning) {
          handleMouseUp();
          return;
      }

      // If timer is still running, it means we released EARLY (< 500ms)
      // This confirms it was a TAP.
      if (longPressTimer.current) {
          clearTimeout(longPressTimer.current);
          longPressTimer.current = null;
          handleNodeClickLogic(id);
      }
  };

  const handleBackgroundDoubleClick = (e) => {
      if (e.target.closest('.node-wrapper')) return;
      const { x, y } = screenToWorld(e.clientX, e.clientY);
      setNodes(prev => [...prev, { 
          id: Date.now(), 
          x, y, 
          title: "", body: "", expanded: false 
      }]);
      setTimeout(() => setEditingNodeId(Date.now()), 50);
  };

  const handleBackgroundDown = (e) => {
      if (e.target.closest('input') || e.target.closest('textarea')) return;
      if (e.target.closest('.node-wrapper')) return; // Nodes handle themselves

      setIsPanning(true);
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      lastMousePos.current = { x: clientX, y: clientY };
  };

  return (
    <div 
      className="fixed inset-0 w-screen h-screen overflow-hidden bg-brutal-white cursor-crosshair select-none touch-none"
      onMouseDown={handleBackgroundDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleBackgroundDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      onWheel={(e) => {
          const newScale = Math.min(Math.max(view.scale - (e.deltaY * 0.001 * view.scale), 0.1), 5);
          setView(prev => ({ ...prev, scale: newScale }));
      }}
      onDoubleClick={handleBackgroundDoubleClick}
    >
      <div 
        style={{ 
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          transformOrigin: "top left",
        }}
        className="absolute top-0 left-0 w-0 h-0 overflow-visible"
      >
        <div 
            className="absolute top-[-5000px] left-[-5000px] w-[10000px] h-[10000px] pointer-events-none opacity-20"
            style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {nodes.map(node => (
          <div key={node.id} className="absolute top-0 left-0 node-wrapper">
             <Node 
               {...node} 
               isEditing={editingNodeId === node.id}
               onMouseDown={handleNodeDown} 
               onMouseUp={handleNodeInteractionEnd} // FIX: Attached directly
               onBlur={handleNodeBlur}      
               onChange={updateNode} 
             />
             {/* OVERLAY REMOVED */}
          </div>
        ))}
        
        <div className="absolute top-0 left-0 w-4 h-4 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      <div className="fixed bottom-4 left-4 p-2 border border-brutal-black bg-white font-mono text-xs pointer-events-none select-none">
        {draggedNode ? 'HOLDING' : editingNodeId ? 'EDITING' : 'IDLE'}
      </div>
    </div>
  );
}