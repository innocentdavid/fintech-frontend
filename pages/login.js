


import Inputfeild from '../components/inputfeild'
import Link from "next/link";
import axios from 'axios';
import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingModal from '../components/LoadingModal ';
import { AuthContext } from '../context/AuthContext';
import { getCookie } from '../utils/helpers';
import { parseCookies } from 'nookies';


export default function Login() {
  const router = useRouter()
  const { login } = useContext(AuthContext);
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
    baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/`,
    headers: {
      'Content-Type': 'application/json',
    },
    // credentials: 'include',
    withCredentials: true
  })

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData)
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

          <div className=''>
            <button type='Submit' className='button ripple px-8 py-2 w-[30%] flex justify-center bg-blue-900 rounded-lg text-sm text-white font-bold' >Login
            </button>
          </div>
          <Link href='/register' className="text-sm text-blue-800 font-bold mt-2">Back to Register</Link>

        </div>

      </form>

    </div>
  </>
  )
} 

export async function getServerSideProps(context) {
  const cookies = parseCookies(context)
  var res;
  res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/getcurrentuser/`, {
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${cookies['jwt']}`,
    },
    withCredentials: true
  }).catch(err => {
    console.log("err_message: ");
    console.log(err?.response?.data?.message);
  });
  
  if (res?.data?.message === 'success'){
    return {
      redirect: {
        destination: '/',
        permanent: false, // Set to true if the redirect is permanent (HTTP 301)
      },
    };
  }else{
    return {
      props: {
        show: true,
      },      
    }; 
  }  
}