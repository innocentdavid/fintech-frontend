


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
  // const [applicationsLoading, setApplicationsLoading] = useState(true)
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

  // useEffect(() => {
  //   const fetch = async () => {
  //     await API.get("/")
  //       .then((res) => {
  //         setApplicationsLoading(false)
  //         setApplications(res?.data)
  //         // console.log(res?.data)
  //       })
  //       .catch(console.error);
  //   };
  //   // fetch()
  //   // Schedule fetch data every 10 seconds
  //   const intervalId = setInterval(fetch, 10000);

  //   // Clean up interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, [])

  return (<>
    {loading ? < LoadingModal loading={loading} /> : <>
      {user?.email && <Nav user={user} setUser={setUser} />}

      <div className="w-full my-[10px] px-5">

        <div className=""><Data /></div>

      </div></>
    }
  </>)
}
