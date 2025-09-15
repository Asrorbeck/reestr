"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock ministry activity data
const ministryActivityData = [
  { name: "Moliya vazirligi", value: 45, color: "hsl(var(--chart-1))" },
  { name: "Soliq qo'mitasi", value: 30, color: "hsl(var(--chart-2))" },
  { name: "Statistika qo'mitasi", value: 15, color: "hsl(var(--chart-3))" },
  { name: "Iqtisodiyot vazirligi", value: 7, color: "hsl(var(--chart-4))" },
  { name: "Boshqalar", value: 3, color: "hsl(var(--chart-5))" },
]

export function MinistryActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Eng faol vazirliklar</CardTitle>
        <CardDescription>Integratsiyalar soni bo'yicha vazirliklar faolligi</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Faollik (%)",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ministryActivityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ministryActivityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
