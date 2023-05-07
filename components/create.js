
import React from 'react'
import { connectDB } from '../components/db'
import Selectmenu from '../components/Selectmenu'
import FileUpload from './FileUpload';
import axios from 'axios'
import Inputfeild from '../components/inputfeild'
import { useState } from 'react';






const Creates = () =>{


    const [formData, setFormData] = useState({});
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      try {
        const response = await fetch('http://localhost:8000/applications/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (response.ok) {
          // Handle success
          console.log(response)
        } else {
          // Handle error
          console.log(response)
        }
      } catch (error) {
        // Handle error
        console.log(response)
      }
    };
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return(
        <div className='md:w-[80%] w-full mx-auto md:p-2 p-1 border flex flex-col justify-center'>
          <h1 className='md:text-[25px] text-[20px] text-center md:my-5 my-2' >Create New </h1>

          <form method='POST' action='' onSubmit={handleSubmit} >

            <div className='md:max-w-[700px] w-full mx-auto'>

              <h2 className='md:text-[19px] text-[15px] m-2 p-2 bg-slate-400'>Company Information</h2>

              <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>Legal Business Name</span>
                  <Inputfeild
                  name= 'legal_business_name'
                  onChange={handleChange}
                  type='text'
                  plholder = 'Legal Business Name'
                  />  
              </div>
              <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>DBA</span>
                  <Inputfeild
                  name= 'dba'
                  onChange={handleChange}
                  type='text'
                  plholder = 'DBA'
                  />  
              </div>
              <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>Address</span>
                  <Inputfeild
                  type='text'
                  onChange={handleChange}
                  name= 'address'
                  plholder = 'Address'
                  />  
              </div>
              <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>Suite</span>
                  <Inputfeild
                  name= 'suite'
                  onChange={handleChange}
                  type='text'
                  plholder = 'Suite'
                  />  
              </div>
              <div className='md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>City</span>
                  <Inputfeild
                  name= 'city'
                  onChange={handleChange}
                  type='text'
                  plholder = 'City'
                  />  
              </div>
              <div className='flex md:gap-5 gap-2 md:max-w-[200px]  md:justify-center'>
              <span className='md:mt-1 mx-3'>State</span>
              <Selectmenu/>
              </div>
              <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>ZIP</span>
                  <Inputfeild
                  onChange={handleChange}
                  type='text'
                  name= 'zip'
                  plholder = 'ZIP'
                  />  
              </div>
              <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>Phone</span>
                  <Inputfeild
                  type='number'
                  onChange={handleChange}
                  name= 'phone'
                  plholder = 'Phone'
                  />  
              </div>
              <div className='md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>Mobile</span>
                  <Inputfeild
                  onChange={handleChange}
                  type='number'
                  name= 'mobile'
                  plholder = 'Mobile'
                  />  
              </div>
              <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>E-mail</span>
                  <Inputfeild
                  onChange={handleChange}
                  type='email'
                  name= 'email'
                  plholder = 'E-mail'
                  />  
              </div>
              <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>Federal Tax ID</span>
                  <Inputfeild
                  onChange={handleChange}
                  type='text'
                  name= 'federal_tax_id'
                  plholder = 'Federal Tax ID'
                  />  
              </div>
              <div className='md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>State of Inc</span>
                  <Inputfeild
                  onChange={handleChange}
                  type='text'
                  name= 'state_inc'
                  plholder = 'State of Inc'
                  />  
              </div>
              <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>Legal Entry</span>
                  <Inputfeild
                  onChange={handleChange}
                  type='text'
                  name= 'legal_entry'
                  plholder = 'Legal Entry'
                  />  
              </div>
              <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>Date Business Started</span>
                  <Inputfeild
                  onChange={handleChange}
                  type='date'
                  name= 'date_bussiness_started'
                  plholder = 'Date Business Started'
                  />  
              </div>
              <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>Length of Owernship</span>
                  <Inputfeild
                  type='number'
                  onChange={handleChange}
                  name= 'length of ownership'
                  plholder = 'Length of Owernship'
                  />  
              </div>
              <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                  <span className='mt-4 mx-3'>Years at Location</span>
                  <Inputfeild
                  type='number'
                  onChange={handleChange}
                  name= 'years_at_location'
                  plholder = 'Years at Location'
                  />  
              </div>
            </div>

            <div className='md:max-w-[700px] w-full mx-auto'>

                <h2 className='md:text-[19px] text-[15px] m-2 p-2 bg-slate-400'>Ownership Information</h2>

                <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>First Name</span>
                    <Inputfeild
                    name= 'owner_first_name'
                    onChange={handleChange}
                    type='text'
                    plholder = 'First Name'
                    />  
                </div>
                <div className='md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>Last Name</span>
                    <Inputfeild
                    name= 'owner_last_name'
                    onChange={handleChange}
                    type='text'
                    plholder = 'Last Name'
                    />  
                </div>
                <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>Home Address</span>
                    <Inputfeild
                    type='text'
                    onChange={handleChange}
                    name= 'owner_home_address'
                    plholder = 'Home Address'
                    />  
                </div>
                <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>City</span>
                    <Inputfeild
                    name= 'owner_city'
                    type='text'
                    onChange={handleChange}
                    plholder = 'City'
                    />  
                </div>
                <div className='flex gap-2 md:gap-5'>
                <span className='md:mt-1 mx-3'>State</span>
                <Selectmenu
                onChange={handleChange}
                />
                </div>
                <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>ZIP</span>
                    <Inputfeild
                    type='text'
                    onChange={handleChange}
                    name= 'owner_zip'
                    plholder = 'ZIP'
                    />  
                </div>
                <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>SSN</span>
                    <Inputfeild
                    type='number'
                    onChange={handleChange}
                    name= 'owner_ssn'
                    plholder = '999-99-9999'
                    />  
                </div>
                <div className='md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>Percentage of Ownership</span>
                    <Inputfeild
                    type='number'
                    onChange={handleChange}
                    name= 'owner_percentage_of_ownership'
                    plholder = 'Percentage of Ownership'
                    />  
                </div>
                <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>DOB</span>
                    <Inputfeild
                    type='date'
                    onChange={handleChange}
                    name= 'owner_dob'
                    plholder = 'DOB'
                    />  
                </div>
                <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>Phone</span>
                    <Inputfeild
                    type='number'
                    onChange={handleChange}
                    name= 'owner_phone'
                    plholder = 'Phone'
                    />  
                </div>
                <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>Federal Tax ID</span>
                    <Inputfeild
                    type='text'
                    onChange={handleChange}
                    name= 'federal_tax_id'
                    plholder = 'Federal Tax ID'
                    />  
                </div>
                <div className='md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>State of Inc</span>
                    <Inputfeild
                    type='text'
                    name= 'state_inc'
                    onChange={handleChange}
                    plholder = 'State of Inc'
                    />  
                </div>
                <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>Legal Entry</span>
                    <Inputfeild
                    type='text'
                    onChange={handleChange}
                    name= 'legal_entry'
                    plholder = 'Legal Entry'
                    />  
                </div>
                <div className='md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>Date Business Started</span>
                    <Inputfeild
                    type='date'
                    onChange={handleChange}
                    name= 'date_bussiness_started'
                    plholder = 'Date Business Started'
                    />  
                </div>
                <div className='md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>Length of Owernship</span>
                    <Inputfeild
                    type='number'
                    onChange={handleChange}
                    name= 'length of ownership'
                    plholder = 'Length of Owernship'
                    />  
                </div>
                <div className='md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                    <span className='mt-4 mx-3'>Years at Location</span>
                    <Inputfeild
                    type='number'
                    onChange={handleChange}
                    name= 'years_at_location'
                    plholder = 'Years at Location'
                    />  
                </div>
            </div>

            <div className='md:max-w-[700px] w-full mx-auto'>

                  <h2 className='md:text-[19px] text-[15px] m-2 p-2 bg-slate-400'>Company Details</h2>

                  <div className='md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                      <span className='mt-4 mx-3'>Gross Monthly Sale</span>
                      <Inputfeild
                      name= 'gross_monthly_sales'
                      onChange={handleChange}
                      type='text'
                      plholder = 'Gross Monthly Sale'
                      />  
                  </div>
                  <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                      <span className='mt-4 mx-3'>Type of Product</span>
                      <Inputfeild
                      name= 'type_of_product'
                      onChange={handleChange}
                      type='text'
                      plholder = 'Type of Product'
                      />  
                  </div>
                  <div className='md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                      <span className='mt-4 mx-3 text-[14px] md:text-[17px]'>Do you have any open Cash Advances [Y/N]</span>
                      <Inputfeild
                      type='text'
                      onChange={handleChange}
                      name= 'has_open_cash_advances'
                      plholder = 'Do you have any open Cash Advances'
                      />  
                  </div>
                  <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                      <span className='mt-4 mx-3 text-[14px] md:text-[17px]'> Have you used a Cash Advance plan before [Y/N]</span>
                      <Inputfeild
                      name= 'has_used_cash_advance_plan_before '
                      onChange={handleChange}
                      type='text'
                      plholder = 'Have you used a Cash Advance plan before'
                      />  
                  </div>
                  <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                      <span className='mt-4 mx-3'> Using the Money For</span>
                      <Inputfeild
                      name= 'using_money_for '
                      onChange={handleChange}
                      type='text'
                      plholder = 'Using the Money For'
                      />  
                  </div>
                  <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                      <span className='mt-4 mx-3'> Description of Business: Retail</span>
                      <Inputfeild
                      name= 'description_of_business '
                      onChange={handleChange}
                      type='text'
                      plholder = 'Description of Business: Retail'
                      />  
                  </div>
            </div>

            <div className='md:max-w-[700px] w-full mx-auto'>

                  <h2 className='md:text-[19px] text-[15px] m-2 p-2 bg-slate-400'>Bank Details</h2>

                  <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                      <span className='mt-4 mx-3'>Business Name</span>
                      <Inputfeild
                      name= 'name_of_business'
                      onChange={handleChange}
                      type='text'
                      plholder = 'Business Name'
                      />  
                  </div>
                  <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                      <span className='mt-4 mx-3'>Bank Name</span>
                      <Inputfeild
                      name= 'bank_name'
                      onChange={handleChange}
                      type='text'
                      plholder = 'Bank Name'
                      />  
                  </div>
                  <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                      <span className='mt-4 mx-3'>Beginning Balance Date</span>
                      <Inputfeild
                      onChange={handleChange}
                      type='date'
                      name= 'begin_bal_date'
                      plholder = 'Beginning Balance Date'
                      />  
                  </div>
                  <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                      <span className='mt-4 mx-3'> Beginning Balance Amount</span>
                      <Inputfeild
                      name= 'begin_bal_amount'
                      onChange={handleChange}
                      type='text'
                      plholder = 'Beginning Balance Amount'
                      />  
                  </div>
                  <div className='md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                      <span className='mt-4 mx-3'>Total Deposit</span>
                      <Inputfeild
                      name= 'total_deposit'
                      onChange={handleChange}
                      type='text'
                      plholder = 'Total Deposit'
                      />  
                  </div>
                  <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                      <span className='mt-4 mx-3'>Ending Balance Date</span>
                      <Inputfeild
                      name= 'ending_bal_date'
                      onChange={handleChange}
                      type='date'
                      plholder = 'Ending Balance Date'
                      />  
                  </div>
                  <div className=' md:w-[70%] w-full md:mx-2 mx-1 md:my-5 my-2'>
                      <span className='mt-4 mx-3'>Ending Balance Amount</span>
                      <Inputfeild
                      name= 'ending_bal_amount'
                      onChange={handleChange}
                      type='text'
                      plholder = 'Ending Balance Amount'
                      />  
                  </div>

                  <div className='flex flex-col  md:flex-row w-full mx-2 mt-[20px]'>

                        <div className='md:w-[45%] w-full '>
                            <h2 className='text-[13px] text-black'>Bank Statement</h2>
                            <div className='flex items-center gap-2 mt-1'>
                                <FileUpload 
                                    name='bankstatement1'
                                    read="True"
                                    onChange={handleChange}
                                />
                                <FileUpload
                                 name='bankstatement2'
                                 onChange={handleChange}
                                read="True" />
                                
                                <FileUpload 
                                 name='bankstatement3'
                                 onChange={handleChange}
                                read="True"
                                />
                              </div>
                          </div>
                          <div className='md:w-[30%] w-full mt-5 md:mt-0 '>
                              <h2 className='text-[13px] text-black'>Application</h2>
                              <div className='flex items-center gap-2 mt-1'>
                                  <FileUpload
                                   name='bankstatement4'
                                   onChange={handleChange} />
                                  <FileUpload
                                   name='bankstatement5'
                                   onChange={handleChange} />
                              
                              </div>
                          </div>

                  </div>
            </div>

            <div className='mt-[25px] flex justify-center gap-4 items-center w-[50%] mx-[50px]'>

              <button type='submit' className='px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none  mb-4 ' >Submit</button>
            </div>

          </form>
        </div>
    )
}
export default Creates