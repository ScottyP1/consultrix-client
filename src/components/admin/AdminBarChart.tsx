import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

export type BarChartItem = {
  label: string
  value: number
  color?: string
}

type Props = {
  data: BarChartItem[]
  layout?: 'horizontal' | 'vertical'
  height?: number
  showValues?: boolean
}

const TOOLTIP_STYLE = {
  backgroundColor: 'rgba(10,10,20,0.92)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8,
  color: '#fff',
  fontSize: 12,
}

export default function AdminBarChart({
  data,
  layout = 'vertical',
  height = 200,
  showValues = false,
}: Props) {
  if (layout === 'horizontal') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24, top: 4, bottom: 4 }}>
          <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={90}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            formatter={(val: number) => [val, 'Count']}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color ?? '#38bdf8'} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ left: 0, right: 0, top: 4, bottom: 4 }}>
        <XAxis
          dataKey="label"
          tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          formatter={(val: number) => [val, 'Count']}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color ?? '#818cf8'} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
