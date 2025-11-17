"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock efficiency data
const efficiencyData = [
  { month: "Yan", success: 98.5, response: 245, uptime: 99.9 },
  { month: "Fev", success: 97.8, response: 267, uptime: 99.7 },
  { month: "Mar", success: 99.1, response: 223, uptime: 99.8 },
  { month: "Apr", success: 98.9, response: 234, uptime: 99.9 },
  { month: "May", success: 99.3, response: 198, uptime: 99.9 },
  { month: "Iyn", success: 98.7, response: 256, uptime: 99.8 },
]

export function EfficiencyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integratsiya samaradorligi</CardTitle>
        <CardDescription>Muvaffaqiyat darajasi va javob vaqti dinamikasi</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            success: {
              label: "Muvaffaqiyat (%)",
              color: "hsl(var(--chart-1))",
            },
            response: {
              label: "Javob vaqti (ms)",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={efficiencyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" domain={[95, 100]} />
              <YAxis yAxisId="right" orientation="right" domain={[150, 300]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="success"
                stroke="var(--color-success)"
                name="Muvaffaqiyat (%)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="response"
                stroke="var(--color-response)"
                name="Javob vaqti (ms)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
