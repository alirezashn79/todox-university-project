import 'flatpickr/dist/themes/material_green.css'
import dynamic from 'next/dynamic'
import DayPlanSection from './dayPlans/DayPlanSection'

const TodoSection = dynamic(() => import('./todo/TodoSection'))
const GoalSection = dynamic(() => import('./goal/GoalSection'))
const AppointmentSection = dynamic(() => import('./Appointment/AppointmentSection'))

export default function MainSection() {
  return (
    <div className="hide-scrollbar overflow-y-auto xl:h-[calc(100vh-200px)]">
      <div className="grid h-full grid-cols-1 gap-4 pt-2 md:grid-cols-2 xl:grid-cols-4">
        <TodoSection />

        <div className="grid h-full grid-cols-1 gap-2 overflow-hidden xl:grid-rows-2">
          <GoalSection />
          <AppointmentSection />
        </div>
        <DayPlanSection />
      </div>
    </div>
  )
}
