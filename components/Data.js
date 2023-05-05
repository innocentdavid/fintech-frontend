import React from 'react'
import Inputfeild from '../components/inputfeild'
import Boxfield from '../components/boxfield'
import Extrabox from '../components/extrabox'

const Data = () =>{

    return (

        <div className=' flex md:flex-row flex-col my-[40px] md:my-[70px] w-full '>

        <div className='md:w-[50%] flex  justify-center align-middle '>
          <Boxfield
              title ='Awaiting statements'
              count ='86'
              amount ='548,325'
            />
        </div>

        <div className='md:w-[70%] justify-center md:mr-8 w-full mx-auto flex flex-col'>
        
          <div className=' flex  justify-center md:flex-row flex-col md:w-full'>

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

          <div className=' flex justify-center md:flex-row flex-col'>
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