

import React, { useEffect } from 'react'
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa'
import axios from 'axios';
import { useState } from 'react'
import { NextApiRequest, NextApiResponse } from 'next';
import FileUpload from './FileUpload';
import { useRouter } from 'next/router';
import { AiFillFilePdf } from 'react-icons/ai';
import API from './API';

const date = new Date();
const year = date.getFullYear(); // e.g. 2022
const month = date.getMonth() + 1; // months are zero-indexed, so add 1 to get the actual month number (e.g. 5 for May)
const day = date.getDate(); // e.g. 28
const today = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

const Application = ({ application }) => {
    const router = useRouter()
    const [applicaitonPdfs, setApplicaitonPdfs] = useState([])
    const [statementPdfs, setStatementPdfs] = useState([])
    const [formData, setFormData] = useState({
        name_of_business: '',
        status: "",
        status_description: "",
        status_date: today,
        advanced_price: '',
        commission_price: '',
        percentage: '',
        factor: '',
        total_fee: '',
        payback: '',
        term: '',
        frequency: '',
        payment: '',
        net_funding_amount: ''
    });
    const [loading, setLoading] = useState(false)
    const [isEditable, setIsEditable] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            const baseUrl = `http://localhost:8000/api/applications/${application.application_id}/pdfs/`
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            };
            const response = await axios.get(baseUrl, config);
            // console.log({ response });
            response.data.pdfs.forEach(item => {
                const type = item?.pdf_type?.toString()
                console.log(type);
                if (type.includes('Application')) {
                    setApplicaitonPdfs([...applicaitonPdfs, item])
                } else {
                    setStatementPdfs([...statementPdfs, item])
                }
            });
        }
        if (application?.application_id) {
            fetch()
        }
        application && setFormData({
            name_of_business: application?.name_of_business,
            status: application?.status?.name,
            status_description: application?.status?.description,
            status_date: today,
            advanced_price: application?.advanced_price,
            commission_price: application?.commission_price,
            percentage: application?.percentage,
            factor: application?.factor,
            total_fee: application?.total_fee,
            payback: application?.payback,
            term: application?.term,
            frequency: application?.frequency,
            payment: application?.payment,
            net_funding_amount: application?.net_funding_amount,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [application])

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        console.log({ formData });

        try {
            const res = await API.put(`/${application?.application_id}/`, formData)
            console.log(res);
            if (res.statusText === "Created"){
                setIsEditable(false)
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    };

    const handleEditButtonClick = () => {
        setIsEditable(!isEditable);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (

        <div className='w-[85%] mx-auto items-center  py-3 rounded-lg mt-[60px]'>

            <form action="" method="post" className='flex' onSubmit={handleSubmit} >

                <div className='w-[45%] mb-[160px] '>
                    <div className='flex justify-between max-w-[300px] items-center mx-4 mb-3 border-b border-slate-200'>
                        <h3>APPLICATION DATA</h3>
                        <span className='text-[15px] h-[20px] w-[20px] flex justify-center my-2' ><FaTimes size={20} className="cursor-pointer" onClick={() => router.back()} /></span>
                    </div>
                    <h2 className='text-[16px] mx-3 mb-3'>Bussiness Information</h2>

                    <div className='w-[75%]'>
                        <Inputfeild
                            formData={formData}
                            label='Business Name'
                            name='name_of_business'
                            type='text'
                            application={application}
                            // value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditable}
                        />

                        <SelectMenuNew
                            onChange={handleInputChange}
                            formData={formData}
                            name='status'
                            disabled={!isEditable}
                        />
                        <Inputfeild
                            formData={formData}
                            label='Status Description'
                            name='status_description'
                            type='text'
                            application={application.status}
                            // value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditable}

                        />
                    </div>

                    <div className='flex w-full mx-2 mt-[40px]'>

                        <div className='w-[45%] '>
                            <h2 className='text-[13px] text-black'>Application</h2>
                            <div className='flex items-center gap-2 mt-1'>
                                {applicaitonPdfs[0] ? <>
                                    <div className='bg-gray-300 cursor-pointer rounded-[10px] text-black grid place-items-center w-[50px] h-[40px]'>
                                        <AiFillFilePdf size={20} />
                                    </div>
                                </> : <>
                                    <FileUpload
                                        //  value={formData.name}
                                        onChange={handleInputChange}

                                    />
                                </>}
                                {applicaitonPdfs[1] ? <>
                                    <div className='bg-gray-300 cursor-pointer rounded-[10px] text-black grid place-items-center w-[50px] h-[40px]'>
                                        <AiFillFilePdf size={20} />
                                    </div>
                                </> : <>
                                    <FileUpload
                                        //  value={formData.name}
                                        onChange={handleInputChange}

                                    />
                                </>}
                                {applicaitonPdfs[2] ? <>
                                    <div className='bg-gray-300 cursor-pointer rounded-[10px] text-black grid place-items-center w-[50px] h-[40px]'>
                                        <AiFillFilePdf size={20} />
                                    </div>
                                </> : <>
                                    <FileUpload
                                        //  value={formData.name}
                                        onChange={handleInputChange}

                                    />
                                </>}
                            </div>
                        </div>
                        <div className='w-[30%]'>
                            <h2 className='text-[13px] text-black'>Bank Statement</h2>
                            <div className='flex items-center gap-2 mt-1'>
                                {statementPdfs[0] ? <>
                                    <div className='bg-gray-300 cursor-pointer rounded-[10px] text-black grid place-items-center w-[50px] h-[40px]'>
                                        <AiFillFilePdf size={20} />
                                    </div>
                                </> : <>
                                    <FileUpload
                                        //  value={formData.name}
                                        onChange={handleInputChange}

                                    />
                                </>}
                                {statementPdfs[1] ? <>
                                    <div className='bg-gray-300 cursor-pointer rounded-[10px] text-black grid place-items-center w-[50px] h-[40px]'>
                                        <AiFillFilePdf size={20} />
                                    </div>
                                </> : <>
                                    <FileUpload
                                        //  value={formData.name}
                                        onChange={handleInputChange}

                                    />
                                </>}
                            </div>
                        </div>

                    </div>

                </div>

                <div className='w-[55%]'>
                    <div className='flex justify-between max-w-[450px] items-center mx-4 mb-3 p-2 border-b border-slate-200'>
                        <h3>Additional Information</h3>
                        <button type="button" className='px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none  mb-4 '
                            onClick={handleEditButtonClick}
                        >
                            {isEditable ? 'Cancel' : 'Edit'}
                        </button>

                    </div>
                    <h2 className='text-[16px] mx-3 mb-3'>Bussiness Information</h2>

                    <div className=' gap-1 w-full flex-1 '>

                        <div className='flex'>
                            <div className='w-[40%]'>

                                <Inputfeild
                                    formData={formData}
                                    label='Advanced Amount'
                                    name='advanced_price'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditable}
                                />
                            </div>
                            <div className='flex gap-3 w-[60%] '>
                                <Inputfeild
                                    formData={formData}
                                    label='Commisson'
                                    name='commission_price'
                                    type='number'
                                    application={application}
                                    // Value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditable}
                                />
                                <Inputfeild
                                    formData={formData}
                                    label='%'
                                    name='percentage'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditable}

                                />
                            </div>
                        </div>

                        <div className='flex gap-1 w-full flex-1 '>
                            <div className='w-[40%]'>
                                <Inputfeild
                                    formData={formData}
                                    label='Factor'
                                    name='factor'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditable}

                                />
                            </div>
                            <div className='flex gap-3 w-[60%] '>
                                <Inputfeild
                                    formData={formData}
                                    label='Total fee'
                                    name='total_fee'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditable}

                                />
                            </div>

                        </div>

                        <div className='flex gap-1 w-full flex-1 '>
                            <div className='w-[40%]'>
                                <Inputfeild
                                    formData={formData}
                                    label='Payback'
                                    name='payback'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditable}

                                />
                            </div>
                            <div className='flex gap-3 w-[60%] '>
                                <Inputfeild
                                    formData={formData}
                                    label='Term'
                                    name='term'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditable}

                                />
                                <Inputfeild
                                    formData={formData}
                                    label='Frequency'
                                    name='frequency'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditable}

                                />
                            </div>

                        </div>

                        <div className='flex gap-1 w-full flex-1 '>
                            <div className='w-[40%]'>
                                <Inputfeild
                                    formData={formData}
                                    label='Payment'
                                    name='payment'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditable}

                                />
                            </div>
                            <div className='flex gap-3 w-[60%] '>
                                <Inputfeild
                                    formData={formData}
                                    label='Net Funding Amount'
                                    name='net_funding_amount'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={!isEditable}

                                />
                            </div>

                        </div>

                        {isEditable && <div className='mt-[90px] flex justify-center gap-4 items-center w-[50%] mx-[100px]'>

                            <button type='submit' className='px-4 py-2  rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none  mb-4 '>{loading ? "processsing..." : "Submit"}</button>

                            <h2 className='mt-[-15px]'>request additional info</h2>

                            {/* <Emailverifybutton
                            title = 'request additional info'
                        /> */}

                        </div>}



                    </div>

                </div>

            </form>

        </div>

    )

}

export default Application


const Inputfeild = (props) => {
    // console.log(props.formData[props.name]);
    const [value, setValue] = useState('')

    useEffect(() => {
        const defaultVal = props?.application?.[props?.name]
        setValue(defaultVal)
    }, [props])

    return (
        <div className='flex gap-1 flex-col mx-3 my-2'>
            <label className='text-[14px]'>{props.label}</label>
            <input type={props.type}
                name={props.name}
                readOnly={props.read}
                disabled={props.disabled}
                // value={value}
                onChange={props.onChange}
                value={props.formData[props.name] ? props.formData[props.name] : props?.application?.[props?.name]}
                placeholder={props.plholder}
                className='px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none w-full mb-4' id="" />
        </div>
    )
};

const SelectMenuNew = (props) => {
    return (<>
        <div className='flex gap-1 flex-col mx-3 my-2'>

            <select className='text-[15px] w-full h-[40px] border border-gray-500 rounded-lg'
                disabled={props.disabled} name={props.name} onChange={props.onChange}>
                <option value="Submitted">Submitted</option>
                <option value="Error Submitting">Error Submitting</option>
                <option value="Approved">Approved</option>
                <option value="Declined">Declined</option>
                <option value="Scraping Data">Scraping Data</option>
                <option value="Needs Manual Entry">Needs Manual Entry</option>
                <option value="Ready for Review">Ready for Review</option>
                <option value="Error Scraping">Error Scraping</option>
            </select>

        </div>
    </>)
}
