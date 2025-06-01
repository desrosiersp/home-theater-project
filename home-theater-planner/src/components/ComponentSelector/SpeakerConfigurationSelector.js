import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { useComponentContext } from '../../context/ComponentContext';

const SpeakerConfigurationSelector = () => {
  const { speakerConfiguration, updateSpeakerConfiguration } = useComponentContext();

  const configurations = [
    "2.0", "2.1", "3.0", "3.1", 
    "5.1", "5.1.2", "5.1.4",
    "7.1", "7.1.2", "7.1.4"
    // Add more configurations as needed
  ];

  const handleChange = (event) => {
    updateSpeakerConfiguration(event.target.value);
  };

  return (
    <Box sx={{ p: 2, border: '1px dashed green', borderRadius: 1, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Speaker Configuration
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="speaker-config-select-label">Configuration</InputLabel>
        <Select
          labelId="speaker-config-select-label"
          id="speaker-config-select"
          value={speakerConfiguration}
          label="Configuration"
          onChange={handleChange}
        >
          {configurations.map((config) => (
            <MenuItem key={config} value={config}>
              {config}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SpeakerConfigurationSelector;
