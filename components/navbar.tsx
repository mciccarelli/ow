'use client'

import { ModeToggle } from '@/components'
import { ArrowDownUp } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      className="w-full bg-background text-foreground flex items-center justify-between p-3 md:p-6"
    >
      <Link href="/" className="hover:opacity-80 transition-opacity">
        <div className="flex gap-2 items-center">
          <ArrowDownUp size="32" />
          <div className="flex flex-col gap-y-px leading-none -mt-px">
            <span className="uppercase font-bold text-xs">Highs&Lows</span>
            <span className="uppercase font-normal text-[10px]">Ride The Market</span>
          </div>
        </div>
      </Link>

      <ModeToggle />
    </motion.header>
  )
}
