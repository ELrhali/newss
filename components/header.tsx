'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Search, Menu, X, Globe } from 'lucide-react'
import { Region } from '@/lib/types'
import { regionLabels } from '@/lib/news-utils'

interface HeaderProps {
  currentRegion?: Region
}

export function Header({ currentRegion = 'global' }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const categories = ['world', 'business', 'tech', 'politics', 'markets'] as const

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="flex h-14 max-w-7xl mx-auto items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center text-white font-bold">
            N
          </div>
          <span className="hidden sm:inline">NewsHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/category/${cat}`}
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="hidden sm:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-32 lg:w-48 px-3 py-2 text-sm rounded-md border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Region Selector */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" />
            <span>{regionLabels[currentRegion]}</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 hover:bg-accent rounded-md transition-colors"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat}`}
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 text-sm font-medium border-b border-border hover:bg-accent transition-colors"
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Link>
            ))}
            <form onSubmit={handleSearch} className="p-4 border-t border-border">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="submit"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </nav>
        </div>
      )}
    </header>
  )
}
