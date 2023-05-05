

import React from 'react'
import Inputfeild from '../components/inputfeild'



const Addmoreinfo = () =>{
    return (
        <div ClassName='flex md:justify-between md:mx-7 md:p-3 flex-col-reverse md:flex-row'>
            <h1 className='md:text-[15px] text-[13px] p-3'>In order to submit to the funder we need the following information</h1>

          <form method="POST" action="" className='md:mx-4 mx-1'>

            <div className="flex gap-2 mt-[30px] align-middle flex-row w-full  md:max-w-[500px] ">
                <h3 className='md:text-[15px] text-[13px] mt-2 md:mt-5'>April Deposit</h3>
                <Inputfeild
                     type='text'
                />
            </div>

            <div className="flex gap-2 mt-[30px] align-middle flex-row w-full  md:max-w-[500px] ">
                <h3 className='md:text-[15px] text-[13px] mt-5'>May Deposit</h3>
                <Inputfeild
                     type='text'
                />
            </div>

            <div className="flex gap-2 mt-[30px] align-middle flex-row w-full  md:max-w-[500px] ">
                <h3 className='md:text-[15px] text-[13px] mt-5'>June Deposit</h3>
                <Inputfeild
                     type='text'
                />
            </div>

            <div className=" gap-2 mt-[30px] align-middle max-w-[400px] ">
                <h3 className='md:text-[15px] text-[13px] mt-3'>Most Recent Month Negative Days</h3>
                <Inputfeild
                    type='text'
                    plholder='Text'
                />
            </div>
            <div className='max-w-[200px] mx-auto bg-gray-300 mb-5 cursor-pointer rounded-[10px] text-black grid place-items-center w-[100px] h-[40px]'>
                <button type='submit'>submit</button>
            </div>

          </form>
        </div>
    )
}

export default Addmoreinfo 