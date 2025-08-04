import React from 'react'
interface IRow {
  packageName: string
  children: React.ReactNode
}
export default function Row({ children, packageName }: IRow) {
  return (
    <div className="odd:text-warning even:text-success">
      <div className="">
        <div className="text-start">
          <code>
            <span className="mx-2 inline-block animate-bounce text-sm">$</span>
            <span className="animate-pulse text-sm text-white">npm i</span>
            <kbd className="ms-1.5 inline-block animate-bounce text-wrap rounded-lg bg-[#191e24] px-1.5 py-0.5 text-sm">
              {packageName}
            </kbd>
          </code>
        </div>
        <div className="ps-2 text-end" style={{ direction: 'rtl', textAlign: 'right' }}>
          <code className="text-wrap">// {children}</code>
        </div>
      </div>

      <div className="divider"></div>
    </div>
  )
}
