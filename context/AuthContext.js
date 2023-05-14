import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { handleLogout } from '../utils/helpers';
import LoadingModal from '../components/LoadingModal ';
import { useRouter } from 'next/router';
import API from '../components/API';
import { destroyCookie, setCookie } from 'nookies';

const APIN = axios.create({
    baseURL: 'http://localhost:8000/',
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
            }else{
                setUser(null);
                setIsAuthenticated(false)                
            }
        };
        fetch()
    }, [refreshUser])

    const login = async (formData) => {
        setLoading(true)
        const response = await axios.post('http://localhost:8000/api/login/', formData, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }).catch((err => {
            console.log(err);
            setLoading(false)
        }))
        if (response?.data?.message && response?.data?.message !== "success") {
            alert(response.data.message)
            setLoading(false)
            return;
        }
        setRefreshUser(!refreshUser)
        response?.data && router.push('/')
        setLoading(false)
        return response
    };

    const logout = async () => {
        setLoading(true)
        const res = await handleLogout().catch(err => {
            console.log(err);
            setLoading(false)
        })
        if (res.message) {
            setUser(null)
            router.push('/login')
            // setCookie({}, 'jwt', '', { expires: new Date(0) })
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            // To delete a cookie on the client side
            destroyCookie(null, 'jwt');

            // To delete a cookie on the server side
            destroyCookie({ res }, 'jwt');

        } else {
            alert('Something went wrong')
        }
        setLoading(false)
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, login, logout }}
        >
            {loading && < LoadingModal loading={loading} />}
            {children}
        </AuthContext.Provider>
    );
};
