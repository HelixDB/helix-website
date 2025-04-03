declare module '@mdx-js/react' {
    import { ComponentType, ReactNode } from 'react';

    export interface MDXProviderProps {
        children: ReactNode;
        components?: Record<string, ComponentType<any>>;
    }

    export const MDXProvider: ComponentType<MDXProviderProps>;
} 