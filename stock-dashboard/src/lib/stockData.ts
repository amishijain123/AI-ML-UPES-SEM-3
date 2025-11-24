export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  sector: string;
}

export const stocksDatabase: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 178.45,
    change: 2.34,
    changePercent: 1.33,
    volume: 52847000,
    marketCap: "2.8T",
    sector: "Technology",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.89,
    change: -1.23,
    changePercent: -0.85,
    volume: 28543000,
    marketCap: "1.7T",
    sector: "Technology",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 378.91,
    change: 5.67,
    changePercent: 1.52,
    volume: 24568000,
    marketCap: "2.9T",
    sector: "Technology",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 242.15,
    change: 8.42,
    changePercent: 3.60,
    volume: 98547000,
    marketCap: "768B",
    sector: "Automotive",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 152.34,
    change: 3.21,
    changePercent: 2.15,
    volume: 45632000,
    marketCap: "1.6T",
    sector: "E-commerce",
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 495.22,
    change: 12.45,
    changePercent: 2.58,
    volume: 42156000,
    marketCap: "1.2T",
    sector: "Technology",
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    price: 338.54,
    change: -4.32,
    changePercent: -1.26,
    volume: 18765000,
    marketCap: "860B",
    sector: "Technology",
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: 445.67,
    change: 6.78,
    changePercent: 1.54,
    volume: 8234000,
    marketCap: "192B",
    sector: "Entertainment",
  },
];

export function generateHistoricalData(stock: Stock, days: number = 30) {
  const data = [];
  const today = new Date();
  const basePrice = stock.price - (days * 0.5);
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const randomVariation = Math.sin(i / 5) * 10 + Math.random() * 8 - 4;
    const actual = basePrice + (days - i) * 0.5 + randomVariation;
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      actual: parseFloat(actual.toFixed(2)),
      predicted: null,
    });
  }
  
  return data;
}

export function generatePredictedData(currentPrice: number, days: number = 7) {
  const data = [];
  const today = new Date();
  const trend = Math.random() > 0.5 ? 1 : -1;
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const predicted = currentPrice + (Math.random() * 6 - 3) + (i * trend * 0.8);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      actual: null,
      predicted: parseFloat(predicted.toFixed(2)),
    });
  }
  
  return data;
}

export function calculateTechnicalIndicators(stock: Stock) {
  const rsi = 30 + Math.random() * 40;
  const macd = (Math.random() - 0.5) * 3;
  const sma50 = stock.price - (Math.random() * 10 - 5);
  const sma200 = stock.price - (Math.random() * 20 - 10);
  
  return {
    rsi: {
      value: parseFloat(rsi.toFixed(2)),
      status: rsi > 70 ? "Overbought" : rsi < 30 ? "Oversold" : "Neutral",
    },
    macd: {
      value: parseFloat(macd.toFixed(2)),
      status: macd > 0 ? "Buy" : "Sell",
    },
    sma50: {
      value: parseFloat(sma50.toFixed(2)),
      status: stock.price > sma50 ? "Buy" : "Sell",
    },
    sma200: {
      value: parseFloat(sma200.toFixed(2)),
      status: stock.price > sma200 ? "Buy" : "Sell",
    },
  };
}

export function generateVolumeData() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  return days.map(day => ({
    date: day,
    volume: 30 + Math.random() * 40,
  }));
}

export function calculateSentiment() {
  const bullish = 40 + Math.random() * 40;
  const bearish = Math.random() * 30;
  const neutral = 100 - bullish - bearish;
  
  return {
    bullish: parseFloat(bullish.toFixed(1)),
    bearish: parseFloat(bearish.toFixed(1)),
    neutral: parseFloat(neutral.toFixed(1)),
  };
}
