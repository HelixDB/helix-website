"use client"

import * as React from "react"
interface TabProps {
  text: string
  selected: boolean
  setSelected: (value: string) => void
  discount?: boolean
}

export function Tab({ text, selected, setSelected, discount }: TabProps) {
  return (
    <button
      onClick={() => setSelected(text)}
      className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${selected
        ? "bg-background text-foreground shadow-sm"
        : "text-muted-foreground hover:bg-background/50"
        }`}
    >
      <span className="relative  capitalize">
        {text}
        {discount && (
          <span className="absolute -right-1 -top-3 translate-x-full rounded-full bg-primary px-1.5 py-px text-[10px] font-medium text-primary-foreground">
            -30%
          </span>
        )}
      </span>
    </button>
  )
}