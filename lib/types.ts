export type ArticleCategory = 'world' | 'business' | 'tech' | 'politics' | 'markets'
export type Region = 'us' | 'eu' | 'global'

export interface NewsArticle {
  id: string
  slug: string
  title: string
  description: string
  content: string
  image: string
  imageAlt: string
  author: string
  authorBio?: string
  publishedAt: Date
  updatedAt: Date
  category: ArticleCategory
  readingTimeMinutes: number
  featured: boolean
  breaking?: boolean
  regions: Region[]
  relatedArticles?: string[]
}

export interface MarketTicker {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  timestamp: Date
}

export interface NewsletterSubscription {
  email: string
  subscribedAt: Date
  regions: Region[]
}

export interface APIArticle {
  id: string
  title: string
  description: string
  content?: string
  image?: string
  imageUrl?: string
  author?: string
  publishedAt: string
  updatedAt?: string
  source?: {
    id: string | null
    name: string
  }
  url?: string
}
