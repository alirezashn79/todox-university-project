import 'flatpickr/dist/themes/material_green.css'
import dynamic from 'next/dynamic'
import DayPlanSection from './dayPlans/DayPlanSection'

const TodoSection = dynamic(() => import('./todo/TodoSection'))
const GoalSection = dynamic(() => import('./goal/GoalSection'))
const AppointmentSection = dynamic(() => import('./Appointment/AppointmentSection'))

export default function MainSection() {
  return (
    <div className="h-full grow overflow-y-auto overflow-x-hidden py-1 transition-all">
      <div className="grid h-full grid-cols-1 items-stretch gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <TodoSection />
        <GoalSection />
        <AppointmentSection />
        <DayPlanSection />
      </div>
    </div>
  )
}
