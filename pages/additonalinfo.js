


import React from 'react'
import Pdfviewer from '../components/pdfview'
import Addmoreinfo from '../components/additionalinfo'




const Additionalinfo = () =>{
    const pdfUrl = '/add';
    return(
       

        <div className='md:w-[80%] w-[90%] mx-auto  flex  flex-col-reverse md:flex-row justify-between mt-[50px]'>
        
            <Addmoreinfo/>

            <Pdfviewer url={pdfUrl}/>

        </div>
    )
}

export default Additionalinfo