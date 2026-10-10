import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { ArticleCard } from '@/components/article-card'
import { fetchArticles, categoryLabels } from '@/lib/news-utils'
import { ArticleCategory } from '@/lib/types'

export const revalidate = 180
const categories: ArticleCategory[] = ['world', 'business', 'tech', 'politics', 'markets']

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!categories.includes(slug as ArticleCategory)) return { title: 'Category Not Found' }
  const label = categoryLabels[slug as ArticleCategory]
  return {
    title: `${label} News & Analysis | NewsHub`,
    description: `Latest ${label.toLowerCase()} news, reporting, and expert analysis from NewsHub journalists.`,
    alternates: { canonical: `https://newshub.example.com/category/${slug}` },
    openGraph: { title: `${label} News & Analysis`, description: `Latest ${label.toLowerCase()} news and analysis.`, type: 'website' },
    twitter: { card: 'summary', title: `${label} News | NewsHub`, description: `Latest ${label.toLowerCase()} news.` },
    robots: { index: true, follow: true },
  }
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ region?: string }> }) {
  const { slug } = await params
  const { region } = await searchParams
  if (!categories.includes(slug as ArticleCategory)) notFound()
  const articles = await fetchArticles({ category: slug as ArticleCategory, region: region === 'us' || region === 'eu' || region === 'global' ? region : undefined })
  const label = categoryLabels[slug as ArticleCategory]
  const schema = { '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: articles.map((article, index) => ({ '@type': 'ListItem', position: index + 1, item: { '@type': 'NewsArticle', headline: article.title, url: `https://newshub.example.com/article/${article.slug}` } })) }

  return <div className="min-h-screen bg-background"><Header currentRegion={region === 'us' || region === 'eu' || region === 'global' ? region : 'global'} /><main className="max-w-7xl mx-auto px-4 py-10"><div className="mb-8 border-b border-border pb-6"><p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">News & analysis</p><h1 className="mt-2 text-4xl font-bold tracking-tight">{label}</h1><p className="mt-3 max-w-2xl text-muted-foreground">The latest reporting, context, and insight across {label.toLowerCase()}.</p></div><div className="mb-6 flex flex-wrap gap-2"><span className="mr-2 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Filter:</span>{['all', 'us', 'eu', 'global'].map((item) => <a key={item} href={item === 'all' ? `/category/${slug}` : `/category/${slug}?region=${item}`} className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors hover:border-red-600 hover:text-red-600 ${((region ?? 'all') === item) ? 'border-red-600 bg-red-600 text-white hover:text-white' : 'border-border'}`}>{item === 'eu' ? 'Europe' : item === 'us' ? 'US' : item === 'all' ? 'All regions' : 'Global'}</a>)}</div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{articles.map((article) => <ArticleCard key={article.id} article={article} />)}</div>{articles.length === 0 && <p className="py-16 text-center text-muted-foreground">No stories found for this filter.</p>}</main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></div>
}
