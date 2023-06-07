import { dist } from "./isOutsidePath";

export default function timeToDestination(currentLocation, pathArray) {
    if (pathArray) {
        const totalDistance = pathArray.distance;
        const totalDuration = Math.floor(pathArray.duration);
        const path = pathArray.legs[0].steps;
        let curMin = path[0];
        let dirSum = 0.0;
        let curDirSum = 0.0;
        path.forEach(element => {
            if (dist(currentLocation, {latitude: ((element.start_location.lat + element.end_location.lat) / 2), longitude: ((element.start_location.lng + element.end_location.lng) / 2)}) < dist(currentLocation, {latitude: ((curMin.start_location.lon + curMin.end_location.lon) / 2), longitude: ((curMin.start_location.lng + curMin.end_location.lng) / 2)})) {
                curMin = element;
                dirSum = curDirSum;
            }
            curDirSum += element.duration.value / 60;
        });
        return ((totalDistance - dirSum) / totalDistance) * totalDuration;
    }
}