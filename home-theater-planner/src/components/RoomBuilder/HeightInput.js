import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { useRoomContext } from '../../context/RoomContext';

const METER_TO_FEET = 3.28084; // Duplicated here for direct use, consider centralizing constants

const HeightInput = () => {
  const {
    unitSystem,
    listenerEarHeightMeters,
    updateListenerEarHeight,
    frontSpeakerHeightMeters,
    updateFrontSpeakerHeight,
  } = useRoomContext();

  const [localListenerHeight, setLocalListenerHeight] = useState('');
  const [localSpeakerHeight, setLocalSpeakerHeight] = useState('');

  const currentUnitSuffix = unitSystem === 'meters' ? 'm' : 'ft';

  useEffect(() => {
    const convertToCurrentUnit = (valueMeters) => 
      unitSystem === 'feet' ? (valueMeters * METER_TO_FEET).toFixed(2) : valueMeters.toFixed(2);
    
    setLocalListenerHeight(convertToCurrentUnit(listenerEarHeightMeters));
    setLocalSpeakerHeight(convertToCurrentUnit(frontSpeakerHeightMeters));
  }, [listenerEarHeightMeters, frontSpeakerHeightMeters, unitSystem]);

  const handleListenerHeightChange = (event) => {
    setLocalListenerHeight(event.target.value);
  };

  const handleListenerHeightBlur = (event) => {
    if (!isNaN(parseFloat(event.target.value))) {
      updateListenerEarHeight(event.target.value);
    } else {
      // Revert to context value if input is invalid
      const listenerHeightInCurrentUnit = unitSystem === 'feet' ? (listenerEarHeightMeters * METER_TO_FEET).toFixed(2) : listenerEarHeightMeters.toFixed(2);
      setLocalListenerHeight(listenerHeightInCurrentUnit);
    }
  };

  const handleSpeakerHeightChange = (event) => {
    setLocalSpeakerHeight(event.target.value);
  };

  const handleSpeakerHeightBlur = (event) => {
    if (!isNaN(parseFloat(event.target.value))) {
      updateFrontSpeakerHeight(event.target.value);
    } else {
      const speakerHeightInCurrentUnit = unitSystem === 'feet' ? (frontSpeakerHeightMeters * METER_TO_FEET).toFixed(2) : frontSpeakerHeightMeters.toFixed(2);
      setLocalSpeakerHeight(speakerHeightInCurrentUnit);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px dashed cyan', borderRadius: 1, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Listener & Speaker Heights
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt:1 }}>
        <TextField
          label={`Listener Ear Height (${currentUnitSuffix})`}
          name="listenerEarHeight"
          type="number"
          value={localListenerHeight}
          onChange={handleListenerHeightChange}
          onBlur={handleListenerHeightBlur}
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: "0.01" }}
        />
        <TextField
          label={`Front Speaker Height (${currentUnitSuffix})`}
          name="frontSpeakerHeight"
          type="number"
          value={localSpeakerHeight}
          onChange={handleSpeakerHeightChange}
          onBlur={handleSpeakerHeightBlur}
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: "0.01" }}
        />
      </Box>
    </Box>
  );
};

export default HeightInput;
