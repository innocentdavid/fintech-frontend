import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaTimes } from 'react-icons/fa'
import { AiFillEdit } from 'react-icons/ai'
import LoadingModal from "../components/LoadingModal ";
import { getCookie, minMaxValidator, scrollToInput } from "../utils/helpers";
import { parseCookies } from "nookies";
import { useRouter } from "next/router";
import { AuthContext } from "../context/AuthContext";

const Funders = ({ data }) => {
// const Funders = () => {
//     const data = []
    
    const [fundersList, setFundersList] = useState(data)
    const [showAddModal, setShowAddModal] = useState(false)
    const [cloading, setCloading] = useState(false);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [phone, setPhone] = useState('')
    const [phoneError, setPhoneError] = useState("");
    const [editMode, seteditMode] = useState(false)
    const [itemToEdit, setItemToEdit] = useState()

    const router = useRouter()
    const { user, loading, refreshUser, setRefreshUser } = useContext(AuthContext);
    
    useEffect(() => {
        if (!user) {
            // router.push('/login')
            setRefreshUser(refreshUser)
            const token = getCookie('jwt')
            // console.log(token);
            if (!token) {
                router.push('/login')
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshUser, user])
      
    // set edit
    useEffect(() => {
        if (editMode) {
            setName(itemToEdit.name)
            setEmail(itemToEdit.email)
            setPhone(itemToEdit.phone)
        }
    }, [editMode, itemToEdit])


    const handleAdd = async (e) => {
        e.preventDefault();
        const API = axios.create({
            baseURL: `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/funders/`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('jwt')}`
            },
            withCredentials: true
        })
        
        var phoneError;
        if (phone && !minMaxValidator(phone, 7, 10)) { phoneError = true; setPhoneError('number must be either 7 or 10 characters') }

        if (phoneError) {
            scrollToInput('phone')
            return
        } else { setPhoneError('') }

        setCloading(true)
        var res;
        var newFundersList = fundersList
        // return;
        if (editMode) {
            res = await API.put(`/${itemToEdit.id ?? 1}/`, { name, email, phone }).catch(err => {
                console.log(err);
                setEmailError(err?.response?.data?.email?.[0])
                setNameError(err?.response?.data?.name?.[0])
                // if (!err?.response?.data?.email?.[0] && !err?.response?.data?.name?.[0]){
                //     alert('something sent wrong')
                // }
            })
            const r = fundersList.filter(funder => funder.id !== res.data.id)
            if (res.data) { newFundersList = r }
        } else {
            res = await API.post("/", { name, email, phone }).catch(err => {
                console.log(err);
                setEmailError(err?.response?.data?.email?.[0])
                setNameError(err?.response?.data?.name?.[0])
                // if (!err?.response?.data?.email?.[0] && !err?.response?.data?.name?.[0]){
                //     alert('something sent wrong')
                // }
            })
        }
        if (res?.data) {
            setFundersList([...newFundersList, res.data])
            setName('')
            setEmail('')
            setPhone('')
            setNameError('')
            setEmailError('')
            setPhoneError('')
            setShowAddModal(false)
            seteditMode(false)
        }
        setCloading(false)
    }

    if (!user) { return (<></>) }
    
    return (<>
        <div className="container mx-auto px-2 md:px-10 lg:px-32 pb-20">
            <LoadingModal loading={loading || cloading} />
            {/* <FaTimes className="absolute top-10 right-10 cursor-pointer" size={20} onClick={() => { setCloading(true); router.push('/') }} /> */}

            <div className="text-center text-3xl font-bold mt-20">Funders</div>
            <div className="relative w-fit mt-[40px]">
                <button className="py-2 px-6 bg-black text-white font-semibold" onClick={() => {seteditMode(false); setShowAddModal(!showAddModal)}}>Add New</button>
                <form onSubmit={handleAdd}
                    className={`${showAddModal ? "opacity-100 z-10" : 'opacity-0 pointer-events-none'} absolute right-0 shadow-[0_0_3px_#00000040] bg-white to-black translate-x-[100%] translate-y-[-25%] px-4 py-2`}
                    style={{ transition: 'opacity 0.15s ease-in' }}>
                    <FaTimes className="absolute top-2 right-3 cursor-pointer" size={20} onClick={() => setShowAddModal(false)} />

                    <div className="my-4">
                        <label htmlFor="name">Name:</label>
                        <div className="">
                            <input type="text" className="rounded-lg border-none outline-none bg-slate-100 h-10 px-2" placeholder="name" name="name" onChange={e => setName(e.target.value)} value={name} />
                        </div>
                        <p className="text-red-600">{nameError}</p>
                    </div>
                    <div className="my-4">
                        <label htmlFor="name">Email:</label>
                        <div className="">
                            <input type="email" className="rounded-lg border-none outline-none bg-slate-100 h-10 px-2" placeholder="name" name="name" onChange={e => setEmail(e.target.value)} value={email} />
                        </div>
                        <p className="text-red-600">{emailError}</p>
                    </div>
                    <div className="my-4">
                        <label htmlFor="name">Phone:</label>
                        <div className="">
                            <input type="number" className="rounded-lg border-none outline-none bg-slate-100 h-10 px-2" placeholder="name" name="name" onChange={e => setPhone(e.target.value)} value={phone} />
                        </div>
                        <p className="-mt-3 ml-3 text-red-500">{phoneError}</p>
                    </div>
                    <div className="my-4">
                        <div className="">
                            <input type="submit" value={editMode ? 'Update' : "Create"} className="w-full cursor-pointer rounded-lg border-none outline-none bg-black text-white h-10 px-2" placeholder="name" />
                        </div>
                    </div>
                </form>
            </div>
            <div className="bg-white md:shadow-md rounded mb-6 w-full overflow-x-auto">
                <table className="min-w-max w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">ID</th>
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-left">Phone</th>
                            <th className="py-3 px-6 text-left"></th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {!!fundersList && fundersList?.sort((a, b) => a.id - b.id).map((funder) => (
                            <tr
                                key={funder.id}
                                className={`${itemToEdit?.name === funder?.name && 'bg-gray-100'} border-b border-gray-200 hover:bg-gray-100`}
                            >
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    {funder.id}
                                </td>
                                <td className="py-3 px-6 text-left">{funder.name}</td>
                                <td className="py-3 px-6 text-left">{funder.email}</td>
                                <td className="py-3 px-6 text-left">{funder.phone}</td>
                                <td className="py-3 px-6 text-left"><AiFillEdit className="cursor-pointer" onClick={() => {
                                    setShowAddModal(!showAddModal)
                                    seteditMode(true)
                                    setItemToEdit(funder)
                                    // if(editMode){
                                    //     seteditMode(false)
                                    //     setItemToEdit()                                  
                                    // }else{
                                    // }
                                }} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </>
    );
};

export default Funders;

export async function getServerSideProps(context) {
    // const cookies = context.req.cookies;
    const cookies = parseCookies(context)
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/funders/`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies['jwt']}` // get JWT token from cookie
        },
        withCredentials: true
    }).catch(err => {
        if (err?.response?.data?.message === "Signature has expired!") {
            return err?.response?.data?.message
        }
        console.log("err: ");
        console.log(err);
    });

    if (res === "Signature has expired!") {
        return {
            redirect: {
                destination: '/login',
                permanent: false, // Set to true if the redirect is permanent (HTTP 301)
            },
        };
    }

    return {
        props: {
            data: res?.data ?? [],
        },
    };
}