import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa'
import { AuthContext } from '../context/AuthContext'

export default function Nav() {
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    const [showMobileMenu, setShowMobileMenu] = useState(false)

    return (<>
        <header className="flex gap-10 items-center justify-between p-5 bg-black text-white relative">
            <Link onClick={() => {
                // setLoading(true)
            }} href="/" className="text-lg font-bold">Fintech</Link>
            {showMobileMenu ?
                <FaTimes size={20} className="md:hidden cursor-pointer" onClick={() => setShowMobileMenu(!showMobileMenu)} />
                :
                <FaBars size={20} className="md:hidden cursor-pointer" onClick={() => setShowMobileMenu(!showMobileMenu)} />
            }
            <div className={`${showMobileMenu ? 'opacity-100' : 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto'} z-10 flex flex-col md:flex-row md:items-center md:gap-2 absolute md:static top-full right-0 bg-slate-300 bg-opacity-25 backdrop-blur-lg backdrop-filter backdrop-saturate-150 text-black md:text-white md:bg-transparent py-4 px-6 md:p-0 rounded-bl-lg`} style={{ transition: 'opacity .15s ease-in' }}>
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:mr-4">
                    <Link onClick={() => {
                        // setLoading(true)
                    }} href="/" className='font-bold hover:underline border py-1 px-2'>Applications</Link>
                    <Link onClick={() => {
                        // setLoading(true)
                    }} href="/submittedapplication" className='font-bold hover:underline border py-1 px-2'>Submitted Application</Link>
                    <Link onClick={() => {
                        // setLoading(true)
                    }} href="/stats" className='font-bold hover:underline border py-1 px-2'>Stats</Link>
                    <Link onClick={() => {
                        // setLoading(true)
                    }} href="/funders" className='font-bold hover:underline border py-1 px-2'>Funders</Link>
                </div>
                {isAuthenticated ? <> 
                 <div className="mt-6 md:mt-0 text-sm font-bold cursor-pointer border border-slate-200 py-1 px-3" onClick={logout}>
                    Log out
                </div> 
                <div className="mt-2 md:mt-0 flex flex-row-reverse items-center justify-end gap-3">
                        <div className="md:hidden lg:block">{user?.email}</div>
                        <div className="lg:hidden cursor-pointer" title={user?.email}><FaUserCircle /></div>
                    </div>
                    </>:
                    <Link href={'/login'} className='mt-6 md:mt-0 text-sm font-bold cursor-pointer'>Login</Link>
                }
            </div>
        </header>
    </>)
}
