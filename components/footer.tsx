'use client'

import { useState } from 'react'
import { TextScramble } from '@/components'

export function Footer() {
  const [isTrigger, setIsTrigger] = useState(false)

  return (
    <footer className="w-full flex items-center justify-center p-6 ">
      <div className="text-xs text-foreground/40 transition-colors hover:text-foreground cursor-default">
        <TextScramble
          as="span"
          speed={0.01}
          trigger={isTrigger}
          onHoverStart={() => setIsTrigger(true)}
          onScrambleComplete={() => setIsTrigger(false)}
        >
          Leverage is a tool—use it wisely.
        </TextScramble>
      </div>
    </footer>
  )
}
