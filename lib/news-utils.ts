import { NewsArticle, ArticleCategory, Region } from './types'
import { mockArticles } from './mock-data'

export async function fetchArticles(options?: {
  category?: ArticleCategory
  region?: Region
  limit?: number
  search?: string
}): Promise<NewsArticle[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  let results = [...mockArticles]

  if (options?.category) {
    results = results.filter((article) => article.category === options.category)
  }

  if (options?.region) {
    results = results.filter((article) => article.regions.includes(options.region!))
  }

  if (options?.search) {
    const query = options.search.toLowerCase()
    results = results.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
    )
  }

  results.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

  if (options?.limit) {
    results = results.slice(0, options.limit)
  }

  return results
}

export async function fetchArticleBySlug(slug: string): Promise<NewsArticle | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockArticles.find((article) => article.slug === slug) || null
}

export async function fetchRelatedArticles(
  articleId: string,
  category: ArticleCategory,
  limit: number = 3
): Promise<NewsArticle[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))

  return mockArticles
    .filter((article) => article.category === category && article.id !== articleId)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit)
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function formatDate(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

export function formatDateTime(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const categoryLabels: Record<ArticleCategory, string> = {
  world: 'World',
  business: 'Business',
  tech: 'Technology',
  politics: 'Politics',
  markets: 'Markets',
}

export const regionLabels: Record<Region, string> = {
  us: 'US',
  eu: 'Europe',
  global: 'Global',
}
