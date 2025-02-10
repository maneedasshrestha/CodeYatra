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

export default async function Page() {
  const supabase = await createClient();
  
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid lg:grid-cols-[280px_1fr]">
        <aside className="border-r bg-background/50 backdrop-blur">
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <Wallet className="h-6 w-6" />
            <span className="font-bold">EcoGrid</span>
          </div>
          <div className="px-4 py-4">
            <Input placeholder="Search" className="bg-background/50" />
          </div>
          <nav className="space-y-2 px-2">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
                <Link href="https://www.google.com">
                  <Button variant="ghost" className="w-full justify-start gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                  </Button>
                </Link>
            <Link href="/protected/map">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Globe className="h-4 w-4" />
              Map
            </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
              Eco Chat
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-focus"><circle cx="12" cy="12" r="3"/><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/></svg>
              Classification Model
              
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <LifeBuoy className="h-4 w-4" />
              Support
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <form onSubmit={signOutAction}>
            <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
          </nav>
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
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">General Statistics</h2>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  Today
                </Button>
                <Button size="sm" variant="ghost">
                  Last week
                </Button>
                <Button size="sm" variant="ghost">
                  Last month
                </Button>
                <Button size="sm" variant="ghost">
                  Last 6 month
                </Button>
                <Button size="sm" variant="ghost">
                  Year
                </Button>
              </div>
            </div>
            <StatsChart />
          </Card>
          
        </main>
      </div>
    </div>
  )
  }

