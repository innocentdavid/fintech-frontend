

import axios from 'axios'
import React from 'react'
import Application from '../../components/application'

const API = axios.create({
    baseURL: 'http://localhost:8000/submittedApplications/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

const ApplicationDetail = ({ application, pdfs, fundersResponse, submittedApplications }) => {

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


export async function getStaticProps({ params }) {
    const appRes = await API.get(`/${params.applicationId}/`)
    
    const baseUrl = `http://localhost:8000/api/submittedApplications/${appRes?.data?.application_id}/pdfs/`
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };
    const response = await axios.get(baseUrl, config).catch(err => {
        // console.log(err);
    });

    return {
        props: {
            application: appRes.data ?? {},
            pdfs: response?.data ?? [],
            fundersResponse: [],
            submittedApplications: [],
        }
    };
}

export async function getStaticPaths() {
    const apps = await axios.get('http://localhost:8000/submittedApplications/', {
        headers: {
            "Content-Type": 'application/json'
        }
    }).catch(err => {
        console.log(err);
    });
    // console.log(apps?.data);
    
    const paths = apps?.data?.map(app => ({ params: { applicationId: app?.submittedApplication_id } }));
    return { paths, fallback: false };
}