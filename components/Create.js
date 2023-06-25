

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
import { getCookie, getToday, minMaxValidator, scrollToInput } from '../utils/helpers';


const Create = ({ application, viewOnly, title }) => {
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [application_id, setApplication_id] = useState('')
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date_submitted: getToday(new Date()),
        status_date: getToday(new Date()),
        status: 'Created',
        status_description: 'Created',
        name_of_business: '',
        legal_business_name: '',

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

        email_id: '', //include
        statement_missing: false,
        opportunity_exist: true,
        opportunity_id: "", //include
        source_email: "", //include
        error: false,
        subject: "", //include
        errors: [],
        multiple_owners: false,
        owners: []
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
    const statusOptions = [
        { id: 1, status: 'Created', status_description: 'Created' },
        { id: 2, status: 'Scraping Data', status_description: 'Scraping Data' },
        { id: 3, status: 'Needs Manual Entry', status_description: 'Needs Manual Entry' },
        { id: 4, status: 'Ready for Review', status_description: 'Ready for Review' },
        { id: 5, status: 'Error Scraping', status_description: 'Error Scraping' },
        { id: 6, status: 'Error Submitting', status_description: 'Error Submitting' },
    ]

    useEffect(() => {
        if (application) {
            setFormData({ ...application })
        }
    }, [application])


    function validateZipCode(zipCode) {
        const zipCodeRegex = /^(\d{5}|\d{8}|\d{9})$/;
        return zipCodeRegex.test(zipCode);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        if (name === 'status') {
            setFormData((prevData) => ({ ...prevData, status_description: statusOptions.find(i => i.status === value).status_description }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        var zipError, ownerZipError, phoneError, mobileError, ownerPhoneError;
        // perform check
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

        setZipError(''); setOwnerZipError('');

        setLoading(true)
        try {
            var res;
            if (application) {
                res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/applications/${application?.application_id}/`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('jwt')}`,
                    },
                    withCredentials: true,
                }).catch(err => {
                    console.log(err);
                })
                // console.log(res);
                if (res.statusText === "Created") {
                    setLoading(false)
                    router.back()
                }
            } else {
                res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/applications/`, formData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('jwt')}`,
                    },
                    withCredentials: true,
                }).catch(err => {
                    console.log(err);
                })
                // res = await API.post("/", formData)
                if (res?.data?.application_id) {
                    res?.data?.application_id && setApplication_id(res?.data?.application_id)
                    setStep(1)
                    document.getElementById('step2').scrollIntoView()
                }
            }

        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    };

    return (<>
        <LoadingModal loading={loading} />
        <div className={`${step === 0 ? "opacity-100 pointer-events-auto" : "opacity-0 !hidden pointer-events-none absolute top-[-1000%]"} w-[80%] mx-auto flex justify-center rounded-lg mt-[60px] mb-10 relative`} style={{
            transition: 'all .15s ease-in'
        }}>
            {/* <Creates/> */}
            <div className='md:w-[80%] w-full mx-auto p-2 border flex flex-col justify-center'>
                {!viewOnly && <FaTimes size={20} className='absolute -top-1 right-0 cursor-pointer' onClick={() => {
                    setLoading(true)
                    router.back()
                }} />}
                {!title ? <h1 className='md:text-[25px] text-[20px] text-center md:my-5 my-2' >{application ? "Update Application" : 'Create New Application'}</h1> :
                    <h1 className='md:text-[25px] text-[20px] text-center md:my-5 my-2' >{title}</h1>}

                <form method='POST' action='' onSubmit={handleSubmit} >
                    <div className='md:max-w-[700px] w-full mx-auto flex flex-col gap-5'>

                        {!viewOnly && application && <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full mt-2 mb-5'>
                                <span className='mx-3'>Status</span>
                                <div className='flex gap-1 flex-col mx-3 my-2'>
                                    <select className='text-[15px] w-full h-[40px] border border-gray-500 rounded-lg'
                                        name='status' onChange={handleChange}>
                                        <option value="">SELECT</option>
                                        {statusOptions.map(item => {
                                            return (<option key={item.id} value={item.status} selected={formData['status'] === item.status ? true : false}>{item.status}</option>)
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>Status Description</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='status_description'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Status Description'
                                />
                            </div>
                        </div>}

                        <h2 className='text-[19px] m-2 p-2 bg-slate-400'>Company Information</h2>

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>Legal Business Name</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='legal_business_name'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Legal Business Name'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>DBA</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='dba'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='DBA'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>Address</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    type='text'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='address'
                                    plholder='Address'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>Suite</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='suite'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Suite'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>City</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='city'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='City'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mt-1 mx-3'>State</span>
                                <SelectMenuNew
                                    disabled={viewOnly}
                                    onChange={handleChange}
                                    formData={formData}
                                    name='state'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>ZIP</span>
                                <Inputfeild
                                    disabled={viewOnly}
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
                            <div className='w-full'>
                                <span className='mx-3'>Phone</span>
                                <Inputfeild
                                    disabled={viewOnly}
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

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>Mobile</span>
                                <Inputfeild
                                    disabled={viewOnly}
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
                            <div className='w-full'>
                                <span className='mx-3'>E-mail</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    onChange={handleChange}
                                    formData={formData}
                                    type='email'
                                    name='email'
                                    plholder='E-mail'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>Federal Tax ID</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    name='federal_tax_id'
                                    plholder='Federal Tax ID'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>State of Inc</span>
                                <SelectMenuNew
                                    disabled={viewOnly}
                                    onChange={handleChange}
                                    formData={formData}
                                    name='state_inc'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>Legal Entry</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    name='legal_entry'
                                    plholder='Legal Entry'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>Date Business Started</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    onChange={handleChange}
                                    formData={formData}
                                    type='date'
                                    name='date_business_started'
                                    plholder='Date Business Started'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>Length of Owernship</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='length_of_ownership'
                                    plholder='Length of Owernship'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>Years at Location</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='years_at_location'
                                    plholder='Years at Location'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>Number Of Locations</span>
                                <Inputfeild
                                    disabled={viewOnly}
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

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>First Name</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='owner_first_name'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='First Name'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>Last Name</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='owner_last_name'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Last Name'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>Home Address</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    type='text'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='owner_home_address'
                                    plholder='Home Address'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>City</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='owner_city'
                                    type='text'
                                    onChange={handleChange}
                                    formData={formData}
                                    plholder='City'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mt-1 mx-3'>State</span>
                                <SelectMenuNew
                                    disabled={viewOnly}
                                    onChange={handleChange}
                                    formData={formData}
                                    name="owner_state"
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>ZIP</span>
                                <Inputfeild
                                    disabled={viewOnly}
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

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>SSN (999-99-9999)</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    type='text'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='owner_ssn'
                                    pattern="\d{3}-\d{2}-\d{4}"
                                    plholder='999-99-9999'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>Percentage of Ownership</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    type='number'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='owner_percentage_of_ownership'
                                    plholder='Percentage of Ownership'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>DOB</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    type='date'
                                    onChange={handleChange}
                                    formData={formData}
                                    name='owner_dob'
                                    plholder='DOB'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>Phone</span>
                                <Inputfeild
                                    disabled={viewOnly}
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

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>Name Of Business</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='name_of_business'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Name Of Business'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>Gross Monthly Sale</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='gross_monthly_sales'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='number'
                                    plholder='Gross Monthly Sale'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>Type of Product Sold</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='type_of_product_sold'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Type of Product Sold'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>Do you have any open Cash Advances [Y/N]</span>
                                <RadioFeild
                                    disabled={viewOnly}
                                    type='radio'
                                    onChange={handleChange}
                                    formData={formData}
                                    options={['YES', 'NO']}
                                    name='has_open_cash_advances'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'> Have you used a Cash Advance plan before [Y/N]</span>
                                <RadioFeild
                                    disabled={viewOnly}
                                    type='radio'
                                    onChange={handleChange}
                                    formData={formData}
                                    options={['YES', 'NO']}
                                    name='has_used_cash_advance_plan_before'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'> Using the Money For</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='using_money_for'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Using the Money For'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'> Description of Business: Retail</span>
                                <Inputfeild
                                    disabled={viewOnly}
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

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>Email Id</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='email_id'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Email Id'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>Opportunity Id</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='opportunity_id'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Opportunity Id'
                                />
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-5 justify-between items-center">
                            <div className='w-full'>
                                <span className='mx-3'>Source Email</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='source_email'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='email'
                                    plholder='Source Email'
                                />
                            </div>
                            <div className='w-full'>
                                <span className='mx-3'>Subject</span>
                                <Inputfeild
                                    disabled={viewOnly}
                                    name='subject'
                                    onChange={handleChange}
                                    formData={formData}
                                    type='text'
                                    plholder='Subject'
                                />
                            </div>
                        </div>
                    </div>

                    {!viewOnly && <div className='mt-[40px] flex justify-center gap-4 items-center w-full mx-auto'>
                        <button type='submit' className='px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none  mb-4 ' >{application ? 'Update' : 'Save and Continue'}</button>
                    </div>}
                </form>
            </div>
        </div>

        {!viewOnly && <div id="step2" className={`${step === 1 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none absolute top-[-1000%]"} w-[80%] mx-auto mt-[60px]`} style={{
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
        </div>}
    </>)
}

export default Create

const UploadFiles = ({ title, application_id }) => {
    const viewOnly = false;
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
        } else {
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file?.name) return alert('You have not selected any file!')
        setLoading(true)
        // console.log({ formData2 });
        // return;
        const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/pdfs/`

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
            const response = await axios.post(baseUrl, formDataWithFiles, {
                headers: {
                    // 'Content-Type': 'application/json',
                    'content-type': 'multipart/form-data',
                    'Authorization': `Bearer ${getCookie('jwt')}`,
                },
                withCredentials: true,
            }).catch(error => {
                console.log(error);
            });
            // console.log({ response });
            if (response.statusText === "Created") {
                setHasUploaded(true)
            }
        } catch (error) {
            // console.log(error);
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
                        <span className='mx-3'>Business Name</span>
                        <Inputfeild
                            disabled={viewOnly}
                            name='business_name'
                            onChange={handleChange}
                            formData={formData2}
                            type='text'
                            plholder='Business Name'
                        />
                    </div>
                    <div className=' w-[33%] mx-2 my-5'>
                        <span className='mx-3'>Bank Name</span>
                        <Inputfeild
                            disabled={viewOnly}
                            name='bank_name'
                            onChange={handleChange}
                            formData={formData2}
                            type='text'
                            plholder='Bank Name'
                        />
                    </div>
                    <div className=' w-[33%] mx-2 my-5'>
                        <span className='mx-3'>Beginning Balance Date</span>
                        <Inputfeild
                            disabled={viewOnly}
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
                        <span className='mx-3'>Total Deposit</span>
                        <Inputfeild
                            disabled={viewOnly}
                            name='total_deposit'
                            onChange={handleChange}
                            formData={formData2}
                            type='number'
                            plholder='Total Deposit'
                        />
                    </div>
                    <div className=' w-[33%] mx-2 my-5'>
                        <span className='mx-3'>Ending Balance Date</span>
                        <Inputfeild
                            disabled={viewOnly}
                            name='ending_bal_date'
                            onChange={handleChange}
                            formData={formData2}
                            type='date'
                            plholder='Ending Balance Date'
                        />
                    </div>
                    <div className=' w-[33%] mx-2 my-5'>
                        <span className='mx-3'>Ending Balance Amount</span>
                        <Inputfeild
                            disabled={viewOnly}
                            name='ending_bal_amount'
                            onChange={handleChange}
                            formData={formData2}
                            type='number'
                            plholder='Ending Balance Amount'
                        />
                    </div>
                </div>

                <div className='w-full'>
                    <span className='mx-3'> Beginning Balance Amount</span>
                    <Inputfeild
                        disabled={viewOnly}
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