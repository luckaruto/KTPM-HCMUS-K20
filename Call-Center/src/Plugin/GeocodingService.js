import axios from 'axios';

class GeocodingService {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async getCoordinateResponse(address) {
        console.log("Định vị bằng GeocodingService:");
        // console.log(`${this.apiKey}`);
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${this.apiKey}`;
        // console.log(apiUrl);
        const response = await axios.get(apiUrl);
        return response.data;
    }
}

export default GeocodingService;




