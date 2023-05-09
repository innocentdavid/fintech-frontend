




import Head from 'next/head'
import Image from 'next/image'
import Inputfeild from '../components/inputfeild'
import Link from "next/link";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';



// const [formData, setFormData] = useState({});

//     const handleSubmit = async (event) => {
//       event.preventDefault();

//       try {
//         const response = await fetch('http://localhost:8000/applications', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(formData),
//           const { token } = response.data
//           setCookie(null, 'token', token, { path: './login' });
//         });

//         if (response.ok) {
//           // Handle success
//           console.log(response)
//         } else {
//           // Handle error
//           console.log(response)
//         }
//       } catch (error) {
//         // Handle error
//         console.log(response)
//       }
//     };

//     const handleChange = (event) => {
//       const { name, value } = event.target;
//       setFormData((prevData) => ({ ...prevData, [name]: value }));
//     };


export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // console.log(formData);
  };

  const API = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
      'Content-Type': 'application/json',
    },
    // credentials: 'include',
    withCredentials: true
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log({ formData });
      const response = await API.post('api/register/', formData)
      console.log(response);
      router.push('/')
    } catch (error) {
      console.log(error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     console.log({ formData });

  //     const response = await axios.post('http://localhost:8000/api/register/', formData);
  //     console.log(response);
  //     // if(response.statusText){

  //     // }
  //     // const { token } = response.data;
  //     // setCookie(null, 'token', token, { path: './login' });
  //     // Redirect the user to a protected page
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <div className='mx-auto my-[100px] md:w-[30%] py-1 pb-4  px-7 h-[400px] md:border border-blue-50 flex flex-col justify-center align-middle' >

      <h1 className='text-[18px] ml-5 md:ml-0 py-1 text-blue-500' >Register</h1>

      <form action="" method='post' className='flex flex-col' onSubmit={handleSubmit}>
        <Inputfeild
          type='text'
          name='name'
          plholder='Name'
          onChange={handleChange}
          formData={formData}
        />
        <Inputfeild
          type='email'
          name='email'
          plholder='Email'
          onChange={handleChange}
          formData={formData}
        />

        <Inputfeild
          type='password'
          name='password'
          plholder='Password'
          onChange={handleChange}
          formData={formData}
        />

        <div className=' flex justify-between align-center max-w-[200px] mx-auto md:max-w-[400px]'>

          <div className='px-9 py-2 text-sm w-[30%] flex justify-center bg-blue-900 text-slate-100 rounded-lg'>
            <button type='Submit' className='text-sm text-white font-bold' >Register
            </button>
          </div>
          <Link href='/login' className="text-sm text-blue-800 font-bold mt-2">Back to Login</Link>

        </div>
      </form>



    </div>
  )
}
