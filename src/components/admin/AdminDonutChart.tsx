import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export type DonutItem = {
  label: string
  value: number
  color: string
}

type Props = {
  data: DonutItem[]
  height?: number
  innerRadius?: number
  outerRadius?: number
}

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(10,10,20,0.92)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  color: '#fff',
  fontSize: 12,
}

export default function AdminDonutChart({
  data,
  height = 200,
  innerRadius = 50,
  outerRadius = 80,
}: Props) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const filtered = data.filter((d) => d.value > 0)

  if (filtered.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-white/30"
        style={{ height }}
      >
        No data
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={filtered}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          dataKey="value"
          nameKey="label"
          paddingAngle={2}
          strokeWidth={0}
        >
          {filtered.map((entry, index) => (
            <Cell key={index} fill={entry.color} fillOpacity={0.88} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          formatter={(val: number, name: string) => [
            `${val} (${total > 0 ? Math.round((val / total) * 100) : 0}%)`,
            name,
          ]}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
