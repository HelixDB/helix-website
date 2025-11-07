/** @type {import('next-sitemap').IConfig} */
import { DOCS_URL, SITE_URL } from '@/lib/const'

module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/'],
      },
    ],
    additionalSitemaps: [
      `${SITE_URL}/blog/sitemap.xml`,
      `${DOCS_URL}/sitemap.xml`,
    ],
  },

  exclude: [

    /** Pages that should be excluded from the sitemap. This is used to prevent pages like the API endpoints from being indexed. */
    '/api/*',
    '/api/**',
    '/dashboard',
    '/dashboard/*',
    '/dashboard/**',
    '/private',
    '/private/*',
    '/private/**',
    '/_next',
    '/_next/*',
    '/_next/**',
    '/favicon*',
    '/icon*',
    '/opengraph*',
    '/manifest*',

    /** Blog pages are excluded because they are dynamically generated in their own sitemap. */
    '/blog',
    '/blog/*',
    '/blog/**',

    /** Hardcoded pages that should be excluded from the sitemap. */
    '/create-instance',
  ],
  transform: async (config, path) => {
    const depth = path.split('/').filter(Boolean).length
    const priority = path === '/' ? 1.0 : depth === 1 ? 0.8 : 0.6
    return {
      loc: path,
      changefreq: path === '/' ? 'daily' : 'weekly',
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    }
  },
}


