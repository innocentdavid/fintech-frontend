

import React, { useContext, useEffect } from 'react'
import API from '../../components/API';
import axios from 'axios';
import Create from '../../components/Create';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/AuthContext';
import { getCookie } from '../../utils/helpers';
import Link from 'next/link';


const ApplicationDetail = ({ application }) => {
// const ApplicationDetail = () => {
    // const application = {}
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

            <Create application={application} />

        </div>
    )
}

export default ApplicationDetail

export async function getServerSideProps(context) {
    // const cookies = context.req.cookies;
    const cookies = parseCookies(context)
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/applications/${context.params.applicationId}/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies['jwt']}` // get JWT token from cookie
        },
        withCredentials: true
    }).catch(err => {
        if (err?.response?.data?.message === "Signature has expired!") {
            return err?.response?.data?.message
        }
        console.log("err: ");
        console.log(err);
    });

    if (res === "Signature has expired!") {
        return {
            redirect: {
                destination: '/login',
                permanent: false, // Set to true if the redirect is permanent (HTTP 301)
            },
        };
    }
    
    // console.log(res);

    return {
        props: {
            application: res?.data ?? [],
        },
    };
}