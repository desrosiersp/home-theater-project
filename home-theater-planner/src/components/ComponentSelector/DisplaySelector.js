import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography, CircularProgress } from '@mui/material';
import { useComponentContext } from '../../context/ComponentContext';

const DisplaySelector = () => {
  const { selectedDisplay, updateSelectedDisplay } = useComponentContext();
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/assets/data/displays.json')
      .then(response => response.json())
      .then(data => {
        setDisplayData(data.displays || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching display data:", error);
        setLoading(false);
      });
  }, []);

  const handleChange = (event) => {
    updateSelectedDisplay(event.target.value);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 2, border: '1px dashed purple', borderRadius: 1, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Display
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="display-select-label">Select Display</InputLabel>
        <Select
          labelId="display-select-label"
          id="display-select"
          value={selectedDisplay}
          label="Select Display"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {displayData.map((display) => (
            <MenuItem key={display.id} value={display.id}>
              {display.brand} - {display.model} ({display.type})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default DisplaySelector;
