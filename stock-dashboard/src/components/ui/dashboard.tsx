import { StockHeader } from "./StockHeader";
import { PredictionChart } from "./PredictionChart";
import { MarketOverview } from "./MarketOverview";
import { StockAnalysis } from "./StockAnalysis";
import { PredictionStats } from "./PredictionStats";
import { Watchlist } from "./Watchlist";
import { useState, useEffect } from "react";
import { Stock, stocksDatabase } from "../../lib/stockData";

export default function Dashboard() {
  const [selectedStock, setSelectedStock] = useState<Stock>(stocksDatabase[0]);
  const [watchlist, setWatchlist] = useState<string[]>(["AAPL", "GOOGL"]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedStock(prev => ({
        ...prev,
        price: prev.price + (Math.random() - 0.5) * 2,
        change: prev.change + (Math.random() - 0.5) * 0.5,
        changePercent: prev.changePercent + (Math.random() - 0.5) * 0.2,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <StockHeader 
        selectedStock={selectedStock}
        onSelectStock={setSelectedStock}
      />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <MarketOverview 
          onSelectStock={setSelectedStock}
          selectedSymbol={selectedStock.symbol}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <PredictionChart stock={selectedStock} />
            <StockAnalysis stock={selectedStock} />
          </div>
          
          <div className="space-y-6">
            <PredictionStats stock={selectedStock} />
            <Watchlist 
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
              onSelectStock={setSelectedStock}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
