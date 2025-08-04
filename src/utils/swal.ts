import useTheme from '@/stores/ThemeStore'
import toast from 'react-hot-toast'
import Swal, { SweetAlertOptions } from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FireToast } from './toast'
const MySwal = withReactContent(Swal)

interface IConfirmSwal {
  confirmText: string
  subText?: string
  successFunction?: () => Promise<void>
  successFunctionVoid?: () => void
  successText: string
}

export const fireSwal = (options: SweetAlertOptions) => {
  const theme = useTheme.getState().theme

  return MySwal.fire({
    position: 'top',
    toast: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    background: theme === 'dark' ? '#1d232a' : undefined,
    color: theme === 'dark' ? '#a6adbb' : undefined,
    ...options,
  })
}

export const fireConfirmSwal = ({
  confirmText,
  subText,
  successFunction,
  successFunctionVoid,
  successText,
}: IConfirmSwal) => {
  fireSwal({
    title: confirmText,
    text: subText,
    icon: 'question',
    showCancelButton: true,
    cancelButtonText: 'منصرف شدم',
    confirmButtonText: 'بله',
  }).then(async (result) => {
    if (result.isConfirmed) {
      const loadingToast = FireToast({
        type: 'loading',
        message: 'صبر کنید...',
      })
      try {
        if (successFunction) await successFunction()
        if (successFunctionVoid) successFunctionVoid()
        FireToast({ type: 'success', message: successText })
      } catch (error) {
        FireToast({ type: 'error', message: 'خطا' })
      } finally {
        toast.dismiss(loadingToast)
      }
    }
  })
}
