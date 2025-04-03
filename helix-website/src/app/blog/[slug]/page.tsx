import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPost } from '@/lib/types/blog';
import { getBlogPostBySlug } from '@/lib/blog';
import { MDXContent } from '@/components/MDXContent';
import { CallToAction } from '@/components/CallToAction';

interface Props {
    params: {
        slug: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = await getBlogPostBySlug(params.slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: `${post.title} | Helix DB`,
        description: post.description,
        openGraph: {
            title: post.title,
            description: post.description,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
            images: post.coverImage ? [post.coverImage] : [],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const post = await getBlogPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="relative min-h-screen flex flex-col">
            <div className="flex-1">
                <div className="container relative mx-auto">
                    <article className="max-w-3xl mx-auto px-4 py-16">
                        {post.coverImage && (
                            <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
                                <img
                                    src={post.coverImage}
                                    alt={post.title}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                            </div>
                        )}
                        <header className="mb-8 space-y-4">
                            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-primary/80">
                                {post.title}
                            </h1>
                            <div className="flex items-center gap-4 text-muted-foreground">
                                <span className="font-medium">{post.author}</span>
                                <span>•</span>
                                <time dateTime={post.date} className="text-sm">
                                    {new Date(post.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                                {post.readingTime && (
                                    <>
                                        <span>•</span>
                                        <span className="text-sm">{post.readingTime} read</span>
                                    </>
                                )}
                            </div>
                        </header>

                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <MDXContent content={post.content} />
                        </div>

                        {post.tags && (
                            <div className="mt-8 flex gap-2 flex-wrap">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </article>
                </div>
            </div>
            <CallToAction />
        </div>
    );
} 