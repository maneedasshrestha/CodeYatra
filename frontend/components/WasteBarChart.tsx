"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useInView } from "react-intersection-observer"
import { motion } from "framer-motion"

const data = [
  { name: "Jan", recycled: 4000, landfill: 2400 },
  { name: "Feb", recycled: 3000, landfill: 1398 },
  { name: "Mar", recycled: 2000, landfill: 9800 },
  { name: "Apr", recycled: 2780, landfill: 3908 },
  { name: "May", recycled: 1890, landfill: 4800 },
  { name: "Jun", recycled: 2390, landfill: 3800 },
]

export function WasteBarChart() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="w-full h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" stroke="#888888" />
          <YAxis stroke="#888888" />
          <Tooltip
            contentStyle={{ backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
          />
          <Legend />
          <Bar dataKey="recycled" fill="#4CAF50" radius={[4, 4, 0, 0]} />
          <Bar dataKey="landfill" fill="#FFA000" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

