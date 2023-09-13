const calculateDrivingDistance = async (origin, destination, callback) => {
  const originLat = origin.lat;
  const originLng = origin.lng;
  const destinationLat = destination.lat;
  const destinationLng = destination.lng;

  const originStr = `${originLat},${originLng}`;
  const destinationStr = `${destinationLat},${destinationLng}`;

  const url = `https://maps.googleapis.com/maps/api/directions/json?units=imperial&origin=${originStr}&destination=${destinationStr}&key=AIzaSyA3I9U2vrkhKwLoziKmNEXbzUcXdXOw630`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "OK" && data.routes.length > 0) {
        const distanceInMeters = data.routes[0].legs[0].distance.value;
        const distanceInKilometers = distanceInMeters / 1000;

        callback(null, distanceInKilometers);
      } else {
        callback(`Error getting directions: ${data.status}`);
      }
    })
    .catch((error) => {
      callback(`Error: ${error}`);
    });
};
export default calculateDrivingDistance;
