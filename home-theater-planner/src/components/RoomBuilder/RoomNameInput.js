import React from 'react';
import { TextField, Box, Typography } from '@mui/material';
import { useRoomContext } from '../../context/RoomContext';

const RoomNameInput = () => {
  const { roomName, updateRoomName } = useRoomContext();

  const handleInputChange = (event) => {
    updateRoomName(event.target.value);
  };

  return (
    <Box sx={{ p: 2, border: '1px dashed orange', borderRadius: 1, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Room Setup
      </Typography>
      <TextField
        label="Room Name"
        name="roomName"
        type="text"
        value={roomName}
        onChange={handleInputChange}
        variant="outlined"
        fullWidth
        InputLabelProps={{ shrink: true }}
      />
    </Box>
  );
};

export default RoomNameInput;
