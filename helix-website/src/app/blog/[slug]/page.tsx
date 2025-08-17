import { getBlogPost, getBlogPosts } from '@/lib/marble'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { BlogImage } from '@/components/blog-image'
import { AuthorAvatar } from '@/components/author-avatar'
import { MDXRenderer } from '@/components/md/MDXRenderer'
import { Metadata } from 'next'
import '../blog.css'

// Revalidate this page every hour
export const revalidate = 3600

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    }
  }

  // Extract first 160 characters for meta description
  const description = post.excerpt || 
    (post.content?.replace(/<[^>]*>/g, '').substring(0, 160) + '...') || 
    `Read about ${post.title} on the HelixDB blog.`

  const imageUrl = post.featured_image || post.coverImage || post.cover || post.image
  const publishedTime = new Date(post.publishedAt).toISOString()
  const modifiedTime = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishedTime

  return {
    title: `${post.title} | HelixDB Blog`,
    description,
    keywords: post.tags?.map(tag => typeof tag === 'string' ? tag : (tag as any).name || (tag as any).label).join(', '),
    authors: [{ name: post.author?.name || 'HelixDB Team' }],
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: [post.author?.name || 'HelixDB Team'],
      images: imageUrl ? [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : undefined,
      tags: post.tags?.map(tag => typeof tag === 'string' ? tag : (tag as any).name || (tag as any).label),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
    alternates: {
      canonical: `https://helix-db.com/blog/${slug}`,
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.content?.replace(/<[^>]*>/g, '').substring(0, 160),
    image: post.featured_image || post.coverImage || post.cover || post.image,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date(post.publishedAt).toISOString(),
    author: {
      '@type': 'Person',
      name: post.author?.name || 'HelixDB Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'HelixDB',
      logo: {
        '@type': 'ImageObject',
        url: 'https://helix-db.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://helix-db.com/blog/${slug}`,
    },
    keywords: post.tags?.map(tag => typeof tag === 'string' ? tag : (tag as any).name || (tag as any).label).join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

      <article itemScope itemType="https://schema.org/BlogPosting">
        <header className="mb-8">
          {(post.featured_image || post.coverImage || post.cover || post.image) && (
            <div className="relative w-full aspect-video overflow-hidden rounded-2xl mb-8 bg-muted">
              <BlogImage
                src={post.featured_image || post.coverImage || post.cover || post.image || ''}
                alt={post.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority
              />
            </div>
          )}

          <h1 className="text-4xl font-bold mb-4" itemProp="headline">{post.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <AuthorAvatar
                author={post.author}
                size="md"
                showName={false}
              />
              <div>
                <p className="font-medium">{post.author?.name || 'Anonymous'}</p>
                <time className="text-sm text-muted-foreground">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag, index) => (
                <span
                  key={`tag-${index}`}
                  className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
                >
                  {typeof tag === 'string' ? tag : (tag as any).name || (tag as any).label || 'tag'}
                </span>
              ))}
            </div>
          )}
        </header>

        <MDXRenderer 
          content={post.content}
          className="prose-blog"
        />
      </article>

      <footer className="mt-12 pt-8 border-t">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Link>
      </footer>
      </div>
    </>
  )
}