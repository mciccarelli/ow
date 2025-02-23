import React from 'react'

import { Hero } from '@/components/hero'

export default function Home() {
  return (
    <div className="grid grid-cols-8 gap-4 px-4">
      <div className="col-span-8 md:col-span-6 md:col-start-2 xl:col-span-4 xl:col-start-2">
        <Hero />
      </div>
    </div>
  )
}
