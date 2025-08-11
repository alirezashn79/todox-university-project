import Weather from '@/components/modules/weather/Weather'
import MainSection from '@/components/template/index/MainSection'
import NavigationDate from '@/components/template/index/NavigationDate'
import Table from '@/components/template/index/Table'

export default async function HomePage() {
  return (
    <main className="flex w-full flex-col overflow-hidden md:h-[calc(100vh-80px)]">
      <NavigationDate />

      <MainSection />
    </main>
  )
}
