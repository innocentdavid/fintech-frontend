

 
import Emailverifybutton from '../components/Buttons/Emailverifybutton'
import Inputfeild from '../components/inputfeild'
import Link from "next/link";
import axios from 'axios';
import { setCookie } from 'nookies';
import { useState } from 'react';


  

 
  

export default function Login() {

  const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

  const HandleLogin = async (e) => {
    e.preventDefault();
    
    // const OnChange = ((e) => setUsername(e.target.value))
    // const OnChange2 = ((e) => setPassword(e.target.value))
   
            try {
              const response = await axios.get('http://localhost:8000/api/login/', {
                username,
                password,
              });
                  return {
                    destination: '/index',
                    permanent: false,
              
                    props: { data: 'some data' },
                    data
              
                  };

      // Redirect to protected page or perform other actions
    } catch (error) {
      console.error(error);
      // Display error message or handle the error
    }
  };



  return (
    <div className='mx-auto my-[100px] w-full px[10px] md:w-[30%] py-2  md:px-7 h-[250px] md:border border-blue-50 flex flex-col justify-center align-middle' >

        <h1 className='text-[18px] md:mx-0 mx-7 py-1 text-blue-500' >Login Now!!</h1>

        <form action="" method='post' onSubmit={HandleLogin} className='flex flex-col'>
            <Inputfeild
                type='text'
                name='username'
                value={username}
                onChange= {(e) => setUsername(e.target.value)}
                plholder ='Username'
            />
            <Inputfeild
                type='password'
                name='password' 
                onChange= {((e) => setPassword(e.target.value))}
                plholder ='Password'
            />
            <div className=' flex justify-between align-center max-w-[200px] mx-auto md:max-w-[400px]'>

              <div className='px-8 py-2 text-sm w-[30%] flex justify-center bg-blue-900 text-slate-100 rounded-lg'>
                  <button type='Submit' className='text-sm text-white font-bold' >Login
                  </button>
                </div>
              <Link href='./register' className="text-sm text-blue-800 font-bold mt-2">Back to Register</Link>

            </div>

        </form>

    </div>
  )
} 
