


// import styles from '../styles/Home.module.css'
import Data from '../components/Data'
import Table from '../components/table'
// import axios from 'axios';
import Link from 'next/link'
import { data, states } from '../components/makeData';
import API from '../components/API';
import { useEffect, useState } from 'react';
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

export default function Home({  }) {
  const [applications, setApplications] = useState([])

  useEffect(() => {
    const refreshMovies = async () => {
      await API.get("/")
        .then((res) => {
          setApplications(res.data)
        })
        .catch(console.error);
    };    
    refreshMovies()
  }, [])

  return (
    <div className="mx-auto w-full md:w-[80%] my-[50px] border border-slate-500 rounded-lg ">
      <header className="flex gap-10 items-center justify-end p-5">
        <Link href='/login' className="text-sm text-blue-800 font-bold">
          Log out
        </Link>
      </header>

      <Data />

      <Table data={applications} />

    </div>

  )
}
