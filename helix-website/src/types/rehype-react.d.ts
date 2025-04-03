declare module 'rehype-react' {
    import { Plugin } from 'unified';
    
    interface RehypeReactOptions {
        createElement?: Function;
        Fragment?: Function;
        components?: Record<string, React.ComponentType<any>>;
        [key: string]: any;
    }

    const rehypeReact: Plugin<[RehypeReactOptions?], any>;
    export = rehypeReact;
} 