export function dist(a, b) {
  return Math.sqrt(
    (a.latitude - b.latitude) * (a.latitude - b.latitude) +
    (a.longitude - b.longitude) * (a.longitude - b.longitude)
  );
}

const MAX_SAFE_DIST = 0;

export default function isOutsidePath(location, path) {
  const pathDist = path.coordinates.slice(1).reduce((x, coord) => {
    return Math.min(x, dist(location, coord));
  }, dist(location, path.coordinates[0]));
  console.log("User is", pathDist, "away from path");
  return pathDist > MAX_SAFE_DIST;
}
