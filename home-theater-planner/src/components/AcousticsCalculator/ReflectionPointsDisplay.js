import React, { useMemo } from 'react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useRoomContext } from '../../context/RoomContext';
import { useComponentContext } from '../../context/ComponentContext';
// import { calculateSpeakerPositions } from '../../utils/dolbyAtmosRules'; // No longer needed here
import { calculateFirstReflectionPoints } from '../../utils/acousticsUtils';

const ReflectionPointList = ({ surfaceName, points }) => (
  <Box mb={1}>
    <Typography variant="subtitle2" gutterBottom>{surfaceName}:</Typography>
    {points.length > 0 ? (
      <List dense disablePadding>
        {points.map((p, i) => (
          <ListItem key={i} disableGutters sx={{ pl: 1 }}>
            <ListItemText primary={`X: ${p.x?.toFixed(2) || 'N/A'}, Y: ${p.y?.toFixed(2) || 'N/A'}, Z: ${p.z?.toFixed(2) || 'N/A'}`} />
          </ListItem>
        ))}
      </List>
    ) : <Typography variant="caption" sx={{ pl: 1 }}>No points calculated.</Typography>}
  </Box>
);


const ReflectionPointsDisplay = ({ finalSpeakerPositions, listeningPosition }) => { // Accept props
  const { roomDimensionsMeters, listenerEarHeightMeters, frontSpeakerHeightMeters } = useRoomContext(); // manualSpeakerPositions removed
  // speakerConfiguration is not directly used here anymore for position calculation
  // const { speakerConfiguration } = useComponentContext(); 

  const listenerPosition3D = useMemo(() => {
    if (!listeningPosition) return null;
    return { ...listeningPosition, z: listenerEarHeightMeters };
  }, [listeningPosition, listenerEarHeightMeters]);

  // Calculate for Front Left, Front Right, and Center speakers if they exist
  // Add Z coordinate to the speakers from finalSpeakerPositions
  const speakersToAnalyze = useMemo(() => {
    if (!finalSpeakerPositions) return [];
    return ['fl', 'fr', 'c']
      .map(id => {
        const speaker = finalSpeakerPositions.find(p => p.id === id);
        if (speaker) {
          return { ...speaker, z: frontSpeakerHeightMeters }; // Add default Z for speakers
        }
        return null;
      })
      .filter(Boolean);
  }, [finalSpeakerPositions, frontSpeakerHeightMeters]);

  const reflectionPointsData = useMemo(() => {
    if (!listenerPosition3D || speakersToAnalyze.length === 0) return [];
    return speakersToAnalyze.map(speaker => ({
      speakerLabel: speaker.label,
      points: calculateFirstReflectionPoints(roomDimensionsMeters, speaker, listenerPosition3D)
    }));
  }, [roomDimensionsMeters, speakersToAnalyze, listenerPosition3D]);

  return (
    <Box sx={{ p: 2, mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        First Reflection Points (FRP)
      </Typography>
      {(roomDimensionsMeters.width <= 0 || roomDimensionsMeters.length <= 0 || roomDimensionsMeters.height <= 0) &&
        <Typography color="error" sx={{ mb: 2 }}>
          Please enter valid room dimensions to calculate reflection points.
        </Typography>
      }
      {reflectionPointsData.length === 0 && !(roomDimensionsMeters.width <= 0 || roomDimensionsMeters.length <= 0 || roomDimensionsMeters.height <= 0) && (
        <Typography sx={{ mb: 2 }}>
          Could not calculate reflection points. Ensure speakers (FL, FR, C) are part of the current configuration.
        </Typography>
      )}

      <Grid container spacing={3}>
        {reflectionPointsData.map(data => (
          <Grid item xs={12} md={6} lg={4} key={data.speakerLabel}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>For {data.speakerLabel} Speaker</Typography>
              <ReflectionPointList surfaceName="Floor" points={data.points.floor} />
              <ReflectionPointList surfaceName="Ceiling" points={data.points.ceiling} />
              <Divider sx={{ my: 1 }} />
              <ReflectionPointList surfaceName="Left Wall" points={data.points.leftWall} />
              <ReflectionPointList surfaceName="Right Wall" points={data.points.rightWall} />
              <Divider sx={{ my: 1 }} />
              <ReflectionPointList surfaceName="Front Wall" points={data.points.frontWall} />
              <ReflectionPointList surfaceName="Rear Wall" points={data.points.rearWall} />
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Typography variant="caption" display="block" sx={{ mt: 2, fontStyle: 'italic' }}>
        Note: Coordinates for wall reflections are on the surface of the wall (e.g., Left Wall points are Y,Z on the X=0 plane). Floor/Ceiling points are X,Y projections. Assumes speakers and listener are within room boundaries.
      </Typography>
    </Box>
  );
};

export default ReflectionPointsDisplay;
