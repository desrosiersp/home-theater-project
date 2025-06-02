import React, { useState, useCallback } from 'react';
import { useRoomContext } from '../../context/RoomContext';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Divider,
} from '@mui/material';
import { AddCircleOutline, Edit, Delete } from '@mui/icons-material';

const WallFeatureEditor = () => {
  const {
    wallFeatures,
    addWallFeature,
    updateWallFeature,
    deleteWallFeature,
    roomDimensionsMeters, // Needed for context/validation if desired
    unitSystem, // For displaying units if needed
  } = useRoomContext();

  const [isEditing, setIsEditing] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(null);
  const [featureType, setFeatureType] = useState('opening'); // 'opening', 'door', 'window'
  const [selectedWall, setSelectedWall] = useState(0); // 0:N, 1:E, 2:S, 3:W
  const [startOffset, setStartOffset] = useState('');
  const [featureWidth, setFeatureWidth] = useState('');
  const [doorSwing, setDoorSwing] = useState('inwardLeft');
  const [doorHingeSide, setDoorHingeSide] = useState('left');

  const wallNames = ['North (Top)', 'East (Right)', 'South (Bottom)', 'West (Left)'];

  const clearForm = useCallback(() => {
    setIsEditing(false);
    setCurrentFeature(null);
    setFeatureType('opening');
    setSelectedWall(0);
    setStartOffset('');
    setFeatureWidth('');
    setDoorSwing('inwardLeft');
    setDoorHingeSide('left');
  }, []);

  const handleEdit = useCallback((feature) => {
    setIsEditing(true);
    setCurrentFeature(feature);
    setFeatureType(feature.type);
    setSelectedWall(feature.wallIndex);
    setStartOffset(feature.startOffset.toString());
    setFeatureWidth(feature.width.toString());
    if (feature.type === 'door') {
      setDoorSwing(feature.doorSwing || 'inwardLeft');
      setDoorHingeSide(feature.doorHingeSide || 'left');
    }
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    const offset = parseFloat(startOffset);
    const width = parseFloat(featureWidth);

    if (isNaN(offset) || isNaN(width) || offset < 0 || width <= 0) {
      alert('Please enter valid positive numbers for offset and width.');
      return;
    }
    
    // Basic validation: feature should not exceed wall length
    const wallLength = selectedWall % 2 === 0 ? roomDimensionsMeters.width : roomDimensionsMeters.length;
    if (offset + width > wallLength) {
        alert(`Feature (offset ${offset}m + width ${width}m) exceeds the length of the selected wall (${wallLength.toFixed(2)}m).`);
        return;
    }


    const featureData = {
      wallIndex: selectedWall,
      type: featureType,
      startOffset: offset,
      width: width,
    };

    if (featureType === 'door') {
      featureData.doorSwing = doorSwing;
      featureData.doorHingeSide = doorHingeSide;
    }

    if (isEditing && currentFeature) {
      updateWallFeature(currentFeature.id, featureData);
    } else {
      addWallFeature(featureData);
    }
    clearForm();
  }, [
    startOffset, featureWidth, selectedWall, featureType, doorSwing, doorHingeSide,
    isEditing, currentFeature, addWallFeature, updateWallFeature, clearForm, roomDimensionsMeters
  ]);

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Wall Features (Openings, Doors, Windows)
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="wall-select-label">Wall</InputLabel>
            <Select
              labelId="wall-select-label"
              value={selectedWall}
              label="Wall"
              onChange={(e) => setSelectedWall(e.target.value)}
            >
              {wallNames.map((name, index) => (
                <MenuItem key={index} value={index}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="feature-type-label">Feature Type</InputLabel>
            <Select
              labelId="feature-type-label"
              value={featureType}
              label="Feature Type"
              onChange={(e) => setFeatureType(e.target.value)}
            >
              <MenuItem value="opening">Large Opening</MenuItem>
              <MenuItem value="door">Door</MenuItem>
              <MenuItem value="window">Window</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label={`Start Offset from Corner (${unitSystem === 'meters' ? 'm' : 'ft'})`}
            type="number"
            value={startOffset}
            onChange={(e) => setStartOffset(e.target.value)}
            inputProps={{ step: "0.01" }}
            fullWidth
            required
          />
          <TextField
            label={`Feature Width (${unitSystem === 'meters' ? 'm' : 'ft'})`}
            type="number"
            value={featureWidth}
            onChange={(e) => setFeatureWidth(e.target.value)}
            inputProps={{ step: "0.01" }}
            fullWidth
            required
          />

          {featureType === 'door' && (
            <>
              <FormControl fullWidth>
                <InputLabel id="door-swing-label">Door Swing</InputLabel>
                <Select
                  labelId="door-swing-label"
                  value={doorSwing}
                  label="Door Swing"
                  onChange={(e) => setDoorSwing(e.target.value)}
                >
                  <MenuItem value="inwardLeft">Inward (hinge on left, swings left)</MenuItem>
                  <MenuItem value="inwardRight">Inward (hinge on right, swings right)</MenuItem>
                  <MenuItem value="outwardLeft">Outward (hinge on left, swings left)</MenuItem>
                  <MenuItem value="outwardRight">Outward (hinge on right, swings right)</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="door-hinge-label">Hinge Side (when facing exterior)</InputLabel>
                <Select
                  labelId="door-hinge-label"
                  value={doorHingeSide}
                  label="Hinge Side (when facing exterior)"
                  onChange={(e) => setDoorHingeSide(e.target.value)}
                >
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<AddCircleOutline />}
              sx={{ flexGrow: 1 }}
            >
              {isEditing ? 'Update Feature' : 'Add Feature'}
            </Button>
            {isEditing && (
              <Button variant="outlined" onClick={clearForm} sx={{ flexGrow: 1 }}>
                Cancel Edit
              </Button>
            )}
          </Box>
        </Box>
      </form>

      {wallFeatures.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Existing Features
          </Typography>
          <List dense>
            {wallFeatures.map((feature) => (
              <ListItem key={feature.id} sx={{ borderBottom: '1px solid #eee' }}>
                <ListItemText
                  primary={`${feature.type.charAt(0).toUpperCase() + feature.type.slice(1)} on ${wallNames[feature.wallIndex]}`}
                  secondary={`Offset: ${feature.startOffset} ${unitSystem === 'meters' ? 'm' : 'ft'}, Width: ${feature.width} ${unitSystem === 'meters' ? 'm' : 'ft'}${feature.type === 'door' ? `, Swing: ${feature.doorSwing}, Hinge: ${feature.doorHingeSide}` : ''}`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="edit" onClick={() => handleEdit(feature)}>
                    <Edit />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => deleteWallFeature(feature.id)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Paper>
  );
};

export default WallFeatureEditor;
