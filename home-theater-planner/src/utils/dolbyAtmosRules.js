// Basic calculations for speaker placement (2D top-down view)

/**
 * Converts degrees to radians.
 * @param {number} degrees
 * @returns {number} Radians
 */
const toRadians = (degrees) => degrees * (Math.PI / 180);

/**
 * Calculates speaker positions for a given configuration.
 * For 2D top-down view. Assumes screen is on the 'top' wall (y=0).
 * Origin (0,0) is top-left corner of the room.
 * @param {object} roomDimensions - { width, length, height } in meters.
 * @param {string} configuration - e.g., "5.1", "7.1.4".
 * @returns {Array<object>} Array of speaker objects { id, label, x, y, angleDeg (optional for visualization) }
 */
export const calculateSpeakerPositions = (roomDimensions, configuration) => {
  const { width, length } = roomDimensions;
  const speakers = [];

  // Ideal Listening Position (LP)
  // Centered horizontally, about 2/3rds down from the front wall (y=0)
  const lpX = width / 2;
  const lpY = length * 0.66; // 66% of room length from front wall

  // Nominal distance from LP to front speakers (can be refined)
  // This is a simplification; true distance depends on many factors.
  // Let's use a fraction of the room width or a fixed distance if room is large.
  const frontSpeakerDistance = Math.min(width * 0.35, length * 0.35, 2.5); // e.g. 35% of width/length or max 2.5m

  // Subwoofer (LFE) - placement is flexible.
  // For visualization, let's place it near the front center or a corner.
  // Example: Front center, slightly offset.
  speakers.push({ id: 'lfe', label: 'LFE', x: width * 0.25, y: length * 0.05 });


  if (configuration.startsWith("2.0") || configuration.startsWith("2.1") || configuration.startsWith("3.") || configuration.startsWith("5.") || configuration.startsWith("7.")) {
    // Front Left (FL)
    const flAngleRad = toRadians(-30); // -22 to -30 degrees
    speakers.push({
      id: 'fl',
      label: 'FL',
      x: lpX + frontSpeakerDistance * Math.sin(flAngleRad),
      y: lpY - frontSpeakerDistance * Math.cos(flAngleRad), // y decreases as we move towards front wall
      angleDeg: -30
    });

    // Front Right (FR)
    const frAngleRad = toRadians(30); // +22 to +30 degrees
    speakers.push({
      id: 'fr',
      label: 'FR',
      x: lpX + frontSpeakerDistance * Math.sin(frAngleRad),
      y: lpY - frontSpeakerDistance * Math.cos(frAngleRad),
      angleDeg: 30
    });
  }

  if (configuration.startsWith("3.") || configuration.startsWith("5.") || configuration.startsWith("7.")) {
    // Center (C)
    speakers.push({
      id: 'c',
      label: 'C',
      x: lpX,
      y: lpY - frontSpeakerDistance, // Directly in front of LP
      angleDeg: 0
    });
  }
  
  // For 5.1, 7.1 configurations (surrounds)
  if (configuration.startsWith("5.") || configuration.startsWith("7.")) {
    const surroundSpeakerDistance = Math.min(width * 0.3, length * 0.2, 2); // Slightly closer than fronts

    // Surround Left (SL)
    const slAngleRad = toRadians(-110); // -90 to -110 degrees
    speakers.push({
      id: 'sl',
      label: 'SL',
      x: lpX + surroundSpeakerDistance * Math.sin(slAngleRad),
      y: lpY - surroundSpeakerDistance * Math.cos(slAngleRad),
      angleDeg: -110
    });

    // Surround Right (SR)
    const srAngleRad = toRadians(110); // +90 to +110 degrees
    speakers.push({
      id: 'sr',
      label: 'SR',
      x: lpX + surroundSpeakerDistance * Math.sin(srAngleRad),
      y: lpY - surroundSpeakerDistance * Math.cos(srAngleRad),
      angleDeg: 110
    });
  }

  // For 7.1 configurations (rear/back surrounds)
  if (configuration.startsWith("7.")) {
    const rearSpeakerDistance = Math.min(width * 0.25, length * 0.15, 1.8);

    // Surround Back Left (SBL) / Rear Left (RL)
    const sblAngleRad = toRadians(-150); // -135 to -150 degrees
    speakers.push({
      id: 'sbl',
      label: 'SBL',
      x: lpX + rearSpeakerDistance * Math.sin(sblAngleRad),
      y: lpY - rearSpeakerDistance * Math.cos(sblAngleRad),
      angleDeg: -150
    });

    // Surround Back Right (SBR) / Rear Right (RR)
    const sbrAngleRad = toRadians(150); // +135 to +150 degrees
    speakers.push({
      id: 'sbr',
      label: 'SBR',
      x: lpX + rearSpeakerDistance * Math.sin(sbrAngleRad),
      y: lpY - rearSpeakerDistance * Math.cos(sbrAngleRad),
      angleDeg: 150
    });
  }

  // Placeholder for Atmos height channels (e.g., Top Middle, Top Front, Top Rear)
  // For 2D view, these might be represented differently or just noted.
  // Example for 5.1.2 (Top Middle) - conceptually placed above LP
  if (configuration.includes(".2")) { // e.g., 5.1.2, 7.1.2
     speakers.push({ id: 'tml', label: 'TML', x: lpX - width * 0.1, y: lpY, note: 'Height Channel' });
     speakers.push({ id: 'tmr', label: 'TMR', x: lpX + width * 0.1, y: lpY, note: 'Height Channel' });
  }
  if (configuration.includes(".4")) { // e.g., 5.1.4, 7.1.4
    // Top Front Left/Right
    speakers.push({ id: 'tfl', label: 'TFL', x: lpX - width*0.15, y: lpY - length*0.1, note: 'Height Channel (Front)' });
    speakers.push({ id: 'tfr', label: 'TFR', x: lpX + width*0.15, y: lpY - length*0.1, note: 'Height Channel (Front)' });
    // Top Rear Left/Right
    speakers.push({ id: 'trl', label: 'TRL', x: lpX - width*0.15, y: lpY + length*0.1, note: 'Height Channel (Rear)' });
    speakers.push({ id: 'trr', label: 'TRR', x: lpX + width*0.15, y: lpY + length*0.1, note: 'Height Channel (Rear)' });
  }
  
  // Add listening position for visualization
  speakers.push({ id: 'lp', label: 'LP', x: lpX, y: lpY, isListeningPosition: true });

  // Ensure speakers are within room boundaries (simple clamping)
  return speakers.map(sp => ({
    ...sp,
    x: Math.max(0.1, Math.min(sp.x, width - 0.1)), // Keep a small margin
    y: Math.max(0.1, Math.min(sp.y, length - 0.1)),
  }));
};

// Example usage:
// const dimensions = { width: 5, length: 6, height: 2.8 };
// const positions51 = calculateSpeakerPositions(dimensions, "5.1");
// console.log("5.1 Positions:", positions51);
// const positions714 = calculateSpeakerPositions(dimensions, "7.1.4");
// console.log("7.1.4 Positions:", positions714);
