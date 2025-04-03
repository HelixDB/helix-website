declare module 'gray-matter' {
    interface GrayMatterData {
        [key: string]: any;
    }

    interface GrayMatterResult {
        data: GrayMatterData;
        content: string;
        excerpt?: string;
        orig: string;
    }

    function matter(input: string): GrayMatterResult;
    export = matter;
} 