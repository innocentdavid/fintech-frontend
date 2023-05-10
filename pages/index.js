


// import styles from '../styles/Home.module.css'
import Data from '../components/Data'
import Table from '../components/table'
// import axios from 'axios';
import Link from 'next/link'
import { data, states } from '../components/makeData';
import API from '../components/API';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { handleLogout } from '../utils/helpers';
import LoadingModal from '../components/LoadingModal ';
import { FaAngleDown, FaUserCircle } from 'react-icons/fa';
import Nav from '../components/Nav';
// import { parseCookies } from 'nookies';
// import jwt from 'jsonwebtoken';

// export async function getServerSideProps(context) {
//   const baseUrl = 'http://localhost:8000/applications '
//   const response = await fetch(baseUrl)
//   const data =response.data
//   const { token } = parseCookies(context);

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // User is authenticated, return some data for the page
//     return {

//       props: { data: 'some data' },
//       data

//     };
//   } catch (error) {
//     // User is not authenticated, redirect to login page
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }
// }

const APIN = axios.create({
  baseURL: 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
  // credentials: 'include',
  withCredentials: true
})

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState({
    email: '',
    name: ''
  })
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(false)
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [showStarts, setShowStarts] = useState(false)

  // useEffect(() => {
  //   if (applications.length > 0) return setApplicationsLoading(false)
  // }, [applications])


  useEffect(() => {
    const fetch = async () => {
      const response = await APIN.get('api/getcurrentuser/')
      setUser(response.data)
      // console.log(response);
      if (response.data.message !== "success") {
        router.push('/login')
        return;
      }
    };
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetch = async () => {
      await API.get("/")
        .then((res) => {
          setApplicationsLoading(false)
          setApplications(res?.data)
          // console.log(res?.data)
        })
        .catch(console.error);
    };
    // fetch()
    // Schedule fetch data every 10 seconds
    const intervalId = setInterval(fetch, 10000);

    // Clean up interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [])

  return (<>
    {loading ? < LoadingModal loading={loading} /> : <>
      {user?.email && <Nav user={user} setUser={setUser} />}
      <div className="w-full my-[10px] px-5">

        {/* <div className="flex justify-center my-10 md:hidden">
          <div className="flex items-center cursor-pointer" onClick={() => setShowStarts(!showStarts)}>See starts <FaAngleDown size={16} /></div>
        </div>
        {showStarts && <div className="md:hidden"><Data /></div>}
        <div className="hidden md:block"><Data /></div> */}

        <Table data={applications} applicationsLoading={applicationsLoading} />

      </div></>
    }
  </>

  )
}
