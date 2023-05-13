

import React from 'react'
import API from '../../components/API';
import axios from 'axios';
import Create from '../../components/Create';


const ApplicationDetail = ({ application }) => {

    return (

        <div className='w-[90%] mx-auto rounded-lg mt-[60px]'>

            <Create application={application} />

        </div>
    )
}

export default ApplicationDetail

export async function getStaticProps({ params }) {
    const appRes = await API.get(`/${params.applicationId}/`)

    return {
        props: {
            application: appRes.data ?? {}
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