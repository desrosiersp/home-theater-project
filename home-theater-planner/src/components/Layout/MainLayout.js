import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, CssBaseline, Tabs, Tab, Divider as MuiDivider, Button, IconButton } from '@mui/material'; // Added Button, IconButton
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import TabPanel from './TabPanel';
import CalculationsDisplay from '../PowerCalculator/CalculationsDisplay';
import RoomModesDisplay from '../AcousticsCalculator/RoomModesDisplay';
import ReflectionPointsDisplay from '../AcousticsCalculator/ReflectionPointsDisplay';
import AcousticTreatmentRecommendations from '../AcousticsCalculator/AcousticTreatmentRecommendations';
import SaveDesignDialog from '../Sharing/SaveDesignDialog';
import LoadDesignDialog from '../Sharing/LoadDesignDialog';
// import CommunityBuildsTab from '../../pages/CommunityBuildsTab'; // Commented out or removed

const drawerWidth = 350; // Width of the sidebar
const appBarHeight = '64px'; // Assuming default AppBar height

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// Added showOwnAppBar prop, defaulting to true
const MainLayout = ({ sidebarContent, children, showOwnAppBar = true }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleOpenSaveDialog = () => setSaveDialogOpen(true);
  const handleCloseSaveDialog = () => setSaveDialogOpen(false);
  const handleOpenLoadDialog = () => setLoadDialogOpen(true);
  const handleCloseLoadDialog = () => setLoadDialogOpen(false);

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <CssBaseline />
      {showOwnAppBar && (
        <>
          <AppBar
            position="fixed"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            }}
          >
            <Toolbar>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                Home Theater Planner
              </Typography>
              <Button color="inherit" startIcon={<SaveIcon />} onClick={handleOpenSaveDialog} sx={{ mr: 1 }}>
                Save Design
              </Button>
              <Button color="inherit" startIcon={<FolderOpenIcon />} onClick={handleOpenLoadDialog}>
                Load Design
              </Button>
            </Toolbar>
          </AppBar>
          <SaveDesignDialog open={saveDialogOpen} handleClose={handleCloseSaveDialog} />
          <LoadDesignDialog open={loadDialogOpen} handleClose={handleCloseLoadDialog} />
        </>
      )}

      <Drawer
        variant="permanent" // Persistent sidebar
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          // marginTop is handled by paddingTop on MuiDrawer-paper if showOwnAppBar is true
          height: '100%', // Drawer fills the height of its flex container
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth, // Ensure paper takes full drawerWidth
            height: '100%',
            position: 'relative', // Important for containing its children properly
            boxSizing: 'border-box',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e9ecef',
            paddingTop: showOwnAppBar ? appBarHeight : '0px', // Offset content if planner's AppBar is shown
          },
        }}
      >
        <Box sx={{ overflow: 'auto', height: '100%', p: 2, boxSizing: 'border-box' }}>
          {sidebarContent} {/* Render sidebarContent prop here */}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1, // Takes remaining width
          display: 'flex',
          flexDirection: 'column',
          height: '100%', // Fills height of its part of the main flex row
          paddingTop: showOwnAppBar ? appBarHeight : '0px', // Adjust based on AppBar visibility
          backgroundColor: 'white', // Main content area background
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%', flexShrink: 0 }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="main content tabs">
            <Tab label="Room Design" {...a11yProps(0)} />
            <Tab label="Power & SPL" {...a11yProps(1)} />
            <Tab label="Optimization" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
          <TabPanel value={currentTab} index={0}>
            {/* Content for Room Design tab (passed as children from App.js) */}
            {children}
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <CalculationsDisplay />
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <RoomModesDisplay />
            <MuiDivider sx={{ my: 3 }} />
            <ReflectionPointsDisplay />
            <MuiDivider sx={{ my: 3 }} />
            <AcousticTreatmentRecommendations />
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
