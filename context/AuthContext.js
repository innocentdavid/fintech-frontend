import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { handleLogout } from '../utils/helpers';
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
            const response = await APIN.get('api/getcurrentuser/').catch(error => {
                console.log(error);
                if (error?.message === "Network Error") {
                    alert("Network Error, please check if the backend is running...")
                }
            })
            // if (response?.data?.message !== "success") { return; }
            // console.log(response?.data);
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
        });

        // console.log(response);
        // setLoading(false)
        // router.push('/')
        // return;
        
        if (response.status === 200) {
            const data = await response.json();
            console.log(data);
            if (data?.message && data?.message !== "Login successful.") {
                alert(data?.message)
                setLoading(false)
                setRefreshUser(!refreshUser)
                return;
            }

            // console.log(response);
            // setLoading(false)
            // return;

            setRefreshUser(!refreshUser)
            if (data?.message === 'Login successful.') {
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 1);
                document.cookie = `jwt=${data.token}; expires=${expirationDate.toUTCString()}; path=/;`;
                router.push('/')
                setLoading(false)
                return response
            }
        } else {
            const error = await response.json();
            console.log(error);
            alert(error.message);
            setLoading(false)
            setRefreshUser(!refreshUser)
            return error;
        }
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
        console.log(response);
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
            router.push('/login')
        } else {
            const error = await response.json();
            console.log(error);
            alert(error.message);
            setLoading(false)
        }
        // if (res.message) {
        //     setUser(null)
        //     router.push('/login')
        //     // setCookie({}, 'jwt', '', { expires: new Date(0) })
        //     // document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        //     // To delete a cookie on the client side
        //     // destroyCookie(null, 'jwt');

        //     // To delete a cookie on the server side
        //     // destroyCookie({ res }, 'jwt');

        // } else {
        //     alert('Something went wrong')
        // }
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
