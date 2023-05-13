


import Table from '../components/table'
import API from '../components/API';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home({ data }) {
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
  const res = await axios.get('http://localhost:8000/applications/', {
    headers: {
      "Content-Type": 'application/json'
    }
  }).catch(err => {
    console.log(err);
  });

  return {
    props: {
      data: res?.data,
    },
  };
}