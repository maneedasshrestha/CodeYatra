import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MetricsCard } from "@/components/metrics-card"
import { StatsChart } from "@/components/stats-chart"
import { BarChart3, ChevronDown, Globe, Home, LayoutDashboard, LifeBuoy, Settings, Wallet } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/server";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { signOutAction } from "@/app/actions";
import "@/app/globals.css"
import ModernCharts from "@/components/Charts"
import WasteManagementCharts from "@/components/Charts"

export default async function Page() {
  const supabase = await createClient();
  
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="border-r bg-background/50 backdrop-blur">

        </aside>
        <main className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Overview</h1>
              <div className="text-sm text-muted-foreground">Feb 1, 2025 - Feb 11, 2025</div>
            </div>
            
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricsCard
              title="Waste Collection Cost"
              value="Rs. 74,892"
              change={{ value: "Rs. 1,340", percentage: "-2.1%", isPositive: false }}
            />
            <MetricsCard
              title="Garbage Collected"
              value="20,892 kg"
              change={{ value: "1,040 kg", percentage: "+13.2%", isPositive: true }}
            />
            <MetricsCard
              title="Garbage Recycled"
              value="8693 kg"
              change={{ value: "1,340 kg", percentage: "+1.2%", isPositive: true }}
            />
          </div>
          <Card className="mt-6 p-6">
            <WasteManagementCharts/>
          </Card>
          
        </main>
      </div>
    </div>
  )
  }