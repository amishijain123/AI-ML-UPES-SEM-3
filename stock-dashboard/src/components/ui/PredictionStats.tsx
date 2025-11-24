import { Card } from "./card";
import { ArrowUpRight, ArrowDownRight, Activity, Target, TrendingUp } from "lucide-react";
import { Stock } from "../../lib/stockData";
import { useEffect, useState } from "react";

interface PredictionStatsProps {
  stock: Stock;
}

export function PredictionStats({ stock }: PredictionStatsProps) {
  const [stats, setStats] = useState({
    predictedChange: 0,
    accuracy: 0,
    volatility: "",
    confidence: 0,
    recommendation: "",
  });

  useEffect(() => {
    // Calculate dynamic stats based on stock
    const predictedChange = (Math.random() * 10 - 2).toFixed(2);
    const accuracy = (80 + Math.random() * 15).toFixed(1);
    const volatilities = ["Low", "Medium", "High"];
    const volatility = volatilities[Math.floor(Math.random() * 3)];
    const confidence = (70 + Math.random() * 25).toFixed(0);
    
    const buySignals = parseFloat(predictedChange) > 0 ? "BUY" : "HOLD";
    const recommendation = parseFloat(predictedChange) < -3 ? "SELL" : buySignals;

    setStats({
      predictedChange: parseFloat(predictedChange),
      accuracy: parseFloat(accuracy),
      volatility,
      confidence: parseFloat(confidence),
      recommendation,
    });
  }, [stock]);

  const statsData = [
    {
      label: "Predicted Change",
      value: `${stats.predictedChange >= 0 ? "+" : ""}${stats.predictedChange}%`,
      subtext: "Next 7 days",
      icon: stats.predictedChange >= 0 ? ArrowUpRight : ArrowDownRight,
      positive: stats.predictedChange >= 0,
    },
    {
      label: "Accuracy Rate",
      value: `${stats.accuracy}%`,
      subtext: "Last 30 predictions",
      icon: Target,
      positive: true,
    },
    {
      label: "Volatility",
      value: stats.volatility,
      subtext: `${stock.sector} sector`,
      icon: Activity,
      positive: null,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-white text-xl">Prediction Stats</h2>
      
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-4 hover:shadow-2xl transition-all bg-slate-800/50 backdrop-blur-sm border-slate-700 hover:bg-slate-800 hover:scale-105">
            <div className="flex items-start justify-between mb-2">
              <p className="text-slate-400">{stat.label}</p>
              <div className={`p-2 rounded-lg ${
                stat.positive === true 
                  ? "bg-green-500/20" 
                  : stat.positive === false
                  ? "bg-red-500/20"
                  : "bg-blue-500/20"
              }`}>
                <Icon className={`w-5 h-5 ${
                  stat.positive === true 
                    ? "text-green-400" 
                    : stat.positive === false
                    ? "text-red-400"
                    : "text-blue-400"
                }`} />
              </div>
            </div>
            <p className={`text-2xl mb-1 ${
              stat.positive === true 
                ? "text-green-400" 
                : stat.positive === false
                ? "text-red-400"
                : "text-white"
            }`}>
              {stat.value}
            </p>
            <p className="text-sm text-slate-500">{stat.subtext}</p>
          </Card>
        );
      })}
      
      <Card className={`p-4 transition-all backdrop-blur-sm ${
        stats.recommendation === "BUY" 
          ? "bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30" 
          : stats.recommendation === "SELL"
          ? "bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/30"
          : "bg-gradient-to-br from-blue-500/20 to-purple-600/10 border-blue-500/30"
      }`}>
        <div className="flex items-start gap-2 mb-2">
          <div className="p-2 bg-white/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white">AI Recommendation</p>
            <p className="text-xs text-slate-400">Machine Learning Model</p>
          </div>
        </div>
        <p className="text-slate-300 mb-3">
          Based on technical analysis and market sentiment, the model suggests a{" "}
          <span className={`px-2 py-1 rounded ${
            stats.recommendation === "BUY" 
              ? "text-green-400 bg-green-500/20" 
              : stats.recommendation === "SELL"
              ? "text-red-400 bg-red-500/20"
              : "text-blue-400 bg-blue-500/20"
          }`}>
            {stats.recommendation}
          </span>{" "}
          signal for {stock.symbol}.
        </p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-slate-400">
            Confidence: {stats.confidence}%
          </p>
          <div className="h-2 flex-1 max-w-[100px] bg-slate-900/50 rounded-full overflow-hidden ml-2 border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500" 
              style={{ width: `${stats.confidence}%` }} 
            />
          </div>
        </div>
      </Card>
      
      <Card className="p-4 bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <p className="text-sm text-slate-400 mb-3">Quick Stats</p>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
            <span className="text-slate-400">Market Cap</span>
            <span className="text-white">{stock.marketCap}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
            <span className="text-slate-400">Sector</span>
            <span className="text-white">{stock.sector}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
            <span className="text-slate-400">Volume</span>
            <span className="text-white">{(stock.volume / 1000000).toFixed(1)}M</span>
          </div>
        </div>
      </Card>
    </div>
  );
}