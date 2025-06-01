// Utility functions for various acoustic calculations

/**
 * Calculates the coordinates of first reflection points on walls, floor, and ceiling.
 * This is a simplified 2D/pseudo-3D approach for now.
 * Assumes a rectangular room and direct line-of-sight.
 *
 * @param {object} roomDimensionsMeters - { width, length, height } in meters.
 * @param {object} speakerPosition - { x, y, z } coordinates of the speaker in meters. 'z' is height from floor.
 * @param {object} listenerPosition - { x, y, z } coordinates of the listener in meters. 'z' is listener ear height from floor.
 * @returns {object} An object containing arrays of reflection points for each surface.
 *                   e.g., { floor: [{x,y}], leftWall: [{x,y}], frontWall: [{x,y}], ... }
 *                   Coordinates are in the 2D top-down plane for walls, or relevant plane for floor/ceiling.
 */
export const calculateFirstReflectionPoints = (roomDimensionsMeters, speakerPosition, listenerPosition) => {
  const points = {
    floor: [],
    ceiling: [],
    leftWall: [], // y-z plane view, x is distance along wall
    rightWall: [],
    frontWall: [], // x-z plane view, y is distance along wall
    rearWall: [],
  };

  if (!roomDimensionsMeters || !speakerPosition || !listenerPosition) {
    return points;
  }

  const { width: W, length: L, height: H } = roomDimensionsMeters;
  const { x: sx, y: sy, z: sz } = speakerPosition; // Speaker coords
  const { x: lx, y: ly, z: lz } = listenerPosition; // Listener coords

  // Floor reflection point (top-down x,y projection)
  // Using image source method: reflect listener across the floor (z becomes -lz)
  // Line from speaker to reflected listener intersects floor at reflection point.
  // Floor is at z=0.
  if (sz !== lz) { // Avoid division by zero if speaker and listener are at same height for floor/ceiling
    const tFloor = sz / (sz + lz); // Ratio for interpolation (assuming lz is positive, sz is positive)
    points.floor.push({
      x: sx + (lx - sx) * tFloor,
      y: sy + (ly - sy) * tFloor,
      surface: 'Floor',
    });
  }


  // Ceiling reflection point (top-down x,y projection)
  // Reflect listener across ceiling (z becomes H + (H-lz) = 2H-lz)
  if ((H-sz) !== (H-lz)) { // Check if speaker and listener are at same distance from ceiling
    const tCeiling = (H - sz) / ((H - sz) + (H - lz));
    points.ceiling.push({
      x: sx + (lx - sx) * tCeiling,
      y: sy + (ly - sy) * tCeiling,
      surface: 'Ceiling',
    });
  }


  // Left Wall reflection point (y,z projection on the wall at x=0)
  // Reflect listener across left wall (x becomes -lx)
  if (sx !== lx) {
    const tLeft = sx / (sx + lx);
    points.leftWall.push({
      y: sy + (ly - sy) * tLeft, // This is the 'horizontal' position along the wall length
      z: sz + (lz - sz) * tLeft, // This is the 'vertical' position on the wall
      surface: 'Left Wall',
    });
  }

  // Right Wall reflection point (y,z projection on the wall at x=W)
  // Reflect listener across right wall (x becomes W + (W-lx) = 2W-lx)
  if ((W-sx) !== (W-lx)) {
    const tRight = (W - sx) / ((W - sx) + (W - lx));
    points.rightWall.push({
      y: sy + (ly - sy) * tRight,
      z: sz + (lz - sz) * tRight,
      surface: 'Right Wall',
    });
  }

  // Front Wall reflection point (x,z projection on the wall at y=0)
  // Reflect listener across front wall (y becomes -ly)
  if (sy !== ly) {
    const tFront = sy / (sy + ly);
    points.frontWall.push({
      x: sx + (lx - sx) * tFront,
      z: sz + (lz - sz) * tFront,
      surface: 'Front Wall',
    });
  }
  
  // Rear Wall reflection point (x,z projection on the wall at y=L)
  // Reflect listener across rear wall (y becomes L + (L-ly) = 2L-ly)
  if ((L-sy) !== (L-ly)) {
    const tRear = (L - sy) / ((L - sy) + (L - ly));
    points.rearWall.push({
      x: sx + (lx - sx) * tRear,
      z: sz + (lz - sz) * tRear,
      surface: 'Rear Wall',
    });
  }

  return points;
};

// Note: For visualization in a 2D top-down view, only x,y of floor/ceiling points are directly usable.
// For wall points, the (y,z) or (x,z) are coordinates ON THE WALL surface.
// Visualizing these on the 2D floor plan requires projecting them or using icons on the walls.
