export default defineEventHandler((event) => {
  const {siteUrl} = useRuntimeConfig(event).public
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`
})
