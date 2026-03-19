const progressData = [
  {
    label: 'Javascript',
    value: '85%',
    color: 'bg-linear-to-r from-cyan-500 to-blue-500',
    variant: 'Dashboard',
  },
  {
    label: 'React',
    value: '60%',
    color: 'bg-linear-to-t from-sky-500 to-indigo-500',
    variant: 'Dashboard',
  },
  {
    label: 'Java',
    value: '45%',
    color: 'bg-linear-to-bl from-violet-500 to-fuchsia-500',
    variant: 'Dashboard',
  },
  {
    label: 'SpringBoot',
    value: '30%',
    color: 'bg-linear-65 from-purple-500 to-pink-500',
    variant: 'Dashboard',
  },
  {
    label: 'Java',
    value: '45%',
    color: 'bg-linear-to-bl from-violet-500 to-fuchsia-500',
    variant: 'Dashboard',
  },
  {
    label: 'SpringBoot',
    value: '30%',
    color: 'bg-linear-65 from-purple-500 to-pink-500',
    variant: 'Dashboard',
  },
]

const ProgressSection = () => {
  return (
    <div className="space-y-4">
      {progressData.map((item) => (
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
