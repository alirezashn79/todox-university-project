import ChatInput from '@/components/modules/chat/ChatInput'
import Sidebar from '@/components/modules/chat/Sidebar'

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-full overflow-hidden rounded-lg lg:h-[calc(100vh-85px)]">
      <div className="relative h-full basis-full overflow-hidden bg-base-300 shadow lg:basis-3/4 xl:basis-5/6">
        <div className="absolute bottom-4 end-12 start-12 z-[999] rounded-full">
          <ChatInput />
        </div>

        {children}
      </div>

      <Sidebar />
    </main>
  )
}
