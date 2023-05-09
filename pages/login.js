


import Emailverifybutton from '../components/Buttons/Emailverifybutton'
import Inputfeild from '../components/inputfeild'
import Link from "next/link";
import axios from 'axios';
import { setCookie } from 'nookies';
import { useState } from 'react';
import { useRouter } from 'next/router';
import LoadingModal from '../components/LoadingModal ';


export default function Login() {
  const router = useRouter()
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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
    setLoading(true)
    const response = await API.post('api/login/', formData).catch((err => {
      console.log(err);
    }))
    // const response = await axios.post();
    // console.log(response);
    if (response?.data?.message && response?.data?.message !== "success") {
      alert(response.data.message)
      setLoading(false)
      return;
    }
    router.push('/')
    // setLoading(false)
  };

  return (<>
    <LoadingModal loading={loading} />
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
  </>
  )
} 
