// Utility functions for power and SPL calculations

/**
 * Calculates the volume of the room.
 * @param {object} roomDimensionsMeters - { width, length, height } in meters.
 * @returns {number} Room volume in cubic meters.
 */
export const calculateRoomVolume = (roomDimensionsMeters) => {
  if (!roomDimensionsMeters) return 0;
  return roomDimensionsMeters.width * roomDimensionsMeters.length * roomDimensionsMeters.height;
};

/**
 * Estimates the required amplifier power per channel.
 * This is a simplified calculation and can be expanded.
 * @param {number} speakerSensitivity - dB/1W/1m.
 * @param {number} listeningDistanceMeters - Distance from listener to speaker in meters.
 * @param {number} targetSPL - Desired Sound Pressure Level at listening position in dB.
 * @param {number} headroomDb - Desired headroom for peaks in dB (e.g., 3dB for doubling power).
 * @returns {number} Estimated power in Watts.
 */
export const calculateRequiredPower = (speakerSensitivity, listeningDistanceMeters, targetSPL, headroomDb = 3) => {
  if (!speakerSensitivity || !listeningDistanceMeters || !targetSPL) return 0;

  // SPL loss over distance: 20 * log10(distance)
  // For 1m, loss is 0. For 2m, loss is ~6dB. For 4m, loss is ~12dB.
  const splLossAtDistance = 20 * Math.log10(listeningDistanceMeters); // distance relative to 1m reference

  // Power needed to achieve targetSPL at 1m before distance loss and headroom
  // SPL = Sensitivity + 10 * log10(Power)
  // targetSPL_at_1m = targetSPL + splLossAtDistance
  // 10 * log10(Power) = targetSPL_at_1m - Sensitivity
  // log10(Power) = (targetSPL_at_1m - Sensitivity) / 10
  // Power = 10 ^ ((targetSPL_at_1m - Sensitivity) / 10)
  
  const targetSPLWithHeadroom = targetSPL + headroomDb;
  const splNeededAt1m = targetSPLWithHeadroom + splLossAtDistance;
  
  const power = Math.pow(10, (splNeededAt1m - speakerSensitivity) / 10);
  return power;
};

/**
 * Estimates the maximum SPL achievable at a given distance.
 * @param {number} speakerSensitivity - dB/1W/1m.
 * @param {number} amplifierPowerWatts - Amplifier power per channel in Watts.
 * @param {number} listeningDistanceMeters - Distance from listener to speaker in meters.
 * @returns {number} Estimated maximum SPL in dB.
 */
export const calculateMaxSPL = (speakerSensitivity, amplifierPowerWatts, listeningDistanceMeters) => {
  if (!speakerSensitivity || !amplifierPowerWatts || !listeningDistanceMeters) return 0;

  // SPL gain from power: 10 * log10(Power)
  const splGainFromPower = 10 * Math.log10(amplifierPowerWatts);
  
  // SPL loss over distance: 20 * log10(distance)
  const splLossAtDistance = 20 * Math.log10(listeningDistanceMeters);

  // Max SPL at listening position = Sensitivity + SPL gain from power - SPL loss from distance
  const maxSPL = speakerSensitivity + splGainFromPower - splLossAtDistance;
  return maxSPL;
};

/**
 * Estimates the total power draw of the system.
 * This is a very rough estimation.
 * @param {object} avr - The selected AVR object (needs a 'typicalPowerConsumptionW' field).
 * @param {object} display - The selected Display object (needs a 'typicalPowerConsumptionW' field).
 * @param {number} numberOfChannelsDriven - How many channels are actively driven by AVR.
 * @param {number} averagePowerPerChannelWatts - Average power being delivered per channel.
 * @returns {number} Estimated total power draw in Watts.
 */
export const estimateTotalPowerDraw = (avr, display, numberOfChannelsDriven = 5, averagePowerPerChannelWatts = 20) => {
  let totalPower = 0;

  // AVR Power Consumption:
  // A very rough estimate: (Number of channels * Average power output / Efficiency) + Standby/Idle power
  // Or, if we have a 'typicalPowerConsumptionW' field in avr.json:
  if (avr && avr.typicalPowerConsumptionW) {
    totalPower += avr.typicalPowerConsumptionW;
  } else if (avr && avr.power) { // Fallback to a rough estimate based on rated power
    const avrPowerMatch = avr.power.match(/(\d+(\.\d+)?)/);
    const avrRatedPowerWatts = avrPowerMatch ? parseFloat(avrPowerMatch[1]) : 0;
    // Assume 50% efficiency and 1/8th of rated power for typical use for driven channels + idle
    totalPower += (numberOfChannelsDriven * averagePowerPerChannelWatts / 0.5) + 50; // 50W idle/base for AVR
  } else {
    totalPower += 150; // Generic placeholder if no AVR data
  }

  // Display Power Consumption:
  if (display && display.typicalPowerConsumptionW) {
    totalPower += display.typicalPowerConsumptionW;
  } else if (display && display.type === 'Projector') {
    totalPower += 300; // Generic projector
  } else if (display && display.type && display.type.includes('TV')) {
    totalPower += 150; // Generic TV
  } else {
    totalPower += 100; // Generic placeholder if no display data
  }
  
  // Add power for active speakers if any (not handled yet)
  // Add power for source components (Blu-ray player, streamer) - estimate 20-50W

  return Math.round(totalPower);
};
