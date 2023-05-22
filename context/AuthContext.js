import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { getCookie, handleLogout } from '../utils/helpers';
import LoadingModal from '../components/LoadingModal ';
import { useRouter } from 'next/router';
import API from '../components/API';
import { destroyCookie, setCookie } from 'nookies';

const APIN = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/`,
    headers: {
        'Content-Type': 'application/json',
    },
    // credentials: 'include',
    withCredentials: true
})

export const AuthContext = createContext({
    isAuthenticated: false,
    user: null,
    login: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }) => {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false)
    const [refreshUser, setRefreshUser] = useState(false)
    const checkAuth = router.route !== "/login" || router.route === "/register";

    useEffect(() => {
        const fetch = async () => {
            // console.log("getCookie('jwt'):  ");
            // console.log(getCookie('jwt'));
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/getcurrentuser/`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${getCookie('jwt')}`,
                },
                withCredentials: true
            }).catch(error => {
                console.log(error);
                if (error?.message === "Network Error") {
                    alert("Network Error, please check if the backend is running...")
                }
            });
            
            console.log(response);
            
            if (response?.data.message === 'success') {
                setUser(response?.data);
                setIsAuthenticated(true)
            } else {
                setUser(null);
                setIsAuthenticated(false)
                if (checkAuth && !response?.data){
                    router.push('/login')
                }
            }
        };
        fetch()
    }, [checkAuth, refreshUser, router])

    const login = async (formData) => {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
        }).catch(err => {
            alert('something went wrong')
            setLoading(false)
        });
        
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            if (data?.message && data?.message !== "Login successful.") {
                alert(data?.message)
                setLoading(false)
                setIsAuthenticated(false)
                setRefreshUser(!refreshUser)
                return;
            }
            
            console.log(data);

            if (data?.message === 'Login successful.') {
                const expirationDate = new Date();
                expirationDate.setHours(expirationDate.getHours() + 23);
                expirationDate.setMinutes(expirationDate.getMinutes() + 50);
                document.cookie = `jwt=${data.token}; expires=${expirationDate.toUTCString()}; path=/;`;
                setLoading(false)
                // setRefreshUser(!refreshUser)
                setUser(data?.user)
                setIsAuthenticated(true)
                router.push('/')
                return response
            }
        } else {
            const error = await response.json();
            console.log(error);
            alert(error.message);
            setLoading(false)
            setIsAuthenticated(false)
            setRefreshUser(!refreshUser)
            return error;
        }
        setLoading(false)
    };

    const logout = async () => {
        setLoading(true)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/logout/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: "logout" }),
            credentials: "include",
        });
        // console.log(response);
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            setLoading(false)
            setUser(null)
            setCookie({}, 'jwt', '', { expires: new Date(0) })
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            // To delete a cookie on the client side
            destroyCookie(null, 'jwt');
            // To delete a cookie on the server side
            destroyCookie({ response }, 'jwt');
            setIsAuthenticated(false)
            router.push('/login')
        } else {
            const error = await response.json();
            console.log(error);
            alert(error.message);
            setLoading(false)
        }
        setLoading(false)
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, login, logout, refreshUser, setRefreshUser }}
        >
            {loading && < LoadingModal loading={loading} />}
            {children}
        </AuthContext.Provider>
    );
};
