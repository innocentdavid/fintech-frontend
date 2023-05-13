


// import styles from '../styles/Home.module.css'
import Table from '../components/table'
import { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingModal from '../components/LoadingModal ';

const API = axios.create({
    baseURL: 'http://localhost:8000/submittedApplications/',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

export default function Home({data}) {
    const [applications, setApplications] = useState(data)
    const [applicationsLoading, setApplicationsLoading] = useState(false)

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

    return (<>
        <div className="w-full my-[10px] px-5">
            <h1 className="text-center font-bold text-2xl my-10">All Submitted Applications</h1>
            <Table data={applications} page='submittedapplication' applicationsLoading={applicationsLoading} />
        </div>
    </>

    )
}


export async function getServerSideProps(context) {
    const res = await axios.get('http://localhost:8000/submittedApplications/', {
        headers: {
            "Content-Type": 'application/json'
        }
    }).catch(err => {
        console.log(err);
    });

    return {
        props: {
            data: res?.data,
        },
    };
}