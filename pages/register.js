





import Inputfeild from '../components/inputfeild'
import Link from "next/link";
// import { setCookie } from 'nookies';
import { useState } from 'react';
import axios from 'axios';



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


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('http://localhost:8000/api/signup', { username, psword1, psword2  });
  //     const { token } = response.data;
  //     setCookie(null, 'token', token, { path: './login' });
  //     // Redirect the user to a protected page
  //   } catch (error) {
  //     // Handle signup error
  //   }
  //   console.log('dem click me')
  // };
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const HandleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username,
        password,
      });
      const token = response.data.token;
      setCookie(null, 'token', token, { path: './login' });
      // Store the token in local storage or cookies
      console.log(token);
      // Redirect to protected page or perform other actions
    } catch (error) {
      console.error(error);
      // Display error message or handle the error
    }
  };
  
  return (
    <div className='mx-auto my-[100px] md:w-[30%] py-1 pb-4  px-7 h-[400px] md:border border-blue-50 flex flex-col justify-center align-middle' >

        <h1 className='text-[18px] ml-5 md:ml-0 py-1 text-blue-500' >Register Now!!</h1>

        <form action="" method='post' className='flex flex-col' onSubmit={HandleLogin}>
            <Inputfeild
                    type='text'
                    name='username'
                    plholder ='Username'
                    onChange={(e) => setUsername(e.target.value)}
                />

                <Inputfeild
                    type='password'
                    name='psword1'
                    plholder ='Password'
                 />

                <Inputfeild
                    type='password'
                    name='psword2'
                    plholder ='confirm password'
                />

              <div className=' flex justify-between align-center max-w-[200px] mx-auto md:max-w-[400px]'>

                  <div className='px-9 py-2 text-sm w-[30%] flex justify-center bg-blue-900 text-slate-100 rounded-lg'>
                      <button type='Submit' className='text-sm text-white font-bold' >Register
                      </button>
                    </div>
                  <Link href='./login' className="text-sm text-blue-800 font-bold mt-2">Back to Login</Link>

              </div>
        </form>

  
    
    </div>
  )
}
