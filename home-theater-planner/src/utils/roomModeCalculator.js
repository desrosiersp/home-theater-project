// Utility functions for room mode calculations

const SPEED_OF_SOUND_MPS = 343; // Speed of sound in meters per second at approx. 20°C

/**
 * Calculates the first few axial modes for a given dimension.
 * @param {number} dimensionInMeters - The length, width, or height of the room in meters.
 * @param {string} dimensionName - 'Length', 'Width', or 'Height'.
 * @param {number} numModesToCalculate - How many modes to calculate for this dimension (e.g., 3).
 * @returns {Array<object>} Array of mode objects { dimensionName, order, frequency }.
 */
const getModesForDimension = (dimensionInMeters, dimensionName, numModesToCalculate = 3) => {
  const modes = [];
  if (dimensionInMeters <= 0) return modes;

  for (let n = 1; n <= numModesToCalculate; n++) {
    const frequency = (n * SPEED_OF_SOUND_MPS) / (2 * dimensionInMeters);
    modes.push({
      dimensionName,
      order: n,
      frequency: parseFloat(frequency.toFixed(1)), // Keep one decimal place
    });
  }
  return modes;
};

/**
 * Calculates the primary axial room modes.
 * @param {object} roomDimensionsMeters - { width, length, height } in meters.
 * @returns {{lengthModes: Array<object>, widthModes: Array<object>, heightModes: Array<object>}}
 */
export const calculateAxialModes = (roomDimensionsMeters) => {
  if (!roomDimensionsMeters) {
    return { lengthModes: [], widthModes: [], heightModes: [] };
  }
  const { width, length, height } = roomDimensionsMeters;

  const lengthModes = getModesForDimension(length, 'Length');
  const widthModes = getModesForDimension(width, 'Width');
  const heightModes = getModesForDimension(height, 'Height');

  return {
    lengthModes,
    widthModes,
    heightModes,
  };
};

// Example Usage:
// const dimensions = { width: 5, length: 6, height: 2.8 };
// const modes = calculateAxialModes(dimensions);
// console.log(modes);
