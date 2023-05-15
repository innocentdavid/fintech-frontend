

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

        if (defaultPdfs) {
            var applicaitonPdfs = []
            var statementPdfs = []
            defaultPdfs?.pdfs?.forEach(item => {
                const type = item?.pdf_type?.toString()
                // console.log(type);
                if (type.includes('Application')) {
                    applicaitonPdfs.push(item)
                } else {
                    statementPdfs.push(item)
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

        try {
            const res = await API.put(`/${application?.application_id}/`, formData)
            // console.log(res);
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

    function mergeArrays(A, B) {
        return A.concat(B.filter(obj => !A.find(o => o.id === obj.id)));
    }
    function removeDuplicates(A, B) {
        // A is the total list // B is the list that contain unwanted ones
        return A.filter(a => !B.find(b => a.id === b.id));
    }

    // get Funders
    useEffect(() => {
        if (fundersResponse){
            var funders = []
            if (submittedApplications.length > 0) {                
                let submittedApplicationFunders = []
                submittedApplications.forEach(application => {
                    submittedApplicationFunders.push({...application?.funder, submitted: true })
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
        setLoading(true)
        const formData = {
            ...application,
            date_submitted: today,
            status: 'Submitted',
            status_date: today,
            status_description: 'Submitted',
            funder_names: selectedFundersArray
        }
        const res = await axios.post(`${process.env.BACKEND_BASE_URL}/submittedApplications/`, formData, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        }).catch(err => {
            console.log(err);
        })
        if(res?.statusText){
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

    return (<>
        <LoadingModal loading={loading} />

        <div className={`${showFunders ? "opacity-100 z-10" : "opacity-0 pointer-events-none"} fixed top-0 left-0 w-full h-screen grid place-items-center`} style={{ transition: 'opacity .15s ease-in' }}>
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
                        {!!fundersArray && fundersArray?.map((funder, index) => {
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
                <button className="mt-4 py-2 px-8 bg-black text-white" onClick={handleSendApplication}>Send</button>
            </div>
        </div>

        <div className='md:first-letter:w-[85%] mx-auto items-center  py-3 rounded-lg mt-[60px] relative'>
            <FaTimes size={20} className="cursor-pointer absolute z-[2] top-0 right-2 text-[15px] h-[20px] w-[20px] flex justify-center my-2" onClick={() => {
                // setLoading(true)
                router.back()
            }} />

            <form action="" method="post" className='flex flex-col-reverse lg:flex-row' onSubmit={handleSubmit} >
                <div className='w-full lg:w-[45%] mb-[160px] '>
                    <div className='flex justify-between max-w-[300px] items-center mx-4 mb-3 border-b border-slate-200'>
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

                        {/* {isEditable && <div className='flex justify-center gap-4 items-center'>
                            <button type='submit' className='px-4 py-2  rounded-lg bg-slate-100 focus:border-solid focus:border-blue-900 outline-none  mb-4 '>{loading ? "processsing..." : "Submit"}</button>
                        </div>} */}
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
                            <div className='w-full md:w-[40%]'>
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
                            <div className='flex gap-3 w-full md:w-[60%] '>
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
                            <div className='w-full md:w-[40%]'>
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
                            <div className='flex gap-3 w-full md:w-[60%] '>
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
                            <div className='w-full md:w-[40%]'>
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

                        <div className='flex gap-1 w-full flex-1 '>
                            <div className='w-full md:w-[40%]'>
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
                            <div className='flex gap-3 w-full md:w-[60%] '>
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

        {showPdfModal && <Viewer pdfObj={pdf} setShowPdfModal={setShowPdfModal} />}
        {showAddPdf && <AddPdf pdfToAdd={pdfToAdd} setPdfToAdd={setPdfToAdd} setShowAddPdf={setShowAddPdf} reFreshPdf={reFreshPdf} setReFreshPdf={setReFreshPdf} />}
    </>)

}


export default Application


const AddPdf = ({ pdfToAdd, setPdfToAdd, setShowAddPdf, reFreshPdf, setReFreshPdf }) => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState()

    const handleFileChange = (e) => {
        console.log('Valid PDF');
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setFile(file)
        } else {
            // Handle invalid file type here
            console.log('Invalid file type');
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
        console.log({ pdfToAdd });
        // return;
        const baseUrl = `${process.env.BACKEND_BASE_URL}/pdfs/`
        const config = {
            headers: {
                // 'Content-Type': 'application/json',
                'content-type': 'multipart/form-data',
            }
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
                setReFreshPdf(!reFreshPdf)
                setShowAddPdf(false)
            }
        } catch (error) {
            console.log(error);
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

const Viewer = ({ pdfObj, setShowPdfModal }) => {
    const baseUrl = `${process.env.BACKEND_BASE_URL}${pdfObj?.pdf_urls}`

    return (<>
        <div className="fixed top-0 left-0 w-full h-screen overflow-auto z-10 bg-white text-black flex items-center justify-center">
            <FaTimesCircle className='absolute right-5 top-5 cursor-pointer' onClick={() => setShowPdfModal(false)} />
            <div className='w-[90%] m-auto flex flex-col-reverse md:flex-row justify-between'>
                <div className="flex-[2]">
                    <div className="mt-1 mb-3 text-center font-bold text-lg">
                        {pdfObj.pdf_type}
                    </div>
                    <div className="">
                        <div className="flex flex-col lg:flex-row items-center">
                            <Inputfeild2
                                type='text'
                                label='Business Name'
                                name="business_name"
                                plholder=""
                                disabled={true}
                                onChange={() => { }}
                                formData={pdfObj}
                            />
                            <Inputfeild2
                                type='text'
                                label='Bank Name'
                                name="bank_name"
                                plholder=""
                                disabled={true}
                                onChange={() => { }}
                                formData={pdfObj}
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row items-center">
                            <Inputfeild2
                                type='number'
                                label='Begin Balance Amount'
                                name="begin_bal_amount"
                                plholder=""
                                disabled={true}
                                onChange={() => { }}
                                formData={pdfObj}
                            />
                            <Inputfeild2
                                type='date'
                                label='Begin Balance Date'
                                name="begin_bal_date"
                                plholder=""
                                disabled={true}
                                onChange={() => { }}
                                formData={pdfObj}
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row items-center">
                            <Inputfeild2
                                type='number'
                                label='Ending Balance Amount'
                                name="ending_bal_amount"
                                plholder=""
                                disabled={true}
                                onChange={() => { }}
                                formData={pdfObj}
                            />
                            <Inputfeild2
                                type='date'
                                label='Ending Balance Date'
                                name="ending_bal_date"
                                plholder=""
                                disabled={true}
                                onChange={() => { }}
                                formData={pdfObj}
                            />
                        </div>
                        <div className="flex flex-col lg:flex-row items-center">
                            <Inputfeild2
                                type='number'
                                label='Total Deposit'
                                name="total_deposit"
                                plholder=""
                                disabled={true}
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
    return str;
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
