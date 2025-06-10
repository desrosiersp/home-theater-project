import { calculateAxialModes } from './roomModeCalculator';

// Helper to check if a point is within a high-pressure zone
// A very simplified check: considers a point in a zone if it's near the mode's peak.
// A more sophisticated check would consider the wavelength and a percentage around the peak.
const isInPressureZone = (coordinate, roomDimension, modeOrder) => {
    if (modeOrder === 1) { // Peak at 0.5 * roomDimension
        const peak = 0.5 * roomDimension;
        const zoneWidth = roomDimension * 0.15; // e.g., +/- 15% of dimension around peak
        return Math.abs(coordinate - peak) < zoneWidth / 2;
    }
    if (modeOrder === 2) { // Peaks at 0.25 and 0.75 * roomDimension
        const peak1 = 0.25 * roomDimension;
        const peak2 = 0.75 * roomDimension;
        const zoneWidth = roomDimension * 0.125; // e.g., +/- 12.5% of dimension around peaks
        return Math.abs(coordinate - peak1) < zoneWidth / 2 || Math.abs(coordinate - peak2) < zoneWidth / 2;
    }
    return false;
};

export const autoOptimizePlacement = (roomDimensionsMeters, currentSpeakerPositions, currentDistanceAdjustments) => {
    const { width, length, height } = roomDimensionsMeters;
    const newAdjustments = JSON.parse(JSON.stringify(currentDistanceAdjustments)); // Deep copy

    if (!width || !length || !height || !currentSpeakerPositions || currentSpeakerPositions.length === 0) {
        return newAdjustments; // Not enough data to optimize
    }

    const allAxialModes = calculateAxialModes(roomDimensionsMeters);
    const modes = {
        length: allAxialModes.lengthModes.slice(0, 2), // First 2 length modes
        width: allAxialModes.widthModes.slice(0, 2)   // First 2 width modes
    };

    const lp = currentSpeakerPositions.find(sp => sp.isListeningPosition);
    if (!lp) return newAdjustments; // LP must exist

    // --- Simplified LP Optimization (Focus on Length Modes for LP y-coordinate) ---
    // This part is conceptual and would ideally adjust lpY directly or via a new context state.
    // For now, we'll skip direct LP y-coordinate changes as it complicates dolbyAtmosRules.
    // Instead, we focus on speaker adjustments relative to the default LP.

    // --- Speaker Group Optimization ---
    const speakerRolesToOptimize = ['front', 'center', 'surround', 'rear']; // Add more if needed

    currentSpeakerPositions.forEach(speaker => {
        if (speaker.isListeningPosition || !speakerRolesToOptimize.some(rolePrefix => speaker.id.startsWith(rolePrefix) || speaker.id === rolePrefix)) {
            return; // Skip LP and non-optimizable speakers (e.g., Atmos for this simplified version)
        }

        let speakerRoleKey = null;
        if (speaker.id.startsWith('fl') || speaker.id.startsWith('fr')) speakerRoleKey = 'front';
        else if (speaker.id === 'c') speakerRoleKey = 'center';
        else if (speaker.id.startsWith('sl') || speaker.id.startsWith('sr')) speakerRoleKey = 'surround';
        else if (speaker.id.startsWith('sbl') || speaker.id.startsWith('sbr')) speakerRoleKey = 'rear';

        if (!speakerRoleKey) return;

        let inBadZoneX = false;
        let inBadZoneY = false;

        // Check against width modes (X-coordinate)
        modes.width.forEach(mode => {
            if (isInPressureZone(speaker.x, width, mode.order)) {
                inBadZoneX = true;
            }
        });

        // Check against length modes (Y-coordinate)
        modes.length.forEach(mode => {
            if (isInPressureZone(speaker.y, length, mode.order)) {
                inBadZoneY = true;
            }
        });

        if (inBadZoneX || inBadZoneY) {
            // If in a bad zone, try to nudge the multiplier.
            // This is a very naive nudge. A better approach would calculate the ideal direction.
            // Nudge factor: try to decrease distance first, then increase if still bad or was already min.
            const currentMultiplier = newAdjustments[speakerRoleKey] || 1.0;
            let potentialMultiplier = currentMultiplier * 0.9; // Try decreasing distance

            if (potentialMultiplier < 0.5) { // If decreasing goes below min, try increasing
                potentialMultiplier = Math.min(currentMultiplier * 1.1, 2.0);
            }

            // Check if new multiplier is different and within bounds
            if (Math.abs(potentialMultiplier - currentMultiplier) > 0.01 && potentialMultiplier >= 0.5 && potentialMultiplier <= 2.0) {
                // Here, we would ideally re-calculate the speaker's new tentative position with potentialMultiplier
                // and re-check isInPressureZone. This requires access to calculateSpeakerPositions or its core logic.
                // For this simplified version, we'll just apply the nudge.
                // A more robust solution needs an iterative check or a more intelligent nudge.
                newAdjustments[speakerRoleKey] = parseFloat(potentialMultiplier.toFixed(2));
            }
        }
    });

    return newAdjustments;
};
