import { ModeToggle } from '@/components/mode-toggle'
import { ArrowDownUp } from 'lucide-react'

export function Navbar() {
  return (
    <header className="w-full bg-background text-foreground flex items-center justify-between p-6">
      <div className="flex gap-2 items-center">
        <ArrowDownUp size="32" />
        <div className="flex flex-col gap-y-px leading-none">
          <span className="uppercase font-semibold text-xs">Highs&Lows</span>
          <span className="uppercase font-normal text-[10px]">Ride The Market</span>
        </div>
      </div>
      <ModeToggle />
    </header>
  )
}
