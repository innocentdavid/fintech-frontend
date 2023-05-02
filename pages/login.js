

import Head from 'next/head'
import Image from 'next/image' 
import Emailverifybutton from '../components/Buttons/Emailverifybutton'
import Inputfeild from '../components/inputfeild'

export default function Login() {
  return (
    <div className='mx-auto my-[100px] w-[30%] py-2  px-7 h-[250px] border border-blue-50 flex flex-col justify-center align-middle' >

        <h1 className='text-[18px] py-1 text-blue-500' >Login Now!!</h1>

        <form action="" method='post' className='flex flex-col'>
            <Inputfeild
                type='text'
                name='usname'
                plholder ='Username'
            />
            <Inputfeild
                type='password'
                name='psword'
                plholder ='Password'
            />

        </form>

      <Emailverifybutton
      title='Log in'
      title2= 'Back to Register'
      link= './register'
    />
    
    </div>
  )
}
