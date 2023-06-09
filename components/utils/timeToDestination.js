import { dist } from "./isOutsidePath";

export function progressToDestination(currentLocation, pathArray) {
    if (pathArray) {
        const totalDistance = pathArray.distance;
        const totalDuration = Math.floor(pathArray.duration);
        const path = pathArray.legs[0].steps;
        let curMin = path[0];
        let dirSum = 0.0;
        let curDirSum = 0.0;
        const totalDist = pathArray.coordinates.reduce((prev, curr, i, a) => {
            return prev + (i > 0 ? dist(a[i-1], a[i]) : 0)
        }, 0)
        let closest = pathArray.coordinates.slice(1).reduce((prev, curr, i, a) => {
            if (dist(currentLocation, a[prev]) > dist(currentLocation, curr)) {
                return i
            }
            return prev
        }, 0)
        const dirDist = pathArray.coordinates.slice(0, closest + 1).reduce((sum, curr, i, a) => {
            if (i == 0) return 0
            return sum + dist(a[i-1], a[i])
        }, 0)
        return dirDist / totalDist
    }
    return 0
}

export default function timeToDestination(currentLocation, pathArray) {
    // if (pathArray) {
    //     const totalDistance = pathArray.distance;
    //     const totalDuration = Math.floor(pathArray.duration);
    //     const path = pathArray.legs[0].steps;
    //     let curMin = path[0];
    //     let dirSum = 0.0;
    //     let curDirSum = 0.0;
    //     path.forEach(element => {
    //         if (dist(currentLocation, {latitude: ((element.start_location.lat + element.end_location.lat) / 2), longitude: ((element.start_location.lng + element.end_location.lng) / 2)}) < dist(currentLocation, {latitude: ((curMin.start_location.lon + curMin.end_location.lon) / 2), longitude: ((curMin.start_location.lng + curMin.end_location.lng) / 2)})) {
    //             curMin = element;
    //             dirSum = curDirSum;
    //         }
    //         curDirSum += element.duration.value / 60;
    //     });
    //     return ((totalDistance - dirSum) / totalDistance) * totalDuration;
    // }
    if (pathArray) {
        const totalDistance = pathArray.distance;
        const totalDuration = Math.floor(pathArray.duration);
        const path = pathArray.legs[0].steps;
        let curMin = path[0];
        let dirSum = 0.0;
        let curDirSum = 0.0;
        const totalDist = pathArray.coordinates.reduce((prev, curr, i, a) => {
            return prev + (i > 0 ? dist(a[i-1], a[i]) : 0)
        }, 0)
        let closest = pathArray.coordinates.slice(1).reduce((prev, curr, i, a) => {
            if (dist(currentLocation, a[prev]) > dist(currentLocation, curr)) {
                return i
            }
            return prev
        }, 0)
        const dirDist = pathArray.coordinates.slice(0, closest + 1).reduce((sum, curr, i, a) => {
            if (i == 0) return 0
            return sum + dist(a[i-1], a[i])
        }, 0)
        const distLeft = totalDist - dirDist
        return Math.round((distLeft * 111.1) / 4.5 * 60)
    }
    return 10
}