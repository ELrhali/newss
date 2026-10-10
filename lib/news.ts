import 'server-only'

export const REVALIDATE_INTERVAL = 180 // 3 minutes cache (ISR)

export interface NewsArticle {
  id: string
  title: string
  description: string
  url: string
  imageUrl: string
  source: string
  publishedAt: string
  category?: string
}

export interface GoogleTrendItem {
  id: string
  title: string
  traffic: string
  snippet?: string
  newsTitle?: string
  newsUrl?: string
  newsSource?: string
  imageUrl?: string
  publishedAt: string
}

const DEFAULT_FALLBACK_IMAGE = '/images/world-default.png'

/**
 * Verified fallback mock articles when API keys are missing, undefined, or all providers fail.
 */
export const DEFAULT_MOCK_ARTICLES: NewsArticle[] = [
  {
    id: 'mock-1',
    title: 'Federal Reserve Signals Gradual Policy Adjustments as Inflation Cools',
    description: 'Central bank leaders indicate measured interest rate approaches amidst stabilizing macroeconomic indicators and resilient labor markets.',
    url: 'https://www.reuters.com/markets',
    imageUrl: '/images/market-default.png',
    source: 'Reuters Financial',
    publishedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    category: 'markets',
  },
  {
    id: 'mock-2',
    title: 'EU Parliament Advances Comprehensive Regulatory Framework for Frontier AI Systems',
    description: 'European lawmakers finalize landmark standards for high-capability artificial intelligence models, balancing innovation with digital safety.',
    url: 'https://www.bloomberg.com/technology',
    imageUrl: '/images/tech-default.png',
    source: 'Bloomberg Tech',
    publishedAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    category: 'tech',
  },
  {
    id: 'mock-3',
    title: 'Global Clean Energy Investments Hit Record High in Transatlantic Transition',
    description: 'International energy ministers unveil joint public-private infrastructure initiatives targeting grid modernization and renewable storage capacity.',
    url: 'https://www.ft.com/climate',
    imageUrl: '/images/world-default.png',
    source: 'Financial Times',
    publishedAt: new Date(Date.now() - 130 * 60 * 1000).toISOString(),
    category: 'world',
  },
  {
    id: 'mock-4',
    title: 'Silicon Valley Semiconductor Giants Expand Next-Generation Packaging Hubs',
    description: 'Leading chipmakers commit billions in domestic fabrication facilities to accelerate specialized silicon processing for enterprise machine learning.',
    url: 'https://www.wsj.com/tech',
    imageUrl: '/images/tech-default.png',
    source: 'Wall Street Journal',
    publishedAt: new Date(Date.now() - 190 * 60 * 1000).toISOString(),
    category: 'tech',
  },
  {
    id: 'mock-5',
    title: 'Transatlantic Trade Summit Reaches Consensus on Supply Chain Resilience',
    description: 'Diplomatic delegations conclude bilateral talks establishing coordinated logistics corridors and critical minerals sourcing pacts.',
    url: 'https://apnews.com/world-news',
    imageUrl: '/images/politics-default.png',
    source: 'Associated Press',
    publishedAt: new Date(Date.now() - 250 * 60 * 1000).toISOString(),
    category: 'politics',
  },
  {
    id: 'mock-6',
    title: 'Global Tech Indices Rally as Enterprise Cloud Infrastructure Demand Outpaces Forecasts',
    description: 'Enterprise spending on scalable data systems drives robust quarterly earnings across premier software and network hardware providers.',
    url: 'https://www.cnbc.com/markets',
    imageUrl: '/images/market-default.png',
    source: 'CNBC International',
    publishedAt: new Date(Date.now() - 310 * 60 * 1000).toISOString(),
    category: 'markets',
  },
  {
    id: 'mock-7',
    title: 'Next-Generation Space Telescope Reveals Atmospheric Details of Distant Exoplanets',
    description: 'Astronomers detect water vapor and carbon signatures in habitable-zone celestial bodies using spectroscopic space observatory feeds.',
    url: 'https://www.nature.com/news',
    imageUrl: '/images/tech-default.png',
    source: 'Nature Science',
    publishedAt: new Date(Date.now() - 370 * 60 * 1000).toISOString(),
    category: 'science',
  },
  {
    id: 'mock-8',
    title: 'Global Maritime Trade Corridors Adopt Automated Port Operations and Green Freight',
    description: 'Major international shipping consortiums deploy zero-emission container networks and algorithmic cargo scheduling across transatlantic terminals.',
    url: 'https://www.economist.com/international',
    imageUrl: '/images/world-default.png',
    source: 'The Economist',
    publishedAt: new Date(Date.now() - 420 * 60 * 1000).toISOString(),
    category: 'world',
  },
]

export const DEFAULT_MOCK_TRENDS: GoogleTrendItem[] = [
  {
    id: 'trend-1',
    title: 'Artificial Intelligence Summit 2026',
    traffic: '100K+ searches',
    newsTitle: 'Global Leaders and Tech CEOs Convene for Milestone AI Safety Accord',
    newsUrl: 'https://news.google.com',
    newsSource: 'Google Trends News',
    imageUrl: '/images/tech-default.png',
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'trend-2',
    title: 'Federal Reserve Interest Rate Decision',
    traffic: '50K+ searches',
    newsTitle: 'Central Bank Rate Outlook Influences Global Currency Markets',
    newsUrl: 'https://news.google.com',
    newsSource: 'Financial Wire',
    imageUrl: '/images/market-default.png',
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'trend-3',
    title: 'Next-Gen Quantum Computing Breakthrough',
    traffic: '20K+ searches',
    newsTitle: 'Research Labs Demonstrate Fault-Tolerant Quantum Processing',
    newsUrl: 'https://news.google.com',
    newsSource: 'Tech Dispatch',
    imageUrl: '/images/tech-default.png',
    publishedAt: new Date().toISOString(),
  },
  {
    id: 'trend-4',
    title: 'Global Renewable Energy Infrastructure',
    traffic: '10K+ searches',
    newsTitle: 'Record Clean Energy Investments Across Transatlantic Grids',
    newsUrl: 'https://news.google.com',
    newsSource: 'Global Reports',
    imageUrl: '/images/world-default.png',
    publishedAt: new Date().toISOString(),
  },
]

/**
 * Sanitizes and cleans incoming raw article records into a normalized NewsArticle.
 */
function normalizeArticle(
  raw: Record<string, unknown>,
  defaultSource: string,
  index: number,
  category = 'general'
): NewsArticle | null {
  const title = String(raw.title || raw.headline || '').trim()
  if (!title || title.toLowerCase() === '[removed]') return null

  const description = String(
    raw.description || raw.summary || raw.snippet || raw.content || ''
  ).trim()

  const url = String(raw.url || raw.link || raw.webUrl || '#').trim()

  const rawImage = String(
    raw.imageUrl || raw.image || raw.urlToImage || raw.image_url || raw.media || ''
  ).trim()

  let finalCategory = category
  const titleLower = title.toLowerCase()
  if (titleLower.includes('tech') || titleLower.includes('ai') || titleLower.includes('software') || titleLower.includes('apple') || titleLower.includes('google') || titleLower.includes('chip') || titleLower.includes('cyber')) {
    finalCategory = 'tech'
  } else if (titleLower.includes('fed') || titleLower.includes('market') || titleLower.includes('stock') || titleLower.includes('economy') || titleLower.includes('bank') || titleLower.includes('inflation') || titleLower.includes('crypto')) {
    finalCategory = 'markets'
  } else if (titleLower.includes('senate') || titleLower.includes('election') || titleLower.includes('president') || titleLower.includes('minister') || titleLower.includes('parliament') || titleLower.includes('court') || titleLower.includes('bill')) {
    finalCategory = 'politics'
  } else if (titleLower.includes('space') || titleLower.includes('climate') || titleLower.includes('health') || titleLower.includes('science') || titleLower.includes('nasa')) {
    finalCategory = 'science'
  } else if (titleLower.includes('world') || titleLower.includes('ukraine') || titleLower.includes('europe') || titleLower.includes('china') || titleLower.includes('un')) {
    finalCategory = 'world'
  }

  let imageUrl = DEFAULT_FALLBACK_IMAGE
  if (rawImage && rawImage !== 'None' && (rawImage.startsWith('http://') || rawImage.startsWith('https://') || rawImage.startsWith('/'))) {
    imageUrl = rawImage
  } else {
    if (finalCategory === 'tech') imageUrl = '/images/tech-default.png'
    else if (finalCategory === 'markets') imageUrl = '/images/market-default.png'
    else if (finalCategory === 'politics') imageUrl = '/images/politics-default.png'
    else imageUrl = '/images/world-default.png'
  }

  let source = defaultSource
  if (typeof raw.source === 'object' && raw.source !== null) {
    const srcObj = raw.source as Record<string, unknown>
    if (srcObj.name) source = String(srcObj.name).trim()
  } else if (typeof raw.source === 'string' && raw.source.trim()) {
    source = raw.source.trim()
  } else if (typeof raw.author === 'string' && raw.author.trim() && raw.author.length < 50) {
    source = raw.author.trim()
  }

  const rawDate = String(
    raw.publishedAt || raw.published_at || raw.published || raw.pubDate || raw.date || ''
  ).trim()
  let publishedAt = new Date().toISOString()
  if (rawDate) {
    const parsed = new Date(rawDate)
    if (!isNaN(parsed.getTime())) {
      publishedAt = parsed.toISOString()
    }
  }

  const id = String(raw.id || raw.uuid || url || `${source}-${index}-${Date.now()}`)

  return {
    id,
    title,
    description: description || 'Read the full coverage for comprehensive analysis and developing context.',
    url,
    imageUrl,
    source: source || 'NewsHub Wire',
    publishedAt,
    category: finalCategory,
  }
}

/**
 * 1. Primary Provider: FreeNewsApi
 */
async function fetchFromFreeNewsApi(apiKey: string): Promise<NewsArticle[]> {
  const endpoint = `https://api.freenewsapi.com/v1/news?language=en&limit=25&apiKey=${encodeURIComponent(apiKey)}`

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'x-api-key': apiKey,
    },
    next: { revalidate: REVALIDATE_INTERVAL },
  })

  if (!response.ok) {
    throw new Error(`FreeNewsApi responded with HTTP ${response.status}: ${response.statusText}`)
  }

  const json = (await response.json()) as Record<string, unknown>
  const rawList = Array.isArray(json.articles)
    ? json.articles
    : Array.isArray(json.data)
    ? json.data
    : Array.isArray(json.news)
    ? json.news
    : []

  const articles = (rawList as Record<string, unknown>[])
    .map((item, idx) => normalizeArticle(item, 'FreeNewsApi', idx))
    .filter((item): item is NewsArticle => item !== null)

  if (articles.length === 0) {
    throw new Error('FreeNewsApi returned 0 valid articles')
  }

  return articles
}

/**
 * 2. Secondary Provider: GNews
 */
async function fetchFromGNews(apiKey: string, query?: string): Promise<NewsArticle[]> {
  const endpoint = query && query.trim() !== ''
    ? `https://gnews.io/api/v4/search?q=${encodeURIComponent(query.trim())}&lang=en&max=25&apikey=${encodeURIComponent(apiKey)}`
    : `https://gnews.io/api/v4/top-headlines?category=general&lang=en&max=25&apikey=${encodeURIComponent(apiKey)}`

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: REVALIDATE_INTERVAL },
  })

  if (!response.ok) {
    throw new Error(`GNews responded with HTTP ${response.status}: ${response.statusText}`)
  }

  const json = (await response.json()) as Record<string, unknown>
  const rawList = Array.isArray(json.articles) ? (json.articles as Record<string, unknown>[]) : []

  const articles = rawList
    .map((item, idx) => normalizeArticle(item, 'GNews', idx))
    .filter((item): item is NewsArticle => item !== null)

  if (articles.length === 0) {
    throw new Error('GNews returned 0 valid articles')
  }

  return articles
}

/**
 * 3. Tertiary Provider: Currents API (with Bearer token)
 */
async function fetchFromCurrentsApi(apiKey: string, query?: string): Promise<NewsArticle[]> {
  const cleanKey = apiKey.trim().replace(/^Bearer\s+/i, '')
  const endpoint = query && query.trim() !== ''
    ? `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(query.trim())}&language=en`
    : 'https://api.currentsapi.services/v1/latest-news?language=en'

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${cleanKey}`,
    },
    next: { revalidate: REVALIDATE_INTERVAL },
  })

  if (!response.ok) {
    throw new Error(`Currents API responded with HTTP ${response.status}: ${response.statusText}`)
  }

  const json = (await response.json()) as Record<string, unknown>
  const rawList = Array.isArray(json.news) ? (json.news as Record<string, unknown>[]) : []

  const articles = rawList
    .map((item, idx) => normalizeArticle(item, 'Currents News', idx))
    .filter((item): item is NewsArticle => item !== null)

  if (articles.length === 0) {
    throw new Error('Currents API returned 0 valid articles')
  }

  return articles
}

/**
 * 4. Google News RSS Fetcher & Search Parser
 */
export async function fetchGoogleNews(query?: string): Promise<NewsArticle[]> {
  try {
    const endpoint = query && query.trim() !== ''
      ? `https://news.google.com/rss/search?q=${encodeURIComponent(query.trim())}&hl=en-US&gl=US&ceid=US:en`
      : 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en'

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: REVALIDATE_INTERVAL },
    })

    if (!response.ok) {
      throw new Error(`Google News RSS returned ${response.status}`)
    }

    const xml = await response.text()
    const articles: NewsArticle[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi
    let match: RegExpExecArray | null
    let idx = 0

    while ((match = itemRegex.exec(xml)) !== null && idx < 30) {
      const itemContent = match[1]
      const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)
      const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/i)
      const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)
      const sourceMatch = itemContent.match(/<source[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/source>/i)
      const descMatch = itemContent.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i)

      const rawTitle = titleMatch ? titleMatch[1].trim() : ''
      if (!rawTitle) continue

      let source = sourceMatch ? sourceMatch[1].trim() : 'Google News'
      let cleanTitle = rawTitle
      if (rawTitle.includes(' - ')) {
        const parts = rawTitle.split(' - ')
        const potentialSource = parts.pop()
        if (potentialSource) source = potentialSource.trim()
        cleanTitle = parts.join(' - ').trim()
      }

      let description = ''
      if (descMatch) {
        description = descMatch[1].replace(/<[^>]+>/g, '').trim()
      }

      const normalized = normalizeArticle(
        {
          id: `gnews-rss-${idx}`,
          title: cleanTitle,
          description: description || `Latest coverage and real-time development report from ${source}.`,
          url: linkMatch ? linkMatch[1].trim() : '#',
          publishedAt: pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString(),
          source,
        },
        source,
        idx
      )

      if (normalized) {
        articles.push(normalized)
        idx++
      }
    }

    return articles
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[NewsService] Google News RSS fetch failed: ${msg}`)
    return []
  }
}

/**
 * 5. Google Trends Real-Time Search Trends Fetcher
 */
export async function fetchGoogleTrends(geo = 'US'): Promise<GoogleTrendItem[]> {
  try {
    const endpoint = `https://trends.google.com/trending/rss?geo=${geo}`
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      next: { revalidate: REVALIDATE_INTERVAL },
    })

    if (!response.ok) {
      throw new Error(`Google Trends RSS returned HTTP ${response.status}`)
    }

    const xml = await response.text()
    const trends: GoogleTrendItem[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi
    let match: RegExpExecArray | null
    let idx = 0

    while ((match = itemRegex.exec(xml)) !== null && idx < 12) {
      const itemContent = match[1]
      const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)
      const trafficMatch = itemContent.match(/<ht:approx_traffic>([\s\S]*?)<\/ht:approx_traffic>/i)
      const pictureMatch = itemContent.match(/<ht:picture>([\s\S]*?)<\/ht:picture>/i)
      const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)
      const newsTitleMatch = itemContent.match(/<ht:news_item_title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/ht:news_item_title>/i)
      const newsUrlMatch = itemContent.match(/<ht:news_item_url>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/ht:news_item_url>/i)
      const newsSourceMatch = itemContent.match(/<ht:news_item_source>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/ht:news_item_source>/i)

      const title = titleMatch ? titleMatch[1].trim() : ''
      if (!title) continue

      trends.push({
        id: `trend-${idx}-${title.toLowerCase().replace(/\s+/g, '-')}`,
        title,
        traffic: trafficMatch ? trafficMatch[1].trim() : '10K+ searches',
        imageUrl: pictureMatch ? pictureMatch[1].trim() : DEFAULT_FALLBACK_IMAGE,
        newsTitle: newsTitleMatch ? newsTitleMatch[1].trim() : undefined,
        newsUrl: newsUrlMatch ? newsUrlMatch[1].trim() : `https://trends.google.com/trending?geo=${geo}`,
        newsSource: newsSourceMatch ? newsSourceMatch[1].trim() : 'Google Trends',
        publishedAt: pubDateMatch ? pubDateMatch[1].trim() : new Date().toISOString(),
      })
      idx++
    }

    if (trends.length > 0) return trends
    return DEFAULT_MOCK_TRENDS
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[NewsService] Google Trends RSS fetch failed, serving default mock trends: ${msg}`)
    return DEFAULT_MOCK_TRENDS
  }
}

/**
 * Robust server-side news fetching function.
 * Cascades: FreeNewsApi -> GNews -> Currents API (Bearer token) -> Google News RSS -> Default Mock Data.
 */
export async function fetchNewsArticles(options?: {
  query?: string
  category?: string
  limit?: number
}): Promise<NewsArticle[]> {
  const freeNewsKey = process.env.FREENEWS_API_KEY
  const gNewsKey = process.env.GNEWS_API_KEY
  const currentsKey = process.env.CURRENTS_API_KEY
  const query = options?.query?.trim()
  const category = options?.category?.toLowerCase()

  // If search query is provided, query Google News search and GNews Search directly
  if (query) {
    if (gNewsKey && gNewsKey.trim() !== '') {
      try {
        const gnewsResults = await fetchFromGNews(gNewsKey.trim(), query)
        if (gnewsResults.length > 0) return gnewsResults
      } catch {
        // Continue
      }
    }
    const googleNewsSearchResults = await fetchGoogleNews(query)
    if (googleNewsSearchResults.length > 0) {
      return googleNewsSearchResults
    }
  }

  // 1. Try FreeNewsApi
  if (freeNewsKey && freeNewsKey.trim() !== '') {
    try {
      const articles = await fetchFromFreeNewsApi(freeNewsKey.trim())
      if (articles.length > 0) {
        return filterAndSortArticles(articles, category, options?.limit)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn(`[NewsService] FreeNewsApi fetch failed, falling back to GNews: ${message}`)
    }
  } else {
    console.warn('[NewsService] FREENEWS_API_KEY is missing or undefined. Skipping FreeNewsApi.')
  }

  // 2. Try GNews
  if (gNewsKey && gNewsKey.trim() !== '') {
    try {
      const articles = await fetchFromGNews(gNewsKey.trim(), query)
      if (articles.length > 0) {
        return filterAndSortArticles(articles, category, options?.limit)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn(`[NewsService] GNews fetch failed, falling back to Currents API: ${message}`)
    }
  } else {
    console.warn('[NewsService] GNEWS_API_KEY is missing or undefined. Skipping GNews.')
  }

  // 3. Try Currents API (with Bearer token)
  if (currentsKey && currentsKey.trim() !== '') {
    try {
      const articles = await fetchFromCurrentsApi(currentsKey.trim(), query)
      if (articles.length > 0) {
        return filterAndSortArticles(articles, category, options?.limit)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn(`[NewsService] Currents API fetch failed, falling back to Google News RSS: ${message}`)
    }
  } else {
    console.warn('[NewsService] CURRENTS_API_KEY is missing or undefined. Skipping Currents API.')
  }

  // 4. Try Google News Live RSS
  try {
    const googleNewsArticles = await fetchGoogleNews(query)
    if (googleNewsArticles.length > 0) {
      return filterAndSortArticles(googleNewsArticles, category, options?.limit)
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn(`[NewsService] Google News RSS failed: ${message}`)
  }

  // 5. Safe Default Fallback
  console.info('[NewsService] Serving verified default mock news dataset.')
  let mockList = [...DEFAULT_MOCK_ARTICLES]
  if (query) {
    const qLower = query.toLowerCase()
    mockList = mockList.filter(
      (a) => a.title.toLowerCase().includes(qLower) || a.description.toLowerCase().includes(qLower)
    )
  }
  return filterAndSortArticles(mockList.length > 0 ? mockList : DEFAULT_MOCK_ARTICLES, category, options?.limit)
}

function filterAndSortArticles(
  articles: NewsArticle[],
  category?: string,
  limit?: number
): NewsArticle[] {
  let list = articles
  if (category && category !== 'all' && category !== 'general') {
    list = list.filter((a) => (a.category || '').toLowerCase() === category.toLowerCase())
    if (list.length === 0) list = articles // fallback to all if filtered is empty
  }
  if (limit && limit > 0) {
    list = list.slice(0, limit)
  }
  return list
}

// Aliases for compatibility
export const fetchNews = fetchNewsArticles
export const getNewsArticles = fetchNewsArticles
export const revalidate = REVALIDATE_INTERVAL
export const newsCacheSeconds = REVALIDATE_INTERVAL


