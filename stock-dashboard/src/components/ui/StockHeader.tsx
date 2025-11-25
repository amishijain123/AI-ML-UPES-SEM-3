import { useState } from "react";
import { TrendingUp, Search } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Stock, stocksDatabase } from "../../lib/stockData";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover";

interface StockHeaderProps {
  selectedStock: Stock;
  onSelectStock: (stock: Stock) => void;
}

export function StockHeader({ selectedStock, onSelectStock }: StockHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50 shadow-2xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-white text-lg font-semibold">Stock Market AI</span>
              <p className="text-xs text-slate-400">Powered by Machine Learning</p>
            </div>
          </div>

          {/* Stock Search */}
          <div className="flex-1 max-w-md">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-start bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white"
                >
                  <Search className="mr-2 h-4 w-4 opacity-50" />
                  {selectedStock ? (
                    <span>
                      {selectedStock.symbol} - {selectedStock.name}
                    </span>
                  ) : (
                    "Search stocks..."
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-[400px] p-0 bg-slate-900 border-slate-800">
                <Command className="bg-slate-900">
                  <CommandInput placeholder="Search stocks..." className="text-white" />
                  <CommandList>
                    <CommandEmpty className="text-slate-400">No stock found.</CommandEmpty>
                    <CommandGroup>
                      {stocksDatabase.map((stock) => (
                        <CommandItem
                          key={stock.symbol}
                          value={`${stock.symbol} ${stock.name}`}
                          onSelect={() => {
                            onSelectStock(stock);
                            setOpen(false);
                          }}
                          className="hover:bg-slate-800"
                        >
                          <div className="flex items-center justify-between w-full">
                            <div>
                              <p className="text-white">{stock.symbol}</p>
                              <p className="text-sm text-slate-400">{stock.name}</p>
                            </div>
                            <p
                              className={`text-sm ${
                                stock.changePercent >= 0 ? "text-green-400" : "text-red-400"
                              }`}
                            >
                              ${stock.price.toFixed(2)}
                            </p>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Current Price + Analyze Button */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700">
              <p className="text-xs text-slate-400">Current Price</p>
              <p className="text-white font-medium">${selectedStock.price.toFixed(2)}</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg">
              Analyze Stock
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
