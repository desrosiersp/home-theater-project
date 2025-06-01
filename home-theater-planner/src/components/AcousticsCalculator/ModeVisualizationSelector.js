import React from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { useRoomContext } from '../../context/RoomContext';

const ModeVisualizationSelector = () => {
  const { selectedModeForVisualization, updateSelectedModeForVisualization } = useRoomContext();

  const handleDimensionChange = (event) => {
    const newDimension = event.target.value === 'none' ? null : event.target.value;
    // If dimension is set to none, also reset order. If a dimension is chosen, default to 1st order.
    updateSelectedModeForVisualization(newDimension, newDimension ? 1 : null);
  };

  const handleOrderChange = (event, newOrder) => {
    if (newOrder !== null) { // ToggleButton returns null if no button is selected
      updateSelectedModeForVisualization(selectedModeForVisualization.dimension, newOrder);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px dashed teal', borderRadius: 1, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Visualize Room Mode
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="mode-dimension-select-label">Dimension</InputLabel>
        <Select
          labelId="mode-dimension-select-label"
          value={selectedModeForVisualization.dimension || 'none'}
          label="Dimension"
          onChange={handleDimensionChange}
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="Length">Length</MenuItem>
          <MenuItem value="Width">Width</MenuItem>
          {/* Height visualization in 2D top-down is tricky, omitting for now */}
        </Select>
      </FormControl>

      {selectedModeForVisualization.dimension && (
        <Box>
          <Typography gutterBottom>Mode Order</Typography>
          <ToggleButtonGroup
            value={selectedModeForVisualization.order}
            exclusive
            onChange={handleOrderChange}
            aria-label="mode order"
          >
            <ToggleButton value={1} aria-label="1st order">
              1st
            </ToggleButton>
            <ToggleButton value={2} aria-label="2nd order">
              2nd
            </ToggleButton>
            {/* Can add 3rd order later if needed */}
          </ToggleButtonGroup>
        </Box>
      )}
    </Box>
  );
};

export default ModeVisualizationSelector;
