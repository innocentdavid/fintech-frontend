import axios from "axios";

const API = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

// export const getAuthenticatedUser = async () => {
//     const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/getcurrentuser/`, {
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         withCredentials: true
//     }).catch(error => {
//         // console.log(error);
//         if (error?.message === "Network Error") {
//             alert("Network Error, please check if the backend is running...")
//         }
//         return error
//     });

//     // console.log(response);

//     if (response?.data.message === 'success') {
//         const user =  response?.data;
//         return user
//     }
// }

export const handleLogout = async () => {
    try {
        const response = await API.post('api/logout/',{})
        // console.log(response);
        return {message: 'success', response}
    } catch (error) {
        // console.log(error);
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

export function getToday(date) {
    // const date = new Date();
    const year = date.getFullYear(); // e.g. 2022
    const month = date.getMonth() + 1; // months are zero-indexed, so add 1 to get the actual month number (e.g. 5 for May)
    const day = date.getDate(); // e.g. 28
    const hours = date.getHours(); // e.g. 13
    const minutes = date.getMinutes(); // e.g. 45
    const seconds = date.getSeconds(); // e.g. 20

    const today = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return today
}