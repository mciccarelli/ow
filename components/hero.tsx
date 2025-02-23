'use client'

import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { TextEffect } from '@/components/ui/text-effect'
import { resetWizardAtom } from '@/store/wizard'
import { motion } from 'framer-motion'
import Link from 'next/link'

export function Hero() {
  const resetWizard = useSetAtom(resetWizardAtom)

  // reset all wizard state on mount
  useEffect(() => {
    resetWizard()
  }, [])

  return (
    <div className="relative flex flex-col items-center md:items-start text-center md:text-left overflow-hidden gap-y-4">
      <div className="flex flex-col gap-y-2">
        <TextEffect
          className="text-sm font-semibold tracking-widest uppercase text-muted-foreground"
          per="word"
          as="p"
          preset="fade-in-blur"
        >
          Smarter Crypto Options
        </TextEffect>
        <TextEffect
          per="line"
          as="h1"
          segmentWrapperClassName="overflow-hidden block"
          className="text-3xl font-black leading-none sm:text-5xl md:text-6xl lg:text-7xl"
          variants={{
            container: {
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            },
            item: {
              hidden: {
                opacity: 0,
                y: 40,
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.4,
                },
              },
            },
          }}
        >
          {`Master the Market 
            With Precision`}
        </TextEffect>
      </div>
      <motion.p
        className="max-w-sm md:max-w-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.4,
          ease: [0.24, 0.25, 0.25, 1],
          delay: 0.5,
        }}
      >
        Discover powerful crypto options trading strategies with our AI-powered wizard. Analyze market conditions,
        refine your approach, and get tailored trade recommendations—step by step.
      </motion.p>
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, filter: 'blur(4px)' }}
        animate={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{
          duration: 0.4,
          delay: 0.7,
        }}
      >
        <Link href="/wizard">
          <Button size="lg" className="bg-primary dark:bg-accent-foreground rounded-full px-8 min-w-[200px]">
            Start Trading Wizard
          </Button>
        </Link>
        <Button variant="outline" size="lg" className="rounded-full px-8 min-w-[200px]">
          Learn More
        </Button>
      </motion.div>
    </div>
  )
}
