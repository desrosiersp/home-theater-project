import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography, CircularProgress } from '@mui/material';
import { useComponentContext } from '../../context/ComponentContext';

const ReceiverSelector = () => {
  const { selectedReceiver, updateSelectedReceiver } = useComponentContext();
  const [receiverData, setReceiverData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/assets/data/receivers.json')
      .then(response => response.json())
      .then(data => {
        setReceiverData(data.receivers || []);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching receiver data:", error);
        setLoading(false);
      });
  }, []);

  const handleChange = (event) => {
    updateSelectedReceiver(event.target.value);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ p: 2, border: '1px dashed green', borderRadius: 1, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        AV Receiver
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="receiver-select-label">Select AV Receiver</InputLabel>
        <Select
          labelId="receiver-select-label"
          id="receiver-select"
          value={selectedReceiver}
          label="Select AV Receiver"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {receiverData.map((receiver) => (
            <MenuItem key={receiver.model} value={receiver.model}> {/* Assuming model is unique, ideally use an ID */}
              {receiver.brand} - {receiver.model} ({receiver.channels}ch, {receiver.power})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default ReceiverSelector;
