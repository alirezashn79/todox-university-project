import ChatSection from '@/components/modules/chat/ChatSection'
import { isAuth } from '@/utils/serverHelpers'

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { avatar } = await isAuth()

  return <ChatSection id={id} avatar={avatar} />
}
