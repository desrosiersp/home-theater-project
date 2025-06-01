import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useRoomContext } from '../../context/RoomContext';

const RoomDimensionInput = () => {
  const {
    unitSystem,
    toggleUnitSystem,
    getDimensionsInCurrentUnit,
    updateRoomDimension,
    roomDimensionsMeters, // Add this
  } = useRoomContext();

  // Local state to manage input field values as strings to avoid direct manipulation issues
  // and allow for intermediate input states (e.g., empty string, partial numbers)
  const [localDimensions, setLocalDimensions] = useState({
    width: '',
    length: '',
    height: '',
  });

  const currentUnitSuffix = unitSystem === 'meters' ? 'm' : 'ft';

  // Effect to update local state when context dimensions or unit system changes
  useEffect(() => {
    const dimensionsInCurrentUnit = getDimensionsInCurrentUnit();
    setLocalDimensions({
      width: dimensionsInCurrentUnit.width.toFixed(2),
      length: dimensionsInCurrentUnit.length.toFixed(2),
      height: dimensionsInCurrentUnit.height.toFixed(2),
    });
  }, [roomDimensionsMeters, unitSystem]); // Removed getDimensionsInCurrentUnit from deps


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLocalDimensions(prev => ({ ...prev, [name]: value }));
  };

  const handleInputBlur = (event) => {
    const { name, value } = event.target;
    // Only update context if value is a valid number
    if (!isNaN(parseFloat(value))) {
      updateRoomDimension(name, value);
    } else {
      // If input is invalid on blur, revert to context's last valid value
      const dimensionsInCurrentUnit = getDimensionsInCurrentUnit();
      setLocalDimensions(prev => ({ ...prev, [name]: dimensionsInCurrentUnit[name].toFixed(2)}));
    }
  };
  
  const handleUnitChange = (event, newUnit) => {
    if (newUnit !== null && newUnit !== unitSystem) {
      toggleUnitSystem();
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1, mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
          Room Dimensions
        </Typography>
        <ToggleButtonGroup
          value={unitSystem}
          exclusive
          onChange={handleUnitChange}
          aria-label="text alignment"
        >
          <ToggleButton value="meters" aria-label="meters">
            Meters
          </ToggleButton>
          <ToggleButton value="feet" aria-label="feet">
            Feet
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt:1 }}>
        <TextField
          label={`Width (${currentUnitSuffix})`}
          name="width"
          type="number"
          value={localDimensions.width}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: "0.01" }}
        />
        <TextField
          label={`Length (${currentUnitSuffix})`}
          name="length"
          type="number"
          value={localDimensions.length}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: "0.01" }}
        />
        <TextField
          label={`Height (${currentUnitSuffix})`}
          name="height"
          type="number"
          value={localDimensions.height}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: "0.01" }}
        />
      </Box>
    </Box>
  );
};

export default RoomDimensionInput;
