import axios from 'axios';
import { getCookie } from '../utils/helpers';

export default axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/applications/`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        // "Authorization": `Bearer ${getCookie('jwt')}`,
    },
    withCredentials: true
})