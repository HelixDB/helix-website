"use client"

import * as React from "react"
import { Button } from "./button"
import { Check } from "lucide-react"

export interface PricingTier {
  name: string
  description: string
  features: string[]
  onDemandPrice: number
  reservedPrice: number
  highlighted?: boolean
  callToAction: string
  callToActionLink: string
}

interface PricingCardProps {
  tier: PricingTier
  paymentFrequency: string
  onSignUpClick?: () => void
}

export function PricingCard({ tier, paymentFrequency, onSignUpClick }: PricingCardProps) {
  const price = paymentFrequency === "on demand" ? tier.onDemandPrice : tier.reservedPrice

  const handleClick = (e: React.MouseEvent) => {
    if (tier.callToActionLink === "/signup" && onSignUpClick) {
      e.preventDefault();
      onSignUpClick();
    }
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-3 rounded-3xl bg-gradient-conic from-blue-600/40 via-purple-600/40 via-pink-600/40 via-red-600/40 via-yellow-600/40 via-green-600/40 via-cyan-600/40 to-blue-600/40 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-indigo-600/25 via-purple-600/25 via-pink-600/25 to-blue-600/25 blur-xl"></div>
      <div
        className={`relative flex h-full flex-col rounded-2xl border bg-gradient-to-b from-background/98 via-background/95 to-background/90 p-6 shadow-sm transition-colors backdrop-blur-sm ${tier.highlighted
          ? "border-primary/50 shadow-md"
          : "border-border hover:border-primary/50"
          }`}
      >
        {tier.highlighted && (
          <div className="absolute -top-5 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
            Free Trial
          </div>
        )}

        <div className="mb-5 space-y-2">
          <h3 className="text-2xl font-semibold">{tier.name}</h3>
          <p className="text-sm text-muted-foreground h-10 line-clamp-2">{tier.description}</p>
        </div>

        <div className="mb-5 flex items-baseline text-foreground">
          <span className="text-4xl font-bold">$</span>
          <span className="text-5xl font-bold">{price}</span>
          <span className="ml-1 text-muted-foreground">/{paymentFrequency === "on demand" ? "hr" : "mo"}</span>
        </div>

        <div className="mb-8 space-y-2">
          {tier.features.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto">
          <Button
            className="w-full"
            variant={tier.highlighted ? "default" : "outline"}
            asChild
          >
            <a href={tier.callToActionLink} onClick={handleClick}>{tier.callToAction}</a>
          </Button>
        </div>
      </div>
    </div>
  )
}