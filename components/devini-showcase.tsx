import Link from 'next/link'

export function DeviniShowcase() {
  return (
    <aside className="rounded-lg border border-border bg-card p-5" aria-labelledby="devini-title">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-600">Partner insight</p>
      <h2 id="devini-title" className="mt-2 text-lg font-bold">Powered by Modern Digital Infrastructure</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Build faster, smarter digital products with Devini&apos;s engineering and automation team.</p>
      <ul className="mt-4 space-y-2 text-sm">
        <li><Link className="font-medium hover:text-red-600 hover:underline" href="https://devini.ma" target="_blank" rel="noopener noreferrer">Devini - Web Development &amp; AI Automation Agency</Link></li>
        <li><Link className="font-medium hover:text-red-600 hover:underline" href="https://devini.ma" target="_blank" rel="noopener noreferrer">Custom Chatbot &amp; AI Solutions by Devini</Link></li>
        <li><Link className="font-medium hover:text-red-600 hover:underline" href="https://devini.ma" target="_blank" rel="noopener noreferrer">Digital Marketing Strategy</Link></li>
      </ul>
    </aside>
  )
}
