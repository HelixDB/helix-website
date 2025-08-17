import Image from 'next/image'
import { User } from 'lucide-react'

interface AuthorAvatarProps {
  author?: {
    name?: string
    avatar?: string
    image?: string
    picture?: string
    photo?: string
  }
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
  className?: string
}

export function AuthorAvatar({ 
  author, 
  size = 'sm', 
  showName = true,
  className = ''
}: AuthorAvatarProps) {
  const authorName = author?.name || 'Anonymous'
  const authorImage = author?.avatar || author?.image || author?.picture || author?.photo
  
  const sizeClasses = {
    sm: { container: 'h-6 w-6', icon: 'h-3 w-3', text: 'text-sm' },
    md: { container: 'h-10 w-10', icon: 'h-5 w-5', text: 'text-base' },
    lg: { container: 'h-12 w-12', icon: 'h-6 w-6', text: 'text-lg' }
  }
  
  const sizes = sizeClasses[size]
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`relative ${sizes.container} rounded-full overflow-hidden bg-muted flex items-center justify-center`}>
        {authorImage ? (
          <Image
            src={authorImage}
            alt={authorName}
            fill
            className="object-cover"
          />
        ) : (
          <User className={`${sizes.icon} text-muted-foreground`} />
        )}
      </div>
      {showName && (
        <span className={`${sizes.text} text-muted-foreground`}>
          {authorName}
        </span>
      )}
    </div>
  )
}