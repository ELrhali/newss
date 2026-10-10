import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { ArticleCard } from '@/components/article-card'
import { fetchArticleBySlug, fetchRelatedArticles, formatDateTime, categoryLabels } from '@/lib/news-utils'

export const revalidate = 180

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await fetchArticleBySlug(slug)
  if (!article) return { title: 'Article Not Found' }
  return { title: `${article.title} | NewsHub`, description: article.description, alternates: { canonical: `https://newshub.example.com/article/${article.slug}` }, openGraph: { title: article.title, description: article.description, url: `https://newshub.example.com/article/${article.slug}`, type: 'article', publishedTime: article.publishedAt.toISOString(), authors: [article.author], images: [{ url: `https://newshub.example.com${article.image}`, alt: article.imageAlt }] }, twitter: { card: 'summary_large_image', title: article.title, description: article.description, images: [`https://newshub.example.com${article.image}`] }, robots: { index: true, follow: true } }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await fetchArticleBySlug(slug)
  if (!article) notFound()
  const related = await fetchRelatedArticles(article.id, article.category)
  const schema = { '@context': 'https://schema.org', '@type': 'NewsArticle', headline: article.title, description: article.description, image: [`https://newshub.example.com${article.image}`], datePublished: article.publishedAt.toISOString(), dateModified: article.updatedAt.toISOString(), author: { '@type': 'Person', name: article.author }, publisher: { '@type': 'Organization', name: 'NewsHub', logo: { '@type': 'ImageObject', url: 'https://newshub.example.com/icon.svg' } }, mainEntityOfPage: { '@type': 'WebPage', '@id': `https://newshub.example.com/article/${article.slug}` } }
  return <div className="min-h-screen bg-background"><Header /><main className="max-w-5xl mx-auto px-4 py-10"><article><div className="mb-8 max-w-3xl"><Link href={`/category/${article.category}`} className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 hover:underline">{categoryLabels[article.category]}</Link><h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">{article.title}</h1><p className="mt-5 text-lg leading-relaxed text-muted-foreground">{article.description}</p><div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground"><span className="font-semibold text-foreground">By {article.author}</span><span>•</span><time dateTime={article.publishedAt.toISOString()}>{formatDateTime(article.publishedAt)}</time><span>•</span><span>{article.readingTimeMinutes} min read</span></div></div><div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-lg"><Image src={article.image} alt={article.imageAlt} fill priority className="object-cover" sizes="(max-width: 1024px) 100vw, 1024px" /></div><div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]"><div className="max-w-2xl text-lg leading-relaxed"><p>{article.content}</p><p className="mt-6">This story will be updated as more information becomes available. NewsHub&apos;s newsroom is monitoring developments and will provide verified context as events unfold.</p></div><aside className="space-y-4"><div className="border-y border-border py-4"><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Share this story</p><div className="mt-3 flex gap-2"><button className="rounded border border-border px-3 py-2 text-xs font-semibold hover:border-red-600 hover:text-red-600">Copy link</button><button className="rounded border border-border px-3 py-2 text-xs font-semibold hover:border-red-600 hover:text-red-600">Email</button></div></div><div><p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">About the author</p><p className="mt-2 text-sm text-muted-foreground">{article.authorBio}</p></div></aside></div></article><section className="mt-16 border-t border-border pt-8"><h2 className="mb-5 text-2xl font-bold">More from {categoryLabels[article.category]}</h2><div className="grid gap-5 md:grid-cols-3">{related.map((item) => <ArticleCard key={item.id} article={item} />)}</div></section></main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></div>
}
