import type { DashboardProgressItem } from '#/data/dashboard/types'

const ProgressSection = ({ items }: { items: DashboardProgressItem[] }) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <ProgressBar
          key={item.label}
          label={item.label}
          value={item.value}
          color={item.color}
          variant={item.variant}
        />
      ))}
    </div>
  )
}

export default ProgressSection

export const ProgressBar = ({
  label,
  value,
  color,
  variant,
}: {
  label?: string
  value?: string
  color?: string
  variant?: string
}) => {
  const percent = Number.parseInt(value?.replace('%', '') ?? '0', 10)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-white">{label}</h4>
        {variant === 'Dashboard' && (
          <span className="text-white/45 text-sm">{value}</span>
        )}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/12">
        <div
          className={`h-full rounded-full ${color ?? 'bg-white'}`}
          style={{ width: `${Number.isNaN(percent) ? 0 : percent}%` }}
        />
      </div>
    </div>
  )
}
