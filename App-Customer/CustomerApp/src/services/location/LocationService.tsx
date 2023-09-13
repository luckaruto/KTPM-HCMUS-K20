import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';

interface Coordinates {
  lat: number;
  lng: number;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}
export class LocationService {
  static getMyLocation = (): Promise<GeolocationResponse> => {
    const config = {enableHighAccuracy: true, timeout: 30000, maximumAge: 1000};
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve(position);
        },
        error => {
          reject(error.message);
        },
        config,
      );
    });
  };
  static async calculateDistance(
    origin: Coordinates,
    destination: Coordinates,
  ): Promise<number> {
    const originLat = origin.lat;
    const originLng = origin.lng;
    const destinationLat = destination.lat;
    const destinationLng = destination.lng;

    const originStr = `${originLat},${originLng}`;
    const destinationStr = `${destinationLat},${destinationLng}`;

    const apiKey = 'AIzaSyCOv0UiRLIxv-IbgnzKGZWJu5BBL-R91gg'; // Replace with your Google Maps API key
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destinationStr}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error getting directions: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'OK' && data.routes.length > 0) {
        const distanceInMeters = data.routes[0].legs[0].distance.value;
        const distanceInKilometers = distanceInMeters / 1000;

        return distanceInKilometers;
      } else {
        throw new Error(`Error getting directions: ${data.status}`);
      }
    } catch (error) {
      throw new Error(`Error`);
    }
  }

  // static getWatchLocation = (
  // 	onLocationChange: (position: GeolocationResponse) => void,
  // 	onError: (error: any) => void
  //   ): number => {
  // 	const config = { enableHighAccuracy: false, maximumAge: 1000 };

  // 	return Geolocation.watchPosition(
  // 	  onLocationChange,
  // 	  onError,
  // 	  config
  // 	);
  //   };
}
