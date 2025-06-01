import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'; // Added useMemo back
import { Box, Typography, Button, Stack } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useRoomContext } from '../../context/RoomContext';
import { useComponentContext } from '../../context/ComponentContext';
import { calculateSpeakerPositions } from '../../utils/dolbyAtmosRules';

const RoomVisualizer = () => {
  const { 
    roomDimensionsMeters, 
    getDimensionsInCurrentUnit, 
    unitSystem, 
    selectedModeForVisualization,
    manualSpeakerPositions, // New from context
    updateManualSpeakerPosition, // New from context
    resetManualSpeakerPositions  // New from context
  } = useRoomContext(); 
  const { speakerConfiguration } = useComponentContext();
  
  const [calculatedSpeakers, setCalculatedSpeakers] = useState([]); // Store initially calculated positions
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Drag state
  const [draggingSpeakerId, setDraggingSpeakerId] = useState(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 }); // Mouse start
  const svgRef = useRef(null); // Ref for SVG element to get its position/size

  const { width: widthMeters, length: lengthMeters } = roomDimensionsMeters;

  // Calculate initial speaker positions or when dependencies change
  const calculateAndSetInitialSpeakers = useCallback(() => {
    if (widthMeters > 0 && lengthMeters > 0 && speakerConfiguration) {
      const calculated = calculateSpeakerPositions(roomDimensionsMeters, speakerConfiguration);
      setCalculatedSpeakers(calculated);
    } else {
      setCalculatedSpeakers([]);
    }
  }, [roomDimensionsMeters, speakerConfiguration, widthMeters, lengthMeters]);

  useEffect(() => {
    calculateAndSetInitialSpeakers();
  }, [calculateAndSetInitialSpeakers, refreshKey]);

  const handleResetLayout = () => {
    resetManualSpeakerPositions(); // Clear manual overrides
    setRefreshKey(prevKey => prevKey + 1); // Trigger recalculation of base positions
  };

  const handleAutoOptimize = () => {
    // For now, same as reset. Later, this can have more advanced logic.
    resetManualSpeakerPositions();
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Combine calculated and manual positions for rendering
  const finalSpeakerPositions = useMemo(() => {
    return calculatedSpeakers.map(cs => {
      const manualPos = manualSpeakerPositions[cs.id];
      return manualPos ? { ...cs, ...manualPos } : cs; // Prioritize manual position if it exists
    });
  }, [calculatedSpeakers, manualSpeakerPositions]);

  // Memoize scaling calculations to avoid re-running them on every render if dimensions/scale haven't changed
  const { vizWidth, vizHeight, currentScale } = useMemo(() => {
    const baseScale = 50;
    const maxVizWidth = 580;
    const maxVizHeight = 580;
    let scale = baseScale;
    let vW = widthMeters * scale;
    let vH = lengthMeters * scale;

    if (widthMeters > 0 && lengthMeters > 0) {
      if (vW > maxVizWidth || vH > maxVizHeight) {
        const scaleX = maxVizWidth / widthMeters;
        const scaleY = maxVizHeight / lengthMeters;
        scale = Math.min(scaleX, scaleY, baseScale);
        vW = widthMeters * scale;
        vH = lengthMeters * scale;
      }
    } else {
      vW = 1; vH = 1;
    }
    return { vizWidth: Math.max(vW, 1), vizHeight: Math.max(vH, 1), currentScale: scale };
  }, [widthMeters, lengthMeters]);

  // Drag handlers
  const handleMouseDown = (e, speakerId) => {
    e.preventDefault();
    setDraggingSpeakerId(speakerId);
    const CTM = svgRef.current.getScreenCTM().inverse();
    const svgPoint = svgRef.current.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    const startPos = svgPoint.matrixTransform(CTM);
    setDragStartPos({ x: startPos.x, y: startPos.y });

    // Add global listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e) => {
    if (!draggingSpeakerId || !svgRef.current) return;
    e.preventDefault();

    const CTM = svgRef.current.getScreenCTM().inverse();
    const svgPoint = svgRef.current.createSVGPoint();
    svgPoint.x = e.clientX;
    svgPoint.y = e.clientY;
    const currentSvgPos = svgPoint.matrixTransform(CTM);

    // Convert pixel position to meters
    let newX_meters = currentSvgPos.x / currentScale;
    let newY_meters = currentSvgPos.y / currentScale;

    // Clamp to room boundaries (in meters)
    newX_meters = Math.max(0, Math.min(newX_meters, widthMeters));
    newY_meters = Math.max(0, Math.min(newY_meters, lengthMeters));
    
    updateManualSpeakerPosition(draggingSpeakerId, { x: newX_meters, y: newY_meters });

  }, [draggingSpeakerId, currentScale, widthMeters, lengthMeters, updateManualSpeakerPosition]); // Added currentScale, widthMeters, lengthMeters

  const handleMouseUp = useCallback((e) => {
    if (!draggingSpeakerId) return;
    e.preventDefault();
    setDraggingSpeakerId(null);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [draggingSpeakerId, handleMouseMove]); // Added handleMouseMove

  // Cleanup global listeners when component unmounts or drag ends
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  
  const displayedDimensions = getDimensionsInCurrentUnit();
  const currentUnitSuffix = unitSystem === 'meters' ? 'm' : 'ft';

  return (
    <Box sx={{ p: 2, border: '1px solid blue', borderRadius: 1, mt: 2, overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Room Visualization (Top-Down) - {speakerConfiguration}
      </Typography>
      {widthMeters > 0 && lengthMeters > 0 ? (
        <svg
          ref={svgRef} // Attach ref here
          width={vizWidth}
          height={vizHeight}
          viewBox={`0 0 ${vizWidth} ${vizHeight}`}
          style={{ border: '1px solid black', backgroundColor: '#f0f0f0', display: 'block', margin: 'auto', position: 'relative', cursor: draggingSpeakerId ? 'grabbing' : 'default' }}
        >
          <rect x="0" y="0" width={vizWidth} height={vizHeight} fill="#e0e0e0" stroke="black" />
          
          {/* Mode Visualization Layer (same as before) */}
          {selectedModeForVisualization && selectedModeForVisualization.dimension && selectedModeForVisualization.order && widthMeters > 0 && lengthMeters > 0 && (
            <g id="mode-visualization-layer">
              {(() => {
                const { dimension, order } = selectedModeForVisualization;
                const modeRects = [];
                const highPressureFill = "rgba(255, 0, 0, 0.3)";
                if (dimension === 'Length') {
                  if (order === 1) modeRects.push(<rect key="l1" x="0" y={vizHeight / 4} width={vizWidth} height={vizHeight / 2} fill={highPressureFill} />);
                  else if (order === 2) {modeRects.push(<rect key="l2a" x="0" y={vizHeight / 8} width={vizWidth} height={vizHeight / 4} fill={highPressureFill} />); modeRects.push(<rect key="l2b" x="0" y={vizHeight * 5 / 8} width={vizWidth} height={vizHeight / 4} fill={highPressureFill} />); }
                } else if (dimension === 'Width') {
                  if (order === 1) modeRects.push(<rect key="w1" x={vizWidth / 4} y="0" width={vizWidth / 2} height={vizHeight} fill={highPressureFill} />);
                  else if (order === 2) { modeRects.push(<rect key="w2a" x={vizWidth / 8} y="0" width={vizWidth / 4} height={vizHeight} fill={highPressureFill} />); modeRects.push(<rect key="w2b" x={vizWidth * 5 / 8} y="0" width={vizWidth / 4} height={vizHeight} fill={highPressureFill} />); }
                }
                return modeRects;
              })()}
            </g>
          )}

          {/* Speaker Layer */}
          {finalSpeakerPositions.map((speaker) => (
            <g 
              key={speaker.id} 
              transform={`translate(${speaker.x * currentScale}, ${speaker.y * currentScale})`}
              onMouseDown={(e) => handleMouseDown(e, speaker.id)}
              style={{ cursor: 'grab' }}
            >
              <circle 
                r={speaker.isListeningPosition ? 8 : 6} // Slightly larger radius for easier grabbing
                fill={speaker.isListeningPosition ? "blue" : (speaker.note && speaker.note.includes("Height") ? "lightgreen" : "red")} 
              />
              <text 
                x={speaker.isListeningPosition ? 10 : 8} 
                y="4" 
                fontSize="10" 
                fill="black"
                style={{ pointerEvents: 'none' }} // Make text non-interactive for dragging
              >
                {speaker.label}
              </text>
            </g>
          ))}
        </svg>
      ) : (
        <Typography>Enter valid room dimensions and select a configuration to see visualization.</Typography>
      )}
      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
        Dimensions: {displayedDimensions.width.toFixed(2)}{currentUnitSuffix} (W) x {displayedDimensions.length.toFixed(2)}{currentUnitSuffix} (L) | Scale: {currentScale.toFixed(2)} px/m
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={handleResetLayout}>
          Reset Layout
        </Button>
        <Button variant="contained" startIcon={<AutoFixHighIcon />} onClick={handleAutoOptimize}>
          Auto-Optimize Positions
        </Button>
      </Stack>
    </Box>
  );
};

export default RoomVisualizer;
