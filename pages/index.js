


import Table from '../components/table'
import API from '../components/API';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';

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
  // console.log("Ncookies: ");
  // console.log(Ncookies);

  try {
    var data = []
    if (Ncookies){
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/applications/`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Ncookies['jwt']}`, // get JWT token from cookie
      },
      // withCredentials: true
      }).catch(err => {
        console.log(err);
      });
      
      if(res?.data){
        data = res.data
      }
    }
    return {
      props: {
        data
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