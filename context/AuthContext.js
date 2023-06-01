import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import { getCookie, handleLogout } from '../utils/helpers';
import LoadingModal from '../components/LoadingModal ';
import { useRouter } from 'next/router';
import API from '../components/API';
import { destroyCookie, setCookie } from 'nookies';
import AlertModal from '../components/AlertModal';

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
    const [errorMsg, setErrorMsg] = useState({title:'Alert', message: 'something went wrong'})
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/getcurrentuser/`, {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${getCookie('jwt')}`,
                },
                withCredentials: true
            }).catch(error => {
                console.log(error);
                if (error?.message === "Network Error") {
                    // alert("Network Error, please check if the backend is running...")
                    setErrorMsg({ title: 'Alert', message: "Network Error, please check if the backend is running..." })
                    handleOpenModal()
                    return;
                }
            });

            if (response?.data.message === 'success') {
                setUser(response?.data);
                setIsAuthenticated(true)
            } else {
                setUser(null);
                setIsAuthenticated(false)
                if (checkAuth && !response?.data) {
                    router.push('/login')
                }
            }
        };
        fetch()
    }, [checkAuth, refreshUser, router])

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

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
            console.log(err);
            // alert('something went wrong')
            setErrorMsg({ title: 'Alert', message: "something went wrong: "+err?.message})
            handleOpenModal()
            setLoading(false)
            return;
        });

        if (response?.status === 200) {
            const data = await response.json();
            // console.log(data);
            if (data?.message && data?.message !== "Login successful.") {
                alert(data?.message)
                setLoading(false)
                setIsAuthenticated(false)
                setRefreshUser(!refreshUser)
                return;
            }

            // console.log(data);

            if (data?.message === 'Login successful.') {
                const expirationDate = new Date(data?.expiration_time ? data?.expiration_time*1000 : '');
                document.cookie = `jwt=${data.token}; expires=${expirationDate.toUTCString()}; path=/;`;
                setLoading(false)
                // setRefreshUser(!refreshUser)
                setUser(data?.user)
                setIsAuthenticated(true)
                router.push('/')
                return response
            }
        } else {
            const error = await response?.json();
            console.log(error);
            // error?.message && alert(error?.message);
            let errMsg = error?.message
            setErrorMsg({ title: 'Authentication Error', message: errMsg })
            errMsg && handleOpenModal()
            setLoading(false)
            setIsAuthenticated(false)
            setRefreshUser(!refreshUser)
            return error;
        }
        setLoading(false)
    };

    const logout = async () => {
        if (!window.confirm('Are you sure you want to log out')) return;
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
            // console.log(data);
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
            // console.log(error);
            alert(error.message);
            setLoading(false)
            return;
        }
        setLoading(false)
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, login, logout, refreshUser, setRefreshUser }}
        >
            {loading && < LoadingModal loading={loading} />}
            <AlertModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={errorMsg?.title}
                message={errorMsg?.message}
            />
            {children}
        </AuthContext.Provider>
    );
};
