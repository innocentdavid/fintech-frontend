import React from 'react'
import Inputfeild from '../components/inputfeild'
import Boxfield from '../components/boxfield'
import Extrabox from '../components/extrabox'

const Data = () =>{

    return (

        <div className=' flex  my-[70px] w-full '>

        <div className='w-[80%] ml-5  justify-right '>
          <Boxfield
              title ='Awaiting statements'
              count ='86'
              amount ='548,325'
            />
        </div>

        <div className='w-[70%] mr-8 mx-auto flex flex-col'>
        
        <div className=' flex'>
        <Boxfield
            title ='Submited'
            count ='86'
            amount ='548,325'
          />

        <Boxfield
            title ='Approved'
            count ='86'
            amount ='548,325'
          />

        <Boxfield
            title ='Funded'
            count ='86'
            amount ='548,325'
          />
        </div>

        <div className=' flex'>
        <Boxfield
            title ='Declined'
            count ='86'
            amount ='548,325'
          />

        <Extrabox
            title ='Commission'
            count ='86'
            amount ='548,325'
            percent= '6'
          />

        </div>

      </div>

      </div>

    )
}

export default Data