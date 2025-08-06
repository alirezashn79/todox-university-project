import MainSection from '@/components/template/index/MainSection'
import NavigationDate from '@/components/template/index/NavigationDate'
import Table from '@/components/template/index/Table'

export default async function HomePage() {
  return (
    <main>
      <NavigationDate />
      <MainSection />
    </main>
  )
}
