

import React, { useContext, useEffect } from 'react'
import API from '../../components/API';
import Application from '../../components/application'
import axios from 'axios';
import { getCookie } from '../../utils/helpers';
import { parseCookies } from 'nookies';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import LoadingModal from '../../components/LoadingModal ';


const ApplicationDetail = ({ application, pdfs, fundersResponse, submittedApplications }) => {
// const ApplicationDetail = () => {
//     const application = {}
//     const pdfs = []
//     const fundersResponse = []
//     const submittedApplications = []
    // console.log(application, pdfs,fundersResponse,submittedApplications);
    
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
  if (loading) {
    return (<>
      <LoadingModal loading={loading} />
    </>)
  }

  if (!user) {
    return (
        <></>
    //   <div className='m-10'>
    //     <Link href="/login" className=''><button className='py-2 px-4 bg-teal-300 text-white rounded-md'>Login</button></Link>
    //   </div>
    )
  }
    
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

export async function getServerSideProps(context) {
    // const cookies = context.req.cookies;
    const cookies = parseCookies(context)
    const appRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/applications/${context.params.applicationId}/`, {
        headers: {
            //  'Accept': 'application/json',
             'Content-Type': 'application/json',
             'Authorization': `Bearer ${cookies['jwt']}`
         },
         withCredentials: true,
    }).catch(err => {
        if (err?.response?.data?.message === "Signature has expired!") {
            return err?.response?.data?.message
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

    const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/applications/${context.params.applicationId}/pdfs/`
    const response = await axios.get(baseUrl, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies['jwt']}`
        },
        withCredentials: true,
    }).catch(err => { console.log(err) });

    const fundersResponse = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/funders/`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies['jwt']}`
        },
        withCredentials: true
    }).catch((err) => {
        console.log(err);
    })

    const submittedApplications = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/get_submittedApplications_by_app_id/${context.params.applicationId}/`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${cookies['jwt']}`
        },
        withCredentials: true,
    }).catch(err => {
        console.log(err);
    })

    return {
        props: {
            application: appRes?.data ?? {},
            pdfs: response?.data ?? {},
            fundersResponse: fundersResponse?.data ?? {},
            submittedApplications: submittedApplications?.data ?? {},
        }
    };
}
