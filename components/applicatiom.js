

import React from 'react'
import Inputfeild from '../components/inputfeild'
import Emailverifybutton from '../components/Buttons/Emailverifybutton'


const Application = () =>{

    return (
       
            <div className='w-[85%] mx-auto items-center flex py-3 rounded-lg mt-[60px]'>

                <div className='w-[45%] mb-[160px] '>
                <div className='flex justify-between max-w-[300px] items-center mx-4 mb-3 border-b border-slate-200'>
                <h3>APPLICATION DATA</h3>
                    <span className='text-[15px] h-[20px] w-[20px] flex justify-center my-2' >X</span>
                </div>
                <h2 className='text-[16px] mx-3 mb-3'>Bussiness Information</h2>

                <div className='w-[75%]'>
                <Inputfeild
                    label='Business Name'
                    type='text'
                    plholder='WMM CAPITAL ADVISORS,LLC'
                />
                <Inputfeild
                    label='Status'
                    type='text'
                    plholder='Contact Out'
                />
                <Inputfeild
                    label='Status Description'
                    type='text'
                    plholder='Contact Sent'
                />
                </div>

                <div className='flex justify-between max-w-[300px] mx-6 mt-[40px]'>
                    <a href="#"><h2 className='text-[13px] text-black'>Bank Statement</h2></a>
                    <a href="#"><h2 className='text-[13px] text-black'>Application</h2></a>
                </div>

                </div>

                <div className='w-[55%] '>
                <div className='flex justify-between max-w-[450px] items-center mx-4 mb-3 p-2 border-b border-slate-200'>
                <h3>Additional Information</h3>
                </div>
                <h2 className='text-[16px] mx-3 mb-3'>Bussiness Information</h2>

                <div className='flex gap-1 w-full flex-1 '>
                    <div className='w-[40%]'>
                        <Inputfeild
                                label='Advanced Amount'
                                type='text'
                                plholder='$6,000.00'
                            />
                        </div>
                    <div className='flex gap-3 w-[60%] '>
                        <Inputfeild
                                label='Commisson'
                                type='text'
                                plholder='$750.00'
                            />
                            <Inputfeild
                                label='%'
                                type='text'
                                plholder='13.0k'
                            />
                    </div>

                </div>

                <div className='flex gap-1 w-full flex-1 '>
                    <div className='w-[40%]'>
                        <Inputfeild
                                label='Factor'
                                type='text'
                                plholder='149000'
                            />
                        </div>
                    <div className='flex gap-3 w-[60%] '>
                        <Inputfeild
                                label='Total fee'
                                type='text'
                                plholder='$940.00'
                            />
                    </div>

                </div>
                
                <div className='flex gap-1 w-full flex-1 '>
                    <div className='w-[40%]'>
                        <Inputfeild
                                label='Payback'
                                type='text'
                                plholder='$8,900.00'
                            />
                        </div>
                    <div className='flex gap-3 w-[60%] '>
                        <Inputfeild
                                label='Term'
                                type='text'
                                plholder='91'
                            />
                            <Inputfeild
                                label='Frequency'
                                type='text'
                                plholder='Daily'
                            />
                    </div>

                </div>

                <div className='flex gap-1 w-full flex-1 '>
                    <div className='w-[40%]'>
                        <Inputfeild
                                label='Payment'
                                type='text'
                                plholder='$99.00'
                            />
                        </div>
                    <div className='flex gap-3 w-[60%] '>
                        <Inputfeild
                                label='Not Funding Amount'
                                type='text'
                                plholder='$5,406.00'
                            />
                    </div>

                </div>

                <div className='mt-[90px] mx-[100px]'>
                <Emailverifybutton
                    title='Submit'
                    title2= 'request additional info'
                />

            </div>
                

                </div>
                


            </div>

    )

}

export default Application