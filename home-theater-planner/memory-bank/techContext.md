# Technical Context: Home Theater Planner

## 1. Frontend Framework & UI Library

- **React.js:** Version 18.x (typical for `create-react-app`). The application is built using functional components and React Hooks (`useState`, `useEffect`, `useContext`, `useCallback`, `useMemo`, `useRef`).
- **Material-UI (MUI):** Version 5.x. Used extensively for UI components (AppBar, Drawer, Tabs, Buttons, Selects, Sliders, Paper, Grid, etc.), styling (`sx` prop, `Box`), and icons.
- **Create React App (CRA):** Used for initial project scaffolding, providing a pre-configured build setup (Webpack, Babel, ESLint).

## 2. State Management

- **React Context API:** Chosen for global state management to avoid prop drilling for widely used data.
  - **`RoomContext.js`:** Manages room-specific data:
    - `roomName` (string)
    - `roomDimensionsMeters` (object: `{ width, length, height }` in meters)
    - `unitSystem` (string: 'meters' or 'feet')
    - `listenerEarHeightMeters` (number)
    - `frontSpeakerHeightMeters` (number)
    - `selectedModeForVisualization` (object: `{ dimension, order }`)
    - `manualSpeakerPositions` (object: `{ [speakerId]: { x, y } }`)
    - Associated updater functions for these states.
  - **`ComponentContext.js`:** Manages selected components and related settings:
    - `speakerConfiguration` (string: e.g., "5.1", "7.1.4")
    - `selectedSpeakers` (object: `{ [role]: speakerModelId }`)
    - `selectedReceiver` (string: receiverModelId)
    - `selectedDisplay` (string: displayId)
    - `targetSPL` (number: dB)
    - Associated updater functions.
  - **`StorageContext.js`:** Manages saving and loading designs:
    - `savedDesigns` (array of design objects)
    - Interaction with browser `localStorage`.
    - Functions for `saveCurrentDesign`, `loadDesign`, `deleteDesign`.

## 3. Styling

- **CSS:** Global styles in `App.css` and `index.css` (mostly CRA defaults).
- **Material-UI Styling Solutions:**
  - `sx` prop for inline styles and access to theme.
  - Styled components (via MUI's `styled` utility) could be used for more complex, reusable styled elements if needed (not extensively used yet).
  - Theme customization (default MUI theme currently used, can be customized later).

## 4. Data Handling

- **Static Data Files:** Component specifications (speakers, receivers, displays), acoustic standards, and example community builds are stored as JSON files in the `public/assets/data/` directory.
- **Data Fetching:** Components use the `fetch` API within `useEffect` hooks to load this JSON data on mount.
- **Local Storage:** User-created designs are saved to and loaded from the browser's `localStorage` via `StorageContext.js`.

## 5. Key Utility Modules (`src/utils/`)

- **`dolbyAtmosRules.js`:** Calculates initial 2D speaker and listening position (LP) coordinates based on room dimensions and speaker configuration, adhering to general Dolby guidelines.
- **`powerCalculator.js`:**
  - `calculateRoomVolume()`
  - `calculateRequiredPower()`: Estimates amplifier power needed per channel.
  - `calculateMaxSPL()`: Estimates maximum Sound Pressure Level.
  - `estimateTotalPowerDraw()`: Rough estimation of system power consumption.
- **`roomModeCalculator.js`:**
  - `calculateAxialModes()`: Calculates frequencies of primary axial room modes.
- **`acousticsUtils.js`:**
  - `calculateFirstReflectionPoints()`: Calculates coordinates of first reflection points on room surfaces.

## 6. Core Application Flow & Structure

- **`App.js`:** Root component. Sets up `BrowserRouter` and defines all application routes using `<Routes>` and `<Route>`. It wraps all routes within `GlobalLayout.js` to provide consistent global navigation and structure. It also initializes React Context providers (`StorageProvider`, `ComponentProvider`, `RoomProvider`) which are likely wrapped around the `PlannerPage` or its specific content, rather than globally in `App.js` if they are planner-specific.
- **`GlobalLayout.js`:** Provides the main application AppBar with global navigation links (e.g., Home, Planner, Guides, Build Blogs) and a footer. It uses `<Outlet />` to render the content of the currently active route.
- **Page Components (e.g., `HomePage.js`, `PlannerPage.js`, `BuildBlogListPage.js`, `HowToListPage.js`):** These are distinct views of the application, each corresponding to a route defined in `App.js`.
  - `PlannerPage.js`: This page specifically uses `MainLayout.js` to structure its content.
  - `BuildBlogListPage.js`: This page renders `CommunityBuildsTab.js` (which is now context-agnostic for display) to show a list of community builds.
- **`MainLayout.js` (Used by `PlannerPage.js`):** Defines the UI structure for the planner tool, including its own AppBar (for planner title and Save/Load actions), a persistent sidebar for inputs, and a tabbed workspace.
  - **Sidebar (within `MainLayout.js`):** Contains various input components (`RoomNameInput`, `RoomDimensionInput`, selectors for components, modes, heights) that update the respective contexts.
  - **Tabs (within `MainLayout.js`):**
    - **"Room Design":** Features `RoomVisualizer.js`.
    - **"Power & SPL":** Features `CalculationsDisplay.js`.
    - **"Optimization":** Features `RoomModesDisplay.js`, `ReflectionPointsDisplay.js`, and `AcousticTreatmentRecommendations.js`.
- **`CommunityBuildsTab.js`:** Originally a tab content component, now primarily used by `BuildBlogListPage.js` to display community build cards. It has been decoupled from planner-specific contexts for display purposes.

## 7. Development Environment

- Node.js and npm for package management and running scripts.
- `create-react-app` scripts (`npm start`, `npm run build`).
- ESLint for linting (configured by CRA).
- Git for version control.

## 8. Potential Technical Challenges / Areas for Improvement

- **SVG Performance:** For very complex rooms or many visual elements in `RoomVisualizer`.
- **Drag & Drop Robustness:** Current SVG drag-and-drop is basic; complex interactions might need a dedicated library.
- **State Management Complexity:** As features grow, ensuring context updates are efficient and don't cause excessive re-renders.
- **Accuracy of Calculations:** Current acoustic and power calculations are simplified estimations and can be made more precise.
- **Data Normalization/IDs:** Ensuring consistent use of IDs vs. names for components across different JSON files and contexts when loading/saving or cross-referencing.
- **3D Visualization (Future):** Would require integrating a 3D library (e.g., Three.js, React Three Fiber) and significantly more complex geometry and rendering logic.
