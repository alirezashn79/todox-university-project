import { cn } from '@/utils/cn'
import { ChevronDown } from 'lucide-react'
import React, { HTMLProps, useState } from 'react'

interface IProps {
  children: React.ReactNode
  title: string
  theme: 'primary' | 'accent' | 'error' | 'secondary' | 'warning' | 'info' | 'success'
  className?: HTMLProps<HTMLElement>['className']
  openClassName?: HTMLProps<HTMLElement>['className']
  childrenWrapperClassName?: HTMLProps<HTMLElement>['className']
  isShowAddButton?: boolean
  onAddClick?: () => void
  isLoading: boolean
  addButtonText?: string
}

export default function Card({
  children,
  theme,
  title,
  className,
  openClassName,
  childrenWrapperClassName,
  isShowAddButton,
  isLoading,
  onAddClick,
  addButtonText = 'افزودن',
}: IProps) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div
      className={cn(
        `card box-border h-9 shrink-0 overflow-hidden border border-transparent md:!h-full ${className}`,
        isOpen && `h-72 max-h-fit md:!h-full md:max-h-full ${openClassName}`,
        isLoading && `border-${theme}`
      )}
    >
      <div className="sticky left-0 right-0 top-0 z-10 bg-base-300">
        <h2 className={`p-1 text-center text-lg text-${theme}`}>{title}</h2>

        {isShowAddButton && (
          <div className="absolute end-2 top-1">
            <button onClick={onAddClick} className={`btn btn-${theme} btn-xs`}>
              {addButtonText}
            </button>
          </div>
        )}
        <div className="absolute start-2 top-1">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className="btn btn-square btn-ghost btn-xs md:hidden"
          >
            <ChevronDown className={cn('transition-transform', isOpen && 'rotate-180')} />
          </button>
        </div>
      </div>
      <div
        className={cn('card-body overflow-y-auto bg-base-300 p-2 md:h-1', childrenWrapperClassName)}
      >
        {children}
      </div>
    </div>
  )
}
