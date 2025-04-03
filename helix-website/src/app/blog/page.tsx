import { Metadata } from 'next';
import { BlogMeta } from '@/lib/types/blog';
import { getAllBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
    title: 'Blog | Your Site Name',
    description: 'Read our latest articles and insights',
    openGraph: {
        title: 'Blog | Your Site Name',
        description: 'Read our latest articles and insights',
        type: 'website',
    },
};

export default async function BlogPage() {
    const posts = await getAllBlogPosts();

    return (
        <main className="max-w-4xl mx-auto px-4 py-16 min-h-screen">
            <h1 className="text-4xl font-bold mb-8">Blog</h1>
            <div className="grid gap-8 md:grid-cols-2">
                {posts.map((post) => (
                    <article
                        key={post.slug}
                        className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                        {post.coverImage && (
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-48 object-cover rounded-md mb-4"
                                loading="lazy"
                            />
                        )}
                        <h2 className="text-2xl font-semibold mb-2">
                            <a href={`/blog/${post.slug}`} className="hover:text-blue-600">
                                {post.title}
                            </a>
                        </h2>
                        <p className="text-gray-600 mb-4">{post.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{post.author}</span>
                            <time dateTime={post.date}>
                                {new Date(post.date).toLocaleDateString()}
                            </time>
                        </div>
                        {post.tags && (
                            <div className="mt-4 flex gap-2 flex-wrap">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </main>
    );
} 