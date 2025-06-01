import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, ListItem, ListItemText, IconButton, Typography, Box, ListItemIcon } from '@mui/material'; // Added ListItemIcon
import DeleteIcon from '@mui/icons-material/Delete';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { useStorageContext } from '../../context/StorageContext';

const LoadDesignDialog = ({ open, handleClose }) => {
  const { savedDesigns, loadDesign, deleteDesign, isStorageLoading } = useStorageContext();

  const handleLoad = (designId) => {
    loadDesign(designId);
    handleClose();
  };

  const handleDelete = (designId, event) => {
    event.stopPropagation(); // Prevent ListItem click when deleting
    if (window.confirm("Are you sure you want to delete this design?")) {
      deleteDesign(designId);
      // Dialog might remain open or close depending on UX preference. For now, it stays open.
    }
  };
  
  if (isStorageLoading) {
      return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Load Design</DialogTitle>
            <DialogContent><Typography>Loading saved designs...</Typography></DialogContent>
        </Dialog>
      );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Load or Delete Saved Designs</DialogTitle>
      <DialogContent>
        {savedDesigns.length === 0 ? (
          <DialogContentText>No saved designs found.</DialogContentText>
        ) : (
          <List>
            {savedDesigns.map((design) => (
              <ListItem
                key={design.id}
                button
                onClick={() => handleLoad(design.id)}
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={(e) => handleDelete(design.id, e)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <FileOpenIcon />
                </ListItemIcon>
                <ListItemText 
                  primary={design.name} 
                  secondary={`Saved: ${new Date(design.timestamp).toLocaleString()}`} 
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoadDesignDialog;
