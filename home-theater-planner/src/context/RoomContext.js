import React, { createContext, useState, useContext, useCallback } from 'react';

const RoomContext = createContext();

const METER_TO_FEET = 3.28084;
const FEET_TO_METER = 0.3048;

export const useRoomContext = () => {
  return useContext(RoomContext);
};

export const RoomProvider = ({ children }) => {
  const [unitSystem, setUnitSystem] = useState('meters'); // 'meters' or 'feet'
  const [roomDimensionsMeters, setRoomDimensionsMeters] = useState({
    width: 5,    // Stored in meters
    length: 6,   // Stored in meters
    height: 2.8, // Stored in meters
  });
  const [roomName, setRoomName] = useState('My Home Theater'); // Default room name
  const [selectedModeForVisualization, setSelectedModeForVisualization] = useState({ dimension: null, order: null });
  const [listenerEarHeightMeters, setListenerEarHeightMeters] = useState(1.0); 
  const [frontSpeakerHeightMeters, setFrontSpeakerHeightMeters] = useState(1.2); 
  const [manualSpeakerPositions, setManualSpeakerPositions] = useState({}); // { [speakerId]: {x, y, z (optional)} }

  const toggleUnitSystem = useCallback(() => {
    setUnitSystem(prevUnit => (prevUnit === 'meters' ? 'feet' : 'meters'));
  }, []);

  const updateRoomName = useCallback((newName) => {
    setRoomName(newName);
  }, []);

  const updateSelectedModeForVisualization = useCallback((dimension, order) => {
    setSelectedModeForVisualization({ dimension, order });
  }, []);

  const updateManualSpeakerPosition = useCallback((speakerId, newPosition) => { // newPosition = {x, y} or {x,y,z}
    setManualSpeakerPositions(prev => ({
      ...prev,
      [speakerId]: { ...prev[speakerId], ...newPosition } // Merge, allowing partial updates e.g. just x,y
    }));
  }, []);

  const resetManualSpeakerPositions = useCallback(() => {
    setManualSpeakerPositions({});
  }, []);

  const updateListenerEarHeight = useCallback((heightInCurrentUnit) => {
    const numericValue = parseFloat(heightInCurrentUnit) || 0;
    setListenerEarHeightMeters(unitSystem === 'feet' ? numericValue * FEET_TO_METER : numericValue);
  }, [unitSystem]);

  const updateFrontSpeakerHeight = useCallback((heightInCurrentUnit) => {
    const numericValue = parseFloat(heightInCurrentUnit) || 0;
    setFrontSpeakerHeightMeters(unitSystem === 'feet' ? numericValue * FEET_TO_METER : numericValue);
  }, [unitSystem]);

  const updateRoomDimension = useCallback((dimension, valueInCurrentUnit) => {
    const numericValue = parseFloat(valueInCurrentUnit) || 0;
    let valueInMeters;

    if (unitSystem === 'feet') {
      valueInMeters = numericValue * FEET_TO_METER;
    } else {
      valueInMeters = numericValue;
    }

    setRoomDimensionsMeters(prevDimensions => ({
      ...prevDimensions,
      [dimension]: valueInMeters,
    }));
  }, [unitSystem]); // unitSystem is a dependency here

  const getDimensionsInCurrentUnit = useCallback(() => {
    if (unitSystem === 'feet') {
      return {
        width: roomDimensionsMeters.width * METER_TO_FEET,
        length: roomDimensionsMeters.length * METER_TO_FEET,
        height: roomDimensionsMeters.height * METER_TO_FEET,
      };
    }
    return roomDimensionsMeters; // Already in meters
  }, [roomDimensionsMeters, unitSystem]);

  const value = {
    unitSystem,
    toggleUnitSystem,
    roomName,
    updateRoomName,
    roomDimensionsMeters, 
    getDimensionsInCurrentUnit, 
    updateRoomDimension,
    selectedModeForVisualization,
    updateSelectedModeForVisualization,
    listenerEarHeightMeters,
    updateListenerEarHeight,
    frontSpeakerHeightMeters,
    updateFrontSpeakerHeight,
    manualSpeakerPositions,
    updateManualSpeakerPosition,
    resetManualSpeakerPositions,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

export default RoomContext;
