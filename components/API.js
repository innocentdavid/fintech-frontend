import axios from 'axios';

export default axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/applications/`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true
})