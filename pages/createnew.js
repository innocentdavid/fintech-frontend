import React, { useContext, useEffect } from 'react'
import Create from '../components/Create'
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import { getCookie } from '../utils/helpers';
import Link from 'next/link';
import LoadingModal from '../components/LoadingModal ';

export default function Createnew() {
  const router = useRouter()
  const { user, loading, refreshUser, setRefreshUser } = useContext(AuthContext);
  useEffect(() => {
    if (!user) {
      router.push('/login')
      setRefreshUser(refreshUser)
      const token = getCookie('jwt')
      // console.log(token);
      if (!token) {
        router.push('/login')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshUser, user])
  if (loading) {
    return (<>
      <LoadingModal loading={loading} />
    </>)
  }

  if (!user) {
    return (
        <></>
    //   <div className='m-10'>
    //     <Link href="/login" className=''><button className='py-2 px-4 bg-teal-300 text-white rounded-md'>Login</button></Link>
    //   </div>
    )
  }
  
  return (
    <Create />
  )
}
