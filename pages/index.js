


import Table from '../components/table'
import API from '../components/API';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from '../utils/helpers';
import { parseCookies } from 'nookies';
import { cookies } from "next/headers";

export default function Home({ data }) {
// export default function Home() {
//   const data = []
  const [applications, setApplications] = useState(data)

  // get applications
  useEffect(() => {
    const fetch = async () => {
      await API.get("/")
        .then((res) => {
          setApplications(res?.data)
        }).catch(error => {
          console.log(error);
        })
    };
    const intervalId = setInterval(fetch, 60000);

    // Clean up interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [])

  return (<>
    <div className="w-full my-[10px]">
      <h1 className="text-center font-bold text-2xl my-10">All Applications</h1>
      <Table data={applications} />
    </div>
  </>
  )
}



export async function getServerSideProps(context) {
  const Ncookies = parseCookies(context);
  console.log("Ncookies: ");
  console.log(Ncookies);
  // const c = cookies().get('jwt')
  // console.log("c: ");
  // console.log(c);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/applications/`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Ncookies['jwt']}` // get JWT token from cookie
      },
      credentials: 'include'
    });
    console.log(res);

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();
    // console.log(data);

    return {
      props: {
        data: data ?? [],
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        data: [],
      },
    };
  }
}


// export async function getServerSideProps(context) {
//   const cookies = parseCookies(context)
//   console.log(cookies)
//   const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/applications/`, {
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${cookies['jwt']}` // get JWT token from cookie
//     },
//     withCredentials: true
//   }).catch(err => {
//     console.log(err);
//   });
  
//   console.log(res);

//   return {
//     props: {
//       data: res?.data ?? [],
//     },
//   };
// }