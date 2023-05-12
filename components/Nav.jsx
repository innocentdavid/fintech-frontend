import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa'
import { handleLogout } from '../utils/helpers'

export default function Nav({ user, setUser }) {
    const router = useRouter()
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    return (
        <header className="flex gap-10 items-center justify-between p-5 bg-black text-white relative">
            <Link href="/" className="text-lg font-bold">Fintech</Link>
            {showMobileMenu ?
                <FaTimes size={20} className="md:hidden cursor-pointer" onClick={() => setShowMobileMenu(!showMobileMenu)} />
                :
                <FaBars size={20} className="md:hidden cursor-pointer" onClick={() => setShowMobileMenu(!showMobileMenu)} />
            }
            <div className={`${showMobileMenu ? 'opacity-100' : 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'} z-10 flex flex-col md:flex-row md:items-center md:gap-2 absolute md:static top-full right-0 bg-slate-300 bg-opacity-25 backdrop-blur-lg backdrop-filter backdrop-saturate-150 text-black md:text-white md:bg-transparent py-4 px-6 md:p-0 rounded-bl-lg`} style={{ transition: 'opacity .15s ease-in'}}>
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:mr-4">
                    <Link href="/" className='font-bold'>Applications</Link>
                    <Link href="/submittedapplication" className='font-bold'>Submitted Application</Link>
                    <Link href="/funders" className='font-bold'>Funders</Link>
                </div>
                {user?.email && <div className="mt-6 md:mt-0 text-sm font-bold cursor-pointer" onClick={async () => {
                    await handleLogout()
                    setUser({})
                    router.push('/login')
                }}>
                    Log out
                </div>}
                <div className="mt-2 md:mt-0 flex flex-row-reverse items-center justify-end gap-3">
                    <div className="md:hidden lg:block">{user?.email}</div>
                    <div className="lg:hidden cursor-pointer" title={user?.email}><FaUserCircle /></div>
                </div>
            </div>
        </header>
    )
}
