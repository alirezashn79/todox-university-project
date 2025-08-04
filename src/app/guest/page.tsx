import Table from '@/components/template/guest/main/table/Table'
import NavigationDate from '@/components/template/index/NavigationDate'
import { isAuth } from '@/utils/serverHelpers'
import { redirect } from 'next/navigation'

export default async function page() {
  const user = await isAuth()
  if (user) {
    return redirect('/')
  }

  return (
    <section className="mt-8">
      <NavigationDate />

      <div className="mt-4">
        <Table />
      </div>
    </section>
  )
}
