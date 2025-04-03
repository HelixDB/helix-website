'use client';

import { MDXProvider } from '@mdx-js/react';

const components = {
    h1: (props: any) => (
        <h1
            className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/80"
            {...props}
        />
    ),
    h2: (props: any) => (
        <h2
            className="text-3xl font-bold mt-12 mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/90"
            {...props}
        />
    ),
    h3: (props: any) => (
        <h3
            className="text-2xl font-semibold mt-8 mb-4 text-foreground/90"
            {...props}
        />
    ),
    h4: (props: any) => (
        <h4
            className="text-xl font-semibold mt-6 mb-3 text-foreground/80"
            {...props}
        />
    ),
    p: (props: any) => (
        <p
            className="text-lg leading-relaxed mb-6 text-muted-foreground"
            {...props}
        />
    ),
    ul: (props: any) => (
        <ul
            className="list-disc ml-6 mb-6 space-y-2 text-muted-foreground"
            {...props}
        />
    ),
    ol: (props: any) => (
        <ol
            className="list-decimal ml-6 mb-6 space-y-2 text-muted-foreground"
            {...props}
        />
    ),
    li: (props: any) => (
        <li
            className="mb-2 text-lg"
            {...props}
        />
    ),
    blockquote: (props: any) => (
        <blockquote
            className="border-l-4 border-primary/30 pl-6 py-4 my-8 bg-primary/5 rounded-r-lg italic text-muted-foreground"
            {...props}
        />
    ),
    code: (props: any) => {
        if (typeof props.children === 'string') {
            return (
                <code
                    className="bg-secondary px-2 py-1 text-sm rounded font-mono text-secondary-foreground"
                    {...props}
                />
            );
        }
        return (
            <div className="relative">
                <pre
                    className="bg-secondary/50 rounded-lg p-4 overflow-x-auto my-6 font-mono text-secondary-foreground"
                >
                    {props.children}
                </pre>
            </div>
        );
    },
    hr: (props: any) => (
        <hr
            className="my-12 border-t-2 border-border/30"
            {...props}
        />
    ),
    strong: (props: any) => (
        <strong
            className="font-bold text-foreground"
            {...props}
        />
    ),
    em: (props: any) => (
        <em
            className="italic text-foreground/90"
            {...props}
        />
    ),
    a: (props: any) => (
        <a
            className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors"
            {...props}
        />
    ),
    img: (props: any) => (
        <img
            className="rounded-lg shadow-lg my-8 w-full"
            {...props}
        />
    ),
};

interface MDXContentProps {
    content: string;
}

export function MDXContent({ content }: MDXContentProps) {
    return (
        <div className="prose prose-lg prose-headings:font-bold prose-headings:tracking-tight max-w-none">
            <MDXProvider components={components}>
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </MDXProvider>
        </div>
    );
} 