"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const wasteCompositionData = [
  { name: "Organic Waste", value: 45, fill: "hsl(var(--success))" },
  { name: "Plastics", value: 20, fill: "hsl(var(--warning))" },
  { name: "Paper", value: 15, fill: "hsl(var(--primary))" },
  { name: "Glass", value: 10, fill: "hsl(var(--secondary))" },
  { name: "Metals", value: 7, fill: "hsl(var(--accent))" },
  { name: "Others", value: 3, fill: "hsl(var(--muted))" },
]

const wasteCollectionData = [
  { month: "Jan", totalWaste: 1200, recycled: 300, compost: 400, landfill: 500 },
  { month: "Feb", totalWaste: 1300, recycled: 350, compost: 450, landfill: 500 },
  { month: "Mar", totalWaste: 1400, recycled: 400, compost: 500, landfill: 500 },
  { month: "Apr", totalWaste: 1500, recycled: 450, compost: 550, landfill: 500 },
  { month: "May", totalWaste: 1600, recycled: 500, compost: 600, landfill: 500 },
  { month: "Jun", totalWaste: 1700, recycled: 550, compost: 650, landfill: 500 },
]

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-2 rounded shadow-lg">
        <p className="font-bold">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}${entry.unit || ""}`}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const WasteManagementCharts = () => {
  const [compositionData, setCompositionData] = useState(wasteCompositionData.map((item) => ({ ...item, value: 0 })))
  const [collectionData, setCollectionData] = useState(
    wasteCollectionData.map((item) => ({ ...item, totalWaste: 0, recycled: 0, compost: 0, landfill: 0 })),
  )

  useEffect(() => {
    const animateCharts = () => {
      setCompositionData(wasteCompositionData)
      setCollectionData(wasteCollectionData)
    }

    setTimeout(animateCharts, 500)
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="w-full bg-background text-foreground">
        <CardHeader>
          <CardTitle>Waste Composition</CardTitle>
          <CardDescription>Breakdown of waste types in percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="10%" outerRadius="80%" barSize={20} data={compositionData}>
                <RadialBar
                  label={{ position: "insideStart", fill: "hsl(var(--foreground))", fontWeight: 600 }}
                  background
                  dataKey="value"
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </motion.div>
        </CardContent>
      </Card>

      <Card className="w-full bg-background text-foreground">
        <CardHeader>
          <CardTitle>Waste Collection Trends</CardTitle>
          <CardDescription>Monthly breakdown of waste management (in tons)</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="h-[400px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={collectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="recycled" stackId="a" fill="hsl(var(--primary))" />
                <Bar dataKey="compost" stackId="a" fill="hsl(var(--success))" />
                <Bar dataKey="landfill" stackId="a" fill="hsl(var(--warning))" />
                <Line
                  type="monotone"
                  dataKey="totalWaste"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}

export default WasteManagementCharts

