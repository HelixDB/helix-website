import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, BlogMeta } from './types/blog';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export async function getAllBlogPosts(): Promise<BlogMeta[]> {
    const files = fs.readdirSync(BLOG_DIR);
    const posts = files
        .filter((filename) => filename.endsWith('.mdx'))
        .map((filename) => {
            const filePath = path.join(BLOG_DIR, filename);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(fileContent);
            
            return {
                slug: filename.replace('.mdx', ''),
                title: data.title,
                description: data.description,
                date: data.date,
                author: data.author,
                coverImage: data.coverImage,
                tags: data.tags,
                readingTime: data.readingTime,
            };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
        const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        return {
            slug,
            title: data.title,
            description: data.description,
            date: data.date,
            author: data.author,
            content: content,
            coverImage: data.coverImage,
            tags: data.tags,
            readingTime: data.readingTime,
        };
    } catch (error) {
        return null;
    }
} 