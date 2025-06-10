import React, { useMemo } from 'react';
import { Box, Typography, Slider, Grid, Paper } from '@mui/material';
import { useComponentContext } from '../../context/ComponentContext';
import { useRoomContext } from '../../context/RoomContext'; // Added

// Helper function to calculate distance between two points
const calculateDistance = (p1, p2) => {
    if (!p1 || !p2) return 0;
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

const SpeakerDistanceControl = ({ finalSpeakerPositions, listeningPosition }) => { // Added props
    const { speakerConfiguration, speakerDistanceAdjustments, updateSpeakerDistanceAdjustment } = useComponentContext();
    const { unitSystem, getDimensionsInCurrentUnit, roomDimensionsMeters } = useRoomContext(); // Added room context

    const METER_TO_FEET = 3.28084;

    const convertToCurrentUnit = (valueInMeters) => {
        if (unitSystem === 'feet') {
            return valueInMeters * METER_TO_FEET;
        }
        return valueInMeters;
    };
    const currentUnitSuffix = unitSystem === 'meters' ? 'm' : 'ft';

    const commonSpeakerRoles = [
        { id: 'front', label: 'Front L/R' },
        { id: 'center', label: 'Center' },
    ];

    const surroundSpeakerRoles = [
        { id: 'surround', label: 'Surrounds (Side)' },
    ];

    const rearSpeakerRoles = [
        { id: 'rear', label: 'Rears (Back)' },
    ];

    const atmosSpeakerRoles = [
        { id: 'topFront', label: 'Top Front' },
        { id: 'topMiddle', label: 'Top Middle' },
        { id: 'topRear', label: 'Top Rear' },
    ];

    let activeRoles = [...commonSpeakerRoles];

    if (speakerConfiguration.startsWith('5.') || speakerConfiguration.startsWith('7.')) {
        activeRoles = [...activeRoles, ...surroundSpeakerRoles];
    }
    if (speakerConfiguration.startsWith('7.')) {
        activeRoles = [...activeRoles, ...rearSpeakerRoles];
    }
    if (speakerConfiguration.includes('.2') || speakerConfiguration.includes('.4')) {
        // Simplified: show all Atmos roles if any Atmos config. Could be more granular.
        if (speakerConfiguration.includes('.2') && !speakerConfiguration.includes('.4')) { // Typically 5.1.2, 7.1.2 use Top Middle
            activeRoles = [...activeRoles, atmosSpeakerRoles.find(r => r.id === 'topMiddle')].filter(Boolean);
        } else if (speakerConfiguration.includes('.4')) { // Typically 5.1.4, 7.1.4 use Top Front & Top Rear
            activeRoles = [...activeRoles, atmosSpeakerRoles.find(r => r.id === 'topFront'), atmosSpeakerRoles.find(r => r.id === 'topRear')].filter(Boolean);
        }
    }

    // Filter out roles not present in the current speaker configuration (e.g. center for 2.0)
    if (!speakerConfiguration.startsWith('3.') && !speakerConfiguration.startsWith('5.') && !speakerConfiguration.startsWith('7.')) {
        activeRoles = activeRoles.filter(role => role.id !== 'center');
    }


    const handleSliderChange = (roleId, value) => {
        updateSpeakerDistanceAdjustment(roleId, value);
    };

    const getSpeakerByIdOrRole = (roleId) => {
        // For roles like 'front', 'surround', 'rear', we might pick the 'left' speaker as representative
        // or average their positions if needed. For simplicity, picking the first one that matches.
        // This mapping needs to be robust based on speaker IDs in dolbyAtmosRules.js
        const roleToIdMap = {
            front: 'fl',
            center: 'c',
            surround: 'sl',
            rear: 'sbl',
            topFront: 'tfl',
            topMiddle: 'tml',
            topRear: 'trl',
        };
        const speakerId = roleToIdMap[roleId] || roleId;
        return finalSpeakerPositions.find(sp => sp.id === speakerId);
    };


    return (
        <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                Speaker Distance Adjustments
            </Typography>
            <Box>
                {activeRoles.map((role) => {
                    const representativeSpeaker = getSpeakerByIdOrRole(role.id);
                    let distFromLpText = '';
                    let wallDistancesText = '';

                    if (representativeSpeaker && listeningPosition) {
                        const distMeters = calculateDistance(representativeSpeaker, listeningPosition);
                        distFromLpText = `${convertToCurrentUnit(distMeters).toFixed(2)}${currentUnitSuffix} from LP`;

                        // Wall distance calculations (simplified examples)
                        const spkrX_m = representativeSpeaker.x;
                        const spkrY_m = representativeSpeaker.y;
                        const roomW_m = roomDimensionsMeters.width;
                        const roomL_m = roomDimensionsMeters.length;
                        let xWallDist = 0, yWallDist = 0;
                        let xWallLabel = '', yWallLabel = '';

                        // Determine relevant walls based on typical speaker role placement
                        if (role.id.includes('front') || role.id === 'center' || role.id.includes('topFront')) {
                            yWallDist = spkrY_m;
                            yWallLabel = 'Front Wall';
                        } else if (role.id.includes('rear') || role.id.includes('topRear')) {
                            yWallDist = roomL_m - spkrY_m;
                            yWallLabel = 'Rear Wall';
                        } else { // Surrounds, Top Middle (often aligned with LP or slightly side)
                            // For side speakers, y distance to front/rear might be less intuitive than x to side.
                            // For simplicity, let's show y from front wall for sides too, or it could be more complex.
                            yWallDist = spkrY_m;
                            yWallLabel = 'Front Wall';
                        }

                        if (role.id.includes('l') || role.id.endsWith('Left')) { // For Left speakers
                            xWallDist = spkrX_m;
                            xWallLabel = 'Left Wall';
                        } else if (role.id.includes('r') || role.id.endsWith('Right')) { // For Right speakers
                            xWallDist = roomW_m - spkrX_m;
                            xWallLabel = 'Right Wall';
                        } else if (role.id === 'center' || role.id === 'topMiddle') { // Center channel or top middle
                            xWallDist = Math.min(spkrX_m, roomW_m - spkrX_m); // Distance to nearest side wall
                            xWallLabel = 'Nearest Side Wall';
                        }

                        if (xWallLabel && yWallLabel) {
                            wallDistancesText = `(${convertToCurrentUnit(xWallDist).toFixed(2)}${currentUnitSuffix} from ${xWallLabel}, ${convertToCurrentUnit(yWallDist).toFixed(2)}${currentUnitSuffix} from ${yWallLabel})`;
                        } else if (xWallLabel) {
                            wallDistancesText = `(${convertToCurrentUnit(xWallDist).toFixed(2)}${currentUnitSuffix} from ${xWallLabel})`;
                        } else if (yWallLabel && role.id === 'center') { // Center only has yWallDist from front
                            wallDistancesText = `(${convertToCurrentUnit(yWallDist).toFixed(2)}${currentUnitSuffix} from ${yWallLabel})`;
                        }


                    }

                    return (
                        <Box key={role.id} sx={{ mb: 3 }}> {/* Increased mb for more spacing */}
                            <Typography gutterBottom>{role.label} Multiplier</Typography>
                            <Grid container spacing={1} alignItems="center"> {/* Reduced spacing for tighter layout */}
                                <Grid item xs={12} sm={6} md={7}> {/* Adjusted grid for responsiveness */}
                                    <Slider
                                        value={typeof speakerDistanceAdjustments[role.id] === 'number' ? speakerDistanceAdjustments[role.id] : 1.0}
                                        onChange={(e, newValue) => handleSliderChange(role.id, newValue)}
                                        aria-labelledby={`${role.id}-distance-slider`}
                                        valueLabelDisplay="auto"
                                        step={0.05}
                                        marks
                                        min={0.5}
                                        max={2.0}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={5}> {/* Adjusted grid */}
                                    <Typography variant="body2" component="div"> {/* Changed to div for better layout control */}
                                        Multiplier: {(speakerDistanceAdjustments[role.id] || 1.0).toFixed(2)}x
                                        {distFromLpText && <><br />{distFromLpText}</>}
                                        {wallDistancesText && <><br /><Typography variant="caption" display="block">{wallDistancesText}</Typography></>}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
};

export default SpeakerDistanceControl;
