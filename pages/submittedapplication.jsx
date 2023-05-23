


// import styles from '../styles/Home.module.css'
import Table from '../components/table'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import LoadingModal from '../components/LoadingModal ';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import { getCookie } from '../utils/helpers';

const API = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/submittedApplications/`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

export default function Home({data}) {
// export default function Home() {
//     const data = []
    const [applications, setApplications] = useState(data)
    const [applicationsLoading, setApplicationsLoading] = useState(false)
    const router = useRouter()
    const { user, refreshUser, setRefreshUser } = useContext(AuthContext);
    useEffect(() => {
        if (!user) {
            setRefreshUser(refreshUser)
            const token = getCookie('jwt')
            // console.log(token);
            if (!token) {
                router.push('/login')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshUser, user])  

    useEffect(() => {
        const fetch = async () => {
            await API.get("/")
                .then((res) => {
                    setApplications(res?.data)
                    // console.log(res?.data)
                })
                .catch(console.error);
            setApplicationsLoading(false)
        };
        const intervalId = setInterval(fetch, 60000);

        // Clean up interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [])

    if (!user) { return (<></>) }
    
    return (<>
        <div className="w-full my-[10px] px-5">
            <h1 className="text-center font-bold text-2xl my-10">All Submitted Applications</h1>
            <Table data={applications} page='submittedapplication' applicationsLoading={applicationsLoading} />
        </div>
    </>

    )
}


export async function getServerSideProps(context) {
    // const cookies = context.req.cookies;
    const cookies = parseCookies(context)
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/submittedApplications/`, {
        headers: {
            "Content-Type": 'application/json',
            'Authorization': `Bearer ${cookies['jwt']}`
        },
        withCredentials: true
    }).catch(err => {
        console.log(err);
    });

    return {
        props: {
            data: res?.data ?? [],
        },
    };
}