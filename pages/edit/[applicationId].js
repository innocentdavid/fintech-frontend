

import React from 'react'
import API from '../../components/API';
import axios from 'axios';
import Create from '../../components/Create';
import { parseCookies } from 'nookies';


const ApplicationDetail = ({ application }) => {
// const ApplicationDetail = () => {
    // const application = {}

    return (

        <div className='w-[90%] mx-auto rounded-lg mt-[60px]'>

            <Create application={application} />

        </div>
    )
}

export default ApplicationDetail

export async function getServerSideProps(context) {
    // const cookies = context.req.cookies;
    const cookies = parseCookies(context)
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/applications/${context.params.applicationId}/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies['jwt']}` // get JWT token from cookie
        },
        withCredentials: true
    }).catch(err => {
        // console.log(err);
    });
    
    // console.log(res);

    return {
        props: {
            application: res?.data ?? [],
        },
    };
}