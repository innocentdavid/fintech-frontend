import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaTimes, FaUserCircle } from 'react-icons/fa'
import LoadingModal from "../components/LoadingModal ";
import Nav from "../components/Nav";
import { handleLogout, minMaxValidator, scrollToInput } from "../utils/helpers";

const API = axios.create({
    baseURL: 'http://localhost:8000/funders/',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

const APIN = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json',
    },
    // credentials: 'include',
    withCredentials: true
})

const Funders = () => {
    const router = useRouter()
    const [fundersList, setFundersList] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [nameError, setNameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [phone, setPhone] = useState('')
    const [phoneError, setPhoneError] = useState("");
    const [user, setUser] = useState({
        email: '',
        name: ''
    })

    useEffect(() => {
        const fetch = async () => {
            const response = await APIN.get('api/getcurrentuser/')
            setUser(response.data)
            // console.log(response);
            if (response.data.message !== "success") {
                router.push('/login')
                return;
            }
        };
        fetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            const res = await API.get("/")
            console.log(res);
            if (res.data) {
                setFundersList(res.data)
            } else {
                alert('something went wrong')
            }
            setLoading(false)
        }
        fetch()
    }, [])


    const handleAdd = async (e) => {
        e.preventDefault();
        var phoneError;
        if (phone && !minMaxValidator(phone, 7, 10)) { phoneError = true; setPhoneError('number must be either 7 or 10 characters') }

        if (phoneError) {
            scrollToInput('phone')
            return
        } else { setPhoneError('') }

        setLoading(true)
        const res = await API.post("/", { name, email, phone }).catch(err => {
            console.log(err);
            setEmailError(err?.response?.data?.email?.[0])
            setNameError(err?.response?.data?.name?.[0])
            // if (!err?.response?.data?.email?.[0] && !err?.response?.data?.name?.[0]){
            //     alert('something sent wrong')
            // }
        })
        console.log(res);
        if (res?.data) {
            setFundersList([...fundersList, res.data])
            setName('')
            setEmail('')
            setPhone('')
            setNameError('')
            setEmailError('')
            setPhoneError('')
            setShowAddModal(false)
        }
        setLoading(false)
    }

    return (<>
        {user?.email && <Nav user={user} setUser={setUser} />}

        <div className="container mx-auto px-2 md:px-10 lg:px-32">
            <LoadingModal loading={loading} />
            {/* <FaTimes className="absolute top-10 right-10 cursor-pointer" size={20} onClick={() => { setLoading(true); router.push('/') }} /> */}

            <div className="text-center text-3xl font-bold mt-20">Funders</div>
            <div className="relative w-fit mt-[40px]">
                <button className="py-2 px-6 bg-black text-white font-semibold" onClick={() => setShowAddModal(!showAddModal)}>Add New</button>
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
                            <input type="submit" value="Create" className="w-full cursor-pointer rounded-lg border-none outline-none bg-black text-white h-10 px-2" placeholder="name" />
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
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {fundersList.map((funder) => (
                            <tr
                                key={funder.id}
                                className="border-b border-gray-200 hover:bg-gray-100"
                            >
                                <td className="py-3 px-6 text-left whitespace-nowrap">
                                    {funder.id}
                                </td>
                                <td className="py-3 px-6 text-left">{funder.name}</td>
                                <td className="py-3 px-6 text-left">{funder.email}</td>
                                <td className="py-3 px-6 text-left">{funder.phone}</td>
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
