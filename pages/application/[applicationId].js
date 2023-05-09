

import axios from 'axios'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import API from '../../components/API';
import Application from '../../components/applicatiom'


const ApplicationDetail = () => {
    const router = useRouter();
    const { applicationId } = router.query;
    console.log(applicationId);
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

    console.log(application);

    return (

        <div className='w-[90%] mx-auto rounded-lg mt-[60px]'>

            {application && <Application application={application} />}

        </div>
    )
}

export default ApplicationDetail

// const API = axios.create({
//     baseURL: 'http://localhost:8000/applications/',
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//     }
// })

// export async function getStaticProps({ params }) {
//     const applicationId = params.applicationId
//     const res = await API.get(`/${applicationId}/`)

//     return {
//         props: {
//             data: res.data
//         },
//         revalidate: 60
//     }
// }

// export async function getStaticPaths() {
//     const allApplications = await API.get("/")
//     return {
//         paths:
//             allApplications.data?.map((application) => ({
//                 params: {
//                     applicationId: application?.application_id,
//                 },
//             })) || [],
//         fallback: true,
//     }
// }