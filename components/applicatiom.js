

import React from 'react'
import Inputfeild from '../components/inputfeild'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa'
import axios from 'axios';
import  useState  from 'react'
import { NextApiRequest, NextApiResponse } from 'next';
import FileUpload from './FileUpload';
import { useRouter } from 'next/router';




const Application =({ add }) =>{

    const router = useRouter()

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const data = { name };
    //     const response = await axios.post('http://localhost:8000/api/user', data);
    //     console.log(response.data);
    //   };
      

    const [isEditable, setIsEditable] = useState(false)
    
    const handleEditButtonClick = () => {
        setIsEditable(!isEditable);
      };
    
    const [formData, setFormData] = useState({
      // Initialize the form data with existing values
      // fetched from the database
      name: 'John Doe',
      email: 'johndoe@example.com',
      // ...
    });
  
   
  
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      // Perform API request to update data in the database
      try {
        const response = await fetch('http://localhost:8000/applications', {
          method: 'POST',
          body: JSON.stringify(formData),
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          // Data updated successfully
          // Perform any additional actions as needed
          setIsEditable(false);
        } else {
          // Handle error case
          console.error('Failed to update data in the database');
        }
      } catch (error) {
        console.error('Failed to update data:', error);
      }
    };
  
    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };

    return (
       
            <div className='w-[85%] mx-auto items-center  py-3 rounded-lg mt-[60px]'>

                <form action="" method="post" className='flex' onSubmit={handleFormSubmit} >

                <div className='w-[45%] mb-[160px] '>
                    <div className='flex justify-between max-w-[300px] items-center mx-4 mb-3 border-b border-slate-200'>
                    <h3>APPLICATION DATA</h3>
                        <span className='text-[15px] h-[20px] w-[20px] flex justify-center my-2' ><FaTimes size={20} className="cursor-pointer" onClick={() => router.back()} /></span>
                    </div>
                    <h2 className='text-[16px] mx-3 mb-3'>Bussiness Information</h2>

                    <div className='w-[75%]'>
                    <Inputfeild
                        label='Business Name'
                        name='Business Name'
                        type='text'
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                       
                    />
                    <Inputfeild
                        label='Status'
                        name='Status'
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditable}
                        type='text'
                    />
                    <Inputfeild
                        label='Status Description'
                        name='Status Description'
                        type='text'
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditable}

                    />
                    </div>

                    <div className='flex w-full mx-2 mt-[40px]'>

                        <div className='w-[45%] '>
                            <h2 className='text-[13px] text-black'>Bank Statement</h2>
                            <div className='flex items-center gap-2 mt-1'>
                                <FileUpload 
                                     value={formData.name}
                                    onChange={handleInputChange}
                                    
                                />
                                <FileUpload
                                 value={formData.name}
                                onChange={handleInputChange}
                                
                                />
                                 
                                <FileUpload 
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    
                                />
                            </div>
                        </div>
                        <div className='w-[30%]'>
                            <h2 className='text-[13px] text-black'>Application</h2>
                            <div className='flex items-center gap-2 mt-1'>
                                <FileUpload
                                 value={formData.name}
                                onChange={handleInputChange}
                                
                                 />
                                <FileUpload
                                 value={formData.name}
                                onChange={handleInputChange}
                                
                                 />
                             
                            </div>
                        </div>
                       
                    </div>

                </div>

                <div className='w-[55%]'>
                    <div className='flex justify-between max-w-[450px] items-center mx-4 mb-3 p-2 border-b border-slate-200'>
                    <h3>Additional Information</h3>
                    <button type="button" className='px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none  mb-4 ' onClick={handleEditButtonClick}>
                            {isEditable ? 'Cancel' : 'Edit'}
                        </button>
                        {isEditable && <button type="submit" className='px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none  mb-4 '>Save</button>}

                    </div>
                    <h2 className='text-[16px] mx-3 mb-3'>Bussiness Information</h2>

                    <div className=' gap-1 w-full flex-1 '>
                  
                        <div className='flex'>
                                <div className='w-[40%]'>
                                
                                <Inputfeild
                                            label='Advanced Amount'
                                            name='Advanced Amount'
                                            type='text'
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={!isEditable}
                                        />
                                </div>
                                <div className='flex gap-3 w-[60%] '>
                                    <Inputfeild
                                            label='Commisson'
                                            name='Commisson'
                                            type='text'
                                            Value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={!isEditable}
                                        />
                                        <Inputfeild
                                            label='%'
                                            name='percent'
                                            type='text'
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            disabled={!isEditable}
                                            
                                        />
                                </div>
                        </div>

                        <div className='flex gap-1 w-full flex-1 '>
                            <div className='w-[40%]'>
                                <Inputfeild
                                        label='Factor'
                                        name='Factor'
                                        type='text'
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditable}
                                        
                                    />
                                </div>
                            <div className='flex gap-3 w-[60%] '>
                                <Inputfeild
                                        label='Total fee'
                                        name='Total fee'
                                        type='text'
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditable}
                                        
                                    />
                            </div>

                        </div>
                        
                        <div className='flex gap-1 w-full flex-1 '>
                            <div className='w-[40%]'>
                                <Inputfeild
                                        label='Payback'
                                        name='Payback'
                                        type='text'
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditable}
                                      
                                    />
                                </div>
                            <div className='flex gap-3 w-[60%] '>
                                <Inputfeild
                                        label='Term'
                                        name='Term'
                                        type='text'
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditable}
                                                    
                                    />
                                    <Inputfeild
                                        label='Frequency'
                                        name='Frequency'
                                        type='text'
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditable}
                                       
                                    />
                            </div>

                        </div>

                        <div className='flex gap-1 w-full flex-1 '>
                            <div className='w-[40%]'>
                                <Inputfeild
                                        label='Payment'
                                        name='Payment'
                                        type='text'
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditable}
                                                    
                                    />
                                </div>
                            <div className='flex gap-3 w-[60%] '>
                                <Inputfeild
                                        label='Not Funding Amount'
                                        name='Not Funding Amount'
                                        type='text'
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={!isEditable}
                                        
                                    />
                            </div>

                        </div>

                        <div className='mt-[90px] flex justify-center gap-4 items-center w-[50%] mx-[100px]'>

                            <button type='submit' className='px-4 py-2  rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none  mb-4 ' >Submit</button>
                            <h2 className='mt-[-15px]'>request additional info</h2>

                        {/* <Emailverifybutton
                            title = 'request additional info'
                        /> */}

                    </div>
                        
                    

                    </div>
                
                </div>

                </form>

            </div>

    )

}

export default Application