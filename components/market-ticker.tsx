import { TrendingUp, TrendingDown } from 'lucide-react'
import { MarketTicker } from '@/lib/types'

interface MarketTickersProps {
  tickers: MarketTicker[]
}

export function MarketTickers({ tickers }: MarketTickersProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
        Market Data
      </h3>
      <div className="space-y-2">
        {tickers.map((ticker) => (
          <div key={ticker.symbol} className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors">
            <div>
              <div className="text-sm font-semibold">{ticker.symbol}</div>
              <div className="text-xs text-muted-foreground">{ticker.name}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold">{ticker.price.toFixed(2)}</div>
              <div
                className={`text-xs font-semibold flex items-center justify-end gap-1 ${
                  ticker.change >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {ticker.change >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {ticker.changePercent.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
