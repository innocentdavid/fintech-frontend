import React from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { FiTriangle } from 'react-icons/fi'
import SuccessModal from './SuccessModal';
import AlertModal from './AlertModal';
import { useState } from 'react';
import { getCookie, getToday } from '../utils/helpers';
import axios from 'axios';
import LoadingModal from './LoadingModal ';
import { useEffect } from 'react';

export default function SubmitApplicationModal({
    showFunders,
    setShowFunders,
    application,
    initialFundersArray
}) {
    const [loading, setLoading] = useState(false)
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState({ title: 'Alert', message: 'something went wrong' })
    const [fundersArray, setFundersArray] = useState([])
    const [selectedFundersArray, setSelectedFundersArray] = useState([])
    const [fundersArrayO, setFundersArrayO] = useState([])
    const [settingUp, setSettingUp] = useState(true)
    const [submittedApps, setSubmittedApps] = useState([])

    useEffect(() => {
        const fetch = async () => {
            var submittedAppsArray = submittedApps
            if (!submittedApps.length > 0) {
                const submitedAppRes = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/get_submittedApplications_by_app_id/${application?.application_id}/`, {
                    headers: {
                        // 'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getCookie('jwt')}`
                    },
                }).catch(err => {
                    setSettingUp(false)
                    if (err?.response?.data?.message === "Signature has expired!") {
                        return err?.response?.data?.message
                    }
                    console.log("err: ");
                    console.log(err);
                });
                submitedAppRes?.data && setSubmittedApps(submitedAppRes?.data)
                submittedAppsArray = submitedAppRes?.data ? submitedAppRes?.data : []
            }

            if (submittedAppsArray.length > 0) {
                const filteredFunders = []
                initialFundersArray.forEach(funder => {
                    const alreadySelected = selectedFundersArray.find(obj => obj?.name === funder?.name)
                    if (alreadySelected) {
                        // console.log('alreadySelected')
                        return;
                    }
                    if (submittedAppsArray?.some(obj => obj?.funder?.name === funder?.name)) {
                        filteredFunders.push({ ...funder, submitted: true })
                    } else {
                        filteredFunders.push(funder)
                    }
                    setFundersArray(filteredFunders)
                    setFundersArrayO(filteredFunders)
                });
            } else {
                setFundersArray(initialFundersArray)
                setFundersArrayO(initialFundersArray)
            }
            setSettingUp(false);
        }
        fetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showFunders, initialFundersArray])


    const handleOpenModal = () => {
        setIsSuccessModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsSuccessModalOpen(false);
    };

    const handleToggleAlertModal = () => {
        setIsAlertModalOpen(!isAlertModalOpen);
    };

    const handleSendApplication = async () => {
        if (selectedFundersArray.length > 0) {
            // console.log("application.opportunity_exist: ");
            // console.log(application?.opportunity_exist);
            if (application?.opportunity_exist !== true || application?.statement_missing === true) {
                // show modal
                handleToggleAlertModal()
                setErrorMsg({ title: 'Alert', message: 'No opportunity with the name {business name} exists in Salesforce' })
                handleOpenModal()
                return;
            }

            setLoading(true)
            const formData = {
                ...application,

                opportunity_id: "",
                salesforce_status: "",
                submission_id: "",
                error: false,
                errors: [],
                replied: false,
                replied_to: "",
                reply_text: "",
                reply_link: "",
                error_parsing: false,
                errors_parsing: [],

                date_submitted: getToday(new Date()),
                status: 'Submitted',
                status_date: getToday(new Date()),
                status_description: 'Submitted',
                funder_names: selectedFundersArray
            }

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
            // console.log(res);
            if (res?.statusText) {
                if (res?.data?.failed?.length > 0) {
                    alert(`submission to ${res?.data?.failed.join(', ')} failed!`);
                }
                setShowFunders(false)
                const list = []
                const filteredFunders = selectedFundersArray.filter(funder => !res?.data?.failed.includes(funder.name));
                filteredFunders.forEach(funder => {
                    list.push({ ...funder, submitted: true })
                })
                const concat = [...fundersArray, ...list]
                // setFundersArray(concat)
                setFundersArrayO(concat)
                setSelectedFundersArray([])
                setSubmittedApps([])
                handleOpenModal()
            }
            setLoading(false)
        }
    }

    // console.log(application);
    // console.log(fundersArray);
    // console.log(submittedAppsArray);

    return (<>
        <LoadingModal loading={loading} />

        {/* success timeout modal */}
        <SuccessModal isOpen={isSuccessModalOpen} onClose={handleCloseModal} />

        <AlertModal
            isOpen={isAlertModalOpen}
            onClose={handleToggleAlertModal}
            title={errorMsg?.title}
            message={errorMsg?.message}
        />

        <div className={`${showFunders ? "opacity-100 z-10 grid" : "hidden opacity-0 pointer-events-none"} fixed top-0 left-0 w-full h-screen place-items-center`} style={{ transition: 'opacity .15s ease-in' }}>
            <div className="absolute top-0 left-0 w-full h-screen bg-black/50 cursor-pointer" onClick={() => {
                setShowFunders(false)
                setFundersArray(fundersArrayO)
                setSelectedFundersArray([])
                setSubmittedApps([])
            }}></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-5 py-10 min-w-[310px] mx-auto md:min-w-[520px] rounded-lg">

                <div className="flex items-center justify-between py-4">
                    <div className="font-bold">{application?.name_of_business ? application?.name_of_business : application?.legal_business_name}</div>

                    <div className="flex justify-end">
                        <FaTimes className='cursor-pointer' onClick={() => {
                            setShowFunders(false)
                            setFundersArray(fundersArrayO)
                            setSelectedFundersArray([])
                            setSubmittedApps([])
                        }} />
                    </div>
                </div>

                <div className="w-full flex gap-2">
                    <div className="flex flex-col gap-2 border w-1/2 h-[300px] overflow-auto relative">
                        {settingUp && <div className="absolute top-0 left-0 w-full h-full bg-black/60 text-white grid place-items-center">Loading...</div>}

                        {fundersArray?.length > 0 && fundersArray?.map((funder, index) => {
                            const alreadySelected = selectedFundersArray.find(obj => obj?.name === funder?.name)
                            if (alreadySelected) {
                                return (<div key={`empty_funder_${index}`} className='hidden'></div>)
                            } else {
                                return (
                                    <div key={`main_${funder?.name}_${index + 1}`} className={`${funder?.submitted ? 'cursor-not-allowed' : 'cursor-pointer'} hover:bg-slate-200 p-3 flex items-center justify-between`}
                                        onClick={() => {
                                            if (funder?.submitted) return;
                                            // const selected = funder
                                            const funderAlreadySelected = selectedFundersArray.some(existingFunder => existingFunder.name === funder.name);
                                            if (!funderAlreadySelected) {
                                                const newSelectedFundersArray = [...selectedFundersArray, funder]
                                                setSelectedFundersArray(newSelectedFundersArray)
                                            }
                                            const newFundersArray = fundersArray.filter(item => item.name !== funder?.name)
                                            setFundersArray(newFundersArray)
                                            return;
                                        }}>{funder?.name} {funder?.submitted && <FaCheck />}</div>
                                )
                            }
                        })}
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="">
                            <FiTriangle className='rotate-90' />
                            <FiTriangle className='-rotate-90 mt-4' />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 border w-1/2 h-[300px] overflow-auto">
                        {selectedFundersArray && selectedFundersArray?.map(funder => {
                            return (
                                <div key={`selected_${funder?.name}`} className="hover:bg-slate-200 p-3 cursor-pointer" onClick={() => {
                                    const newFunderArray = [...fundersArray, funder]
                                    setFundersArray(newFunderArray)
                                    const newSelectedFundersArray = selectedFundersArray?.filter(item => item.name !== funder?.name)
                                    setSelectedFundersArray && setSelectedFundersArray(newSelectedFundersArray)
                                }}>{funder?.name}</div>
                            )
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-2 justify-end">
                    <button className={`${selectedFundersArray?.length > 0 ? 'bg-blue-600' : 'bg-blue-400'} mt-4 py-2 px-8 text-white`} onClick={handleSendApplication}>Send</button>

                    <button className={`bg-gray-500 mt-4 py-2 px-8 text-white`} onClick={() => {
                        setShowFunders(false)
                        setFundersArray && setFundersArray(fundersArrayO)
                        setSelectedFundersArray([])
                        setSubmittedApps([])
                    }}>Cancel</button>
                </div>
            </div>
        </div>
    </>)
}
