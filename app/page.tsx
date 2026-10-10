import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { MarketTickers } from '@/components/market-ticker'
import { NewsletterSignup } from '@/components/newsletter-signup'
import { DeviniShowcase } from '@/components/devini-showcase'
import {
  fetchNewsArticles,
  fetchGoogleTrends,
  type NewsArticle,
  type GoogleTrendItem,
} from '@/lib/news'
import { mockMarketTickers } from '@/lib/mock-data'
import {
  ExternalLink,
  Clock,
  Newspaper,
  ArrowRight,
  Flame,
  Search,
  TrendingUp,
  Sparkles,
  Globe,
  Cpu,
  BarChart3,
  Landmark,
  Layers,
  X,
} from 'lucide-react'

export const revalidate = 180

function formatArticleDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Recently'
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  } catch {
    return 'Recently'
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string }>
}): Promise<Metadata> {
  const params = searchParams ? await searchParams : {}
  const q = params.q?.trim()
  const category = params.category?.trim()

  const articles = await fetchNewsArticles({ query: q, category })
  const hero = articles[0]
  const siteUrl = 'https://newshub.example.com'
  const ogImageUrl = hero?.imageUrl?.startsWith('http')
    ? hero.imageUrl
    : `${siteUrl}${hero?.imageUrl || '/images/world-default.png'}`

  const baseTitle = q
    ? `"${q}" — Live Google News Trends & Headlines`
    : category && category !== 'all'
    ? `${category.toUpperCase()} News & Google Trends Live | NewsHub`
    : 'Breaking News Live — US, European & World Headlines Today'

  const description = q
    ? `Explore real-time Google News search results and trends for "${q}". Verified reporting, market intelligence, and global updates.`
    : 'Get live breaking news, Google search trends, US & European headlines, global market intelligence, tech updates, and political digest 24/7.'

  return {
    title: baseTitle,
    description: description.slice(0, 155),
    keywords: [
      'breaking news',
      'Google news trends',
      'trending searches today',
      'US headlines today',
      'Europe news updates',
      'live global reports',
      'tech news',
      'global markets',
      'technology updates',
      'political digest',
    ],
    alternates: {
      canonical: q ? `${siteUrl}?q=${encodeURIComponent(q)}` : siteUrl,
    },
    openGraph: {
      title: baseTitle,
      description: description.slice(0, 155),
      url: siteUrl,
      type: 'website',
      siteName: 'NewsHub Media',
      locale: 'en_US',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: hero?.title || 'Breaking News Live Headlines & Google Trends',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: baseTitle,
      description: description.slice(0, 155),
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string }>
}) {
  const params = searchParams ? await searchParams : {}
  const currentQuery = params.q?.trim() || ''
  const currentCategory = params.category?.trim().toLowerCase() || 'all'

  // Fetch all news and Google Trends simultaneously on the server
  const [allArticles, googleTrends] = await Promise.all([
    fetchNewsArticles({ query: currentQuery, category: currentCategory }),
    fetchGoogleTrends('US'),
  ])

  const heroArticle = allArticles[0]
  const feedArticles = allArticles.slice(1)
  const siteUrl = 'https://newshub.example.com'

  // Partitioned categories for the single-page multi-category view
  const techArticles = allArticles.filter((a) => a.category === 'tech').slice(0, 4)
  const marketArticles = allArticles.filter((a) => a.category === 'markets').slice(0, 4)
  const worldArticles = allArticles.filter((a) => a.category === 'world' || a.category === 'politics').slice(0, 4)

  const categories = [
    { id: 'all', label: 'All Headlines', icon: Layers },
    { id: 'world', label: 'World & Geopolitics', icon: Globe },
    { id: 'markets', label: 'Markets & Economy', icon: BarChart3 },
    { id: 'tech', label: 'Tech & AI', icon: Cpu },
    { id: 'politics', label: 'Politics', icon: Landmark },
  ]

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Breaking News Live — US, European & World Headlines Today',
    description:
      'Real-time aggregated global news reports, Google News trends, and financial intelligence.',
    numberOfItems: allArticles.length,
    itemListElement: allArticles.map((article: NewsArticle, index: number) => {
      const fullImageUrl = article.imageUrl.startsWith('http')
        ? article.imageUrl
        : `${siteUrl}${article.imageUrl}`

      return {
        '@type': 'ListItem',
        position: index + 1,
        url: article.url,
        item: {
          '@type': 'NewsArticle',
          headline: article.title,
          description: article.description,
          image: [fullImageUrl],
          datePublished: article.publishedAt,
          dateModified: article.publishedAt,
          mainEntityOfPage: article.url,
          publisher: {
            '@type': 'Organization',
            name: article.source || 'NewsHub',
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}/icon.svg`,
            },
          },
          author: {
            '@type': 'Organization',
            name: article.source || 'NewsHub',
          },
        },
      }
    }),
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <div>
        <Header />

        {/* 1. Live Google News & Trends Flash Bar */}
        <div className="border-b border-border bg-red-600 text-white">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 py-2.5 text-xs font-semibold">
            <div className="flex items-center gap-2 truncate">
              <span className="flex items-center gap-1 rounded bg-white px-2 py-0.5 text-xs font-bold uppercase text-red-600 shadow-xs">
                <Flame className="h-3.5 w-3.5 fill-red-600" /> Google Trend
              </span>
              <span className="truncate">
                {googleTrends[0]?.title
                  ? `${googleTrends[0].title.toUpperCase()} (${googleTrends[0].traffic}) — ${googleTrends[0].newsTitle || heroArticle?.title}`
                  : heroArticle?.title || 'Global markets monitor economic shifts and policy updates'}
              </span>
            </div>
            <a
              href="https://trends.google.com/trending"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1 text-[11px] underline text-white/90 hover:text-white shrink-0"
            >
              <span>Explore Google Trends</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
          {/* 2. Search & Headline Header */}
          <div className="mb-8 border-b border-border pb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-red-600 mb-2">
                  <Newspaper className="h-4 w-4" />
                  <span>The 24/7 Global Portal</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
                  World News, Markets & Google Trends
                </h1>
                <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                  Aggregated real-time headlines, trending Google search queries, and verified dispatches in one single page.
                </p>
              </div>

              {/* Direct Search Bar for Google News & Trends */}
              <div className="w-full md:w-96">
                <form method="GET" action="/" className="relative flex items-center">
                  {currentCategory !== 'all' && (
                    <input type="hidden" name="category" value={currentCategory} />
                  )}
                  <input
                    type="text"
                    name="q"
                    defaultValue={currentQuery}
                    placeholder="Search Google News & trends..."
                    className="w-full rounded-xl border border-input bg-card py-2.5 pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-red-600 shadow-xs"
                  />
                  <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground" />
                  {currentQuery && (
                    <Link
                      href={currentCategory !== 'all' ? `/?category=${currentCategory}` : '/'}
                      className="absolute right-3 text-muted-foreground hover:text-foreground"
                      title="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </Link>
                  )}
                </form>
              </div>
            </div>

            {/* 3. Real-Time Google Trends Pills (Clickable Search & Trends) */}
            <div className="mt-6 flex flex-wrap items-center gap-2 pt-4 border-t border-border/70">
              <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-red-600 mr-1">
                <TrendingUp className="h-3.5 w-3.5" />
                Google Trends:
              </span>
              {googleTrends.slice(0, 8).map((trend: GoogleTrendItem) => (
                <Link
                  key={trend.id}
                  href={`/?q=${encodeURIComponent(trend.title)}`}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    currentQuery.toLowerCase() === trend.title.toLowerCase()
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-muted/80 hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-950/60 dark:hover:text-red-300 border border-border/60'
                  }`}
                >
                  <span>{trend.title}</span>
                  <span className="rounded-full bg-black/10 dark:bg-white/10 px-1.5 py-0.2 text-[10px] font-semibold text-muted-foreground group-hover:text-inherit">
                    {trend.traffic}
                  </span>
                </Link>
              ))}
            </div>

            {/* 4. Category Filter Tabs */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground mr-1">Category:</span>
              {categories.map((cat) => {
                const Icon = cat.icon
                const isActive = currentCategory === cat.id
                const targetHref =
                  cat.id === 'all'
                    ? currentQuery
                      ? `/?q=${encodeURIComponent(currentQuery)}`
                      : '/'
                    : currentQuery
                    ? `/?category=${cat.id}&q=${encodeURIComponent(currentQuery)}`
                    : `/?category=${cat.id}`

                return (
                  <Link
                    key={cat.id}
                    href={targetHref}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-foreground text-background shadow-xs'
                        : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-red-600'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{cat.label}</span>
                  </Link>
                )
              })}
              {currentQuery && (
                <span className="ml-auto text-xs font-medium text-red-600 bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded-md border border-red-200 dark:border-red-900">
                  Search results for: <strong>&quot;{currentQuery}&quot;</strong> ({allArticles.length} stories)
                </span>
              )}
            </div>
          </div>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
            {/* Left Content Column */}
            <div className="space-y-12">
              {/* 5. Hero Feature Story */}
              {heroArticle && (
                <section aria-labelledby="hero-lead-story" className="group relative">
                  <h2 id="hero-lead-story" className="sr-only">
                    Top Headline Story
                  </h2>
                  <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md">
                    <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden bg-muted">
                      <Image
                        src={heroArticle.imageUrl}
                        alt={heroArticle.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 850px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
                          Lead Story
                        </span>
                        <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-medium text-white border border-white/20">
                          {heroArticle.source}
                        </span>
                        {heroArticle.category && (
                          <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-medium text-white uppercase">
                            {heroArticle.category}
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
                        <div className="flex items-center gap-3 text-xs text-white/80 mb-2">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatArticleDate(heroArticle.publishedAt)}
                          </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-white transition-colors group-hover:text-red-100">
                          {heroArticle.title}
                        </h2>
                        <p className="mt-3 text-sm sm:text-base text-white/90 line-clamp-3 leading-relaxed max-w-3xl">
                          {heroArticle.description}
                        </p>
                        <div className="mt-5 flex items-center gap-3">
                          <a
                            href={heroArticle.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-red-700 hover:gap-3"
                          >
                            <span>Read Full Story</span>
                            <ArrowRight className="h-4 w-4" />
                          </a>
                          <Link
                            href={`/?q=${encodeURIComponent(heroArticle.title.slice(0, 30))}`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md px-3 py-2.5 text-xs font-semibold text-white transition-all"
                          >
                            <Search className="h-3.5 w-3.5" />
                            <span>Related Trends</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* 6. Live Google Trends Highlight Cards */}
              <section aria-labelledby="google-trends-section" className="space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-red-600" />
                    <h2 id="google-trends-section" className="text-xl font-bold tracking-tight">
                      Google Trends & Trending Search Intelligence
                    </h2>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    Real-time search volume
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {googleTrends.slice(0, 4).map((trend: GoogleTrendItem) => (
                    <div
                      key={trend.id}
                      className="group flex flex-col justify-between rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-red-500/60 hover:shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="rounded-md bg-red-600/10 px-2 py-0.5 text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wide">
                            {trend.traffic}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {formatArticleDate(trend.publishedAt)}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold capitalize leading-snug group-hover:text-red-600 transition-colors">
                          {trend.title}
                        </h3>
                        {trend.newsTitle && (
                          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                            {trend.newsTitle}
                          </p>
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-border flex items-center justify-between text-xs">
                        <Link
                          href={`/?q=${encodeURIComponent(trend.title)}`}
                          className="font-semibold text-red-600 hover:underline flex items-center gap-1"
                        >
                          <span>Filter stories</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                        {trend.newsUrl && (
                          <a
                            href={trend.newsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                            title="Open Google trend report"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 7. Responsive All News Feed Grid (1, 2, and 3 Columns) */}
              <section aria-labelledby="all-news-feed" className="space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <div>
                    <h2 id="all-news-feed" className="text-2xl font-bold tracking-tight">
                      {currentQuery
                        ? `Search Results for "${currentQuery}"`
                        : currentCategory !== 'all'
                        ? `${currentCategory.toUpperCase()} News Feed`
                        : 'Latest Verified News Dispatches'}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Updated every 3 minutes via FreeNewsApi, GNews, Currents API & Google News
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {feedArticles.length} stories displayed
                  </span>
                </div>

                {feedArticles.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border py-16 text-center">
                    <p className="text-base font-semibold">No stories found for this search or filter.</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try searching another topic or reset the filter.
                    </p>
                    <Link
                      href="/"
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
                    >
                      Reset All Filters
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feedArticles.map((article: NewsArticle) => (
                      <article
                        key={article.id}
                        className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-red-500/50"
                      >
                        <div>
                          {/* Image */}
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                            <Image
                              src={article.imageUrl}
                              alt={article.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                              <span className="rounded-md bg-black/75 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-semibold text-white uppercase tracking-wider">
                                {article.source}
                              </span>
                              {article.category && (
                                <span className="rounded-md bg-red-600/90 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                                  {article.category}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2.5">
                              <Clock className="h-3.5 w-3.5" />
                              <time dateTime={article.publishedAt}>
                                {formatArticleDate(article.publishedAt)}
                              </time>
                            </div>

                            <h3 className="text-base font-bold leading-snug tracking-tight text-foreground line-clamp-3 group-hover:text-red-600 transition-colors">
                              {article.title}
                            </h3>

                            <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                              {article.description}
                            </p>
                          </div>
                        </div>

                        {/* Card Link */}
                        <div className="p-5 pt-0 mt-auto">
                          <div className="border-t border-border/60 pt-3 flex items-center justify-between">
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors group/link"
                            >
                              <span>Read Full Story</span>
                              <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                            </a>
                            <Link
                              href={`/?q=${encodeURIComponent(article.title.slice(0, 25))}`}
                              className="text-[11px] text-muted-foreground hover:text-foreground"
                              title="Search related stories"
                            >
                              More like this
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {/* 8. Dedicated Multi-Category Sections Displayed on the Same Page */}
              {!currentQuery && currentCategory === 'all' && (
                <div className="space-y-10 pt-4 border-t border-border">
                  {/* Tech & AI Section */}
                  {techArticles.length > 0 && (
                    <section aria-labelledby="tech-section" className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-5 w-5 text-red-600" />
                          <h2 id="tech-section" className="text-xl font-bold tracking-tight">
                            Technology & Artificial Intelligence
                          </h2>
                        </div>
                        <Link
                          href="/?category=tech"
                          className="text-xs font-bold text-red-600 hover:underline"
                        >
                          View all tech
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {techArticles.map((article) => (
                          <div
                            key={article.id}
                            className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:border-red-500/50 transition-all"
                          >
                            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                              <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                            </div>
                            <div className="flex flex-col justify-between">
                              <span className="text-[11px] font-semibold text-red-600">
                                {article.source} • {formatArticleDate(article.publishedAt)}
                              </span>
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs sm:text-sm font-bold line-clamp-2 hover:text-red-600 transition-colors"
                              >
                                {article.title}
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Markets Section */}
                  {marketArticles.length > 0 && (
                    <section aria-labelledby="markets-section" className="space-y-4">
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-red-600" />
                          <h2 id="markets-section" className="text-xl font-bold tracking-tight">
                            Global Markets & Economic Digest
                          </h2>
                        </div>
                        <Link
                          href="/?category=markets"
                          className="text-xs font-bold text-red-600 hover:underline"
                        >
                          View all markets
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {marketArticles.map((article) => (
                          <div
                            key={article.id}
                            className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:border-red-500/50 transition-all"
                          >
                            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                              <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                            </div>
                            <div className="flex flex-col justify-between">
                              <span className="text-[11px] font-semibold text-red-600">
                                {article.source} • {formatArticleDate(article.publishedAt)}
                              </span>
                              <a
                                href={article.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs sm:text-sm font-bold line-clamp-2 hover:text-red-600 transition-colors"
                              >
                                {article.title}
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <aside className="space-y-8">
              <DeviniShowcase />

              {/* Fast Wire Digest / Trending Quick Links */}
              <section aria-labelledby="wire-digest" className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                  <h2 id="wire-digest" className="text-lg font-bold">
                    Fast Wire Headlines
                  </h2>
                  <span className="rounded bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-400 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wide">
                    Live Feed
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {allArticles.slice(1, 6).map((article: NewsArticle, idx: number) => (
                    <div key={article.id} className="py-3.5 first:pt-0 last:pb-0">
                      <div className="flex items-start gap-3">
                        <span className="text-xl font-extrabold text-red-600/90 leading-none">
                          0{idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1">
                            <span className="font-semibold text-foreground/80">{article.source}</span>
                            <span>•</span>
                            <span>{formatArticleDate(article.publishedAt)}</span>
                          </div>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold leading-snug hover:text-red-600 transition-colors line-clamp-2"
                          >
                            {article.title}
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <MarketTickers tickers={mockMarketTickers} />
              <NewsletterSignup />
            </aside>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 px-4 py-8 text-sm text-muted-foreground">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center text-white font-bold text-sm">
                N
              </div>
              <span className="font-bold text-foreground">NewsHub Global Media</span>
            </div>
            <span>Independent global reporting, Google Trends integration, and continuous market intelligence.</span>
            <span>© 2026 NewsHub Media</span>
          </div>
          <p className="border-t border-border pt-4 text-xs">
            Platform engineered with enterprise web solutions and marketing automation powered by{' '}
            <a
              className="font-semibold text-foreground hover:text-red-600 hover:underline"
              href="https://devini.ma"
              target="_blank"
              rel="noopener noreferrer"
            >
              Devini
            </a>
            .
          </p>
        </div>
      </footer>

      {/* Structured Data (Schema.org / JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </div>
  )
}


