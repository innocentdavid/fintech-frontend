

import React from 'react'
import API from '../../components/API';
import Application from '../../components/application'
import axios from 'axios';


const ApplicationDetail = ({ application, pdfs, fundersResponse, submittedApplications }) => {

    return (

        <div className='w-[90%] mx-auto rounded-lg mt-[60px]'>

            {application && <Application
                application={application}
                defaultPdfs={pdfs}
                fundersResponse={fundersResponse}
                submittedApplications={submittedApplications}
            />}

        </div>
    )
}

export default ApplicationDetail

export async function getStaticProps({ params }) {
    const appRes = await API.get(`/${params.applicationId}/`)
    
    const baseUrl = `http://localhost:8000/api/applications/${params.applicationId}/pdfs/`
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    };
    const response = await axios.get(baseUrl, config);

    const fundersResponse = await axios.get("http://localhost:8000/funders/", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }).catch(err => {
        console.log(err);
    })

    const submittedApplications = await axios.get(`http://localhost:8000/api/submittedApplications/${params.applicationId}/`, {
        headers: {
            'Accept': 'application/json'
        },
    }).catch(err => {
        console.log(err);
    })

    return {
        props: {
            application: appRes.data ?? {},
            pdfs: response.data ?? {},
            fundersResponse: fundersResponse.data ?? {},
            submittedApplications: submittedApplications.data ?? {},
        }
    };
}

export async function getStaticPaths() {
    const apps = await axios.get('http://localhost:8000/applications/', {
        headers: {
            "Content-Type": 'application/json'
        }
    }).catch(err => {
        console.log(err);
    });

    const paths = apps?.data?.map(app => ({ params: { applicationId: app?.application_id } }));
    return { paths, fallback: false };
}