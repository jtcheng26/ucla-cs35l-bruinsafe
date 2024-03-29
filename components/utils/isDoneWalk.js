import { dist } from "./isOutsidePath";

const END_WALK_THRESHOLD = 0.00001;
export default function isDoneWalk(coords, path) {
  return (
    dist(coords, path.coordinates[path.coordinates.length - 1]) <=
    END_WALK_THRESHOLD
  );
}
