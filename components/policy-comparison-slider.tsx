"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export function PolicyComparisonSlider() {
  const [compareValue, setCompareValue] = useState(50)
  
  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-xl border">
      <div className="absolute inset-0 flex">
        <div className="h-full" style={{ width: `${compareValue}%`, overflow: 'hidden' }}>
          <Card className="w-[100vw] h-full p-6 rounded-none">
            <h3 className="text-xl font-bold">Basic Plan</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2">✓ ₹5 Lakh Coverage</li>
              <li className="flex items-center gap-2">✓ 3000+ Hospitals</li>
              <li className="flex items-center gap-2">✓ 30 Day Waiting Period</li>
            </ul>
          </Card>
        </div>
        <div className="h-full" style={{ width: `${100 - compareValue}%`, overflow: 'hidden' }}>
          <Card className="w-[100vw] h-full p-6 rounded-none bg-primary/5">
            <h3 className="text-xl font-bold">Premium Plan</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center gap-2">✓ ₹25 Lakh Coverage</li>
              <li className="flex items-center gap-2">✓ 7500+ Hospitals</li>
              <li className="flex items-center gap-2">✓ No Waiting Period</li>
            </ul>
          </Card>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="h-full w-[2px] bg-primary/50" style={{ left: `${compareValue}%` }}></div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 px-6">
        <Slider 
          value={[compareValue]} 
          onValueChange={(values) => setCompareValue(values[0])} 
          className="z-10"
        />
      </div>
    </div>
  )
}