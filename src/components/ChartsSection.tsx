import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, BarChart3, Clock, RefreshCw } from 'lucide-react';
import { useTokenData } from '@/hooks/useTokenData';

const apyData = [
  { epoch: 1, apy: 8.25, volume: 45000 },
  { epoch: 2, apy: 12.6, volume: 52000 }
];

const holdersData = [
  { date: 'Week 1', holders: 8245, newHolders: 1245 },
  { date: 'Week 2', holders: 9312, newHolders: 1067 },
  { date: 'Week 3', holders: 10389, newHolders: 1077 },
  { date: 'Week 4', holders: 11456, newHolders: 1067 },
  { date: 'Week 5', holders: 12823, newHolders: 1367 }
];

export const ChartsSection = () => {
  const [activeChart, setActiveChart] = useState('price');
  const [timeframe, setTimeframe] = useState<'minute' | 'hour' | 'day'>('hour');
  const { chartData, fetchChartData, tokenData, formatNumber } = useTokenData();

  const handleTimeframeChange = (newTimeframe: 'minute' | 'hour' | 'day') => {
    setTimeframe(newTimeframe);
    fetchChartData(newTimeframe);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
          <p className="font-orbitron text-sm font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === 'price' && '$'}{typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              {entry.dataKey === 'apy' && '%'}
              {entry.dataKey === 'volume' && ' USD'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="retro-window">
      <div className="window-titlebar">
        <div className="window-controls">
          <div className="window-control control-close"></div>
          <div className="window-control control-minimize"></div>
          <div className="window-control control-maximize"></div>
        </div>
        <h2 className="font-orbitron font-bold text-sm text-black ml-2">Live Analytics & Charts</h2>
      </div>
      
      <div className="p-6">
        <Tabs value={activeChart} onValueChange={setActiveChart} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-secondary border border-border">
            <TabsTrigger value="price" className="font-orbitron data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Clock className="w-4 h-4 mr-2" />
              Live Price
            </TabsTrigger>
            <TabsTrigger value="apy" className="font-orbitron data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="w-4 h-4 mr-2" />
              APY Trends
            </TabsTrigger>
            <TabsTrigger value="holders" className="font-orbitron data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Holders Growth
            </TabsTrigger>
            <TabsTrigger value="volume" className="font-orbitron data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="w-4 h-4 mr-2" />
              Volume Analysis
            </TabsTrigger>
          </TabsList>
          
          {/* Live Price Chart */}
          <TabsContent value="price" className="space-y-4">
            <Card className="chart-container">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gradient font-orbitron">Live Price Chart</h3>
                  <p className="text-sm text-muted-foreground">Real-time $AIR price movements</p>
                </div>
                <div className="flex gap-2">
                  {(['minute', 'hour', 'day'] as const).map((tf) => (
                    <Button
                      key={tf}
                      onClick={() => handleTimeframeChange(tf)}
                      variant={timeframe === tf ? "default" : "outline"}
                      size="sm"
                      className="font-orbitron"
                    >
                      {tf === 'minute' ? '15m' : tf === 'hour' ? '1h' : '1d'}
                    </Button>
                  ))}
                  <Button onClick={() => fetchChartData(timeframe)} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(190 100% 50%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(190 100% 50%)" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value.toFixed(6)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(190 100% 50%)"
                      fill="url(#priceGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-xl font-bold text-cyber font-orbitron">${tokenData.price.toFixed(8)}</p>
                  <p className="text-xs text-muted-foreground">Current Price</p>
                </div>
                <div className="text-center">
                  <p className={`text-xl font-bold font-orbitron ${tokenData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {tokenData.priceChange24h >= 0 ? '+' : ''}{tokenData.priceChange24h.toFixed(2)}%
                  </p>
                  <p className="text-xs text-muted-foreground">24h Change</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-neon font-orbitron">{formatNumber(tokenData.volume24h)}</p>
                  <p className="text-xs text-muted-foreground">24h Volume</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-cyber font-orbitron">LIVE</p>
                  <p className="text-xs text-muted-foreground">Status</p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="apy" className="space-y-4">
            <Card className="chart-container">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gradient font-orbitron">APY Across Epochs</h3>
                <p className="text-sm text-muted-foreground">Historical yield performance</p>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={apyData}>
                    <defs>
                      <linearGradient id="apyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(270 100% 70%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(270 100% 70%)" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="epoch" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="apy"
                      stroke="hsl(270 100% 70%)"
                      fill="url(#apyGradient)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-neon font-orbitron">12.6%</p>
                  <p className="text-xs text-muted-foreground">Current APY</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyber font-orbitron">+52.7%</p>
                  <p className="text-xs text-muted-foreground">Growth Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-neon font-orbitron">2</p>
                  <p className="text-xs text-muted-foreground">Epochs Tracked</p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="holders" className="space-y-4">
            <Card className="chart-container">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gradient font-orbitron">Holder Growth Over Time</h3>
                <p className="text-sm text-muted-foreground">Community growth tracking</p>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={holdersData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="date" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="holders"
                      stroke="hsl(270 100% 70%)"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(270 100% 70%)', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'hsl(270 100% 70%)', strokeWidth: 2 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="newHolders"
                      stroke="hsl(190 100% 50%)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: 'hsl(190 100% 50%)', strokeWidth: 2, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-neon font-orbitron">12.8K</p>
                  <p className="text-xs text-muted-foreground">Total Holders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyber font-orbitron">+1.4K</p>
                  <p className="text-xs text-muted-foreground">New This Week</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-neon font-orbitron">+55.5%</p>
                  <p className="text-xs text-muted-foreground">Growth Rate</p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="volume" className="space-y-4">
            <Card className="chart-container">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gradient font-orbitron">Volume Analysis</h3>
                <p className="text-sm text-muted-foreground">Trading volume from live data</p>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.slice(-12)}>
                    <defs>
                      <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(190 100% 50%)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(190 100% 50%)" stopOpacity={0.2}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="time" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="volume"
                      fill="url(#volumeGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyber font-orbitron">{formatNumber(tokenData.volume24h)}</p>
                  <p className="text-xs text-muted-foreground">24h Volume</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-neon font-orbitron">{tokenData.totalTransactions}</p>
                  <p className="text-xs text-muted-foreground">24h Transactions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyber font-orbitron">LIVE</p>
                  <p className="text-xs text-muted-foreground">Real-time Data</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};