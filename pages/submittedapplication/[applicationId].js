

import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import Application from '../../components/application'
import { parseCookies } from 'nookies'
import { useRouter } from 'next/router'
import { AuthContext } from '../../context/AuthContext'
import { getCookie } from '../../utils/helpers'

const API = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/submittedApplications/`,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

const ApplicationDetail = ({ application, pdfs, fundersResponse, submittedApplications }) => {
    // const ApplicationDetail = () => {
    //     const application = {}
    //     const pdfs = []
    //     const fundersResponse = []
    //     const submittedApplications = []

    const router = useRouter()
    const { user, loading, refreshUser, setRefreshUser } = useContext(AuthContext);
    useEffect(() => {
        if (!user) {
            // router.push('/login')
            setRefreshUser(refreshUser)
            const token = getCookie('jwt')
            // console.log(token);
            if (!token) {
                router.push('/login')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshUser, user])
    if (!user) { return (<></>) }

    // console.log(application);

    return (

        <div className='w-[90%] mx-auto rounded-lg mt-[60px]'>

            {application?.application?.application_id ? <Application
                application={application}
                defaultPdfs={pdfs}
                fundersResponse={fundersResponse}
                submittedApplications={submittedApplications}
                page={true}
            /> : <div className='flex items-center gap-10'>No data found! <button className='py-1 px-6 rounded-lg bg-black text-white' onClick={() => { router.back() }}>Go back</button></div>}

        </div>
    )
}

export default ApplicationDetail


export async function getServerSideProps(context) {
    // const cookies = context.req.cookies; 
    const cookies = parseCookies(context)
    const appRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/submittedApplications/${context.params.applicationId}/`, {
        headers: {
            // 'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies['jwt']}`
        },
        withCredentials: true,
    }).catch(err => {
        if (err?.response.data?.message === "Signature has expired!") {
            return err?.response.data?.message
        }
        console.log("err: ");
        console.log(err);
    });

    if (appRes === "Signature has expired!") {
        return {
            redirect: {
                destination: '/login',
                permanent: false, // Set to true if the redirect is permanent (HTTP 301)
            },
        };
    }

    const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/applications/${appRes?.data?.application?.application_id}/pdfs/`
    const response = await axios.get(baseUrl, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies['jwt']}`
        },
        withCredentials: true,
    }).catch(err => {
        // console.log(err)
    });

    return {
        props: {
            application: appRes?.data ?? {},
            pdfs: response?.data ?? [],
            fundersResponse: [],
            submittedApplications: [],
        }
    };
}