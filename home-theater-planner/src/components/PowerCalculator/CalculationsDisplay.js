import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import { useRoomContext } from '../../context/RoomContext';
import { useComponentContext } from '../../context/ComponentContext';
import { calculateRoomVolume, calculateRequiredPower, calculateMaxSPL, estimateTotalPowerDraw } from '../../utils/powerCalculator'; // Added estimateTotalPowerDraw
import { calculateSpeakerPositions } from '../../utils/dolbyAtmosRules'; 

const CalculationCard = ({ title, value, unit }) => (
  <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
    <Typography variant="subtitle1" color="textSecondary">{title}</Typography>
    <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
      {value} <Typography variant="caption" component="span">{unit}</Typography>
    </Typography>
  </Paper>
);

const CalculationsDisplay = () => {
  const { roomDimensionsMeters, unitSystem, manualSpeakerPositions } = useRoomContext(); // Added manualSpeakerPositions
  const { selectedSpeakers, selectedReceiver, selectedDisplay, targetSPL, speakerConfiguration } = useComponentContext();
  
  const [speakerData, setSpeakerData] = useState([]);
  const [receiverData, setReceiverData] = useState([]);
  const [displayData, setDisplayData] = useState([]); // Added displayData state
  const [loading, setLoading] = useState(true);

  // Calculate all speaker positions including LP, then merge with manual overrides
  const allSpeakerPositions = useMemo(() => {
    let positions = [];
    if (roomDimensionsMeters.width > 0 && roomDimensionsMeters.length > 0 && speakerConfiguration) {
      positions = calculateSpeakerPositions(roomDimensionsMeters, speakerConfiguration);
    }
    // Merge with manual positions
    return positions.map(p => ({
      ...p,
      ...(manualSpeakerPositions[p.id] || {}) 
    }));
  }, [roomDimensionsMeters, speakerConfiguration, manualSpeakerPositions]);

  const listeningPosition = useMemo(() => allSpeakerPositions.find(sp => sp.isListeningPosition), [allSpeakerPositions]);
  
  // Use Center speaker if available, otherwise Front Left as reference for distance
  const referenceSpeakerForDistance = useMemo(() => {
    return allSpeakerPositions.find(sp => sp.id === 'c') || allSpeakerPositions.find(sp => sp.id === 'fl');
  }, [allSpeakerPositions]);

  const listeningDistanceMeters = useMemo(() => {
    if (listeningPosition && referenceSpeakerForDistance) {
      const dx = listeningPosition.x - referenceSpeakerForDistance.x;
      const dy = listeningPosition.y - referenceSpeakerForDistance.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
    return 3; // Default if positions not available
  }, [listeningPosition, referenceSpeakerForDistance]);

  // Fetch component data
  useEffect(() => {
    Promise.all([
      fetch('/assets/data/speakers.json').then(res => res.json()),
      fetch('/assets/data/receivers.json').then(res => res.json()),
      fetch('/assets/data/displays.json').then(res => res.json()) // Fetch display data
    ]).then(([speakers, receivers, displays]) => {
      setSpeakerData(speakers.speakers || []);
      setReceiverData(receivers.receivers || []);
      setDisplayData(displays.displays || []); // Set display data
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching component data:", error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  // --- Calculations ---
  const roomVolumeMeters = calculateRoomVolume(roomDimensionsMeters);
  const roomVolumeFeet = roomVolumeMeters * Math.pow(3.28084, 3); // m^3 to ft^3

  // For simplified calculation, assume main speaker and average listening distance
  // This needs to be more sophisticated later (e.g., per speaker type, actual LP)
  const frontLRSpeakerModelId = selectedSpeakers.frontLR; // Use 'frontLR' role for front speakers
  const currentSpeaker = speakerData.find(s => s.model === frontLRSpeakerModelId); // Assuming model is unique ID for now
  
  const currentReceiverModelId = selectedReceiver;
  const currentAvr = receiverData.find(r => r.model === currentReceiverModelId); 
  
  const currentDisplayId = selectedDisplay;
  const currentDisplay = displayData.find(d => d.id === currentDisplayId);


  let requiredPower = 0;
  let maxSPL = 0;
  let totalPowerDraw = 0;

  if (currentSpeaker && currentSpeaker.sensitivity && listeningDistanceMeters > 0) {
    requiredPower = calculateRequiredPower(
      currentSpeaker.sensitivity,
      listeningDistanceMeters,
      targetSPL
    );
    if (currentAvr && currentAvr.power) {
        const avrPowerMatch = currentAvr.power.match(/(\d+(\.\d+)?)/); 
        const avrPowerWatts = avrPowerMatch ? parseFloat(avrPowerMatch[1]) : 0;
        if (avrPowerWatts > 0) {
             maxSPL = calculateMaxSPL(currentSpeaker.sensitivity, avrPowerWatts, listeningDistanceMeters);
        }
    }
  }

  // Calculate total power draw
  // For numberOfChannelsDriven, use a simple count based on speakerConfiguration (e.g., 5 for 5.1, 7 for 7.1)
  // This is a simplification.
  let numChannels = 0;
  if (speakerConfiguration) {
    const parts = speakerConfiguration.split('.');
    numChannels = parseInt(parts[0], 10); // e.g., "5" from "5.1"
    if (parts.length > 2) numChannels += parseInt(parts[2], 10); // Add height channels e.g. "2" from "5.1.2"
  }
  numChannels = Math.max(numChannels, 2); // Assume at least 2 channels for stereo

  totalPowerDraw = estimateTotalPowerDraw(currentAvr, currentDisplay, numChannels);
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Power & SPL Calculations
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}> 
          <CalculationCard 
            title="Room Volume" 
            value={unitSystem === 'meters' ? roomVolumeMeters.toFixed(2) : roomVolumeFeet.toFixed(2)} 
            unit={unitSystem === 'meters' ? 'm³' : 'ft³'} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CalculationCard 
            title="Listening Distance" 
            value={listeningDistanceMeters > 0 ? listeningDistanceMeters.toFixed(2) : 'N/A'} 
            unit={listeningDistanceMeters > 0 ? (unitSystem === 'meters' ? 'm' : 'ft') : ''} // Show distance in current unit
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CalculationCard 
            title="Required Power (per ch)" 
            value={requiredPower > 0 ? requiredPower.toFixed(1) : 'N/A'} 
            unit={requiredPower > 0 ? 'W' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CalculationCard 
            title="Estimated Max SPL" 
            value={maxSPL > 0 ? maxSPL.toFixed(1) : 'N/A'} 
            unit={maxSPL > 0 ? 'dB' : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <CalculationCard 
            title="Total Power Draw" 
            value={totalPowerDraw > 0 ? totalPowerDraw : 'N/A'} 
            unit={totalPowerDraw > 0 ? "W" : ""} />
        </Grid>
      </Grid>
      {(!currentSpeaker || !currentAvr || !currentDisplay) && (
        <Typography color="error" sx={{mt: 2}}>
            Please select a main speaker, AV receiver, and Display from the sidebar to see all calculations.
        </Typography>
      )}
       <Typography variant="caption" display="block" sx={{mt: 2, fontStyle: 'italic'}}>
        Note: Listening distance is calculated to the Center or Front Left speaker. Required power, Max SPL and Total Power Draw are estimates.
      </Typography>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Detailed Analysis</Typography>
        <Paper elevation={1} sx={{p:2}}>
          {currentSpeaker && currentAvr && currentDisplay ? (
            <>
              <Typography variant="body2" paragraph>
                <strong>Speaker Efficiency:</strong> Your selected front speakers ({currentSpeaker.brand} {currentSpeaker.model}) have a sensitivity of {currentSpeaker.sensitivity}dB/1W/1m. This is a key factor in how much power is needed.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Amplifier Power:</strong> Your selected AV Receiver ({currentAvr.brand} {currentAvr.model}) is rated at {currentAvr.power}. The estimated maximum SPL of {maxSPL > 0 ? maxSPL.toFixed(1) : 'N/A'}dB suggests whether you have adequate headroom for dynamic peaks at your listening distance of {listeningDistanceMeters > 0 ? listeningDistanceMeters.toFixed(2) : 'N/A'}m.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Display Choice:</strong> You've selected a {currentDisplay.brand} {currentDisplay.model} ({currentDisplay.type}). Its power consumption contributes to the total system draw.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Room Influence:</strong> Your room volume of {unitSystem === 'meters' ? roomDimensionsMeters.width.toFixed(1) : (roomDimensionsMeters.width * 3.28084).toFixed(1)}{unitSystem === 'meters' ? 'm' : 'ft'} (W) x {unitSystem === 'meters' ? roomDimensionsMeters.length.toFixed(1) : (roomDimensionsMeters.length * 3.28084).toFixed(1)}{unitSystem === 'meters' ? 'm' : 'ft'} (L) x {unitSystem === 'meters' ? roomDimensionsMeters.height.toFixed(1) : (roomDimensionsMeters.height * 3.28084).toFixed(1)}{unitSystem === 'meters' ? 'm' : 'ft'} (H) impacts how bass frequencies behave (see Optimization tab for room modes). Larger rooms generally require more power to achieve the same SPL.
              </Typography>
            </>
          ) : (
            <Typography variant="body2">
              Select components (Front Speakers, AV Receiver, Display) from the sidebar to see a more detailed analysis.
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default CalculationsDisplay;
