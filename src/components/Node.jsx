import { useState } from 'react';

export default function Node({ id, x, y, initialTitle = "", onMouseDown }) {
  const [title, setTitle] = useState(initialTitle);

  return (
    <div
      // EVENT: When touched/clicked, trigger the parent's handler
      onMouseDown={(e) => onMouseDown(e, id)}
      
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      className="absolute top-0 left-0 w-48 bg-brutal-white border-2 border-brutal-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-move"
    >
      {/* Title Input */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="UNTITLED"
        className="w-full bg-transparent font-bold uppercase outline-none placeholder:text-brutal-gray/50 cursor-text"
        // Prevent drag when interacting with text
        onMouseDown={(e) => e.stopPropagation()} 
      />
      
      <div className="mt-2 h-12 border-t-2 border-brutal-black border-dashed opacity-20" />
    </div>
  );
}