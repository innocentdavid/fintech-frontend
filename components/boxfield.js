

import React from 'react'

const Boxfield = (props) => {
    return (
        <div className='m-3 border-black mx-auto w-[70%] md:w-[50%] text-center text-sm'>
            <div className='w-full border border-black text-[14px]' >  {props.title} </div>
            <div className='flex justify-center w-full'>
                <span className='p-1 border border-black w-full' >  {props.count}</span>
                <span className='p-1 border border-black w-full' >  ${props.amount}</span>
            </div>
        </div>
    )

}

export default Boxfield