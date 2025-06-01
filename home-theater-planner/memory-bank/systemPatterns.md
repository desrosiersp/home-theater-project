# System Patterns: Home Theater Planner

## 1. Overall Architecture

- **Single Page Application (SPA):** Built with React, managed by `create-react-app`.
- **Component-Based Architecture:** UI is broken down into reusable React components, organized by feature/domain (e.g., `RoomBuilder`, `ComponentSelector`, `AcousticsCalculator`).
- **Context-Driven State Management:** Global and shared state is managed via React Context API, with dedicated contexts for different domains (`RoomContext`, `ComponentContext`, `StorageContext`). This avoids prop drilling for widely used data.
- **Utility Modules:** Business logic and complex calculations are encapsulated in utility functions within the `src/utils/` directory (e.g., `dolbyAtmosRules.js`, `powerCalculator.js`).

## 2. UI Structure Pattern

- **`GlobalLayout.js` Component:** Provides the outermost application shell, including the main AppBar for global navigation (Home, Planner, Guides, Build Blogs, etc.) and a footer. It uses React Router's `<Outlet />` to render page-specific content.
- **`MainLayout.js` Component (for PlannerPage):** Provides a specific layout for the planner tool:
  - **AppBar (Planner-specific):** Fixed header for "Home Theater Planner" title and planner-specific actions (Save/Load Design). This AppBar is part of `MainLayout` itself.
  - **Persistent Drawer (Sidebar):** Fixed left sidebar for all primary user inputs and controls related to the planner (room setup, component selection, visualization controls).
  - **Tabbed Workspace:** Main content area within the planner uses Material-UI Tabs to switch between different planner functionalities ("Room Design", "Power & SPL", "Optimization").
- **`TabPanel.js`:** A helper component to manage the display of content for the active tab within `MainLayout.js`.
- **Page Components (e.g., `HomePage.js`, `PlannerPage.js`, `BuildBlogListPage.js`):** These are routed via `App.js` and rendered within `GlobalLayout.js`. `PlannerPage.js` in turn uses `MainLayout.js`. `BuildBlogListPage.js` renders `CommunityBuildsTab.js` (which is now context-agnostic for display purposes).
- **Responsive Design (Aspirational):** Material-UI's Grid and Box components are used, which support responsive props, but thorough responsive testing and refinement is a future task.

## 3. State Management Pattern

- **Centralized Context Providers:** Providers (`RoomProvider`, `ComponentProvider`, `StorageProvider`) are wrapped around the application's root in `App.js` to make state and updater functions available throughout the component tree via custom hooks (`useRoomContext`, etc.).
- **Immutable Updates:** State updates follow React's principles of immutability (e.g., `setState(prev => ({ ...prev, ...updates }))`).
- **Memoization:** `useCallback` is used for context updater functions to stabilize their references. `useMemo` is used for derived data and complex calculations within components to optimize performance by avoiding unnecessary re-computations.
- **Local Component State:** `useState` is used for component-specific UI state (e.g., dialog open/close status, local form input values before committing to context).
- **Data Fetching in Components:** `useEffect` hooks are used within components (e.g., selectors, display components) to fetch necessary JSON data on mount. Loading and error states are managed locally within these components.

## 4. Data Flow Pattern

1.  **User Input:** Primarily occurs in sidebar components. Input components use local state for immediate input handling and then call updater functions from contexts on blur or specific actions (e.g., button click, select change).
2.  **Context Update:** Context updater functions modify the global state.
3.  **Re-render:** Components consuming the updated context re-render.
4.  **Derived Data/Calculations:**
    - Display components (e.g., `RoomVisualizer`, `CalculationsDisplay`) consume context state.
    - `useMemo` hooks within these components re-calculate derived data (e.g., speaker positions, SPL values, room modes) when relevant context state changes.
    - Utility functions from `src/utils/` are called to perform these calculations.
5.  **Visual Output:** Display components update their rendering based on the new state or derived data.

## 5. Key Component Interaction Patterns

- **Selectors -> Context -> Display:**
  - E.g., `SpeakerConfigurationSelector` updates `speakerConfiguration` in `ComponentContext`.
  - `RoomVisualizer` and `CalculationsDisplay` consume `speakerConfiguration` and re-calculate/re-render.
- **Room Dimensions -> Context -> Multiple Consumers:**
  - `RoomDimensionInput` updates `roomDimensionsMeters` in `RoomContext`.
  - `RoomVisualizer`, `CalculationsDisplay`, `RoomModesDisplay`, `ReflectionPointsDisplay` all consume `roomDimensionsMeters` and update their respective outputs.
- **Drag & Drop (`RoomVisualizer`):**
  - `onMouseDown` on an SVG element initiates drag state (local to `RoomVisualizer`).
  - `mousemove` (global listener) calculates new position and calls `updateManualSpeakerPosition` in `RoomContext`.
  - Context update triggers re-render of `RoomVisualizer` with the new manual position.
  - Other components (e.g., `CalculationsDisplay`) also consume `manualSpeakerPositions` to use updated locations.
- **Save/Load Design (`StorageContext`):**
  - `saveCurrentDesign` pulls data from `RoomContext` and `ComponentContext` to create a design object.
  - `loadDesign` pushes data from a saved design object back into `RoomContext` and `ComponentContext` via their updater functions.

## 6. Asynchronous Operations

- **Data Fetching:** `fetch` API used in `useEffect` for loading JSON data. Loading states managed with `useState`.
- **Local Storage:** `localStorage.getItem`, `localStorage.setItem` are synchronous but wrapped in context functions. `useEffect` in `StorageContext` loads initial data.

## 7. Code Reusability

- **Utility Functions:** Common calculations are centralized in `src/utils/`.
- **Context Hooks:** Custom hooks (`useRoomContext`, etc.) provide a clean API for accessing context.
- **Generic UI Components:** `CalculationCard.js`, `TabPanel.js` are examples of reusable presentational components.

This document outlines the primary design patterns and architectural decisions made during the development of the Home Theater Planner.
