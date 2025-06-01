import React, { useMemo } from 'react';
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useRoomContext } from '../../context/RoomContext';
import { calculateAxialModes } from '../../utils/roomModeCalculator';

const ModeList = ({ title, modes }) => (
  <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
    <Typography variant="h6" gutterBottom align="center">{title} Modes</Typography>
    {modes.length > 0 ? (
      <List dense>
        {modes.map((mode, index) => (
          <React.Fragment key={index}>
            <ListItem>
              <ListItemText 
                primary={`${mode.frequency} Hz`} 
                secondary={`Order: ${mode.order}`} 
              />
            </ListItem>
            {index < modes.length - 1 && <Divider component="li" />}
          </React.Fragment>
        ))}
      </List>
    ) : (
      <Typography variant="body2" color="textSecondary" align="center">N/A</Typography>
    )}
  </Paper>
);

const RoomModesDisplay = () => {
  const { roomDimensionsMeters } = useRoomContext();

  const axialModes = useMemo(() => {
    if (roomDimensionsMeters.width > 0 && roomDimensionsMeters.length > 0 && roomDimensionsMeters.height > 0) {
      return calculateAxialModes(roomDimensionsMeters);
    }
    return { lengthModes: [], widthModes: [], heightModes: [] };
  }, [roomDimensionsMeters]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Primary Axial Room Modes
      </Typography>
      { (roomDimensionsMeters.width <= 0 || roomDimensionsMeters.length <= 0 || roomDimensionsMeters.height <= 0) &&
        <Typography color="error" sx={{mb: 2}}>
            Please enter valid room dimensions (greater than 0) to calculate room modes.
        </Typography>
      }
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ModeList title="Length" modes={axialModes.lengthModes} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ModeList title="Width" modes={axialModes.widthModes} />
        </Grid>
        <Grid item xs={12} md={4}>
          <ModeList title="Height" modes={axialModes.heightModes} />
        </Grid>
      </Grid>
      <Typography variant="caption" display="block" sx={{mt: 2, fontStyle: 'italic'}}>
        Note: These are the first few axial modes. Tangential and oblique modes also exist and contribute to the room's acoustic response.
      </Typography>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Listening Position (LP) Guidance</Typography>
        <Paper elevation={1} sx={{p:2}}>
          <Typography variant="body2" paragraph>
            - Try to avoid placing your main listening position at exact fractions of the room's dimensions (e.g., 1/2, 1/4, 3/4 of length, width, or height from a wall). These locations often coincide with pressure peaks or nulls of strong room modes, leading to uneven bass response.
          </Typography>
          <Typography variant="body2" paragraph>
            - A common starting point is around 38% of the room length from the front or rear wall (often referred to as the "38% rule" by some acousticians), but this is just a guideline and varies with room specifics.
          </Typography>
          <Typography variant="body2" paragraph>
            - Experiment with small movements of your listening position forward/backward and side-to-side while listening to bass-heavy music to find the spot with the smoothest bass.
          </Typography>
        </Paper>
      </Box>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Subwoofer Placement Guidance</Typography>
        <Paper elevation={1} sx={{p:2}}>
          <Typography variant="body2" paragraph>
            - Subwoofer placement is critical for good bass response and is heavily influenced by room modes.
          </Typography>
          <Typography variant="body2" paragraph>
            - **Corners:** Often provide the most bass output (corner loading) but can also excite modes strongly, leading to boomy or uneven bass. Good starting points for the "subwoofer crawl" method.
          </Typography>
          <Typography variant="body2" paragraph>
            - **Wall Midpoints:** Placing subwoofers at the midpoint of a wall can sometimes help excite modes more evenly.
          </Typography>
          <Typography variant="body2" paragraph>
            - **1/4 or 1/5 Wall Lengths:** Placing subwoofers at approximately 1/4 or 1/5 of the wall length/width from corners can sometimes yield smoother responses.
          </Typography>
          <Typography variant="body2" paragraph>
            - **Multiple Subwoofers:** Using two or four subwoofers in specific arrangements (e.g., opposing corners, midpoints of opposing walls) can significantly smooth out modal response across a wider listening area.
          </Typography>
          <Typography variant="body2" paragraph>
            - **The "Subwoofer Crawl":** Place the subwoofer at your main listening position. Play bass-heavy test tones or music. Crawl around the perimeter of the room (where subwoofers might practically go) and listen for where the bass sounds smoothest and most even. Mark those spots.
          </Typography>
          <Typography variant="body2" paragraph>
            - Avoid placing the subwoofer in the exact center of the room or at precise 1/2 fractions of room dimensions, as this can lead to strong cancellations for certain modes.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default RoomModesDisplay;
