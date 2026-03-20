import type { ReactNode } from 'react'

const spanClassNames = {
  1: 'xl:col-span-1',
  2: 'xl:col-span-2',
  3: 'xl:col-span-3',
  4: 'xl:col-span-4',
  5: 'xl:col-span-5',
  6: 'xl:col-span-6',
  7: 'xl:col-span-7',
  8: 'xl:col-span-8',
  9: 'xl:col-span-9',
} as const

type DashboardGridProps = {
  children: ReactNode
  className?: string
}

type DashboardColumnProps = {
  children: ReactNode
  span: keyof typeof spanClassNames
  className?: string
}

const DashboardGrid = ({ children, className = '' }: DashboardGridProps) => {
  return <section className={`grid gap-6 xl:grid-cols-9 ${className}`}>{children}</section>
}

export const DashboardColumn = ({
  children,
  span,
  className = '',
}: DashboardColumnProps) => {
  return (
    <div className={`flex flex-col gap-6 ${spanClassNames[span]} ${className}`}>
      {children}
    </div>
  )
}

export default DashboardGrid
