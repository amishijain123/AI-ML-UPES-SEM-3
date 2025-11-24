import { Card } from "./card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { stocksDatabase, Stock } from "../../lib/stockData";

interface MarketOverviewProps {
  onSelectStock: (stock: Stock) => void;
  selectedSymbol: string;
}

export function MarketOverview({ onSelectStock, selectedSymbol }: MarketOverviewProps) {
  return (
    <div>
      <h2 className="text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">Market Overview</span>
        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">Live</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stocksDatabase.slice(0, 8).map((stock) => {
          const isPositive = stock.changePercent >= 0;
          const isSelected = stock.symbol === selectedSymbol;
          
          return (
            <Card 
              key={stock.symbol} 
              className={`p-4 hover:shadow-2xl transition-all cursor-pointer bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800 hover:scale-105 ${
                isSelected ? "ring-2 ring-blue-500 shadow-2xl shadow-blue-500/20 bg-slate-800" : ""
              }`}
              onClick={() => onSelectStock(stock)}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-white text-lg">{stock.symbol}</p>
                  <p className="text-sm text-slate-400">{stock.name}</p>
                </div>
                <div className={`p-2 rounded-lg ${isPositive ? "bg-green-500/20" : "bg-red-500/20"}`}>
                  {isPositive ? (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>
              <p className="text-white text-2xl mb-2">${stock.price.toFixed(2)}</p>
              <div className="flex items-center gap-2">
                <p className={`text-sm px-2 py-1 rounded ${isPositive ? "text-green-400 bg-green-500/10" : "text-red-400 bg-red-500/10"}`}>
                  {isPositive ? "+" : ""}{stock.change.toFixed(2)} ({isPositive ? "+" : ""}{stock.changePercent.toFixed(2)}%)
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-3">Vol: {(stock.volume / 1000000).toFixed(1)}M</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}