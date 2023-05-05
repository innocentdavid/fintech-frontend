

 
import Emailverifybutton from '../components/Buttons/Emailverifybutton'
import Inputfeild from '../components/inputfeild'
import Link from "next/link";
import axios from 'axios';
import { setCookie } from 'nookies';

import { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  const handlelogin = async (event) => {
   
    event.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const { token } = await response.json();
      // Save the token to local storage or cookies
    } else {
      const { message } = await response.json();
      // Display an error message to the user
    }
  }
}

export default function Login() {
  return (
    <div className='mx-auto my-[100px] w-full px[10px] md:w-[30%] py-2  md:px-7 h-[250px] md:border border-blue-50 flex flex-col justify-center align-middle' >

        <h1 className='text-[18px] md:mx-0 mx-7 py-1 text-blue-500' >Login Now!!</h1>

        <form action="" method='post' className='flex flex-col' onSubmit={handlelogin}>
            <Inputfeild
                type='text'
                name='usname'
                onChange={(e) => setEmail(e.target.value)} 
                plholder ='Username'
            />
            <Inputfeild
                type='password'
                name='psword'
                onChange={(e) => setPassword(e.target.value)} 
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
