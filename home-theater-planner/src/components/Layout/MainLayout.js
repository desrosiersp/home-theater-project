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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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
          marginTop: showOwnAppBar ? appBarHeight : '0px',
          height: showOwnAppBar ? `calc(100vh - ${appBarHeight})` : '100vh',
          [`& .MuiDrawer-paper`]: {
            width: '100%', 
            height: '100%', 
            position: 'relative', 
            boxSizing: 'border-box',
            backgroundColor: '#f8f9fa', 
            borderRight: '1px solid #e9ecef',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', p: 2, boxSizing: 'border-box' }}> {/* Removed height: '100%' */}
          {/* The mt above is a bit of a hack if GlobalLayout's AppBar is also fixed. 
              A better solution might involve GlobalLayout providing its AppBar height via context if needed,
              or ensuring only one AppBar is 'fixed' if they are from different layout components.
              For now, this assumes GlobalLayout's AppBar might also be fixed and we need to clear it.
              If GlobalLayout's AppBar is static, this mt might not be needed or adjusted.
              Let's assume for now GlobalLayout's AppBar is static or PlannerPage is the only content.
              Revisiting this specific margin might be needed based on GlobalLayout's AppBar style.
              A simpler approach: if showOwnAppBar is false, the Drawer's content might need padding to clear the *GlobalLayout's* AppBar.
              Let's simplify: Drawer content starts from its top. GlobalLayout handles its own AppBar spacing.
            */}
             {sidebarContent} {/* Render sidebarContent prop here */}
        </Box>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: `${drawerWidth}px`, // Offset by drawer width
          marginTop: showOwnAppBar ? appBarHeight : '0px', // Adjust based on AppBar visibility
          backgroundColor: 'white', // Main content area background
          minHeight: showOwnAppBar ? `calc(100vh - ${appBarHeight})` : '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="main content tabs">
            <Tab label="Room Design" {...a11yProps(0)} />
            <Tab label="Power & SPL" {...a11yProps(1)} />
            <Tab label="Optimization" {...a11yProps(2)} />
          </Tabs>
        </Box>
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
  );
};

export default MainLayout;
