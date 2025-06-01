# Active Context: Home Theater Planner

## Date: May 31, 2025

## 1. Current Work Focus

- **Bug Fix:** Resolved "Cannot read properties of undefined (reading 'roomName')" error during "save design" functionality by correcting the Context Provider order in `App.js`.
- Initializing the Memory Bank system.
- Populating core documentation files.
- Updating project title.
- **Navigation Refactor & Crash Fix (Build Blogs):**
  - Addressed a crash when navigating to the "Build Blogs" page.
  - Decoupled `CommunityBuildsTab.js` and `CommunityBuildCard.js` from planner-specific contexts (e.g., `StorageContext`) by removing the "load build" functionality from these components for now.
  - Created `BuildBlogListPage.js` to serve as the main page for `/build-blogs`, which now correctly displays a list of community builds without crashing.
  - Updated `App.js` to route `/build-blogs` to `BuildBlogListPage.js`.
  - Removed the obsolete `BuildBlogsPage.js` (simple wrapper).
  - Updated relevant Memory Bank documents (`systemPatterns.md`, `techContext.md`, `progress.md`).

## 2. Recent Accomplishments

- **UI Layout:** Implemented `MainLayout.js` with AppBar, persistent Drawer (sidebar), and Tabbed Workspace.
- **Contexts:** Established `RoomContext`, `ComponentContext`, and `StorageContext` for state management.
- **Sidebar Controls:** Added inputs for room name, dimensions (with unit toggle), speaker/component selection, target SPL, mode visualization selection, and listener/speaker heights.
- **"Room Design" Tab:**
  - `RoomVisualizer.js` with 2D SVG rendering of room and speakers.
  - Speaker positions based on `dolbyAtmosRules.js`.
  - Interactive drag & drop for speaker/LP positions, updating `manualSpeakerPositions` in `RoomContext`.
  - Visual overlay for selected axial room modes.
  - "Reset Layout" and "Auto-Optimize" (basic) buttons.
- **"Power & SPL" Tab:**
  - `CalculationsDisplay.js` showing room volume, listening distance (dynamic), required power, max SPL, and estimated total power draw.
  - `powerCalculator.js` utility.
  - "Detailed Analysis" text section.
- **"Optimization" Tab:**
  - `RoomModesDisplay.js` showing axial mode frequencies and textual guidance for LP/subwoofer placement.
  - `ReflectionPointsDisplay.js` calculating and listing FRPs using configurable heights.
  - `AcousticTreatmentRecommendations.js` providing general advice.
  - Utilities `roomModeCalculator.js` and `acousticsUtils.js`.
- **"Build Blogs" Page (List View):**
  - Accessible via global AppBar (`/build-blogs`).
  - Renders `BuildBlogListPage.js`, which in turn uses a modified `CommunityBuildsTab.js` (now context-agnostic for display) and `CommunityBuildCard.js` (with "load" button removed).
  - Displays a list of community builds from `communityBuilds.json`.
- **Local Storage:**
  - Save/Load design functionality implemented via `StorageContext` and dialog components.

## 3. Key Decisions & Patterns Recently Established

- **Memory Bank System:** Adopted as per `.clinerules` for project documentation and context persistence.
- **Project Name:** Standardized to "Home Theater Planner".
- **State Management:** Corrected Context Provider order in `App.js`.
- **Component Structure:** Organization by feature/domain.
- **Iterative Feature Development:** Building features incrementally.
- **Navigation Structure:** Successfully shifted "Community Builds" content to a top-level "Build Blogs" page (`BuildBlogListPage.js`), resolving crashes and improving separation of concerns.

## 4. Next Immediate Steps

1.  **Verify "Build Blogs" Page:** Manually test that the "Build Blogs" link navigates to `/build-blogs`, displays the list of community builds correctly, and no longer crashes.
2.  **Verify Planner:** Ensure the Planner tool still functions correctly and the "Community Builds" tab is gone.
3.  **Verify Fix:** Manually test the "save design" functionality.
4.  **Update Project Title in Code:** Ensure "Home Theater Planner" is consistent.
5.  **Review and Refine Memory Bank Content:** Ensure all core files are accurate after these changes.
6.  **Discuss and Prioritize Remaining Tasks:** Based on `progress.md`, including potential re-introduction of "View Details" for builds or a safe "Load to Planner" mechanism.

## 5. Current Known Issues/Challenges

- **Save Design Functionality:** Needs verification after the context provider fix.
- **Browser Automation:** Previous difficulties with reliable browser automation for testing UI interactions (unit toggles, tab switching, drag-and-drop). Manual testing is crucial.
- **Placeholder Image:** The placeholder image for community build cards (`placeholder-build-default.jpg`) is still a text file.
- **Community Build Loading to Planner:** The functionality to load a community build _into_ the planner context has been temporarily removed to fix the crash. This needs to be re-evaluated and implemented carefully if desired.
- **Build Blog Detail Pages:** Not yet implemented. Currently, only a list view is available.
- **`loadDesign` in `StorageContext.js`:** The logic for handling `unitSystem` differences between saved and current states during loading might need refinement.

This `activeContext.md` will be updated as the project progresses to reflect the latest focus and decisions.
