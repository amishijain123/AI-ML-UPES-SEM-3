import { useState, useEffect } from "react";
import {StockHeader} from "./src/components/ui/StockHeader";
import {PredictionChart} from "./src/components/ui/PredictionChart";
import{ MarketOverview }from "./src/components/ui/MarketOverview";
import {StockAnalysis} from "./src/components/ui/StockAnalysis";
import {PredictionStats} from "./src/components/ui/PredictionStats";
import {Watchlist} from "./src/components/ui/Watchlist";
import { Stock, stocksDatabase } from "./src/lib/stockData";

export default function App() {
  const [selectedStock, setSelectedStock] = useState<Stock>(stocksDatabase[0]);
  const [watchlist, setWatchlist] = useState<string[]>(["AAPL", "GOOGL"]);

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedStock(prev => ({
        ...prev,
        price: +(prev.price + (Math.random() - 0.5) * 2).toFixed(2),
        change: +(prev.change + (Math.random() - 0.5) * 0.5).toFixed(2),
        changePercent: +(prev.changePercent + (Math.random() - 0.5) * 0.2).toFixed(2),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleWatchlist = (symbol: string) => {
    setWatchlist(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <StockHeader selectedStock={selectedStock} onSelectStock={setSelectedStock} />

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Market Overview */}
        <MarketOverview onSelectStock={setSelectedStock} selectedSymbol={selectedStock.symbol} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-3 space-y-6">
            <PredictionChart stock={selectedStock} />
            <StockAnalysis stock={selectedStock} />
          </div>

          {/* Right Column */}
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
