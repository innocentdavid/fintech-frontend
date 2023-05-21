import React, { useContext, useEffect } from 'react'
import Create from '../components/Create'
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import { getCookie } from '../utils/helpers';

export default function Createnew() {
  const router = useRouter()
  const { user, refreshUser, setRefreshUser } = useContext(AuthContext);
  useEffect(() => {
    if (!user) {
      setRefreshUser(refreshUser)
      const token = getCookie('jwt')
      // console.log(token);
      if (!token) {
        router.push('/login')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshUser, user])
  if (!user) { return(<></>) }
  
  return (
    <Create />
  )
}
