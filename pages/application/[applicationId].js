

import axios from 'axios'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import API from '../../components/API';
import Application from '../../components/applicatiom'


const ApplicationDetail = () => {
    const router = useRouter();
    const { applicationId } = router.query;
    const [application, setApplication] = useState([])

    useEffect(() => {
        if (!applicationId) return;
        const refreshMovies = async () => {
            await API.get(`/${applicationId}/`)
                .then((res) => {
                    setApplication(res.data)
                })
                .catch(console.error);
        };
        if (applicationId) {
            refreshMovies()
        }
    }, [applicationId])

    return (

        <div className='w-[90%] mx-auto rounded-lg mt-[60px]'>

            {application && <Application application={application} />}

        </div>
    )
}

export default ApplicationDetail