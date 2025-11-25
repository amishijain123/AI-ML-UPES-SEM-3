import { Card } from "./card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import { Button } from "./button";
import { useState, useEffect } from "react";
import { Stock, generateHistoricalData, generatePredictedData } from "../../lib/stockData";

interface PredictionChartProps {
  stock: Stock;
}

export function PredictionChart({ stock }: PredictionChartProps) {
  const [timeframe, setTimeframe] = useState("1M");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const daysMap: { [key: string]: number } = {
      "1D": 1,
      "1W": 7,
      "1M": 30,
      "3M": 90,
      "1Y": 365,
    };
    
    const days = daysMap[timeframe] || 30;
    const historical = generateHistoricalData(stock, days);
    const predicted = generatePredictedData(stock.price, 7);
    
    setData([...historical, ...predicted]);
  }, [stock, timeframe]);

  const predictedChange = data.length > 0 
    ? ((data[data.length - 1]?.predicted || stock.price) - stock.price) / stock.price * 100 
    : 0;

  return (
    <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700 shadow-2xl">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-white text-xl">Price Prediction</h2>
            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">AI Powered</span>
          </div>
          <p className="text-slate-400">{stock.symbol} - {stock.name}</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400">Current</p>
              <p className="text-white text-lg">${stock.price.toFixed(2)}</p>
            </div>
            <div className={`px-4 py-2 rounded-lg border ${predictedChange >= 0 ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
              <p className="text-xs text-slate-400">7-Day Forecast</p>
              <p className={`text-lg ${predictedChange >= 0 ? "text-green-400" : "text-red-400"}`}>
                {predictedChange >= 0 ? "+" : ""}{predictedChange.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {["1D", "1W", "1M", "3M", "1Y"].map((tf) => (
            <Button
              key={tf}
              variant={timeframe === tf ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf)}
              className={timeframe === tf ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700"}
            >
              {tf}
            </Button>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fontSize: 12, fill: '#94a3b8' }}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: any) => [`$${value?.toFixed(2)}`, '']}
          />
          <Legend wrapperStyle={{ color: '#94a3b8' }} />
          <ReferenceLine x={data.find(d => d.predicted !== null)?.date} stroke="#64748b" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="url(#colorActual)"
            name="Actual Price"
          />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#10b981"
            strokeWidth={3}
            strokeDasharray="5 5"
            fill="url(#colorPredicted)"
            name="Predicted Price"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}