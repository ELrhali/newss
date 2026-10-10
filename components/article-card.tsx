import Link from 'next/link'
import Image from 'next/image'
import { NewsArticle } from '@/lib/types'
import { formatDate, categoryLabels } from '@/lib/news-utils'
import { Clock, TrendingUp } from 'lucide-react'

interface ArticleCardProps {
  article: NewsArticle
  variant?: 'default' | 'compact' | 'featured'
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const href = `/article/${article.slug}`

  if (variant === 'featured') {
    return (
      <Link href={href} className="group block">
        <div className="relative overflow-hidden rounded-lg bg-card">
          <div className="relative h-80 w-full sm:h-96">
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              priority
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                {categoryLabels[article.category]}
              </span>
              {article.breaking && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-600/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                  <TrendingUp className="h-3 w-3" />
                  Breaking
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold leading-tight mb-2 group-hover:underline">
              {article.title}
            </h2>
            <p className="text-sm text-white/80">{article.description}</p>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/20">
              <span className="text-xs text-white/70">{article.author}</span>
              <time className="text-xs text-white/70">{formatDate(article.publishedAt)}</time>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <Link href={href} className="group flex gap-3 py-4 border-b border-border last:border-b-0">
        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            sizes="96px"
          />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold leading-tight group-hover:underline">
              {article.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {article.description}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{categoryLabels[article.category]}</span>
            <span>•</span>
            <time>{formatDate(article.publishedAt)}</time>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={href} className="group block">
      <article className="overflow-hidden rounded-lg border border-border bg-card transition-colors hover:bg-card/80">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={article.image}
            alt={article.imageAlt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded bg-red-600/10 px-2 py-1 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
              {categoryLabels[article.category]}
            </span>
            {article.breaking && (
              <span className="inline-flex items-center gap-1 rounded bg-red-600/10 px-2 py-1 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">
                <TrendingUp className="h-3 w-3" />
                BREAKING
              </span>
            )}
          </div>
          <h3 className="text-base font-bold leading-tight mb-2 group-hover:underline line-clamp-3">
            {article.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{article.description}</p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span>{article.author}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readingTimeMinutes}m
              </div>
            </div>
            <time>{formatDate(article.publishedAt)}</time>
          </div>
        </div>
      </article>
    </Link>
  )
}
