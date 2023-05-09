


import Emailverifybutton from '../components/Buttons/Emailverifybutton'
import Inputfeild from '../components/inputfeild'
import Link from "next/link";
import axios from 'axios';
import { setCookie } from 'nookies';
import { useState } from 'react';
import { useRouter } from 'next/router';


export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // const handlelogin = async (event) => {
  
  //   event.preventDefault();
  
  //   const response = await fetch('http://localhost:8000/applications', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ email, password }),
  //   });
  
  //   if (response.ok) {
  //     const { token } = await response.json();(
  //     console.log(token)
  //     // Save the token to local storage or cookies
  //   )} else {
  //     const { message } = await response.json();
  //     // Display an error message to the user
  //   }
  // }


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
      const response = await API.post('api/login/', formData)
      // const response = await axios.post();
      console.log(response);
      router.push('/')
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='mx-auto my-[100px] w-full px[10px] md:w-[30%] py-2  md:px-7 h-[250px] md:border border-blue-50 flex flex-col justify-center align-middle' >

      <h1 className='text-[18px] md:mx-0 mx-7 py-1 text-blue-500' >Login Now!!</h1>

      <form action="" method='post' onSubmit={handleSubmit} className='flex flex-col'>
        <Inputfeild
          type='email'
          name='email'
          onChange={handleChange}
          formData={formData}
          plholder='email'
        />
        <Inputfeild
          type='password'
          name='password'
          onChange={handleChange}
          formData={formData}
          plholder='Password'
        />
        <div className=' flex justify-between align-center max-w-[200px] mx-auto md:max-w-[400px]'>

          <div className='px-8 py-2 text-sm w-[30%] flex justify-center bg-blue-900 text-slate-100 rounded-lg'>
            <button type='Submit' className='text-sm text-white font-bold' >Login
            </button>
          </div>
          <Link href='/register' className="text-sm text-blue-800 font-bold mt-2">Back to Register</Link>

        </div>

      </form>

    </div>
  )
} 
