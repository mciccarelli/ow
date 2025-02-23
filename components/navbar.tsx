'use client'

import { useState } from 'react'
import { ArrowDownUp } from 'lucide-react'
import { ModeToggle, TextScramble } from '@/components'
import Link from 'next/link'

export function Navbar() {
  const [isTrigger, setIsTrigger] = useState(false)

  return (
    <header className="grid grid-cols-8 p-4 items-center gap-4">
      <Link href="/" className="hover:opacity-80 transition-opacity col-span-1">
        <ArrowDownUp size="24" />
      </Link>
      <div className="flex gap-2 items-center justify-between col-span-7">
        <div className="leading-none font-semibold cursor-default text-sm flex gap-x-2 flex-col md:flex-row gap-0 md:items-center items-start">
          <span>OptionsWizard</span>
          <span className="text-muted-foreground/90 hidden md:flex items-center gap-2">
            -
            <TextScramble
              as="span"
              speed={0.01}
              trigger={isTrigger}
              onHoverStart={() => setIsTrigger(true)}
              onScrambleComplete={() => setIsTrigger(false)}
            >
              Leverage is a tool—use it wisely.
            </TextScramble>
          </span>
        </div>
        <ModeToggle />
      </div>
    </header>
  )
}
