import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { ArticleCard } from '@/components/article-card'
import { fetchArticles } from '@/lib/news-utils'

export const metadata: Metadata = { title: 'Search News | NewsHub', description: 'Search NewsHub for reporting, analysis, and market intelligence.', robots: { index: false, follow: true }, alternates: { canonical: 'https://newshub.example.com/search' } }

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const results = q ? await fetchArticles({ search: q }) : []
  return <div className="min-h-screen bg-background"><Header /><main className="max-w-7xl mx-auto px-4 py-10"><div className="mb-8 border-b border-border pb-6"><p className="text-xs font-bold uppercase tracking-[0.25em] text-red-600">News search</p><h1 className="mt-2 text-4xl font-bold">{q ? `Results for “${q}”` : 'Search NewsHub'}</h1></div>{q && <p className="mb-6 text-sm text-muted-foreground">{results.length} {results.length === 1 ? 'story' : 'stories'} found</p>}<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{results.map((article) => <ArticleCard key={article.id} article={article} />)}</div>{q && results.length === 0 && <p className="py-16 text-center text-muted-foreground">No stories matched your search.</p>}</main></div>
}
