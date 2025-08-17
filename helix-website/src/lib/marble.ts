const MARBLE_API_URL = 'https://api.marblecms.com'
const MARBLE_WORKSPACE_KEY = 'cmecu76v80006lb04m7svelqd'

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author?: {
    name?: string
    avatar?: string
    image?: string
    picture?: string
    photo?: string
  }
  publishedAt: string
  featured_image?: string
  coverImage?: string
  cover?: string
  image?: string
  tags?: (string | { name?: string; label?: string })[]
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch(`${MARBLE_API_URL}/v1/${MARBLE_WORKSPACE_KEY}/posts`, {
      next: { revalidate: 60 } // Cache for 1 minute (reduced for testing)
    })
    
    if (!response.ok) {
      console.error(`Failed to fetch from MarbleCMS: ${response.status}`)
      return []
    }
    
    const data = await response.json()
    console.log('MarbleCMS API Response:', data)
    
    // MarbleCMS returns { posts: [...] }
    const posts = data.posts || []
    
    return posts.map((post: any) => {
      // Handle different author field structures
      let author = null
      
      // Check for 'authors' array (MarbleCMS format)
      if (post.authors && Array.isArray(post.authors) && post.authors.length > 0) {
        const firstAuthor = post.authors[0]
        author = {
          name: firstAuthor.name,
          avatar: firstAuthor.image
        }
      }
      // Check for single 'author' field
      else if (post.author) {
        if (typeof post.author === 'string') {
          author = { name: post.author }
        } else if (typeof post.author === 'object') {
          author = {
            name: post.author.name || post.author.displayName || post.author.username,
            avatar: post.author.avatar || post.author.image || post.author.picture || post.author.photo
          }
        }
      }
      
      return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || post.description || '',
        content: post.content || post.body || '',
        author: author,
        publishedAt: post.publishedAt || post.published_at || post.createdAt,
        featured_image: post.coverImage || post.cover_image || post.cover || post.image || post.featured_image,
        tags: post.tags || []
      }
    })
  } catch (error) {
    console.error('Error fetching blog posts from MarbleCMS:', error)
    return []
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    console.log(`Fetching post with slug: ${slug}`)
    const response = await fetch(`${MARBLE_API_URL}/v1/${MARBLE_WORKSPACE_KEY}/posts/${slug}`, {
      next: { revalidate: 60 } // Cache for 1 minute (reduced for testing)
    })
    
    if (!response.ok) {
      console.error(`Failed to fetch post from MarbleCMS: ${response.status}`)
      return null
    }
    
    const data = await response.json()
    console.log(`MarbleCMS single post response for ${slug}:`, JSON.stringify(data, null, 2))
    const post = data.post || data
    
    if (!post) {
      console.log('No post data found in response')
      return null
    }
    
    // Handle different author field structures
    let author = null
    
    // Check for 'authors' array (MarbleCMS format)
    if (post.authors && Array.isArray(post.authors) && post.authors.length > 0) {
      const firstAuthor = post.authors[0]
      author = {
        name: firstAuthor.name,
        avatar: firstAuthor.image
      }
    }
    // Check for single 'author' field
    else if (post.author) {
      if (typeof post.author === 'string') {
        author = { name: post.author }
      } else if (typeof post.author === 'object') {
        author = {
          name: post.author.name || post.author.displayName || post.author.username,
          avatar: post.author.avatar || post.author.image || post.author.picture || post.author.photo
        }
      }
    }
    
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || post.description || '',
      content: post.content || post.body || '',
      author: author || undefined,
      publishedAt: post.publishedAt || post.published_at || post.createdAt,
      featured_image: post.coverImage || post.cover_image || post.cover || post.image || post.featured_image,
      tags: post.tags || []
    }
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
}