


// import styles from '../styles/Home.module.css'
import Table from '../components/table'
// import axios from 'axios';
// import API from '../components/API';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import LoadingModal from '../components/LoadingModal ';
import Nav from '../components/Nav';

const APIN = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json',
    },
    // credentials: 'include',
    withCredentials: true
})

const API = axios.create({
    baseURL: 'http://localhost:8000/submittedApplications/',
    headers: {
        'Content-Type': 'application/json',
    },
    // credentials: 'include',
    withCredentials: true
})

export default function Home() {
    const router = useRouter()
    const [user, setUser] = useState({
        email: '',
        name: ''
    })
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(false)
    const [applicationsLoading, setApplicationsLoading] = useState(true)

    useEffect(() => {
        const fetch = async () => {
            const response = await APIN.get('api/getcurrentuser/')
            setUser(response.data)
            // console.log(response);
            if (response.data.message !== "success") {
                router.push('/login')
                return;
            }
        };
        fetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
        const intervalId = setInterval(fetch, 10000);

        // Clean up interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [])

    return (<>
        {loading ? < LoadingModal loading={loading} /> : <>
            <Nav user={user} setUser={setUser} />
            <div className="w-full my-[10px] px-5">

                <h1 className="text-center font-bold text-2xl my-10">All Submitted Applications</h1>

                <Table data={applications} page='submittedapplication' applicationsLoading={applicationsLoading} />

            </div></>
        }
    </>

    )
}
