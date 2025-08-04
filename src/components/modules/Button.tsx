import { cn } from '@/utils/cn'
import { PulseLoader } from 'react-spinners'

export default function Button({
  loading,
  text,
  type = 'submit',
  disabled,
  className = '',
  onClick,
}: {
  loading: boolean
  text: string
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      type={type}
      className={cn('btn btn-primary', className)}
      disabled={loading || disabled}
      onClick={onClick}
    >
      {loading ? <PulseLoader color="#7480ff" size={6} /> : <span>{text}</span>}
    </button>
  )
}
