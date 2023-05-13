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
    }
}

export function minMaxValidator(v, min, max) {
    const value = v.split("");
    if (value.length >= min && value.length <= max) {
        return true;
    }
    return false;
}

export function scrollToInput(name) {
    const input = document.querySelector(`input[name="${name}"]`);
    if (input) {
        input.scrollIntoView({ behavior: "smooth" });
    }
}