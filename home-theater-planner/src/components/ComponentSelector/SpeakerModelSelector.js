import React, { useState, useEffect, useMemo } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography, CircularProgress, Grid } from '@mui/material';
import { useComponentContext } from '../../context/ComponentContext';

// Helper to determine roles based on configuration
const getRolesForConfiguration = (config) => {
  const roles = [];
  if (!config) return roles;

  if (config.startsWith('2.') || config.startsWith('3.') || config.startsWith('5.') || config.startsWith('7.') || config.startsWith('9.')) {
    roles.push({ id: 'frontLR', label: 'Front L/R' });
  }
  if (config.startsWith('3.') || config.startsWith('5.') || config.startsWith('7.') || config.startsWith('9.')) {
    roles.push({ id: 'center', label: 'Center' });
  }
  if (config.startsWith('5.') || config.startsWith('7.') || config.startsWith('9.')) {
    roles.push({ id: 'surroundLR', label: 'Surround L/R' });
  }
  if (config.startsWith('7.') || config.startsWith('9.')) {
    roles.push({ id: 'surroundBackLR', label: 'Surround Back L/R' });
  }
  // Atmos channels
  const parts = config.split('.');
  if (parts.length === 3) { // e.g., 5.1.4 or 7.1.2
    const atmosChannels = parseInt(parts[2], 10);
    if (atmosChannels >= 2) {
      roles.push({ id: 'heightAtmosPair1', label: 'Atmos Height Pair 1' });
    }
    if (atmosChannels >= 4) {
      roles.push({ id: 'heightAtmosPair2', label: 'Atmos Height Pair 2' });
    }
    if (atmosChannels >= 6) {
      roles.push({ id: 'heightAtmosPair3', label: 'Atmos Height Pair 3' });
    }
  }
  // Always include LFE/Subwoofer role if config includes .1 or more
  if (config.includes('.')) { 
    const subCount = parseInt(config.split('.')[1], 10);
    if (subCount > 0) {
        roles.push({ id: 'lfe', label: 'Subwoofer(s)' });
    }
  }
  return roles;
};


const SpeakerModelSelector = () => {
  const { selectedSpeakers, updateSelectedSpeaker, speakerConfiguration } = useComponentContext();
  const [speakerData, setSpeakerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/assets/data/speakers.json')
      .then(response => response.json())
      .then(data => {
        setSpeakerData(data.speakers || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching speaker data:", error);
        setLoading(false);
      });
  }, []);

  const speakerRolesToSelect = useMemo(() => getRolesForConfiguration(speakerConfiguration), [speakerConfiguration]);

  const handleRoleChange = (roleId, event) => {
    updateSelectedSpeaker(roleId, event.target.value);
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 2 }} />;
  }
  
  if (speakerRolesToSelect.length === 0) {
    return (
        <Box sx={{ p: 2, border: '1px dashed blue', borderRadius: 1, mt: 2 }}>
            <Typography variant="h6" gutterBottom>Speaker Models</Typography>
            <Typography variant="body2">Select a speaker configuration to assign models.</Typography>
        </Box>
    );
  }

  return (
    <Box sx={{ p: 2, border: '1px dashed blue', borderRadius: 1, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Speaker Models
      </Typography>
      {/* <Grid container spacing={2}> */}
        {speakerRolesToSelect.map((role) => (
          // <Grid xs={12} key={role.id}>
            <FormControl fullWidth sx={{ mb: 2 }} key={role.id}> {/* Added mb: 2 for spacing */}
              <InputLabel id={`speaker-role-${role.id}-label`}>{role.label}</InputLabel>
              <Select
                labelId={`speaker-role-${role.id}-label`}
                id={`speaker-role-${role.id}-select`}
                value={selectedSpeakers[role.id] || ''}
                label={role.label}
                onChange={(event) => handleRoleChange(role.id, event)}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {speakerData.map((speaker) => (
                  // Assuming speaker.model is unique for key and value for now. Ideally, use a proper speaker.id
                  <MenuItem key={speaker.model} value={speaker.model}> 
                    {speaker.brand} - {speaker.model} ({speaker.type})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          // </Grid>
        ))}
      {/* </Grid> */}
    </Box>
  );
};

export default SpeakerModelSelector;
