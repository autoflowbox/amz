import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const SERIES_BLUE = '#3987e5'
const GRID = '#2c2c2a'
const AXIS_TEXT = '#c3c2b7'
const SURFACE = '#1a1a19'

export interface RankingDatum {
  label: string
  value: number
  sublabel?: string
}

export function RankingBarChart({
  data,
  valueLabel,
  labelWidth = 200,
}: {
  data: RankingDatum[]
  valueLabel: string
  labelWidth?: number
}) {
  if (data.length === 0) {
    return <p className="text-sm text-white/40 py-8 text-center">Chưa có dữ liệu.</p>
  }

  const height = Math.max(120, data.length * 34 + 24)

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, bottom: 4, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID} horizontal={false} />
        <XAxis type="number" tick={{ fill: AXIS_TEXT, fontSize: 12 }} axisLine={{ stroke: GRID }} tickLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="label"
          width={labelWidth}
          tick={{ fill: AXIS_TEXT, fontSize: 12 }}
          axisLine={{ stroke: GRID }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
          contentStyle={{ background: SURFACE, border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
          labelStyle={{ color: '#fff' }}
          itemStyle={{ color: AXIS_TEXT }}
          formatter={(value) => [String(value), valueLabel]}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {data.map((_, i) => (
            <Cell key={i} fill={SERIES_BLUE} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
