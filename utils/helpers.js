import axios from "axios";

const API = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

export const handleLogout = async () => {
    try {
        const response = await API.post('api/logout/',{})
        // console.log(response);
        return {message: 'success', response}
    } catch (error) {
        console.log(error);
        return error
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

export function formatNumber(number) {
    const million = 1000000;
    const billion = 1000000000;
    if (number >= billion) {
        return (number / billion).toFixed(1) + 'B';
    } else if (number >= million) {
        return (number / million).toFixed(1) + 'M';
    } else {
        return number?.toLocaleString() ?? 0;
    }
}

export function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
}