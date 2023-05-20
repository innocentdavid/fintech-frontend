

import axios from 'axios'
import React from 'react'
import Application from '../../components/application'
import { parseCookies } from 'nookies'

const API = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/submittedApplications/`,
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

    return (

        <div className='w-[90%] mx-auto rounded-lg mt-[60px]'>
            
            {application && <Application
                application={application}
                defaultPdfs={pdfs}
                fundersResponse={fundersResponse}
                submittedApplications={submittedApplications}
                page={true}
            />}

        </div>
    )
}

export default ApplicationDetail


export async function getServerSideProps(context) {
    // const cookies = context.req.cookies; 
    const cookies = parseCookies(context)
    const appRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/submittedApplications/${context.params.applicationId}/`, {
        headers: {
            //  'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies['jwt']}`
        },
        withCredentials: true,
    }).catch(err => { console.log(err) });

    const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/submittedApplications/${appRes?.data?.application_id}/pdfs/`
    const response = await axios.get(baseUrl, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies['jwt']}`
        },
        withCredentials: true,
    }).catch(err => { console.log(err) });

    return {
        props: {
            application: appRes.data ?? {},
            pdfs: response?.data ?? [],
            fundersResponse: [],
            submittedApplications: [],
        }
    };
}