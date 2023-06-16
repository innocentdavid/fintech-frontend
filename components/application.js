

import React, { useEffect, useRef } from 'react'
import { FaCheck, FaCloudUploadAlt, FaTimes, FaTimesCircle } from 'react-icons/fa'
import { FiTriangle } from 'react-icons/fi'
import axios from 'axios';
import { useState } from 'react'
import { useRouter } from 'next/router';
import { AiFillFilePdf } from 'react-icons/ai';
// import API from './API';
import LoadingModal from './LoadingModal ';
import { getCookie, getToday } from '../utils/helpers';
import PdfViewer from './PdfViewer'
import pdfjs from "pdfjs-dist";
// import { PDFViewer, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
// import Document from "react-pdf";


const Application = ({ application, defaultPdfs, fundersResponse, submittedApplications, page }) => {
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
        status_date: getToday(new Date()),
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
    const [refreshFunders, setRefreshFunders] = useState(false)
    const [showAddPdf, setShowAddPdf] = useState(false)
    const [reFreshPdf, setReFreshPdf] = useState(false)
    const [pdfToAdd, setPdfToAdd] = useState({
        application_id: '',
        pdf_type: "",
        business_name: "",
        bank_name: "",
        begin_bal_date: "",
        begin_bal_amount: "",
        total_deposit: "",
        ending_bal_date: "",
        ending_bal_amount: "",
    })

    // set details and get pdfs
    useEffect(() => {
        setPdfToAdd({ ...pdfToAdd, application_id: application.application_id });
        application && setFormData({
            name_of_business: application?.name_of_business,
            status: application?.status || 'Created',
            status_description: application?.status_description,
            status_date: getToday(new Date()),
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

        if (defaultPdfs) {
            var applicaitonPdfs = []
            var statementPdfs = []
            defaultPdfs?.pdfs?.forEach(item => {
                const type = item?.pdf_type?.toString()
                // console.logplication_id_cplication_id_cplication_id_c(type);
                if (type) {
                    if (type.includes('Application')) {
                        applicaitonPdfs.push(item)
                    } else {
                        statementPdfs.push(item)
                    }
                }
            });
            setApplicaitonPdfs(applicaitonPdfs)
            setStatementPdfs(statementPdfs)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true)
        // console.log({ formData });

        const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/${application?.application_id}/`, formData, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getCookie('jwt')}`,
            },
            withCredentials: true,
        }).catch(err => {
            console.log(err);
            setLoading(false)
            return;
        })
        if (res.statusText === "Created") {
            setIsEditable(false)
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

    function mergeArrays(A, B) {
        return A.concat(B.filter(obj => !A.find(o => o.id === obj.id)));
    }
    function removeDuplicates(A, B) {
        // A is the total list // B is the list that contain unwanted ones
        return A.filter(a => !B.find(b => a.id === b.id));
    }

    // get Funders
    useEffect(() => {
        if (fundersResponse.length > 0) {
            var funders = []
            if (submittedApplications.length > 0) {
                let submittedApplicationFunders = []
                
                submittedApplications?.forEach(application => {
                    submittedApplicationFunders.push({ ...application?.funder, submitted: true })
                });

                funders = mergeArrays(submittedApplicationFunders, removeDuplicates(fundersResponse, submittedApplicationFunders))
            } else {
                funders = fundersResponse
            }
            // console.log({funders});
            setFundersArray(funders)
            setFundersArrayO(funders)
            setSelectedFundersArray([])
        }
    }, [application, fundersResponse, refreshFunders, submittedApplications])

    const [selectedFundersArray, setSelectedFundersArray] = useState([])

    const handleSendApplication = async () => {
        if (selectedFundersArray.length > 0) {
            setLoading(true)
            const formData = {
                ...application,
                date_submitted: getToday(new Date()),
                status: 'Submitted',
                status_date: getToday(new Date()),
                status_description: 'Submitted',
                funder_names: selectedFundersArray
            }
            // console.log(formData);
            // return;
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/submittedApplications/`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getCookie('jwt')}`,
                },
                withCredentials: true
            }).catch(err => {
                console.log(err);
                alert('Something went wrong');
                setLoading(false)
                return;
            })
            if (res?.statusText) {
                setShowFunders(false)
                const list = []
                selectedFundersArray.forEach(funder => {
                    list.push({ ...funder, submitted: true })
                })
                const concat = [...fundersArray, ...list]
                setFundersArray(concat)
                setFundersArrayO(concat)
                setSelectedFundersArray([])
            }
            setLoading(false)
        }
    }

    return (<>
        <LoadingModal loading={loading} />

        <div className={`${showFunders ? "opacity-100 z-10 grid" : "hidden opacity-0 pointer-events-none"} fixed top-0 left-0 w-full h-screen place-items-center`} style={{ transition: 'opacity .15s ease-in' }}>
            <div className="absolute top-0 left-0 w-full h-screen bg-black/50 cursor-pointer" onClick={() => {
                setShowFunders(false)
                setFundersArray(fundersArrayO)
                setSelectedFundersArray([])
            }}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-5 py-10 min-w-[310px] mx-auto md:min-w-[520px]">
                <FaTimes className='absolute top-2 right-2 cursor-pointer' onClick={() => {
                    setShowFunders(false)
                    setFundersArray(fundersArrayO)
                    setSelectedFundersArray([])
                }} />

                <div className="w-full flex gap-2">
                    <div className="flex flex-col gap-2 border w-1/2 h-[300px] overflow-auto">
                        {fundersArray?.length>0 && fundersArray?.map((funder, index) => {
                            return (
                                <div key={`main_${funder?.name}_${index + 1}`} className={`${funder?.submitted ? 'cursor-not-allowed' : 'cursor-pointer'} hover:bg-slate-200 p-3 flex items-center justify-between`}
                                    onClick={() => {
                                        if (funder?.submitted) return;
                                        const selected = fundersArray.find(item => item.name === funder?.name)
                                        const newSelectedFundersArray = [...selectedFundersArray, selected]
                                        setSelectedFundersArray(newSelectedFundersArray)
                                        const newFundersArray = fundersArray.filter(item => item.name !== funder?.name)
                                        setFundersArray(newFundersArray)
                                    }}>{funder?.name} {funder?.submitted && <FaCheck />}</div>
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
                <button className={`${selectedFundersArray.length > 0 ? 'bg-black' : 'bg-black'} mt-4 py-2 px-8 text-white`} onClick={handleSendApplication}>Send</button>
            </div>
        </div>

        <div className='md:first-letter:w-[85%] mx-auto items-center  py-3 rounded-lg mt-[60px] relative'>
            <FaTimes size={20} className="cursor-pointer absolute z-[2] top-0 right-2 text-[15px] h-[20px] w-[20px] flex justify-center my-2" onClick={() => {
                // setLoading(true)
                router.back()
            }} />

            <form action="" method="post" className='flex flex-col-reverse lg:flex-row' onSubmit={handleSubmit} >
                <div className='w-full lg:w-[45%] mb-[160px] '>
                    <div className='hidden lg:flex justify-between max-w-[300px] items-center mx-4 mb-3 border-b border-slate-200'>
                        <h3>APPLICATION DATA</h3>
                    </div>
                    <h2 className='text-[16px] mx-3 mb-3'>Bussiness Information</h2>

                    <div className='w-full md:w-[75%]'>
                        <Inputfeild
                            formData={formData}
                            label='Business Name'
                            name='name_of_business'
                            type='text'
                            application={application}
                            // value={formData.name}
                            onChange={handleInputChange}
                            // disabled={!isEditable}
                            disabled={true}
                        />

                        {/* <SelectMenuNew
                            onChange={handleInputChange}
                            formData={formData}
                            name='status'
                            // disabled={!isEditable}
                            disabled={true}
                        /> */}
                        <Inputfeild
                            formData={formData}
                            label='Status'
                            name='status'
                            type='text'
                            application={application}
                            // value={formData.name}
                            onChange={handleInputChange}
                            // disabled={!isEditable}
                            disabled={true}
                        />
                        <Inputfeild
                            formData={formData}
                            label='Status Description'
                            name='status_description'
                            type='text'
                            application={application}
                            // value={formData.name}
                            onChange={handleInputChange}
                            // disabled={!isEditable}
                            disabled={true}
                        />
                    </div>

                    <div className='flex flex-col md:flex-row items-center gap-2 md:gap-5 w-full md:pl-2 mt-5 md:mt-[40px]'>
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
                                    <div className={!isEditable && "cursor-not-allowed"}>
                                        <FileUpload
                                            pdfToAdd={pdfToAdd}
                                            setPdfToAdd={setPdfToAdd}
                                            type={'Statement 1'}
                                            setShowAddPdf={setShowAddPdf}
                                            disabled={!isEditable}
                                            onChange={handleInputChange}
                                        />
                                    </div>}

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
                                    <div className={!isEditable && "cursor-not-allowed"}><FileUpload
                                        pdfToAdd={pdfToAdd}
                                        setPdfToAdd={setPdfToAdd}
                                        type={'Statement 2'}
                                        setShowAddPdf={setShowAddPdf}
                                        disabled={!isEditable}
                                        onChange={handleInputChange}
                                    />
                                    </div>}

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
                                    <div className={!isEditable && "cursor-not-allowed"}><FileUpload
                                        pdfToAdd={pdfToAdd}
                                        setPdfToAdd={setPdfToAdd}
                                        type={'Statement 3'}
                                        setShowAddPdf={setShowAddPdf}
                                        disabled={!isEditable}
                                        onChange={handleInputChange}
                                    />
                                    </div>}
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
                                    <div className={!isEditable && "cursor-not-allowed"}><FileUpload
                                        pdfToAdd={pdfToAdd}
                                        setPdfToAdd={setPdfToAdd}
                                        type={'Application file 1'}
                                        setShowAddPdf={setShowAddPdf}
                                        disabled={!isEditable}
                                        onChange={handleInputChange}
                                    />
                                    </div>}

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
                                    <div className={!isEditable && "cursor-not-allowed"}><FileUpload
                                        pdfToAdd={pdfToAdd}
                                        setPdfToAdd={setPdfToAdd}
                                        type={'Application file 2'}
                                        setShowAddPdf={setShowAddPdf}
                                        disabled={!isEditable}
                                        onChange={handleInputChange}
                                    />
                                    </div>}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-7">
                        {!page && <button type="button" className='px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 focus:bg-slate-300 focus:border-solid focus:border-blue-900 outline-none  mb-4 '
                            onClick={handleEditButtonClick}
                        >
                            {isEditable ? 'Done' : 'Edit'}
                        </button>}
                    </div>

                    {!page && <div className="ml-2 w-[200px] bg-blue-500 text-white font-semibold mt-6 py-4 text-center cursor-pointer"
                        onClick={() => setShowFunders(true)}>Submit Application</div>}

                </div>

                <div className='w-full lg:w-[55%]'>
                    <div className='flex justify-between max-w-[450px] items-center mx-4 mb-3 p-2 border-b border-slate-200'>
                        <h3>Additional Information</h3>
                    </div>
                    <h2 className='text-[16px] mx-3 mb-3'>Bussiness Information</h2>

                    <div className=' gap-1 w-full flex-1 '>
                        <div className='flex flex-col md:flex-row'>
                            <div className='w-full'>
                                <Inputfeild
                                    formData={formData}
                                    label='Advanced Amount'
                                    name='advanced_price'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    // disabled={!isEditable}
                                    disabled={true}
                                />
                            </div>
                            <div className='flex flex-col md:flex-row gap-3 w-full md:w-[60%] '>
                                <Inputfeild
                                    formData={formData}
                                    label='Commisson'
                                    name='commission_price'
                                    type='number'
                                    application={application}
                                    // Value={formData.name}
                                    onChange={handleInputChange}
                                    // disabled={!isEditable}
                                    disabled={true}
                                />
                                <Inputfeild
                                    formData={formData}
                                    label='%'
                                    name='percentage'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    // disabled={!isEditable}
                                    disabled={true}

                                />
                            </div>
                        </div>

                        <div className='flex flex-col md:flex-row gap-1 w-full flex-1 '>
                            <div className='w-full'>
                                <Inputfeild
                                    formData={formData}
                                    label='Factor'
                                    name='factor'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    // disabled={!isEditable}
                                    disabled={true}

                                />
                            </div>
                            <div className='w-full'>
                                <Inputfeild
                                    formData={formData}
                                    label='Total fee'
                                    name='total_fee'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    // disabled={!isEditable}
                                    disabled={true}

                                />
                            </div>

                        </div>

                        <div className='flex flex-col md:flex-row gap-1 w-full flex-1 '>
                            <div className='w-full'>
                                <Inputfeild
                                    formData={formData}
                                    label='Payback'
                                    name='payback'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    // disabled={!isEditable}
                                    disabled={true}

                                />
                            </div>
                            <div className='flex flex-col md:flex-row gap-3 w-full md:w-[60%] '>
                                <Inputfeild
                                    formData={formData}
                                    label='Term'
                                    name='term'
                                    type='text'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    // disabled={!isEditable}
                                    disabled={true}

                                />
                                <Inputfeild
                                    formData={formData}
                                    label='Frequency'
                                    name='frequency'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    // disabled={!isEditable}
                                    disabled={true}

                                />
                            </div>

                        </div>

                        <div className='flex flex-col md:flex-row items-center justify-between'>
                            <div className='w-full'>
                                <Inputfeild
                                    formData={formData}
                                    label='Payment'
                                    name='payment'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    // disabled={!isEditable}
                                    disabled={true}

                                />
                            </div>
                            <div className='w-full'>
                                <Inputfeild
                                    formData={formData}
                                    label='Net Funding Amount'
                                    name='net_funding_amount'
                                    type='number'
                                    application={application}
                                    // value={formData.name}
                                    onChange={handleInputChange}
                                    // disabled={!isEditable}
                                    disabled={true}

                                />
                            </div>

                        </div>
                    </div>
                </div>
            </form>

        </div>

        {showPdfModal && <Viewer pdfObj={pdf} setPdfObj={setPdf} setShowPdfModal={setShowPdfModal} isEditable={isEditable} setLoading={setLoading} />}
        {showAddPdf && <AddPdf pdfToAdd={pdfToAdd} setPdfToAdd={setPdfToAdd} setShowAddPdf={setShowAddPdf} reFreshPdf={reFreshPdf} setReFreshPdf={setReFreshPdf} />}
    </>)
}


const AddPdf = ({ pdfToAdd, setPdfToAdd, setShowAddPdf, reFreshPdf, setReFreshPdf }) => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState()

    const handleFileChange = (e) => {
        // console.log('Valid PDF');
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setFile(file)
        } else {
            // Handle invalid file type here
            // console.log('Invalid file type');
        }
    };

    const handleInputChange = (e) => {
        setPdfToAdd({
            ...pdfToAdd,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!pdfToAdd.application_id) return alert('Application not found!');
        if (!file?.name) return alert('You have not selected any file!')
        setLoading(true)
        // console.log({ pdfToAdd });
        // return;
        const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/pdfs/`
        const config = {
            headers: {
                // 'Content-Type': 'application/json',
                'content-type': 'multipart/form-data',
                'Authorization': `Bearer ${getCookie('jwt')}`
            },
            withCredentials: true,
        };

        try {
            const formDataWithFiles = new FormData();
            formDataWithFiles.append('pdf_type', pdfToAdd.pdf_type);
            formDataWithFiles.append('application_id', pdfToAdd.application_id);
            formDataWithFiles.append('business_name', pdfToAdd?.business_name ? pdfToAdd.business_name : '');
            formDataWithFiles.append('bank_name', pdfToAdd?.bank_name ? pdfToAdd.bank_name : '');
            formDataWithFiles.append('begin_bal_date', pdfToAdd?.begin_bal_date ? pdfToAdd.begin_bal_date : '');
            formDataWithFiles.append('begin_bal_amount', pdfToAdd?.begin_bal_amount ? pdfToAdd.begin_bal_amount : '');
            formDataWithFiles.append('ending_bal_amount', pdfToAdd?.ending_bal_amount ? pdfToAdd.ending_bal_amount : '');
            formDataWithFiles.append('ending_bal_date', pdfToAdd?.ending_bal_date ? pdfToAdd.ending_bal_date : '');
            formDataWithFiles.append('total_deposit', pdfToAdd?.total_deposit ? pdfToAdd.total_deposit : '');
            formDataWithFiles.append(
                'pdf_file', file ? file : {}, file?.name ? file.name : ''
            );

            // console.log({ formDataWithFiles });
            const response = await axios.post(baseUrl, formDataWithFiles, config);
            // console.log({ response });
            if (response.statusText === "Created") {
                // setReFreshPdf(!reFreshPdf)
                // setShowAddPdf(false)
                window.location.reload();
                return
            }
        } catch (error) {
            // console.log(error);
        }
        setLoading(false)
    };

    return (<>
        <LoadingModal loading={loading} />
        <div className="fixed top-0 left-0 w-full h-screen overflow-auto z-10 bg-white text-black flex items-center justify-center">
            <FaTimesCircle className='absolute right-5 top-5 cursor-pointer' onClick={() => setShowAddPdf(false)} />

            <div className='w-[90%] m-auto'>
                <div className="">
                    <div className="mt-1 mb-3 text-center font-bold text-lg">
                        {pdfToAdd.pdf_type}
                    </div>

                    <div className="flex justify-center mt-7 mb-4"><input type="file" accept="application/pdf" name="pdf_file" className="mr-[-100px] md:mr-0" onChange={handleFileChange} /></div>

                    <div className="flex flex-col items-center">
                        <div className="flex flex-col md:flex-row md:items-center">
                            <Inputfeild2
                                type='text'
                                label='business_name'
                                name="business_name"
                                plholder=""
                                disabled={false}
                                onChange={handleInputChange}
                                formData={pdfToAdd}
                            />
                            <Inputfeild2
                                type='text'
                                label='bank_name'
                                name="bank_name"
                                plholder=""
                                disabled={false}
                                onChange={handleInputChange}
                                formData={pdfToAdd}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center">
                            <Inputfeild2
                                type='number'
                                label='begin_bal_amount'
                                name="begin_bal_amount"
                                plholder=""
                                disabled={false}
                                onChange={handleInputChange}
                                formData={pdfToAdd}
                            />
                            <Inputfeild2
                                type='date'
                                label='begin_bal_date'
                                name="begin_bal_date"
                                plholder=""
                                disabled={false}
                                onChange={handleInputChange}
                                formData={pdfToAdd}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center">
                            <Inputfeild2
                                type='number'
                                label='ending_bal_amount'
                                name="ending_bal_amount"
                                plholder=""
                                disabled={false}
                                onChange={handleInputChange}
                                formData={pdfToAdd}
                            />
                            <Inputfeild2
                                type='date'
                                label='ending_bal_date'
                                name="ending_bal_date"
                                plholder=""
                                disabled={false}
                                onChange={handleInputChange}
                                formData={pdfToAdd}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center">
                            <Inputfeild2
                                type='number'
                                label='total_deposit'
                                name="total_deposit"
                                plholder=""
                                disabled={false}
                                onChange={handleInputChange}
                                formData={pdfToAdd}
                            />
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button className='py-2 px-4 bg-black text-white'
                            onClick={handleSubmit}
                        >Upload</button>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

// const PdfPreview = ({ pdfObj }) => {
//     const router = useRouter()
//     const [fileUrl, setFileUrl] = useState()
//     const [pdfBlob, setPdfBlob] = useState(null);

//     useEffect(() => {
//         const fetchPDFFile = async () => {
//             if (!getCookie('jwt')) {
//                 alert('Please login to continue')
//                 router.push('/login')
//                 return;
//             }
//             try {
//                 const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/get_file/${pdfObj?.application_id}/${pdfObj?.pdf_type}/`, {
//                     responseType: 'blob', // Set the response type to blob
//                     headers: {
//                         Authorization: `Bearer ${getCookie('jwt')}`,
//                     },
//                 });

//                 if (response?.status === 200) {
//                     const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
//                     setPdfBlob(pdfBlob);
//                     const pdfUrl = URL.createObjectURL(pdfBlob);
//                     setFileUrl(pdfUrl);

//                     // Use the generated URL to display or download the PDF file
//                     // ...
//                 } else {
//                     // Handle non-200 status code
//                     // ...
//                 }
//             } catch (error) {
//                 // Handle network or request error
//                 // ...
//             }
//         };

//         fetchPDFFile();
//     }, [pdfObj, router]);
    
//     const styles = StyleSheet.create({
//         page: {
//             flexDirection: 'row',
//             backgroundColor: '#E4E4E4'
//         },
//         section: {
//             margin: 10,
//             padding: 10,
//             flexGrow: 1
//         }
//     });
    
//     return (
//         <div>
//             {pdfBlob && (
//                 <PDFViewer>
//                     <Document file={pdfBlob}>
//                         {/* <Page pageNumber={1} /> */}
//                         {/* <Page size="A4" style={styles.page}>
//                             <View style={styles.section}>
//                                 <Text>Section #1</Text>
//                             </View>
//                             <View style={styles.section}>
//                                 <Text>Section #2</Text>
//                             </View>
//                         </Page> */}
//                     </Document>
//                 </PDFViewer>
//             )}
//         </div>
//     );
// };

const Viewer = ({ pdfObj, setPdfObj, setShowPdfModal, isEditable, setLoading }) => {
    const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/pdfs/${pdfObj?.file}/?authorization=${getCookie('jwt')}`;
    // console.log("pdfObj: ");
    // console.log(pdfObj);
    // const containerRef = useRef(null);
    // const router = useRouter()
    // const baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/pdfs/${pdfObj?.file}/`;
    // const [fileUrl, setFileUrl] = useState()
    // const [pdfBlob, setPdfBlob] = useState(null);
    
    // useEffect(() => {
    //     // var iframe = document.querySelector('#iframe');
    //     // if(iframe) {
    //     //     iframe.src=fileUrl
    //     // }
    // }, [fileUrl])
    

    // useEffect(() => {
    //     const fetchPDFFile = async () => {
    //         if (!getCookie('jwt')) {
    //             alert('Please login to continue')
    //             router.push('/login')
    //             return;
    //         }
    //         try {
    //             const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/get_file/${pdfObj?.application_id}/${pdfObj?.pdf_type}/`, {
    //                 responseType: 'blob', // Set the response type to blob
    //                 headers: {
    //                     Authorization: `Bearer ${getCookie('jwt')}`,
    //                 },
    //             });

    //             if (response?.status === 200) {
    //                 const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    //                 // setPdfBlob(pdfBlob);
    //                 const pdfUrl = URL.createObjectURL(pdfBlob);
    //                 // console.log(pdfUrl);
    //                 var iframe = document.querySelector('#iframe');
    //                 if (iframe) {
    //                     iframe.src = pdfUrl
    //                 }
    //                 setFileUrl(pdfUrl);

    //                 // Use the generated URL to display or download the PDF file
    //                 // ...
    //             } else {
    //                 // Handle non-200 status code
    //                 // ...
    //             }
    //         } catch (error) {
    //             // Handle network or request error
    //             // ...
    //         }
    //     };

    //     fetchPDFFile();
    // }, [pdfObj, router]);
    
    // useEffect(() => {
    //     const renderPDF = async () => {
    //         const pdf = await Document.load(fileUrl);
    //         const viewer = new Viewer({
    //             container: containerRef.current,
    //         });
    //         viewer.setDocument(pdf);
    //     };

    //     renderPDF();
    // }, [fileUrl]);
    
    const pdfRef = useRef();
    const [itemCount, setItemCount] = useState(0);
    
    // useEffect(() => {
    //     var loadingTask = pdfjs?.getDocument(fileUrl);
    //     loadingTask?.promise?.then(
    //         pdf => {
    //             pdfRef.current = pdf;

    //             setItemCount(pdf._pdfInfo.numPages);

    //             // Fetch the first page
    //             var pageNumber = 1;
    //             pdf.getPage(pageNumber).then(function (page) {
    //                 console.log("Page loaded");
    //             });
    //         },
    //         reason => {
    //             // PDF loading error
    //             console.error(reason);
    //         }
    //     );
    // }, [fileUrl]);

    const handleInputChange = (e) => {
        setPdfObj({
            ...pdfObj,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateButton = async (event) => {
        event.preventDefault();
        // console.log(pdfObj);
        setLoading(true)
        const data = {
            bank_name: pdfObj?.bank_name,
            begin_bal_amount: pdfObj?.begin_bal_amount,
            begin_bal_date: pdfObj?.begin_bal_date,
            business_name: pdfObj?.business_name,
            ending_bal_amount: pdfObj?.ending_bal_amount,
            ending_bal_date: pdfObj?.ending_bal_date,
            pdf_type: pdfObj?.pdf_type,
            total_deposit: pdfObj?.total_deposit,
        }

        const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/pdf/${pdfObj?.id}/`
        // const res = await axios.put(url, pdfObj, {
        const res = await axios.put(url, data, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getCookie('jwt')}`,
            },
            withCredentials: true,
        }).catch(err => {
            console.log(err);
            setLoading(false)
            return;
        })
        if (res?.status === 200) {
            res?.data && setPdfObj(res?.data)
            setShowPdfModal(false)
        }
        setLoading(false)
    };
                                       
    // const renderPDF = () => {
    //     if (pdfBlob) {
    //         const dataUrl = URL.createObjectURL(pdfBlob);
    //         return <iframe src={dataUrl} width="100%" height="600px" />;
    //     }
    //     return null;
    // };

    return (<>
        <div className="pt-16 fixed top-0 left-0 w-full h-screen overflow-auto z-10 bg-white text-black flex items-center justify-center">
            <FaTimesCircle className='absolute right-5 top-5 cursor-pointer' onClick={() => setShowPdfModal(false)} />
            <div className='w-[90%] m-auto flex flex-col-reverse lg:flex-row justify-between'>
                <form className="flex-1 lg:flex-[2]" onSubmit={handleUpdateButton}>
                    <div className="mt-1 mb-3 text-center font-bold text-lg">
                        {pdfObj.pdf_type}
                    </div>
                    <div className="">
                        <div className="flex flex-col lg:flex-row items-center">
                            <Inputfeild2
                                type='text'
                                label='Business Name'
                                name="business_name"
                                plholder="Business Name"
                                disabled={!isEditable}
                                onChange={handleInputChange}
                                formData={pdfObj}
                            />
                            <Inputfeild2
                                type='text'
                                label='Bank Name'
                                name="bank_name"
                                plholder="Bank Name"
                                disabled={!isEditable}
                                onChange={handleInputChange}
                                formData={pdfObj}
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row items-center">
                            <Inputfeild2
                                type='number'
                                label='Begin Balance Amount'
                                name="begin_bal_amount"
                                plholder="Begin Balance Amount"
                                disabled={!isEditable}
                                onChange={handleInputChange}
                                formData={pdfObj}
                            />
                            <Inputfeild2
                                type='date'
                                label='Begin Balance Date'
                                name="begin_bal_date"
                                plholder="Begin Balance Date"
                                disabled={!isEditable}
                                onChange={handleInputChange}
                                formData={pdfObj}
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row items-center">
                            <Inputfeild2
                                type='number'
                                label='Ending Balance Amount'
                                name="ending_bal_amount"
                                plholder="Ending Balance Amount"
                                disabled={!isEditable}
                                onChange={handleInputChange}
                                formData={pdfObj}
                            />
                            <Inputfeild2
                                type='date'
                                label='Ending Balance Date'
                                name="ending_bal_date"
                                plholder="Ending Balance Date"
                                disabled={!isEditable}
                                onChange={handleInputChange}
                                formData={pdfObj}
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row items-center">
                            <Inputfeild2
                                type='number'
                                label='Total Deposit'
                                name="total_deposit"
                                plholder="Total Deposit"
                                disabled={!isEditable}
                                onChange={handleInputChange}
                                formData={pdfObj}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-7">
                        {isEditable && <button type="submit" className='px-4 py-2 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-400 focus:bg-blue-400 focus:border-solid focus:border-blue-900 outline-none  mb-4 '
                        >
                            Update
                        </button>}
                    </div>
                </form>

                <div className="flex-1 lg:flex-[3] mb-14 lg:mb-0 z-50">
                    {/* <object
                        // data="https://html.spec.whatwg.org/print.pdf"
                        data={fileUrl}
                        type="application/pdf"
                        width="100%"
                        style={{ height: 'calc(100vh - 43px)' }}
                        aria-label="This object displays an PDF file"
                    /> */}
                    
                    {/* <Document data={pdfBlob} /> */}
                    {/* <PdfViewer pdfData={pdfBlob} /> */}
                    {/* {renderPDF()} */}
                    {/* <PdfPreview pdfObj={pdfObj} /> */}
                    {/* {fileUrl ? (
                        // <div ref={containerRef} className="pdf-viewer-container" />
                        <Document file={pdfBlob}>
                            <Page pageNumber={1} />
                        </Document>
                        // <Document file={fileUrl}>
                        //     <Page pageNumber={1} />
                        // </Document>
                    ) : (
                        <div>Loading...</div>
                    )} */}
                    {/* <div className="">1</div>
                    <iframe src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${fileUrl}`} className="w-full h-screen" frameBorder="0" />   */}
                    
                    
                    
                    {/* working version */}
                    {/* <div className="">2</div> */}
                    <iframe src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${baseUrl}`} className="w-full h-screen" frameBorder="0" />

                    {/* <div className="">3</div> */}
                    {/* <iframe src={baseUrl} className="w-full h-screen" frameBorder="0" /> */}
                    
                    
                    {/* <div className="">4</div>
                    <iframe src={fileUrl} className="w-full h-screen" frameBorder="0" />

                    <div className="">5</div>
                    <iframe id='iframe' className="w-full h-screen" frameBorder="0" /> */}
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
    return str;
}

const Inputfeild = ({ type, application, label, read, name, disabled, onChange, formData, plholder }) => {
    // console.log({ type, application, label, read, name, disabled, onChange, formData, plholder });
    const value = formData?.[name] ? formData?.[name] !== 0 ? formData?.[name] : ''
        : application?.[name] !== 0 ? application?.[name] : ''
    return (
        <div className='flex gap-1 flex-col mx-3 my-2'>
            <label className='text-[14px]'>{label}</label>
            <input type={type}
                name={name}
                readOnly={read}
                disabled={disabled}
                // value={value}
                onChange={onChange}
                value={value}
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
                className='px-4 py-2 rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none w-[200px] mb-4' id="" />
        </div>
    )
};

function FileUpload(props) {
    return (
        <label htmlFor="bankstatement1" title={`${props.disabled && 'cannot edit'}`} className={`${props.disabled ? 'cursor-not-allowed' : 'cursor-pointer'} bg-gray-300 rounded-[10px] text-black grid place-items-center w-[50px] h-[40px]`} onClick={() => {
            if (!props.disabled) {
                props.setPdfToAdd({ ...props.pdfToAdd, pdf_type: props.type })
                props.setShowAddPdf(true)
            }
        }}>
            <FaCloudUploadAlt size={20} />
        </label>
    )
}


export default Application