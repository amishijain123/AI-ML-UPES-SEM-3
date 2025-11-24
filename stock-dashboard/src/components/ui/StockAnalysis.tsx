import { Card } from "./card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Stock, calculateTechnicalIndicators, generateVolumeData, calculateSentiment } from "../../lib/stockData";
import { useEffect, useState } from "react";

interface StockAnalysisProps {
  stock: Stock;
}

export function StockAnalysis({ stock }: StockAnalysisProps) {
  const [technicalData, setTechnicalData] = useState<any>(null);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [sentiment, setSentiment] = useState<any>(null);

  useEffect(() => {
    setTechnicalData(calculateTechnicalIndicators(stock));
    setVolumeData(generateVolumeData());
    setSentiment(calculateSentiment());
  }, [stock]);

  if (!technicalData || !sentiment) return null;

  const indicators = [
    { indicator: "RSI", value: technicalData.rsi.value, status: technicalData.rsi.status },
    { indicator: "MACD", value: technicalData.macd.value, status: technicalData.macd.status },
    { indicator: "Moving Avg (50)", value: technicalData.sma50.value, status: technicalData.sma50.status },
    { indicator: "Moving Avg (200)", value: technicalData.sma200.value, status: technicalData.sma200.status },
  ];

  return (
    <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-2xl">
      <h2 className="text-white mb-4 text-xl">Stock Analysis</h2>
      
      <Tabs defaultValue="technical" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-900/50 border border-slate-700">
          <TabsTrigger value="technical" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Technical</TabsTrigger>
          <TabsTrigger value="volume" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Volume</TabsTrigger>
          <TabsTrigger value="sentiment" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Sentiment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="technical" className="space-y-4">
          <div className="space-y-3">
            {indicators.map((item) => (
              <div key={item.indicator} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:bg-slate-900/70 transition-colors">
                <div>
                  <p className="text-white">{item.indicator}</p>
                  <p className="text-sm text-slate-400">
                    {typeof item.value === 'number' ? item.value.toFixed(2) : item.value}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  item.status === "Buy" 
                    ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                    : item.status === "Sell"
                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                    : item.status === "Overbought"
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : item.status === "Oversold"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-slate-700/50 text-slate-300 border border-slate-600"
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/30">
            <p className="text-sm text-slate-300">
              <span className="text-white">Overall Signal:</span> Based on technical indicators, 
              the trend suggests a {
                indicators.filter(i => i.status === "Buy").length > 2 
                  ? <span className="text-green-400">BULLISH</span>
                  : indicators.filter(i => i.status === "Sell").length > 2
                  ? <span className="text-red-400">BEARISH</span>
                  : <span className="text-slate-400">NEUTRAL</span>
              } outlook.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="volume">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: any) => [`${value.toFixed(1)}M`, 'Volume']}
              />
              <Bar dataKey="volume" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-400">Average Daily Volume</span>
              <span className="text-white">{(stock.volume / 1000000).toFixed(1)}M</span>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="sentiment" className="space-y-4">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Bullish Sentiment</span>
                <span className="text-white">{sentiment.bullish}%</span>
              </div>
              <div className="h-3 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500" 
                  style={{ width: `${sentiment.bullish}%` }} 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Bearish Sentiment</span>
                <span className="text-white">{sentiment.bearish}%</span>
              </div>
              <div className="h-3 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500" 
                  style={{ width: `${sentiment.bearish}%` }} 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-300">Neutral Sentiment</span>
                <span className="text-white">{sentiment.neutral}%</span>
              </div>
              <div className="h-3 bg-slate-900/50 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-slate-500 to-slate-400 transition-all duration-500" 
                  style={{ width: `${sentiment.neutral}%` }} 
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <p className="text-sm text-slate-400">
              Market sentiment analysis based on social media, news articles, and analyst reports for {stock.symbol}.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}