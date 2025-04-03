declare module 'remark' {
    export interface RemarkProcessor {
        use: (plugin: any) => RemarkProcessor;
        process: (content: string) => Promise<{ toString: () => string }>;
    }

    export function remark(): RemarkProcessor;
}

declare module 'remark-gfm' {
    const plugin: any;
    export default plugin;
}

declare module 'remark-html' {
    const plugin: any;
    export default plugin;
} 