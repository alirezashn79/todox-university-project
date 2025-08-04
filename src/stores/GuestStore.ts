import { create } from 'zustand'
import { persist } from 'zustand/middleware'
interface ITodo {
  id: string
  title: string
  isDone: boolean
  date: string
  time: string
}
interface IGuest {
  todos: ITodo[] | []
  addTodo: (todo: Omit<ITodo, 'isDone' | 'id'>) => void
  editTodo: (todo: Omit<ITodo, 'isDone' | 'date'>) => void
  deleteTodo: (id: string) => void
  clearTodos: () => void
  checkAll: ({ date, isCheck }: { date: string; isCheck: boolean }) => void
  toggleDoneTodo: (id: string) => void
}

const useGuest = create<IGuest>()(
  persist(
    (set, get) => ({
      todos: [],
      addTodo: (todo) => {
        var id = new Date().getTime().toString()
        const newTodo = {
          ...todo,
          id,
          isDone: false,
        }

        set((state) => ({
          todos: [...state.todos, newTodo],
        }))
      },
      editTodo: (todo) => {
        const AllTodos = get().todos.slice()
        const index = AllTodos.findIndex((item) => item.id === todo.id)
        AllTodos[index] = { ...AllTodos[index], ...todo }
        set({ todos: AllTodos })
      },
      deleteTodo: (id) => {
        const AllTodos = get().todos.slice()
        const filteredTodos = AllTodos.filter((item) => item.id !== id)
        set({ todos: filteredTodos })
      },
      clearTodos: () => {
        set({ todos: [] })
      },
      checkAll: ({ date, isCheck }) => {
        const allTodos = get().todos.slice()
        allTodos.forEach((item) => {
          if (item.date === date) {
            return (item.isDone = isCheck)
          }
        })
        set({ todos: allTodos })
      },
      toggleDoneTodo: (id) => {
        const allTodos = get().todos.slice()
        const index = allTodos.findIndex((item) => item.id === id)
        allTodos[index].isDone = !allTodos[index].isDone
        set({ todos: allTodos })
      },
    }),
    {
      name: 'guest',
      version: undefined,
    }
  )
)

export default useGuest
