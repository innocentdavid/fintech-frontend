import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { handleLogout } from '../utils/helpers'

export default function Nav({user, setUser}) {
    const router = useRouter()

  return (
      <header className="flex gap-10 items-center justify-between p-5 bg-black text-white">
          <Link href="/" className="text-lg font-bold">Fintech</Link>
          <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 md:mr-4">
                  <Link href="/" className='font-bold'>Applications</Link>
                  <Link href="/funders" className='font-bold'>Funders</Link>
              </div>
              <div className="text-sm font-bold cursor-pointer" onClick={async () => {
                  await handleLogout()
                  setUser({})
                  router.push('/login')
              }}>
                  Log out
              </div>
              <div className="hidden lg:block">{user?.email}</div>
              <div className="lg:hidden cursor-pointer" title={user?.email}><FaUserCircle /></div>
          </div>
      </header>
  )
}
