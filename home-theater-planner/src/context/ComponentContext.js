import React, { createContext, useState, useContext, useCallback } from 'react';

const ComponentContext = createContext();

export const useComponentContext = () => {
  return useContext(ComponentContext);
};

export const ComponentProvider = ({ children }) => {
  const [speakerConfiguration, setSpeakerConfiguration] = useState("5.1"); // Default configuration
  // selectedSpeakers could map role (e.g., 'fronts', 'center', 'surrounds') to a speaker model ID
  const [selectedSpeakers, setSelectedSpeakers] = useState({}); 
  const [selectedReceiver, setSelectedReceiver] = useState(''); // Store ID of selected receiver
  const [selectedDisplay, setSelectedDisplay] = useState(''); // Store ID of selected display
  const [targetSPL, setTargetSPL] = useState(85); // Default Target SPL in dB

  const updateSpeakerConfiguration = useCallback((newConfiguration) => {
    setSpeakerConfiguration(newConfiguration);
    // Reset selected speakers if configuration changes, as roles might change
    setSelectedSpeakers({}); 
  }, []);

  const updateSelectedSpeaker = useCallback((role, speakerId) => {
    setSelectedSpeakers(prev => ({ ...prev, [role]: speakerId }));
  }, []);

  const updateSelectedReceiver = useCallback((receiverId) => {
    setSelectedReceiver(receiverId);
  }, []);

  const updateSelectedDisplay = useCallback((displayId) => {
    setSelectedDisplay(displayId);
  }, []);

  const updateTargetSPL = useCallback((spl) => {
    setTargetSPL(spl);
  }, []);

  const value = {
    speakerConfiguration,
    updateSpeakerConfiguration,
    selectedSpeakers,
    updateSelectedSpeaker,
    selectedReceiver,
    updateSelectedReceiver,
    selectedDisplay,
    updateSelectedDisplay,
    targetSPL,
    updateTargetSPL,
  };

  return <ComponentContext.Provider value={value}>{children}</ComponentContext.Provider>;
};

export default ComponentContext;
