import { getBlogPosts } from '@/lib/marble'
import Link from 'next/link'
import { BlogImage } from '@/components/blog-image'
import { AuthorAvatar } from '@/components/author-avatar'
import { Metadata } from 'next'

// Revalidate this page every hour
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Blog | HelixDB - Database Insights & Tutorials',
  description: 'Explore HelixDB blog for database insights, tutorials, performance tips, and the latest updates on vector databases and AI technologies.',
  keywords: 'database, vector database, AI, machine learning, tutorials, HelixDB, database performance, data management',
  openGraph: {
    title: 'HelixDB Blog - Database Insights & Tutorials',
    description: 'Explore database insights, tutorials, and the latest updates from the HelixDB team.',
    type: 'website',
    url: 'https://helix-db.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HelixDB Blog - Database Insights & Tutorials',
    description: 'Explore database insights, tutorials, and the latest updates from the HelixDB team.',
  },
  alternates: {
    canonical: 'https://helix-db.com/blog',
  },
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-xl text-muted-foreground">
          Insights, tutorials, and updates from the Helix team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group block"
          >
            <article className=" overflow-hidden transition-all duration-300">
              {(post.featured_image || post.coverImage || post.cover || post.image) && (
                <div className="relative w-full h-52 overflow-hidden bg-muted rounded-xl">
                  <BlogImage
                    src={post.featured_image || post.coverImage || post.cover || post.image || ''}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover  group-hover:scale-105 transition-transform duration-300"
                    priority={false}
                  />
                </div>
              )}

              <div className="space-y-4 pt-6">
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2 group-hover:opacity-100 opacity-70">
                    {post.title}
                  </h2>

                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/30">
                  <AuthorAvatar
                    author={post.author}
                    size="sm"
                    showName={true}
                  />

                  <time className="text-muted-foreground text-sm font-medium">
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </div>

                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={`${post.id}-tag-${index}`}
                        className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20"
                      >
                        {typeof tag === 'string' ? tag : (tag as any).name || (tag as any).label || 'tag'}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No blog posts found.</p>
        </div>
      )}
    </div>
  )
}