


import Table from '../components/table'
import API from '../components/API';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { parseCookies } from 'nookies';
// import Cookies from 'cookies';

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



// export async function getServerSideProps(context) {
//   const Ncookies = new Cookies(context.req);
//   const cookieValue = Ncookies.get('jwt');
//   console.log("cookieValue: ");
//   console.log(cookieValue);

//   const cookies = context?.req?.cookies;
//   console.log("cookies: ");
//   console.log(cookies);
//   // console.log(cookies['jwt']);

//   // const jwtCookie = cookies.get('jwt');
//   // console.log(jwtCookie);
//   // const Ncookies = parseCookies(context);
//   // console.log("Ncookies: ");
//   // console.log(Ncookies);

//   try {
//     var data = []
//     // if (cookies['jwt']){
//       console.log('eysdkl');
//       const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/applications/`, {
//       headers: {
//         'Content-Type': 'application/json',
//           Authorization: `Bearer ${cookieValue}`, // get JWT token from cookie
//       },
//       withCredentials: true
//       }).catch(err => {
//         console.log(err);
//       });

//       if(res?.data){
//         data = res.data
//       }
//     // }
//     return {
//       props: {
//         data
//       },
//     };
//   } catch (error) {
//     console.log(error);
//     return {
//       props: {
//         data: [],
//       },
//     };
//   }
// }




export async function getServerSideProps(context) {
  const c = context.req.cookies
  // console.log(c['jwt']);
  var data = []
  if (c['jwt']) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/applications/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${c['jwt']}`, // get JWT token from cookie
      },
      credentials: 'include',
    }).catch(err => {
      console.log(err)
    });
    // console.log(res);
    if (res.status === 200) {
      data = await res?.json();
    }
  }
  return {
    props: {
      data: data,
    },
  };
  // const cookies = new Cookies(context.req);
  // const cookieValue = cookies.get('jwt');
  // const Ncookies = parseCookies(context);
  // console.log("Ncookies: ");
  // console.log(Ncookies);

  // try {
  //   var data = []
  //   if (c['jwt']){
  //     // const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/applications/`, {
  //     //   method: 'GET',
  //     //   headers: {
  //     //     'Content-Type': 'application/json',
  //     //     Authorization: `Bearer ${c['jwt']}`, // get JWT token from cookie
  //     //     Cookie: `jwt=${c['jwt']}`,
  //     //   },
  //     //   credentials: 'include',
  //     // }).catch(err => console.log(err));
  //     // // console.log(res);
  //     // if(res.status === 200){
  //     //   data = await res?.json();     
  //     // }
  //   }

  //   return {
  //     props: {
  //       data,
  //     },
  //   };
  // } catch (error) {
  //   console.log(error);
  //   return {
  //     props: {
  //       data: [],
  //     },
  //   };
  // }
}