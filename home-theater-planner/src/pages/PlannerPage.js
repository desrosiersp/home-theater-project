import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import { RoomProvider } from '../context/RoomContext';
import { ComponentProvider } from '../context/ComponentContext';
import { StorageProvider } from '../context/StorageContext';

// Import components for sidebar and initial tab content
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

function PlannerPage() {
  const sidebarContent = (
    <>
      <RoomNameInput />
      <RoomDimensionInput />
      <SpeakerConfigurationSelector />
      <SpeakerModelSelector />
      <ReceiverSelector />
      <DisplaySelector />
      <TargetSPLSlider />
      <ModeVisualizationSelector />
      <HeightInput />
      {/* Other sidebar controls would go here if they existed in original App.js */}
    </>
  );

  const roomDesignTabContent = (
    <>
      <RoomVisualizer />
      {/* Other content specific to Room Design tab from original App.js */}
    </>
  );

  return (
    <StorageProvider>
      <ComponentProvider>
        <RoomProvider>
          <MainLayout showOwnAppBar={false} sidebarContent={sidebarContent}>
            {roomDesignTabContent}
          </MainLayout>
        </RoomProvider>
      </ComponentProvider>
    </StorageProvider>
  );
}

export default PlannerPage;
