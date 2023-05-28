


import Table from '../components/table'
import API from '../components/API';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import { getCookie } from '../utils/helpers';
// import Cookies from 'cookies';

export default function Home({ data }) {
  // export default function Home() {
  //   const data = []
  const [applications, setApplications] = useState(data)
  const [refreshData, setRefreshData] = useState(false)
  const router = useRouter()
  const { user, refreshUser, setRefreshUser } = useContext(AuthContext);

  // console.log(user);

  useEffect(() => {
    if (!user) {
      setRefreshUser(refreshUser)
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
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/applications/`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getCookie('jwt')}`,
        },
        withCredentials: true,
      }).catch(error => console.error(error))
      if(res && res?.status === 200){
        console.log('response is good');
        setApplications(res?.data)
      }
    };
    if(refreshData){
      fetch()
      setRefreshData(false)
    }
    const intervalId = setInterval(fetch, 60000);

    // Clean up interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [refreshData])

  if (!user) { return (<></>) }

  return (<>
    <div className="w-full my-[10px]">
      <h1 className="text-center font-bold text-2xl my-10">All Applications</h1>
      <Table data={applications} setRefreshData={setRefreshData} />
    </div>
  </>
  )
}

export async function getServerSideProps(context) {
  // const cookies = context.req.cookies;
  const cookies = parseCookies(context)
  var res;
  try {
    res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/applications/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies['jwt']}` // get JWT token from cookie
      },
      withCredentials: true
    }).catch(err => {
      // console.log(err);
    });

  } catch (error) {
    // console.log(error);    
  }

  return {
    props: {
      data: res?.data ?? [],
    },
  };
}