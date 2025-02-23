import React from 'react'
import { Wizard } from '@/components'

export default function WizardPage() {
  return (
    <div className="grid grid-cols-8 gap-4 px-4">
      <div className="col-span-8 md:col-span-6 md:col-start-2 xl:col-span-3 xl:col-start-2">
        <Wizard />
      </div>
    </div>
  )
}
