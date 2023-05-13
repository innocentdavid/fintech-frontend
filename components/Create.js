

import axios from 'axios';
import { useEffect, useState } from 'react';
import Inputfeild from '../components/inputfeild';
import SelectMenuNew from '../components/SelectMenuNew';
import { AiFillCheckCircle } from 'react-icons/ai'
import API from '../components/API';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/router';
import RadioFeild from '../components/Radio';
import LoadingModal from '../components/LoadingModal ';
import { minMaxValidator, scrollToInput } from '../utils/helpers';

const date = new Date();
const year = date.getFullYear(); // e.g. 2022
const month = date.getMonth() + 1; // months are zero-indexed, so add 1 to get the actual month number (e.g. 5 for May)
const day = date.getDate(); // e.g. 28
const today = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

const Create = ({ application }) => {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [application_id, setApplication_id] = useState('')
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date_submitted: today,
        status_date: today,
        status: 'Created',
        status_description: 'Created',
        name_of_business: '',
        legal_business_name: '',
        owners: '',
        dba: '',
        address: '',
        suite: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        mobile: '',
        email: '',

        legal_entry: '',
        state_inc: '',
        federal_tax_id: '',
        state_of_inc: '',
        legal_entity: '',
        date_business_started: '',

        owner_first_name: '',
        owner_last_name: '',
        owner_home_address: '',
        max_length: '',
        owner_city: '',
        owner_state: '',
        owner_zip: '',
        owner_ssn: '',
        owner_percentage_of_ownership: '',
        owner_dob: '',
        owner_phone: '',

        gross_monthly_sales: '',
        type_of_product_sold: '',
        has_open_cash_advances: 'NO',
        has_used_cash_advance_plan_before: 'NO',
        using_money_for: '',
        description_of_business: '',
        length_of_ownership: '',
        years_at_location: '',

        advanced_price: 0,
        commission_price: 0,
        percentage: 0,
        factor: 0,
        total_fee: 0,
        payback: 0,
        term: '',
        frequency: 0,
        payment: 0,
        net_funding_amount: 0
    });
    const [zipError, setZipError] = useState("");
    const [ownerZipError, setOwnerZipError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [mobileError, setMobileError] = useState("");
    const [ownerPhoneError, setOwnerPhoneError] = useState("");
    const [formData2, setFormData2] = useState({
        business_name: '',
        bank_name: '',
        begin_bal_date: '',
        begin_bal_amount: '',
        ending_bal_amount: '',
        ending_bal_date: '',
        total_deposit: '',
    });
    
    useEffect(() => {
        if (application){
            setFormData({...application})
        }
    }, [application])
    

    function validateZipCode(zipCode) {
        const zipCodeRegex = /^(\d{5}|\d{8}|\d{9})$/;
        return zipCodeRegex.test(zipCode);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        var zipError, ownerZipError, phoneError, mobileError, ownerPhoneError;
        // perform check
        console.log(formData.phone);
        console.log(minMaxValidator(formData.phone, 7, 10));
        if (formData.zip && !validateZipCode(formData.zip)) { zipError = true; setZipError('Zip code must be either 5, 8, or 9 characters') }
        if (formData.owner_zip && !validateZipCode(formData.owner_zip)) { ownerZipError = true; setOwnerZipError('Zip code must be either 5, 8, or 9 characters') }
        if (formData.phone && !minMaxValidator(formData.phone, 7, 10)) { phoneError = true; setPhoneError('number must be either 7 or 10 characters') }
        if (formData.mobile && !minMaxValidator(formData.mobile, 7, 10)) { mobileError = true; setMobileError('number must be either 7 or 10 characters') }
        if (formData.owner_phone && !minMaxValidator(formData.owner_phone, 7, 10)) { ownerPhoneError = true; setOwnerPhoneError('number must be either 7 or 10 characters') }

        if (zipError) {
            scrollToInput('zip')
            return
        } else { setZipError('') }
        if (ownerZipError) {
            scrollToInput('owner_zip')
            return
        } else { setOwnerZipError('') }
        if (phoneError) {
            scrollToInput('phone')
            return
        } else { setPhoneError('') }
        if (mobileError) {
            scrollToInput('mobile')
            return
        } else { setMobileError('') }
        if (ownerPhoneError) {
            scrollToInput('owner_phone')
            return
        } else { setOwnerPhoneError('') }

        console.log('all-good!');
        setZipError(''); setOwnerZipError('');


        setLoading(true)
        // console.log({ formData });

        try {
            var res;
            if (application){
                console.log("application: ");
                console.log(application);
                res = await axios.put(`http://localhost:8000/applications/${application?.application_id}/`, formData, {
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }).catch(err => {
                    console.log(err);
                })
                console.log(res);
                if(res.data){
                    setLoading(false)
                    router.back()                    
                }
            }else{
                res = await API.post("/", formData)                
                setApplication_id(res?.data?.application_id)
                setStep(1)
                document.getElementById('step2').scrollIntoView()
            }
            
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    return (<>
        <LoadingModal loading={loading} />
        <div className={`${step === 0 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none absolute top-[-1000%]"} w-[80%] mx-auto flex justify-center rounded-lg mt-[60px] mb-10`} style={{
            transition: 'all .15s ease-in'
        }}>
            {/* <Creates/> */}
            <div className='md:w-[80%] w-full mx-auto p-2 border flex flex-col justify-center'>
                <FaTimes size={20} className='absolute top-5 right-7 cursor-pointer' onClick={() => {
                    setLoading(true)
                    router.back()
                }} />
                <h1 className='md:text-[25px] text-[20px] text-center md:my-5 my-2' >Create New Application</h1>

                <form method='POST' action='' onSubmit={handleSubmit} >
                    <div className='md:max-w-[700px] w-full mx-auto'>

                        <h2 className='text-[19px] m-2 p-2 bg-slate-400'>Company Information</h2>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Legal Business Name</span>
                                <Inputfeild
                                    name='legal_business_name'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Legal Business Name'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>DBA</span>
                                <Inputfeild
                                    name='dba'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='DBA'
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Address</span>
                                <Inputfeild
                                    type='text'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='address'
                                    plholder='Address'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Suite</span>
                                <Inputfeild
                                    name='suite'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Suite'
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>City</span>
                                <Inputfeild
                                    name='city'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='City'
                                />
                            </div>
                            <div className='w-[70%] mx-2 my-5'>
                                <span className='mt-1 mx-3'>State</span>
                                <SelectMenuNew
                                    onChange={handleChange}
                                    formData={formData}
                                    name='state'
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>ZIP</span>
                                <Inputfeild
                                    onChange={handleChange}
                                    formData={formData}
                                    type='number'
                                    name='zip'
                                    plholder='ZIP'
                                    min={5}
                                    max={9}
                                />
                                <p className="-mt-3 ml-3 text-red-500">{zipError}</p>
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Phone</span>
                                <Inputfeild
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='phone'
                                    min={7}
                                    max={10}
                                    plholder='Phone'
                                />
                                <p className="-mt-3 ml-3 text-red-500">{phoneError}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Mobile</span>
                                <Inputfeild
                                    onChange={handleChange}
                                    formData={formData}
                                    type='number'
                                    name='mobile'
                                    min={7}
                                    max={10}
                                    plholder='Mobile'
                                />
                                <p className="-mt-3 ml-3 text-red-500">{mobileError}</p>
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>E-mail</span>
                                <Inputfeild
                                    onChange={handleChange}
                                    formData={formData}
                                    type='email'
                                    name='email'
                                    plholder='E-mail'
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Federal Tax ID</span>
                                <Inputfeild
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    name='federal_tax_id'
                                    plholder='Federal Tax ID'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>State of Inc</span>
                                <SelectMenuNew
                                    onChange={handleChange}
                                    formData={formData}
                                    name='state_inc'
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Legal Entry</span>
                                <Inputfeild
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    name='legal_entry'
                                    plholder='Legal Entry'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Date Business Started</span>
                                <Inputfeild
                                    onChange={handleChange}
                                    formData={formData}
                                    type='date'
                                    name='date_business_started'
                                    plholder='Date Business Started'
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Length of Owernship</span>
                                <Inputfeild
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='length_of_ownership'
                                    plholder='Length of Owernship'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Years at Location</span>
                                <Inputfeild
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='years_at_location'
                                    plholder='Years at Location'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Number Of Locations</span>
                                <Inputfeild
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='number_of_locations'
                                    plholder='Number Of Locations'
                                />
                            </div>
                        </div>
                    </div>


                    <div className='md:max-w-[700px] w-full mx-auto'>

                        <h2 className='md:text-[19px] text-[15px] m-2 p-2 bg-slate-400'>Ownership Information</h2>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>First Name</span>
                                <Inputfeild
                                    name='owner_first_name'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='First Name'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Last Name</span>
                                <Inputfeild
                                    name='owner_last_name'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Last Name'
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Home Address</span>
                                <Inputfeild
                                    type='text'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='owner_home_address'
                                    plholder='Home Address'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>City</span>
                                <Inputfeild
                                    name='owner_city'
                                    type='text'
                                    onChange={handleChange}
                                    formData={formData}
                                    plholder='City'
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className='w-[70%] mx-2 my-5'>
                                <span className='mt-1 mx-3'>State</span>
                                <SelectMenuNew
                                    onChange={handleChange}
                                    formData={formData}
                                    name="owner_state"
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>ZIP</span>
                                <Inputfeild
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='owner_zip'
                                    plholder='ZIP'
                                    min={5}
                                    max={9}
                                />
                                <p className="-mt-3 ml-3 text-red-500">{ownerZipError}</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>SSN (999-99-9999)</span>
                                <Inputfeild
                                    type='text'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='owner_ssn'
                                    pattern="\d{3}-\d{2}-\d{4}"
                                    plholder='999-99-9999'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Percentage of Ownership</span>
                                <Inputfeild
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='owner_percentage_of_ownership'
                                    plholder='Percentage of Ownership'
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>DOB</span>
                                <Inputfeild
                                    type='date'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='owner_dob'
                                    plholder='DOB'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Phone</span>
                                <Inputfeild
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='owner_phone'
                                    plholder='Phone'
                                    min={7}
                                    max={10}
                                />
                                <p className="-mt-3 ml-3 text-red-500">{ownerPhoneError}</p>
                            </div>
                        </div>
                    </div>


                    <div className='max-w-[700px] mx-auto'>

                        <h2 className='text-[19px] m-2 p-2 bg-slate-400'>Company Details</h2>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Name Of Business</span>
                                <Inputfeild
                                    name='name_of_business'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Name Of Business'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Gross Monthly Sale</span>
                                <Inputfeild
                                    name='gross_monthly_sales'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='number'
                                    plholder='Gross Monthly Sale'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Type of Product Sold</span>
                                <Inputfeild
                                    name='type_of_product_sold'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Type of Product Sold'
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Do you have any open Cash Advances [Y/N]</span>
                                <RadioFeild
                                    type='radio'
                                    onChange={handleChange}
                                    formData={formData}
                                    options={['YES', 'NO']}
                                    name='has_open_cash_advances'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'> Have you used a Cash Advance plan before [Y/N]</span>
                                <RadioFeild
                                    type='radio'
                                    onChange={handleChange}
                                    formData={formData}
                                    options={['YES', 'NO']}
                                    name='has_used_cash_advance_plan_before'
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'> Using the Money For</span>
                                <Inputfeild
                                    name='using_money_for'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Using the Money For'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'> Description of Business: Retail</span>
                                <Inputfeild
                                    name='description_of_business'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Description of Business: Retail'
                                />
                            </div>
                        </div>
                    </div>


                    <div className='max-w-[700px] mx-auto'>

                        <h2 className='text-[19px] m-2 p-2 bg-slate-400'>Advance Information</h2>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Advanced Amount</span>
                                <Inputfeild
                                    name='advanced_price'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='number'
                                    plholder='Advanced Amount'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Commission Amount</span>
                                <Inputfeild
                                    name='commission_price'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='number'
                                    plholder='Commission Amount'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>%</span>
                                <Inputfeild
                                    name='percentage'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='number'
                                    plholder='percentage'
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Factor</span>
                                <Inputfeild
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='factor'
                                    plholder='Factor'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Total Fee</span>
                                <Inputfeild
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='total_fee'
                                    plholder='Total Fee'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Payment</span>
                                <Inputfeild
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='payment'
                                    plholder='Payment'
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Payback</span>
                                <Inputfeild
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='payback'
                                    plholder='Payback'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Term</span>
                                <Inputfeild
                                    type='text'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='term'
                                    plholder='Term'
                                />
                            </div>
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'>Frequency</span>
                                <Inputfeild
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='frequency'
                                    plholder='Frequency'
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className=' w-[70%] mx-2 my-5'>
                                <span className='mt-4 mx-3'> Net Funding Amount</span>
                                <Inputfeild
                                    name='net_funding_amount'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='number'
                                    plholder='Net Funding Amount'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='mt-[40px] flex justify-center gap-4 items-center w-full mx-auto'>
                        <button type='submit' className='px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none  mb-4 ' >{application ? 'Update' :'Save and Continue' }</button>
                    </div>
                </form>
            </div>
        </div>

        <div id="step2" className={`${step === 1 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none absolute top-[-1000%]"} w-[80%] mx-auto mt-[60px]`} style={{
            transition: 'all .15s ease-in'
        }}>
            <div className="mb-10 flex gap-4 items-center justify-center">
                <FaArrowLeft size={20} className="cursor-pointer" onClick={() => setStep(0)} />
                <div className="">Submit Application files</div>
            </div>

            <div className="flex flex-col gap-10">
                <UploadFiles title={'Application file 1'} application_id={application_id}
                    formData={formData2} setFormData={setFormData2}
                />
                <UploadFiles title={'Application file 2'} application_id={application_id}
                    formData={formData2} setFormData={setFormData2}
                />
                <UploadFiles title={'Statement 1'} application_id={application_id}
                    formData={formData2} setFormData={setFormData2}
                />
                <UploadFiles title={'Statement 2'} application_id={application_id}
                    formData={formData2} setFormData={setFormData2}
                />
                <UploadFiles title={'Statement 3'} application_id={application_id}
                    formData={formData2} setFormData={setFormData2}
                />

                <div className='my-[40px] flex justify-center gap-4 items-center w-full mx-auto'>
                    <button type='submit' className='px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none  mb-4 '
                        onClick={() => {
                            setLoading(true)
                            router.push('/')
                        }}>Complete</button>
                </div>
            </div>
        </div>
    </>)
}

export default Create

const UploadFiles = ({ title, application_id, formData }) => {
    const [formData2, setFormData2] = useState({
        business_name: '',
        bank_name: '',
        begin_bal_date: '',
        begin_bal_amount: '',
        ending_bal_amount: '',
        ending_bal_date: '',
        total_deposit: '',
    })
    const [file, setFile] = useState({});
    const [hasUploaded, setHasUploaded] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target;
        const d = (prevData) => ({ ...prevData, [name]: value })
        setFormData2(d);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setFile(file)
            // Handle the valid PDF file here
            // console.log('Valid PDF file:', file);
            // const list = formData2?.pdf_files ? formData2?.pdf_files : []
            // list.push(file)
            // setFormData2({
            //   ...formData2,
            //   pdf_file: file,
            // });
        } else {
            // Handle invalid file type here
            console.log('Invalid file type');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file?.name) return alert('You have not selected any file!')
        setLoading(true)
        // console.log({ formData2 });
        // return;
        const baseUrl = 'http://localhost:8000/pdfs/'
        const config = {
            headers: {
                // 'Content-Type': 'application/json',
                'content-type': 'multipart/form-data',
            }
        };

        try {
            const formDataWithFiles = new FormData();
            formDataWithFiles.append('pdf_type', title);
            formDataWithFiles.append('application_id', application_id);
            formDataWithFiles.append('business_name', formData2?.business_name ? formData2.business_name : '');
            formDataWithFiles.append('bank_name', formData2?.bank_name ? formData2.bank_name : '');
            formDataWithFiles.append('begin_bal_date', formData2?.begin_bal_date ? formData2.begin_bal_date : '');
            formDataWithFiles.append('begin_bal_amount', formData2?.begin_bal_amount ? formData2.begin_bal_amount : '');
            formDataWithFiles.append('ending_bal_amount', formData2?.ending_bal_amount ? formData2.ending_bal_amount : '');
            formDataWithFiles.append('ending_bal_date', formData2?.ending_bal_date ? formData2.ending_bal_date : '');
            formDataWithFiles.append('total_deposit', formData2?.total_deposit ? formData2.total_deposit : '');
            formDataWithFiles.append(
                'pdf_file', file ? file : {}, file?.name ? file.name : ''
            );

            // console.log({ formDataWithFiles });
            const response = await axios.post(baseUrl, formDataWithFiles, config);
            // console.log({ response });
            if (response.statusText === "Created") {
                setHasUploaded(true)
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    };

    return (<>
        <LoadingModal loading={loading} />
        <form method='POST' action='' onSubmit={handleSubmit} >
            <div className="flex justify-around mb-3">
                <h3 className='font-bold'>{title}</h3>
                {hasUploaded ?
                    <AiFillCheckCircle size={24} />
                    :
                    <input type="file" accept="application/pdf" name="pdf_file" id="" onChange={handleFileChange} />
                }
            </div>

            <div className={`${!hasUploaded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none absolute top-[-1000%]"} max-w-[700px] mx-auto`}>

                <h2 className='text-[19px] m-2 p-2 bg-slate-400'>Bank Details</h2>

                <div className="flex items-center justify-around mx-5">
                    <div className=' w-[33%] mx-2 my-5'>
                        <span className='mt-4 mx-3'>Business Name</span>
                        <Inputfeild
                            name='business_name'
                            onChange={handleChange}
                            formData={formData2}
                            type='text'
                            plholder='Business Name'
                        />
                    </div>
                    <div className=' w-[33%] mx-2 my-5'>
                        <span className='mt-4 mx-3'>Bank Name</span>
                        <Inputfeild
                            name='bank_name'
                            onChange={handleChange}
                            formData={formData2}
                            type='text'
                            plholder='Bank Name'
                        />
                    </div>
                    <div className=' w-[33%] mx-2 my-5'>
                        <span className='mt-4 mx-3'>Beginning Balance Date</span>
                        <Inputfeild
                            onChange={handleChange}
                            formData={formData2}
                            type='date'
                            name='begin_bal_date'
                            plholder='Beginning Balance Date'
                        />
                    </div>
                </div>

                <div className="flex items-center justify-around mx-5">
                    <div className=' w-[33%] mx-2 my-5'>
                        <span className='mt-4 mx-3'>Total Deposit</span>
                        <Inputfeild
                            name='total_deposit'
                            onChange={handleChange}
                            formData={formData2}
                            type='number'
                            plholder='Total Deposit'
                        />
                    </div>
                    <div className=' w-[33%] mx-2 my-5'>
                        <span className='mt-4 mx-3'>Ending Balance Date</span>
                        <Inputfeild
                            name='ending_bal_date'
                            onChange={handleChange}
                            formData={formData2}
                            type='date'
                            plholder='Ending Balance Date'
                        />
                    </div>
                    <div className=' w-[33%] mx-2 my-5'>
                        <span className='mt-4 mx-3'>Ending Balance Amount</span>
                        <Inputfeild
                            name='ending_bal_amount'
                            onChange={handleChange}
                            formData={formData2}
                            type='number'
                            plholder='Ending Balance Amount'
                        />
                    </div>
                </div>

                <div className=' w-[70%] mx-2 my-5'>
                    <span className='mt-4 mx-3'> Beginning Balance Amount</span>
                    <Inputfeild
                        name='begin_bal_amount'
                        onChange={handleChange}
                        formData={formData2}
                        type='number'
                        plholder='Beginning Balance Amount'
                    />
                </div>


                <div className='mt-[90px] flex justify-center gap-4 items-center w-full'>
                    <button type='submit' className='px-4 py-2 w-full rounded-lg bg-blue-500 text-white focus:border-solid focus:border-blue-900 outline-none  mb-4 ' >{loading ? "processing..." : `Submit ${title}`}</button>
                </div>

            </div>
        </form>
    </>)
}