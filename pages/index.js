


import Table from '../components/table'
import API from '../components/API';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import { getCookie } from '../utils/helpers';
import Link from 'next/link';
import LoadingModal from '../components/LoadingModal ';
// import Cookies from 'cookies';

export default function Home({ data }) {
  // export default function Home() {
  //   const data = []
  const [applications, setApplications] = useState(data)
  const [refreshData, setRefreshData] = useState(false)
  const router = useRouter()
  const { user, loading, refreshUser, setRefreshUser } = useContext(AuthContext);

  // console.log(user);

  useEffect(() => {
    if (!user) {
      router.push('/login')
      if (setRefreshUser) {
        setRefreshUser(refreshUser)
      }
      const token = getCookie('jwt')
      // console.log(token);
      if (!token) {
        router.push('/login')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshUser, user])


  // get applications
  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/applications/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('jwt')}`,
        },
        withCredentials: true,
      }).catch(error => console.error(error))
      if (res && res?.status === 200) {
        console.log('response is good');
        setApplications(res?.data)
      }
    };
    if (refreshData) {
      fetch()
      setRefreshData(false)
    }
    const intervalId = setInterval(fetch, 60000);

    // Clean up interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [refreshData])

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

  return (<>
    <div className="w-full my-[10px]">
      <h1 className="text-center font-bold text-2xl my-10">All Applications</h1>
      <Table data={applications} setRefreshData={setRefreshData} />
    </div>
  </>
  )
}

export async function getServerSideProps(context) {
  var res;
  // const cookies = context.req.cookies;
  const cookies = parseCookies(context)
  res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/applications/`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cookies['jwt']}` // get JWT token from cookie
    },
    withCredentials: true
  }).catch(err => {
    if (err?.response.data?.message === "Signature has expired!") {
      return err?.response.data?.message
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

  return {
    props: {
      data: res?.data ?? [],
    },
  };
}