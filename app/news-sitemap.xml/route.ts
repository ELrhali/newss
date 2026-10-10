import { fetchArticles } from '@/lib/news-utils'

export async function GET() {
  const articles = await fetchArticles({ limit: 100 })
  const items = articles.map((article) => `<url><loc>https://newshub.example.com/article/${article.slug}</loc><news:news><news:publication><news:name>NewsHub</news:name><news:language>en</news:language></news:publication><news:publication_date>${article.publishedAt.toISOString()}</news:publication_date><news:title>${escapeXml(article.title)}</news:title></news:news></url>`).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${items}</urlset>`
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=180, stale-while-revalidate=300' } })
}

function escapeXml(value: string) { return value.replace(/[<>&'\"]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[char] ?? char) }
