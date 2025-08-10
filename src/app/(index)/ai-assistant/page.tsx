import Logo from '@/assets/images/chatGPT.webp'
import Image from 'next/image'

export default function page() {
  return (
    <div className="h-full overflow-y-auto p-2">
      <div className="flex size-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-dana text-xl font-bold text-base-content lg:text-3xl">
            چطور می‌توانم به شما کمک کنم؟
          </h1>
          <div className="mt-2 flex size-32 items-center justify-center rounded-full bg-[#4ca07f]/20">
            <Image src={Logo} alt="chat GPT" height={120} width={120} />
          </div>
          <h2 className="text-[#4ca07f]">
            <span>مدل</span>
            <span>4o-mini</span>
          </h2>
        </div>
      </div>
    </div>
  )
}
