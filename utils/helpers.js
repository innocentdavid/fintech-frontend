import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json',
        // withCredentials: true
    },
})

export const handleLogout = async () => {
    try {
        const response = await API.post('api/logout/',{})
        console.log(response);
    } catch (error) {
        console.log(error);
        // alert('Unthenticated!')
        // router.push('login')
    }
}