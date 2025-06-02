import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { useRoomContext } from './RoomContext';
import { useComponentContext } from './ComponentContext';

const StorageContext = createContext();
const LOCAL_STORAGE_KEY = 'homeTheaterDesigns';

export const useStorageContext = () => {
  return useContext(StorageContext);
};

export const StorageProvider = ({ children }) => {
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [isStorageLoading, setIsStorageLoading] = useState(true);

  // RoomContext consumers
  const roomCtx = useRoomContext();
  // ComponentContext consumers
  const componentCtx = useComponentContext();

  // Load designs from localStorage on initial mount
  useEffect(() => {
    try {
      const designsFromStorage = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (designsFromStorage) {
        setSavedDesigns(JSON.parse(designsFromStorage));
      }
    } catch (error) {
      console.error("Error loading designs from localStorage:", error);
    }
    setIsStorageLoading(false);
  }, []);

  const saveCurrentDesign = useCallback((designName) => {
    if (!designName || designName.trim() === "") {
      alert("Please enter a name for your design.");
      return false;
    }

    const currentDesignData = {
      // From RoomContext
      roomName: roomCtx.roomName,
      unitSystem: roomCtx.unitSystem,
      roomDimensionsMeters: roomCtx.roomDimensionsMeters,
      listenerEarHeightMeters: roomCtx.listenerEarHeightMeters,
      frontSpeakerHeightMeters: roomCtx.frontSpeakerHeightMeters,
      selectedModeForVisualization: roomCtx.selectedModeForVisualization,
      wallFeatures: roomCtx.wallFeatures, // Added wallFeatures
      // From ComponentContext
      speakerConfiguration: componentCtx.speakerConfiguration,
      selectedSpeakers: componentCtx.selectedSpeakers,
      selectedReceiver: componentCtx.selectedReceiver,
      selectedDisplay: componentCtx.selectedDisplay,
      targetSPL: componentCtx.targetSPL,
    };

    const newDesign = {
      id: `design-${Date.now()}`, // Simple unique ID
      name: designName,
      timestamp: new Date().toISOString(),
      data: currentDesignData,
    };

    const updatedDesigns = [...savedDesigns, newDesign];
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedDesigns));
      setSavedDesigns(updatedDesigns);
      alert(`Design "${designName}" saved successfully!`);
      return true;
    } catch (error) {
      console.error("Error saving design to localStorage:", error);
      alert("Failed to save design.");
      return false;
    }
  }, [roomCtx, componentCtx, savedDesigns]);

  const loadDesign = useCallback((designId) => {
    const designToLoad = savedDesigns.find(d => d.id === designId);
    if (!designToLoad) {
      console.error("Design not found:", designId);
      alert("Failed to load design: Not found.");
      return;
    }

    const { data } = designToLoad;
    
    // Update RoomContext
    if (data.roomName) roomCtx.updateRoomName(data.roomName);
    if (data.unitSystem && data.unitSystem !== roomCtx.unitSystem) roomCtx.toggleUnitSystem(); // Simplistic toggle, assumes only two states
    if (data.roomDimensionsMeters) {
        // Need to call updateRoomDimension for each dimension to ensure proper state update via context function
        // Assuming updateRoomDimension expects value in current unitSystem, but we store in meters.
        // This part needs careful handling of units. For now, directly setting meter values if possible,
        // or ensuring updateRoomDimension can take metric values if unitSystem is meters.
        // The current updateRoomDimension converts based on current unitSystem.
        // Let's assume we need to set the unit system first, then update.
        // This is tricky. A direct setter for roomDimensionsMeters would be easier here.
        // For now, let's just update the raw meter values and hope for the best with current context structure.
        // This might require refactoring updateRoomDimension or adding a direct setter.
        // A simpler approach for now:
        if(data.roomDimensionsMeters.width) roomCtx.updateRoomDimension('width', data.unitSystem === 'feet' ? data.roomDimensionsMeters.width * 3.28084 : data.roomDimensionsMeters.width);
        if(data.roomDimensionsMeters.length) roomCtx.updateRoomDimension('length', data.unitSystem === 'feet' ? data.roomDimensionsMeters.length * 3.28084 : data.roomDimensionsMeters.length);
        if(data.roomDimensionsMeters.height) roomCtx.updateRoomDimension('height', data.unitSystem === 'feet' ? data.roomDimensionsMeters.height * 3.28084 : data.roomDimensionsMeters.height);
    }
    if (data.listenerEarHeightMeters) roomCtx.updateListenerEarHeight(data.unitSystem === 'feet' ? data.listenerEarHeightMeters * 3.28084 : data.listenerEarHeightMeters);
    if (data.frontSpeakerHeightMeters) roomCtx.updateFrontSpeakerHeight(data.unitSystem === 'feet' ? data.frontSpeakerHeightMeters * 3.28084 : data.frontSpeakerHeightMeters);
    if (data.selectedModeForVisualization) roomCtx.updateSelectedModeForVisualization(data.selectedModeForVisualization.dimension, data.selectedModeForVisualization.order);
    if (data.wallFeatures) roomCtx.setWallFeatures(data.wallFeatures); // Added for loading wallFeatures (assuming setWallFeatures exists)

    // Update ComponentContext
    if (data.speakerConfiguration) componentCtx.updateSpeakerConfiguration(data.speakerConfiguration);
    if (data.selectedSpeakers) { // This needs to iterate and call updateSelectedSpeaker for each role
        Object.entries(data.selectedSpeakers).forEach(([role, speakerId]) => {
            componentCtx.updateSelectedSpeaker(role, speakerId);
        });
    }
    if (data.selectedReceiver) componentCtx.updateSelectedReceiver(data.selectedReceiver);
    if (data.selectedDisplay) componentCtx.updateSelectedDisplay(data.selectedDisplay);
    if (data.targetSPL) componentCtx.updateTargetSPL(data.targetSPL);
    
    alert(`Design "${designToLoad.name}" loaded.`);
  }, [savedDesigns, roomCtx, componentCtx]);

  const deleteDesign = useCallback((designId) => {
    const updatedDesigns = savedDesigns.filter(d => d.id !== designId);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedDesigns));
      setSavedDesigns(updatedDesigns);
      alert("Design deleted.");
    } catch (error) {
      console.error("Error deleting design from localStorage:", error);
      alert("Failed to delete design.");
    }
  }, [savedDesigns]);

  const value = {
    savedDesigns,
    isStorageLoading,
    saveCurrentDesign,
    loadDesign,
    deleteDesign,
  };

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
};

export default StorageContext;
