


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

  useEffect(() => {
    const fetch = async () => {
      const response = await APIN.get('api/getcurrentuser/')
      setUser(response.data)
      console.log(response);
      if (response.data.message !== "success") {
        router.push('/login')
        return;
      }
    };
    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const refreshMovies = async () => {
      await API.get("/")
        .then((res) => {
          setApplications(res?.data)
          // console.log(res?.data)
        })
        .catch(console.error);
    };
    refreshMovies()
  }, [])

  return (<>
    {loading ? < LoadingModal loading={loading} /> :
      <div className="w-full my-[10px] px-5">
        {user?.email && <header className="flex gap-10 items-center justify-between p-5">
          <div className="text-lg font-bold">{user?.name}</div>
          <div className="flex items-center gap-2">
            <div className="">{user?.email}</div>
            <div className="text-sm text-blue-800 font-bold cursor-pointer" onClick={async () => {
              await handleLogout()
              setUser({})
              router.push('/login')
            }}>
              Log out
            </div>
          </div>
        </header>}

        <Data />

        <Table data={applications} />

      </div>
    }
  </>

  )
}
