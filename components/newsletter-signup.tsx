'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setSubmitted(true)
      setEmail('')
      setTimeout(() => setSubmitted(false), 3000)
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
        <Mail className="h-4 w-4" />
        Newsletter
      </h3>
      <p className="text-xs text-muted-foreground">
        Get the latest news and market updates delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 text-sm rounded-md border border-input bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          className="w-full px-3 py-2 text-sm font-semibold rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
          {submitted ? 'Subscribed!' : 'Subscribe'}
        </button>
      </form>
    </div>
  )
}
