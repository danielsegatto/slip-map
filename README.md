# Slip-Map: Spatial Thought Mapping

# App

## Project Specification & Roadmap

## 1. Vision & Core Philosophy

Slip-Map is a mobile-first web application designed to break the constraints of
linear note-taking. Traditionally, digital notes are captured in a vertical, line-by-
line format that mimics physical paper but fails to represent the multi-
dimensional way the human brain processes information. Slip-Map provides a
spatial canvas where thoughts are represented as "Nodes" that can be freely
placed, connected, and expanded.

The Spatial Paradigm Shift: Instead of scrolling through a list, the user
navigates through a "Landscape of Ideas." This allows for visual grouping,
where distance between nodes represents semantic distance. Proximity
becomes a tool for organization, allowing for "piles" of related thoughts without
the need for rigid folder structures.

Design Philosophy: Extreme Minimalism & Brutalism. The app follows a
"Zero-Distraction" approach. We intentionally strip away the "fluff" of modern
web design:

- Zero Transition Animations: Every state change (opening a node,
    switching layouts) is instantaneous. No fades, no slides, no easing
    functions.
- No Interactive Visual Feedback: Buttons and nodes do not change
    color, shadow, or scale when touched. Interaction is confirmed by the
    resulting action, not by a visual "click" effect.
- Brutalist Aesthetic: High contrast, system fonts, clear borders, and a
    monochrome-first palette. The goal is a utility-first interface that feels like
    a professional tool rather than a toy.

## 2. User Experience (UX) & Design Principles

- Mobile-First Interaction: Designed for thumb-reach and touch
    precision.
- Gesture Vocabulary:
    o Single-Finger Pan: Moves the viewport across the infinite
       canvas.
    o Pinch-to-Zoom: Scales the view to see the "Galaxy" view (macro)
       or the "Micro" view (node content).
    o Double-Tap: Instant creation of a node at the exact touch
       coordinate.
    o Long-Press: Contextual actions (delete, link mode, change color).


- Instant Interaction: State changes happen at the speed of the
    hardware. This reinforces the "tool" feel, where the software never
    makes the user wait for an animation to finish.
- Static Visuals: UI elements remain visually constant. This reduces
    cognitive load by removing unnecessary movement from the peripheral
    vision.

## 3. Core Functional Requirements

3.1. Node Management & Lifecycle

- Creation: Instant spawning. A new node is initialized with a blank title.
- Editing Architecture: * Tapping a node enters "Active Mode."
    o Title Field: Brief label for spatial identification.
    o Body Content: Detailed text area supporting Markdown-like
       simplicity (lists, bold text) without complex formatting toolbars.
- Visual States:
    o Minimized: A compact box showing only the title. Ideal for high-
       level mapping.
    o Expanded: A larger container displaying the body text. The node
       footprint on the canvas increases to accommodate information.
- Deletion: Nodes can be removed instantly. Deleting a node
    automatically severs all incoming and outgoing connections to prevent
    "ghost lines."

3.2. Advanced Connectivity Engine

The connection system is the "nervous system" of the app.

- Structural (Direct) Connections: Solid lines that represent hierarchy or
    direct sequence. Used for traditional mind-mapping.
- Semantic (Indirect) Connections: Dashed lines that represent cross-
    references between distant branches of thought. This allows the user to
    see links between "Project A" and "Idea B" without moving them
    together.
- Visual Logic: Connections are rendered as SVG paths that calculate the
    shortest distance between node boundaries, updating in real-time as
    nodes are moved.
- Unlinking: A simple "Cut" interaction to remove relationships between
    nodes without deleting the nodes themselves.

3.3. Temporal Dimension (Reminders)

- Contextual Dates: Each node can host a "Reminder Attribute."
- Reminder Dashboard: A non-spatial, functional list view that scans all
    nodes across the map and presents those with a date matching "Today."
- Spatial Highlighting: While we avoid color changes on click, nodes with
    active reminders use a thicker border or a specific static icon to signal
    their status on the map.


3.4. Layout Persistence & Spatial Views

- Instant Auto-Save: Every movement of a node is pushed to the
    persistence layer.
- Custom Layouts: A single dataset of nodes can have multiple
    "Coordinate Sets."
       o Example: A "Brainstorm Layout" where nodes are scattered
          randomly, and a "Execution Layout" where the same nodes are
          organized into a strict flowchart.
- Switching Views: When a user selects a different layout, nodes
    "teleport" to their new coordinates instantly.

## 4. Technical Architecture

4.1. Frontend Implementation

- React Engine: Centralized state management using a single source of
    truth for the node dictionary.
- Tailwind CSS Configuration: A custom configuration that disables all
    default transition classes and hover states to enforce the minimalist
    philosophy.
- SVG Canvas: A high-performance SVG layer for rendering lines,
    ensuring crisp visuals at any zoom level.

4.2. Backend & Persistence (Firebase)

- Auth: Firebase Anonymous Authentication as a baseline, allowing users
    to start immediately without a sign-up barrier.
- Firestore Data Schema:
    o nodes: Document per node storing metadata (title, content,
       created_at, reminder_date).
    o layouts: Maps nodeId to { x, y } coordinates. This allows the same
       node to exist in different positions in different layouts.
    o connections: Stores { from, to, type } relationships.

## 5. Detailed Implementation Roadmap (Block-by-Block)

Block 1: The Zero-Lag Infinite Viewport

- Objective: A flawless navigation experience.
- Tasks:
    o Create a container with overflow: hidden and a coordinate system.
    o Implement the math for zoom (scale) and pan (translate).
    o Render a static dot-grid background that stays fixed or scales with
       the zoom.
    o Ensure touch events (touchstart, touchmove) are handled without
       "browser-bounce" effects.

Block 2: Spatial Node Mechanics


- Objective: Manipulating thoughts in space.
- Tasks:
    o Logic to convert "Click/Tap" coordinates into "Canvas"
       coordinates.
    o Implement draggability for nodes.
    o Minimalist Rule Check: Verify no color shifts occur during the
       drag.
    o Collision logic: Ensure nodes don't overlap in a way that hides
       content.

Block 3: The Content Layer

- Objective: From spatial labels to deep notes.
- Tasks:
    o Implement the "Toggle" logic (Minimized vs Expanded).
    o Build the instant-edit text fields for Title and Content.
    o Add the "Delete" workflow via a simple long-press menu.

Block 4: Relationship Rendering (SVG)

- Objective: Visualizing connections.
- Tasks:
    o Calculate dynamic line paths between the edges of rectangular
       nodes.
    o Implement "Link Mode": Select Node A, then Node B to create a
       link.
    o Logic for "Indirect" vs "Direct" visual styles (Stroke-dasharray for
       SVG).

Block 5: Persistence & Cloud Sync

- Objective: Real-time persistence.
- Tasks:
    o Connect to Firestore using the optimized path structure.
    o Implement debouncing on node movement: Save to cloud only
       after the user stops dragging for 500ms to save API calls.
    o Handle offline mode: UI should show a "Local Mode" indicator if
       Firebase is unreachable.

Block 6: Time & Reminders

- Objective: Making the map actionable.
- Tasks:
    o Add a minimalist date-picker (native mobile picker).
    o Create the "Reminders List" overlay/view.
    o Logic to filter nodes by date and status.

Block 7: Multi-Layout Management

- Objective: Viewing the map from different perspectives.


- Tasks:
    o Implement the "Save Current Layout" feature.
    o Build a minimalist Layout Switcher (List of names).
    o Ensure "Instant Teleportation" logic when switching views.

Block 8: Final Optimization & Brutalist Audit

- Objective: Hardening the app.
- Tasks:
    o Viewport Culling: Stop rendering nodes that are outside the
       current screen view to save battery and CPU.
    o Audit every component to remove any stray CSS transitions or
       focus-ring colors that break the minimalist rule.
    o Final mobile testing: Ensure all tap targets are appropriately sized
       for fingers.


