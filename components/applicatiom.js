

import React, { useEffect } from 'react'
import { FaCheck, FaCloudUploadAlt, FaTimes, FaTimesCircle } from 'react-icons/fa'
import { FiTriangle } from 'react-icons/fi'
import axios from 'axios';
import { useState } from 'react'
import { useRouter } from 'next/router';
import { AiFillFilePdf } from 'react-icons/ai';
import API from './API';
import LoadingModal from './LoadingModal ';

const date = new Date();
const year = date.getFullYear(); // e.g. 2022
const month = date.getMonth() + 1; // months are zero-indexed, so add 1 to get the actual month number (e.g. 5 for May)
const day = date.getDate(); // e.g. 28
const today = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

const Application = ({ application, page }) => {
    const router = useRouter()
    const [applicaitonPdfs, setApplicaitonPdfs] = useState([])
    const [statementPdfs, setStatementPdfs] = useState([])
    const [showPdfModal, setShowPdfModal] = useState(false)
    const [showFunders, setShowFunders] = useState(false)
    const [pdf, setPdf] = useState()
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
    const [loadingPdfs, setLoadingPdfs] = useState(false)

    useEffect(() => {
        application && setFormData({
            name_of_business: application?.name_of_business,
            status: application?.status || 'Created',
            status_description: application?.status_description,
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

        const fetch = async () => {
            setLoadingPdfs(true)
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
                // console.log(type);
                if (type.includes('Application')) {
                    setApplicaitonPdfs([...applicaitonPdfs, item])
                } else {
                    setStatementPdfs([...statementPdfs, item])
                }
            });
            setLoadingPdfs(false)
        }
        if (application?.application_id) {
            fetch()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [application])

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        console.log({ formData });

        try {
            const res = await API.put(`/${application?.application_id}/`, formData)
            console.log(res);
            if (res.statusText === "Created") {
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

    const [fundersArray, setFundersArray] = useState([])
    const [fundersArrayO, setFundersArrayO] = useState([])

    useEffect(() => {
        const API = axios.create({
            baseURL: 'http://localhost:8000/funders/',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })

        const fetch = async () => {
            setLoading(true)
            var funders = []
            const res = await API.get("/")
            // console.log(res.data);
            const res2 = await axios.get(`http://localhost:8000/api/submittedApplications/${application?.application_id}/`, {
                headers: {
                    'Accept': 'application/json'
                },
            }).catch(err => {
                console.log(err);
            })
            // console.log(res2);
            if (res2?.status === 200) {
                if(!res?.data) return;
                var l = []
                var newItems = [];
                res2.data.forEach(item => {
                    const newList = res?.data?.find(funder => funder?.name !== item?.funder?.name)
                    l.push(newList)
                    const newItem = res?.data?.find(funder => funder?.name === item?.funder?.name)
                    newItems.push({ ...newItem, submited: true })
                });
                const d = [...l, ...newItems]
                funders=d
            } else {
                funders = res.data
            }
            // console.log(res);
            setFundersArray(funders)
            setFundersArrayO(funders)
            setSelectedFundersArray([])
            setLoading(false)
        }
        if (application?.application_id) {
            console.log(application?.application_id);
            fetch()
        }
    }, [application])

    const [selectedFundersArray, setSelectedFundersArray] = useState([])

    const handleSendApplication = async () => {
        setLoading(true)
        const formData = { ...application, funder_names: selectedFundersArray }
        const res = await axios.post("http://localhost:8000/submittedApplications/", formData).catch(err => {
            console.log(err);
        })
        setFundersArray(fundersArrayO)
        setSelectedFundersArray([])
        console.log(res);
        setLoading(false)
    }

    return (<>
        <LoadingModal loading={loading} />

        <div className={`${showFunders ? "opacity-100 z-10" : "opacity-0 pointer-events-none"} fixed top-0 left-0 w-full h-screen grid place-items-center`} style={{ transition: 'opacity .15s ease-in' }}>
            <div className="absolute top-0 left-0 w-full h-screen bg-black/50 cursor-pointer" onClick={() => setShowFunders(false)}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-5 py-10 min-w-[310px] mx-auto md:min-w-[520px]">
                <FaTimes className='absolute top-2 right-2 cursor-pointer' onClick={() => setShowFunders(false)} />
                <div className="w-full flex gap-2">
                    <div className="flex flex-col gap-2 border w-1/2 h-[300px] overflow-auto">
                        {fundersArray.map(funder => {
                            return (
                                <div key={`main_${funder?.name}`} className={`${funder?.submited ? 'cursor-not-allowed' : 'cursor-pointer'} hover:bg-slate-200 p-3 flex items-center justify-between`} onClick={() => {
                                    if (funder?.submited) return;
                                    const selected = fundersArray.find(item => item.name === funder?.name)
                                    const newSelectedFundersArray = [...selectedFundersArray, selected]
                                    setSelectedFundersArray(newSelectedFundersArray)
                                    const newFundersArray = fundersArray.filter(item => item.name !== funder?.name)
                                    setFundersArray(newFundersArray)
                                }}>{funder?.name} {funder?.submited && <FaCheck />}</div>
                            )
                        })}
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="">
                            <FiTriangle className='rotate-90' />
                            <FiTriangle className='-rotate-90 mt-4' />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 border w-1/2 h-[300px] overflow-auto">
                        {selectedFundersArray.map(funder => {
                            return (
                                <div key={`selected_${funder?.name}`} className="hover:bg-slate-200 p-3 cursor-pointer" onClick={() => {
                                    const selected = selectedFundersArray.find(item => item.name === funder?.name)
                                    const newFunderArray = [...fundersArray, selected]
                                    setFundersArray(newFunderArray)
                                    const newSelectedFundersArray = selectedFundersArray.filter(item => item.name !== funder?.name)
                                    setSelectedFundersArray(newSelectedFundersArray)
                                }}>{funder?.name}</div>
                            )
                        })}
                    </div>
                </div>
                <button className="mt-4 py-2 px-8 bg-black text-white" onClick={handleSendApplication}>Send</button>
            </div>
        </div>

        <div className='w-[85%] mx-auto items-center  py-3 rounded-lg mt-[60px]'>
            <span className='absolute top-6 right-10 text-[15px] h-[20px] w-[20px] flex justify-center my-2' ><FaTimes size={20} className="cursor-pointer" onClick={() => {
                setLoading(true)
                router.back()
            }} /></span>

            <form action="" method="post" className='flex' onSubmit={handleSubmit} >
                <div className='w-[45%] mb-[160px] '>
                    <div className='flex justify-between max-w-[300px] items-center mx-4 mb-3 border-b border-slate-200'>
                        <h3>APPLICATION DATA</h3>
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
                            application={application}
                            // value={formData.name}
                            onChange={handleInputChange}
                            disabled={!isEditable}

                        />
                    </div>

                    {!loadingPdfs && !loading ?
                        <div className='flex items-center gap-5 w-full mx-2 mt-[40px]'>
                            <div className=''>
                                <h2 className='text-[13px] text-black'>Bank Statement</h2>
                                <div className='flex items-center gap-2 mt-1'>
                                    {statementPdfs[0] ? <>
                                        <div className='bg-gray-300 cursor-pointer rounded-[10px] text-black grid place-items-center w-[50px] h-[40px]'>
                                            <AiFillFilePdf size={20}
                                                onClick={() => {
                                                    setPdf(statementPdfs[0])
                                                    setShowPdfModal(true)
                                                }}
                                            />
                                        </div>
                                    </> :
                                        <div className={!isEditable && "cursor-not-allowed"}><FileUpload disabled={!isEditable} onChange={handleInputChange} /></div>}

                                    {statementPdfs[1] ? <>
                                        <div className='bg-gray-300 cursor-pointer rounded-[10px] text-black grid place-items-center w-[50px] h-[40px]'>
                                            <AiFillFilePdf size={20}
                                                onClick={() => {
                                                    setPdf(statementPdfs[1])
                                                    setShowPdfModal(true)
                                                }}
                                            />
                                        </div>
                                    </> :
                                        <div className={!isEditable && "cursor-not-allowed"}><FileUpload disabled={!isEditable} onChange={handleInputChange} /></div>}

                                    {statementPdfs[2] ? <>
                                        <div className='bg-gray-300 cursor-pointer rounded-[10px] text-black grid place-items-center w-[50px] h-[40px]'>
                                            <AiFillFilePdf size={20}
                                                onClick={() => {
                                                    setPdf(statementPdfs[2])
                                                    setShowPdfModal(true)
                                                }}
                                            />
                                        </div>
                                    </> :
                                        <div className={!isEditable && "cursor-not-allowed"}><FileUpload disabled={!isEditable} onChange={handleInputChange} /></div>}
                                </div>
                            </div>

                            <div className=''>
                                <h2 className='text-[13px] text-black'>Application</h2>
                                <div className='flex items-center gap-2 mt-1'>
                                    {applicaitonPdfs[0] ? <>
                                        <div className='bg-gray-300 cursor-pointer rounded-[10px] text-black grid place-items-center w-[50px] h-[40px]'>
                                            <AiFillFilePdf size={20}
                                                onClick={() => {
                                                    setPdf(applicaitonPdfs[0])
                                                    setShowPdfModal(true)
                                                }}
                                            />
                                        </div>
                                    </> :
                                        <div className={!isEditable && "cursor-not-allowed"}><FileUpload disabled={!isEditable} onChange={handleInputChange} /></div>}

                                    {applicaitonPdfs[1] ? <>
                                        <div className='bg-gray-300 cursor-pointer rounded-[10px] text-black grid place-items-center w-[50px] h-[40px]'>
                                            <AiFillFilePdf size={20}
                                                onClick={() => {
                                                    setPdf(applicaitonPdfs[1])
                                                    setShowPdfModal(true)
                                                }}
                                            />
                                        </div>
                                    </> :
                                        <div className={!isEditable && "cursor-not-allowed"}><FileUpload disabled={!isEditable} onChange={handleInputChange} /></div>}
                                </div>
                            </div>
                        </div>
                        :
                        "Loading..."}

                    {!page && <div className="w-[200px] bg-blue-500 text-white font-semibold mt-6 py-4 text-center cursor-pointer"
                        onClick={() => setShowFunders(true)}>Submit Application</div>}

                </div>

                <div className='w-[55%]'>
                    <div className='flex justify-between max-w-[450px] items-center mx-4 mb-3 p-2 border-b border-slate-200'>
                        <h3>Additional Information</h3>
                        {!page && <button type="button" className='px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none  mb-4 '
                            onClick={handleEditButtonClick}
                        >
                            {isEditable ? 'Cancel' : 'Edit'}
                        </button>}

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

                        {isEditable && <div className='mt-[40px] flex justify-center gap-4 items-center w-[50%] mx-[100px]'>

                            <button type='submit' className='px-4 py-2  rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none  mb-4 '>{loading ? "processsing..." : "Submit"}</button>

                            <h2 className='mt-[-15px] cursor-pointer'>request additional info</h2>

                            {/* <Emailverifybutton
                            title = 'request additional info'
                        /> */}

                        </div>}



                    </div>

                </div>

            </form>

        </div>

        {showPdfModal && <Viewer pdfObj={pdf} setShowPdfModal={setShowPdfModal} />}
    </>)

}

export default Application

const Viewer = ({ pdfObj, setShowPdfModal }) => {
    // console.log(pdfObj);
    // const [file, setFile] = useState()
    // const [pdfUrl, setPdfUrl] = useState()
    const [loading, setLoading] = useState(false);
    // console.log(`http://localhost:8000${pdfObj?.pdf_urls}`);
    const baseUrl = `http://localhost:8000${pdfObj?.pdf_urls}`

    // useEffect(() => {
    //     const fetch = async () => {
    //         setLoading(true)
    //         const config = {
    //             responseType: 'blob',
    //             headers: {
    //                 'Content-Type': 'application/pdf',
    //             }
    //         };
    //         const response = await axios.get(baseUrl, config);
    //         var pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    //         var pdfUrl = URL.createObjectURL(pdfBlob);
    //         setPdfUrl(pdfUrl);

    //         setLoading(false)

    //         // Create a URL for the blob using the createObjectURL method
    //         //   console.log({ response });
    //         //   setFile(response.data)
    //         //   const url = URL.createObjectURL(response.data);
    //         //   console.log(url);
    //         //   return () => URL.revokeObjectURL(url);
    //     }
    //     fetch()
    // }, [pdfObj])

    return (<>
        <LoadingModal loading={loading} />
        <div className="fixed top-0 left-0 w-full h-screen overflow-auto z-10 bg-white text-black flex items-center justify-center">
            <FaTimesCircle className='absolute right-5 top-5 cursor-pointer' onClick={() => setShowPdfModal(false)} />
            <div className='w-[90%] m-auto flex flex-col-reverse md:flex-row justify-between'>
                <div className="flex-[2]">
                    <div className="mt-1 mb-3 text-center font-bold text-lg">
                        {pdfObj.pdf_type}
                    </div>
                    <div className="">
                        <div className="flex items-center">
                            <Inputfeild2
                                type='text'
                                label='business_name'
                                name="business_name"
                                plholder=""
                                disabled='false'
                                onChange={() => { }}
                                formData={pdfObj}
                            />
                            <Inputfeild2
                                type='text'
                                label='bank_name'
                                name="bank_name"
                                plholder=""
                                disabled='false'
                                onChange={() => { }}
                                formData={pdfObj}
                            />
                        </div>
                        <div className="flex items-center">
                            <Inputfeild2
                                type='text'
                                label='begin_bal_amount'
                                name="begin_bal_amount"
                                plholder=""
                                disabled='false'
                                onChange={() => { }}
                                formData={pdfObj}
                            />
                            <Inputfeild2
                                type='text'
                                label='begin_bal_date'
                                name="begin_bal_date"
                                plholder=""
                                disabled='false'
                                onChange={() => { }}
                                formData={pdfObj}
                            />
                        </div>
                        <div className="flex items-center">
                            <Inputfeild2
                                type='text'
                                label='ending_bal_amount'
                                name="ending_bal_amount"
                                plholder=""
                                disabled='false'
                                onChange={() => { }}
                                formData={pdfObj}
                            />
                            <Inputfeild2
                                type='text'
                                label='ending_bal_date'
                                name="ending_bal_date"
                                plholder=""
                                disabled='false'
                                onChange={() => { }}
                                formData={pdfObj}
                            />
                        </div>
                        <div className="flex items-center">
                            <Inputfeild2
                                type='text'
                                label='total_deposit'
                                name="total_deposit"
                                plholder=""
                                disabled='false'
                                onChange={() => { }}
                                formData={pdfObj}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex-[3]">
                    <iframe src={baseUrl} width="100%" height="600" frameBorder="0" />
                </div>
            </div>
        </div>
    </>)
}


function removeQuotes(str) {
    return str.replace(/'/g, '');
}
function purifyData(str) {
    const match = str.match(/\{(.+?)\}/);
    if (match) {
        return removeQuotes(match[1]);
    }
    return '';
}
const Inputfeild = ({ type, application, label, read, name, disabled, onChange, formData, plholder }) => {
    // console.log({ type, application, label, read, name, disabled, onChange, formData, plholder });
    
    return (
        <div className='flex gap-1 flex-col mx-3 my-2'>
            <label className='text-[14px]'>{label}</label>
            <input type={type}
                name={name}
                readOnly={read}
                disabled={disabled}
                // value={value}
                onChange={onChange}
                value={formData?.[name] ? formData?.[name] : application?.[name]}
                placeholder={plholder}
                className='px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none w-full mb-4' id="" />
        </div>
    )
};

const Inputfeild2 = ({ type, application, label, read, name, disabled, onChange, formData, plholder }) => {
    return (
        <div className='flex gap-1 flex-col mx-3 my-2'>
            <label className='text-[14px]'>{label}</label>
            <input type={type}
                name={name}
                readOnly={read}
                disabled={disabled}
                // value={value}
                onChange={onChange}
                value={formData?.[name] ? purifyData(formData?.[name]) : application?.[name]}
                placeholder={plholder}
                className='px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none w-full mb-4' id="" />
        </div>
    )
};


function FileUpload(props) {

    // const handleFileUpload = (event) => {
    //     const file = event.target.files[0];
    //     if (file && file.type === 'application/pdf') {
    //         // Handle the valid PDF file here
    //         console.log('Valid PDF file:', file);
    //     } else {
    //         // Handle invalid file type here
    //         throw ('Invalid file type');
    //     }
    // };

    // console.log(props.disabled);

    return (
        <label htmlFor="bankstatement1" className='bg-gray-300 cursor-pointer rounded-[10px] text-black grid place-items-center w-[50px] h-[40px]'>
            <FaCloudUploadAlt size={20} />
            <input type="file"
                disabled={props.disabled}
                // disabled={true}
                id="bankstatement1" name={props.name} accept="application/pdf" onChange={props.onChange} readable={props.read} className='hidden' />
        </label>
    )
}


const SelectMenuNew = (props) => {
    return (<>
        <div className='flex gap-1 flex-col mx-3 my-2'>

            <select className='text-[15px] w-full h-[40px] border border-gray-500 rounded-lg'
                disabled={props.disabled} name={props.name} onChange={props.onChange}>
                <option value="Created">Created</option>
                <option value="Submitted">Submitted</option>
                <option value="Error Submitting">Error Submitting</option>
                <option value="Scraping Data">Scraping Data</option>
                <option value="Needs Manual Entry">Needs Manual Entry</option>
                <option value="Ready for Review">Ready for Review</option>
                <option value="Error Scraping">Error Scraping</option>
            </select>

        </div>
    </>)
}
