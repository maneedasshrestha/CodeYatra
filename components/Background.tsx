"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// Assuming you have a Button component from your UI library
// If not, you can replace it with a regular button element
import { ReactNode } from "react"
import Link from "next/link"

const Button = ({ children, ...props }: { children: ReactNode; [key: string]: any }) => (
  <button
    {...props}
    className="px-4 py-2 text-lg font-semibold bg-black text-white rounded-md hover:text-black hover:bg-white/90 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
  >
    {children}
  </button>
)

function Bubble({ x, y, size, opacity }: { x: number; y: number; size: number; opacity: number }) {
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={size}
      fill={`rgba(0, 0, 0, ${opacity})`} // Changed to black
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, opacity, opacity * 0.5, opacity],
        scale: [0, 1, 1.2, 1],
        x: x + Math.random() * 100 - 50,
        y: y + Math.random() * 100 - 50,
      }}
      transition={{
        duration: 5 + Math.random() * 10,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    />
  )
}

function AnimatedGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="black" strokeWidth="0.5" strokeOpacity="0.2">
            <animate attributeName="strokeOpacity" values="0.2;0.3;0.2" dur="5s" repeatCount="indefinite" />
          </path>
        </pattern>
        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#smallGrid)" />
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="black" strokeWidth="1" strokeOpacity="0.2">
            <animate attributeName="strokeOpacity" values="0.2;0.4;0.2" dur="7s" repeatCount="indefinite" />
          </path>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)">
        <animate attributeName="opacity" values="1;0.8;1" dur="10s" repeatCount="indefinite" />
      </rect>
    </svg>
  )
}

function FloatingBubbles() {
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number }>>([])

  useEffect(() => {
    const newBubbles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 30 + 10,
      opacity: Math.random() * 0.3 + 0.1,
    }))
    setBubbles(newBubbles)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full">
        <title>Floating Bubbles</title>
        {bubbles.map((bubble) => (
          <Bubble key={bubble.id} {...bubble} />
        ))}
      </svg>
    </div>
  )
}

export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden bg-white text-foreground">
      <AnimatedGrid />
      <FloatingBubbles />
    </div>
  )
}

