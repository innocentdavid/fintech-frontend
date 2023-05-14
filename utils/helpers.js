import axios from "axios";

const API = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        // 'Content-Type': 'application/json',
        // withCredentials: true
    },
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
    // Check if the number is a string.
    if (typeof number === "string") {
        // Convert the string to a number.
        number = Number(number);
    }

    // Check if the number is a valid number.
    if (!isNaN(number)) {
        // Convert the number to a string with commas.
        return number.toString().replace(/(\d{3})(?=\d)/g, "$1,");
    } else {
        // Return the original number.
        return number;
    }
}

export function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
}