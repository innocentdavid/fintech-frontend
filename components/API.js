import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:8000/applications/',
    // baseURL: 'http://localhost:8000/movies/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})