import ChatInput from '@/components/modules/chat/ChatInput'
import Sidebar from '@/components/modules/chat/Sidebar'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full overflow-x-hidden">
      <div className="relative h-full grow bg-base-300 shadow">
        <div className="absolute bottom-4 end-4 start-4 z-10 overflow-hidden rounded-lg">
          <ChatInput />
        </div>

        {children}
      </div>

      <Sidebar />
    </div>
  )
}
