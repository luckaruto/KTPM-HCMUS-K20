import axios from 'axios';
const api = axios.create({
	baseURL: `https://ktpm-k20-hcmus.onrender.com/api`,
});

export default api