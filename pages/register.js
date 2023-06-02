
import Head from 'next/head'
import Image from 'next/image'
import Inputfeild from '../components/inputfeild'
import Link from "next/link";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import LoadingModal from '../components/LoadingModal ';

export default function Register() {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    cpassword: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password !== formData.cpassword) return alert("Your password must be the same!")
    setLoading(true)
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/register/`, formData, {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }).catch(err => {
      console.log(err);
      setLoading(false)
    })
    // console.log(response);
    if (response?.data?.message && response?.data?.message === 'success' ) {
      // const expirationDate = new Date();
      // expirationDate.setDate(expirationDate.getDate() + 1);
      // document.cookie = `jwt=${response?.data?.token}; expires=${expirationDate.toUTCString()}; path=/;`;
      const expirationDate = new Date(response?.expiration_time ? response?.expiration_time * 1000 : '');
      document.cookie = `jwt=${response?.token}; expires=${expirationDate.toUTCString()}; path=/;`;
      router.push('/')
    }else{
      alert(response?.data?.message)
      setLoading(false)
      return;
    }
    setLoading(false)
  };

  return (<>
    <LoadingModal loading={loading} />
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
        <Inputfeild
          type='password'
          name='cpassword'
          plholder='Confirm Password'
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
  </>
  )
}
