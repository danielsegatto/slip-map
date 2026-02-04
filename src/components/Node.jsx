import { useRef, useEffect } from 'react';

export default function Node({ 
  id, 
  x, 
  y, 
  title, 
  body, 
  expanded, 
  isEditing, 
  onMouseDown, 
  onMouseUp,   // NEW: Receive the end-interaction handler
  onChange,
  onBlur 
}) {
  const titleInputRef = useRef(null);
  
  useEffect(() => {
    if (isEditing && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditing]);

  const handleTitleChange = (e) => onChange(id, { title: e.target.value });
  const handleBodyChange = (e) => onChange(id, { body: e.target.value });

  return (
    <div
      // EVENT: Start (Down) and End (Up) of gestures
      onMouseDown={(e) => onMouseDown(e, id)}
      onTouchStart={(e) => onMouseDown(e, id)}
      onMouseUp={(e) => onMouseUp(e, id)}       // WIRED UP
      onTouchEnd={(e) => onMouseUp(e, id)}      // WIRED UP
      
      style={{
        transform: `translate(${x}px, ${y}px)`,
        width: expanded ? '320px' : '192px',
        zIndex: expanded || isEditing ? 50 : 1, 
      }}
      className={`
        absolute top-0 left-0 bg-brutal-white border-2 border-brutal-black 
        shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col transition-none
        ${expanded ? 'p-4' : 'p-2'}
        cursor-pointer select-none
      `}
    >
      <input
        ref={titleInputRef}
        value={title}
        onChange={handleTitleChange}
        onBlur={() => onBlur(id)} 
        placeholder="UNTITLED"
        readOnly={!isEditing} 
        className={`
          w-full bg-transparent outline-none placeholder:text-brutal-gray/30 font-bold uppercase
          ${expanded ? 'text-lg mb-2' : 'text-sm'}
          /* Ignore clicks when not editing so parent handles gestures */
          ${!isEditing ? 'pointer-events-none' : ''} 
        `}
      />

      {expanded && (
        <textarea
          value={body}
          onChange={handleBodyChange}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          placeholder="Write your thought..."
          className="w-full h-32 bg-transparent outline-none resize-none font-mono text-sm leading-relaxed placeholder:text-brutal-gray/30 mt-2"
        />
      )}
    </div>
  );
}