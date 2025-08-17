'use client'

import Image from 'next/image'
import { useState } from 'react'

interface BlogImageProps {
  src: string
  alt: string
  className?: string
  sizes?: string
  priority?: boolean
  fill?: boolean
  width?: number
  height?: number
}

export function BlogImage({ 
  src, 
  alt, 
  className = '', 
  sizes,
  priority = false,
  fill = false,
  width,
  height
}: BlogImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${fill ? 'absolute inset-0' : ''}`} 
           style={!fill ? { width: width || 800, height: height || 400 } : undefined}>
        <div className="text-muted-foreground text-sm">No image</div>
      </div>
    )
  }

  const handleLoad = () => setIsLoading(false)
  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (fill) {
    return (
      <>
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes || '100vw'}
          className={className}
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          crossOrigin="anonymous"
          unoptimized={false}
        />
      </>
    )
  }

  return (
    <div className="relative" style={{ width: width || 800, height: height || 400 }}>
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 400}
        className={className}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        crossOrigin="anonymous"
        unoptimized={false}
      />
    </div>
  )
}