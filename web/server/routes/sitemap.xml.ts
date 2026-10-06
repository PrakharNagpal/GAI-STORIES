import { createClient } from '@sanity/client'

export default defineEventHandler(async (event) => {
  const { sanity, siteUrl } = useRuntimeConfig(event).public
  const client = createClient({ ...sanity, useCdn: true, perspective: 'published' })

  const stories = await client.fetch<{ slug: string; updated: string }[]>(
    `*[_type == "story" && defined(slug.current)]{ "slug": slug.current, "updated": _updatedAt }`,
  )

  const urls = [
    `<url><loc>${siteUrl}/</loc></url>`,
    ...stories.map((s) => `<url><loc>${siteUrl}/stories/${s.slug}</loc><lastmod>${s.updated}</lastmod></url>`),
  ]

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`
})