

import axios from 'axios'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Application from '../../components/application'
import LoadingModal from '../../components/LoadingModal ';

const API = axios.create({
    baseURL: 'http://localhost:8000/submittedApplications/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

const ApplicationDetail = () => {
    const router = useRouter();
    const { applicationId } = router.query;
    const [application, setApplication] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!applicationId) return;
        const fetch = async () => {
            await API.get(`/${applicationId}/`)
                .then((res) => {
                    setApplication(res.data)
                })
                .catch(console.error);
        };
        if (applicationId) {
            fetch()
        }
        setLoading(false)
    }, [applicationId])

    return (

        <div className='w-[90%] mx-auto rounded-lg mt-[60px]'>
            <LoadingModal loading={loading} />

            {application && <Application page={'sa'} application={application} />}

        </div>
    )
}

export default ApplicationDetail