import React from 'react';
import { Box, Typography, Slider } from '@mui/material';
import { useComponentContext } from '../../context/ComponentContext';

const TargetSPLSlider = () => {
  const { targetSPL, updateTargetSPL } = useComponentContext();

  const handleChange = (event, newValue) => {
    updateTargetSPL(newValue);
  };

  return (
    <Box sx={{ p: 2, border: '1px dashed red', borderRadius: 1, mt: 2 }}>
      <Typography variant="h6" gutterBottom id="target-spl-slider-label">
        Target SPL at Listening Position
      </Typography>
      <Slider
        aria-labelledby="target-spl-slider-label"
        value={targetSPL}
        onChange={handleChange}
        valueLabelDisplay="auto"
        step={1}
        marks={[
            { value: 75, label: '75 dB' },
            { value: 85, label: '85 dB (Ref)' },
            { value: 95, label: '95 dB' },
            { value: 105, label: '105 dB (Max)' },
        ]}
        min={70}
        max={110} // THX Reference is 105dB for main channels
      />
      <Typography variant="caption" display="block" textAlign="center">
        Current: {targetSPL} dB
      </Typography>
    </Box>
  );
};

export default TargetSPLSlider;
