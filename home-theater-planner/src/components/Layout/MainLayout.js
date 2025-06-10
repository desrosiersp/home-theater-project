import React, { useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, CssBaseline, Button, Stepper, Step, StepLabel, StepButton } from '@mui/material'; // Added StepButton
// import SaveIcon from '@mui/icons-material/Save'; // Temporarily unused
// import FolderOpenIcon from '@mui/icons-material/FolderOpen'; // Temporarily unused
// import TabPanel from './TabPanel'; // No longer needed
// import CalculationsDisplay from '../PowerCalculator/CalculationsDisplay'; // Will be part of a step
// import RoomModesDisplay from '../AcousticsCalculator/RoomModesDisplay'; // Will be part of a step
// import ReflectionPointsDisplay from '../AcousticsCalculator/ReflectionPointsDisplay'; // Will be part of a step
// import AcousticTreatmentRecommendations from '../AcousticsCalculator/AcousticTreatmentRecommendations'; // Will be part of a step
// import SaveDesignDialog from '../Sharing/SaveDesignDialog'; // To be reintegrated
// import LoadDesignDialog from '../Sharing/LoadDesignDialog'; // To be reintegrated

const drawerWidth = 350; // Width of the sidebar - This might be removed or repurposed if sidebar is removed
const appBarHeight = '64px'; // Assuming default AppBar height

const steps = ['Room Definition', 'Component Setup', 'Layout & Placement', 'Analysis & Insights', 'Review & Save/Load'];

// showOwnAppBar defaults to true. stepsContent prop will hold an array of components for each step.
const MainLayout = ({ stepsContent, showOwnAppBar = true }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({}); // Added completed state
  // const [saveDialogOpen, setSaveDialogOpen] = useState(false); // To be reintegrated
  // const [loadDialogOpen, setLoadDialogOpen] = useState(false); // To be reintegrated

  // const handleOpenSaveDialog = () => setSaveDialogOpen(true); // To be reintegrated
  // const handleCloseSaveDialog = () => setSaveDialogOpen(false); // To be reintegrated
  // const handleOpenLoadDialog = () => setLoadDialogOpen(true); // To be reintegrated
  // const handleCloseLoadDialog = () => setLoadDialogOpen(false); // To be reintegrated

  const handleNext = () => {
    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = (stepIndex) => {
    if (stepIndex === activeStep + 1) { // If moving to the immediate next step
      const newCompleted = { ...completed };
      newCompleted[activeStep] = true; // Mark current step as completed
      setCompleted(newCompleted);
    }
    setActiveStep(stepIndex); // Set the new active step
  };

  const getStepContent = (step) => {
    if (stepsContent && stepsContent[step]) {
      return stepsContent[step];
    }
    return <Typography>Content not available for this step.</Typography>;
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', flexDirection: 'column' }}> {/* Changed to column for wizard */}
      <CssBaseline />
      {showOwnAppBar && (
        <>
          <AppBar
            position="fixed"
            sx={{
              // If this AppBar is shown, it needs to be positioned correctly,
              // e.g., top: globalAppBarHeight if there's a global one above it.
              // For now, assuming it's hidden via showOwnAppBar={false} from PlannerPage.
              zIndex: (theme) => theme.zIndex.drawer + 1, // Example, may not be needed if no drawer
              background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
            }}
          >
            <Toolbar>
              <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                Home Theater Planner (Wizard Mode)
              </Typography>
              {/* Save/Load buttons were here, will move to final wizard step */}
            </Toolbar>
          </AppBar>
          {/* <SaveDesignDialog open={saveDialogOpen} handleClose={handleCloseSaveDialog} /> */}
          {/* <LoadDesignDialog open={loadDialogOpen} handleClose={handleCloseLoadDialog} /> */}
        </>
      )}

      {/* The Drawer is removed as the wizard steps will occupy the main content area.
          If a persistent sidebar is still desired alongside the wizard, this section would need to be re-evaluated.
          For now, assuming a full-width wizard experience. */}
      {/*
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          height: '100%',
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            height: '100%',
            position: 'relative',
            boxSizing: 'border-box',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e9ecef',
            paddingTop: showOwnAppBar ? appBarHeight : '0px',
          },
        }}
      >
        <Box sx={{ overflow: 'auto', height: '100%', p: 2, boxSizing: 'border-box' }}>
          {/* Sidebar content would be dynamic based on step or removed entirely }
        </Box>
      </Drawer>
      */}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%', // Wizard takes full width
          paddingTop: showOwnAppBar ? appBarHeight : '0px', // Adjust if MainLayout's AppBar is shown
          backgroundColor: 'white',
          overflowY: 'auto', // Allow content within a step to scroll
          p: 3, // Padding for the main content area of the wizard
        }}
      >
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepButton
                onClick={() => handleStepClick(index)}
                disabled={index > activeStep + 1}
              >
                <StepLabel>{label}</StepLabel>
              </StepButton>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mb: 2, flexGrow: 1 }}> {/* Box for step content */}
          {getStepContent(activeStep)}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Box sx={{ flex: '1 1 auto' }} />
          <Button onClick={handleNext} disabled={activeStep === steps.length - 1}>
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
