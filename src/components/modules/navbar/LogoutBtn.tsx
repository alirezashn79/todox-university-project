'use client'

import client from '@/utils/client'
import { fireConfirmSwal } from '@/utils/swal'
import { useRouter } from 'next/navigation'

export default function LogoutBtn() {
  const { replace } = useRouter()

  const handleLogout = () => {
    const logout = async () => {
      await client.get('api/auth/logout')
      replace('/auth/login-register')
    }
    fireConfirmSwal({
      confirmText: 'آیا میخواهید خارج شوید؟',
      successFunction: logout,
      successText: 'خارج شدید',
    })
  }
  return (
    <button onClick={handleLogout} className="px-2 py-3 text-error">
      خروج
    </button>
  )
}
