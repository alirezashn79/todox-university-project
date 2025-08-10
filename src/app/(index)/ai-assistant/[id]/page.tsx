import { isAuth } from '@/utils/serverHelpers'
import dynamic from 'next/dynamic'
const ChatSection = dynamic(() => import('@/components/modules/chat/ChatSection'))

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { avatar } = await isAuth()

  return <ChatSection id={id} avatar={avatar} />
}
