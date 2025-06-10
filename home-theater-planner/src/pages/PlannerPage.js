import React, { useState, useMemo } from 'react'; // Added useMemo
import { Stack, Typography, Box, Button } from '@mui/material'; // Import Stack, Typography, Box, Button
import MainLayout from '../components/Layout/MainLayout';
import { RoomProvider, useRoomContext } from '../context/RoomContext';
import { ComponentProvider, useComponentContext } from '../context/ComponentContext';
import { StorageProvider } from '../context/StorageContext';
import { calculateSpeakerPositions } from '../utils/dolbyAtmosRules'; // Added

// Import components for wizard steps
import RoomDimensionInput from '../components/RoomBuilder/RoomDimensionInput';
import RoomVisualizer from '../components/RoomBuilder/RoomVisualizer';
import SpeakerConfigurationSelector from '../components/ComponentSelector/SpeakerConfigurationSelector';
import RoomNameInput from '../components/RoomBuilder/RoomNameInput';
import SpeakerModelSelector from '../components/ComponentSelector/SpeakerModelSelector';
import ReceiverSelector from '../components/ComponentSelector/ReceiverSelector';
import DisplaySelector from '../components/ComponentSelector/DisplaySelector';
import TargetSPLSlider from '../components/ComponentSelector/TargetSPLSlider';
import ModeVisualizationSelector from '../components/AcousticsCalculator/ModeVisualizationSelector';
import HeightInput from '../components/RoomBuilder/HeightInput';
import WallFeatureEditor from '../components/RoomBuilder/WallFeatureEditor';
import SpeakerDistanceControl from '../components/ComponentSelector/SpeakerDistanceControl'; // Added
import CalculationsDisplay from '../components/PowerCalculator/CalculationsDisplay';
import RoomModesDisplay from '../components/AcousticsCalculator/RoomModesDisplay';
import ReflectionPointsDisplay from '../components/AcousticsCalculator/ReflectionPointsDisplay';
import AcousticTreatmentRecommendations from '../components/AcousticsCalculator/AcousticTreatmentRecommendations';
import LoadDesignDialog from '../components/Sharing/LoadDesignDialog'; // Import LoadDesignDialog
import SaveDesignDialog from '../components/Sharing/SaveDesignDialog'; // Import SaveDesignDialog

// Inner component to access contexts for centralized calculation
const PlannerContent = () => {
  const { roomDimensionsMeters } = useRoomContext();
  const { speakerConfiguration, speakerDistanceAdjustments } = useComponentContext();

  const finalSpeakerPositions = useMemo(() => {
    if (roomDimensionsMeters.width > 0 && roomDimensionsMeters.length > 0 && speakerConfiguration) {
      return calculateSpeakerPositions(roomDimensionsMeters, speakerConfiguration, speakerDistanceAdjustments);
    }
    return [];
  }, [roomDimensionsMeters, speakerConfiguration, speakerDistanceAdjustments]);

  const listeningPosition = useMemo(() => {
    return finalSpeakerPositions.find(sp => sp.isListeningPosition);
  }, [finalSpeakerPositions]);

  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const handleOpenLoadDialog = () => setLoadDialogOpen(true);
  const handleCloseLoadDialog = () => setLoadDialogOpen(false);

  const handleOpenSaveDialog = () => setSaveDialogOpen(true); // Added handler for Save dialog
  const handleCloseSaveDialog = () => setSaveDialogOpen(false); // Added handler for Save dialog

  // Define content for each wizard step, now passing finalSpeakerPositions and listeningPosition
  const wizardStepsContent = [
    // Step 1: Room Definition
    <Stack spacing={3}>
      <Typography variant="h5" gutterBottom>Step 1: Room Definition</Typography>
      <Button variant="outlined" onClick={handleOpenLoadDialog} sx={{ mb: 2, alignSelf: 'flex-start' }}>
        Load Existing Design
      </Button>
      <RoomNameInput />
      <RoomDimensionInput />
      <WallFeatureEditor />
      <RoomVisualizer finalSpeakerPositions={[]} speakerConfiguration={null} /> {/* Added for Step 1 */}
    </Stack>,
    // Step 2: Component Setup
    <Stack spacing={3}>
      <Typography variant="h5" gutterBottom>Step 2: Component Setup</Typography>
      <SpeakerConfigurationSelector />
      <SpeakerModelSelector />
      <ReceiverSelector />
      <DisplaySelector />
    </Stack>,
    // Step 3: Layout & Placement
    <Stack spacing={3}>
      <Typography variant="h5" gutterBottom>Step 3: Layout & Placement</Typography>
      <HeightInput /> {/* Listener/Front Speaker Heights */}
      <SpeakerDistanceControl finalSpeakerPositions={finalSpeakerPositions} listeningPosition={listeningPosition} /> {/* Pass props */}
      <RoomVisualizer finalSpeakerPositions={finalSpeakerPositions} speakerConfiguration={speakerConfiguration} /> {/* Pass props */}
      {/* Add controls for manual placement, reset, optimize here or integrate into RoomVisualizer */}
    </Stack>,
    // Step 4: Analysis & Insights
    <Stack spacing={3}>
      <Typography variant="h5" gutterBottom>Step 4: Analysis & Insights</Typography>
      <TargetSPLSlider />
      <ModeVisualizationSelector />
      <CalculationsDisplay finalSpeakerPositions={finalSpeakerPositions} listeningPosition={listeningPosition} />
      <RoomModesDisplay />
      <ReflectionPointsDisplay finalSpeakerPositions={finalSpeakerPositions} listeningPosition={listeningPosition} />
      <AcousticTreatmentRecommendations />
      <RoomVisualizer finalSpeakerPositions={finalSpeakerPositions} speakerConfiguration={speakerConfiguration} /> {/* Added for Step 4 */}
    </Stack>,
    // Step 5: Review & Save/Load
    <Stack spacing={3}>
      <Typography variant="h5" gutterBottom>Step 5: Review & Save/Load</Typography>
      <Typography gutterBottom>
        Review your current home theater design configuration below.
      </Typography>
      {/* Placeholder for design summary - this would ideally be a new component */}
      <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1, minHeight: 100 }}>
        <Typography variant="subtitle1">Current Design Summary (Placeholder)</Typography>
        {/* TODO: Populate with actual data from contexts */}
      </Box>
      <Button variant="contained" onClick={handleOpenSaveDialog} sx={{ alignSelf: 'flex-start' }}>
        Save Current Design
      </Button>
    </Stack>,
  ];

  return (
    <>
      {/* MainLayout is now part of PlannerContent and can access context-derived props if needed,
          or wizardStepsContent can be passed as is if MainLayout doesn't need direct access to these props.
          For simplicity, passing wizardStepsContent which now has components with props. */}
      <MainLayout showOwnAppBar={false} stepsContent={wizardStepsContent} />
      <LoadDesignDialog open={loadDialogOpen} handleClose={handleCloseLoadDialog} />
      <SaveDesignDialog open={saveDialogOpen} handleClose={handleCloseSaveDialog} />
    </>
  );
};

function PlannerPage() {
  return (
    <StorageProvider>
      <ComponentProvider>
        <RoomProvider>
          <PlannerContent />
        </RoomProvider>
      </ComponentProvider>
    </StorageProvider>
  );
}

export default PlannerPage;
