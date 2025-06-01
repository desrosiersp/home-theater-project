import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { useStorageContext } from '../../context/StorageContext';

const SaveDesignDialog = ({ open, handleClose }) => {
  const [designName, setDesignName] = useState('');
  const { saveCurrentDesign } = useStorageContext();

  const handleSave = () => {
    if (saveCurrentDesign(designName)) {
      handleClose(); // Close dialog only if save was successful (name was provided)
      setDesignName(''); // Reset for next time
    }
  };

  const handleDialogClose = () => {
    setDesignName(''); // Reset name if dialog is closed without saving
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose}>
      <DialogTitle>Save Design</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter a name for your current home theater design.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="design-name"
          label="Design Name"
          type="text"
          fullWidth
          variant="standard"
          value={designName}
          onChange={(e) => setDesignName(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') handleSave();}}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaveDesignDialog;
