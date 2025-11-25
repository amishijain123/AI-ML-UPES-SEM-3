import { Card } from "./card";
import { Button } from "./button";
import { Star, X } from "lucide-react";
import { stocksDatabase, Stock } from "../../lib/stockData";

interface WatchlistProps {
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  onSelectStock: (stock: Stock) => void;
}

export function Watchlist({ watchlist, onToggleWatchlist, onSelectStock }: WatchlistProps) {
  const watchlistStocks = stocksDatabase.filter(stock => 
    watchlist.includes(stock.symbol)
  );

  return (
    <Card className="p-4 bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
          <div>
            <h3 className="text-white">Watchlist</h3>
            <p className="text-xs text-slate-400">Your favorites</p>
          </div>
        </div>
        <span className="text-sm text-slate-400 bg-slate-900/50 px-2 py-1 rounded">{watchlist.length} stocks</span>
      </div>

      {watchlistStocks.length === 0 ? (
        <div className="text-center py-8 bg-slate-900/30 rounded-lg border border-slate-700 border-dashed">
          <Star className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No stocks in watchlist</p>
          <p className="text-slate-500 text-xs mt-1">Click on stocks to add them</p>
        </div>
      ) : (
        <div className="space-y-2">
          {watchlistStocks.map(stock => {
            const isPositive = stock.changePercent >= 0;
            return (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900 transition-all cursor-pointer group border border-slate-700 hover:border-slate-600"
                onClick={() => onSelectStock(stock)}
              >
                <div className="flex-1">
                  <p className="text-white">{stock.symbol}</p>
                  <p className="text-sm text-slate-400">${stock.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className={`text-sm px-2 py-1 rounded ${isPositive ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"}`}>
                    {isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 hover:bg-red-500/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(stock.symbol);
                    }}
                  >
                    <X className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">
          Click on any stock in Market Overview to add to watchlist
        </p>
      </div>
    </Card>
  );
}