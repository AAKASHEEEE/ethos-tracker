import { useState, useEffect, useCallback } from 'react';
import { geckoTerminalApi } from '@/services/geckoTerminalApi';

export interface TokenData {
  price: number;
  priceChange24h: number;
  marketCap: number;
  holders: number;
  totalTransactions: number;
  volume24h: number;
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  totalSupply: number;
}

export interface ChartDataPoint {
  timestamp: number;
  time: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  price: number;
}

export const useTokenData = () => {
  const [tokenData, setTokenData] = useState<TokenData>({
    price: 0.00025,
    priceChange24h: 12.5,
    marketCap: 925821,
    holders: 12823,
    totalTransactions: 1247,
    volume24h: 87432,
    symbol: 'AIR',
    name: 'Ethereum OS',
    address: '0xd277b8bef27af6c2dc0a8aeddd23a57637892270',
    decimals: 18,
    totalSupply: 0,
  });

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchTokenData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch pool data and token info
      const { pool, tokens } = await geckoTerminalApi.getPoolData();
      const formattedData = geckoTerminalApi.formatTokenData(pool, tokens);

      // Update token data with real API data, keeping holders from our manual data
      setTokenData(prev => ({
        ...formattedData,
        holders: prev.holders, // Keep manual holder count since API doesn't provide this
      }));

      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error fetching token data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch token data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchChartData = useCallback(async (timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' = '1h') => {
    try {
      const ohlcvData = await geckoTerminalApi.getOHLCVData(timeframe, 100);
      const formattedChartData = geckoTerminalApi.formatChartData(ohlcvData);
      setChartData(formattedChartData);
    } catch (err) {
      console.error('Error fetching chart data:', err);
      // Fallback to dummy data if API fails
      const fallbackData: ChartDataPoint[] = Array.from({ length: 24 }, (_, i) => {
        const now = Date.now();
        const timestamp = now - (23 - i) * 60 * 60 * 1000; // Hourly data for 24h
        const basePrice = tokenData.price;
        const volatility = 0.1;
        const price = basePrice * (1 + (Math.random() - 0.5) * volatility);
        
        return {
          timestamp,
          time: new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          date: new Date(timestamp).toLocaleDateString(),
          open: price * 0.99,
          high: price * 1.02,
          low: price * 0.98,
          close: price,
          volume: Math.random() * 100000,
          price,
        };
      });
      setChartData(fallbackData);
    }
  }, [tokenData.price]);

  const refreshData = useCallback(() => {
    fetchTokenData();
    fetchChartData();
  }, [fetchTokenData, fetchChartData]);

  useEffect(() => {
    fetchTokenData();
    fetchChartData();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchTokenData();
    }, 30000);

    // Listen for manual refresh events
    const handleRefresh = () => {
      refreshData();
    };

    window.addEventListener('refreshData', handleRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshData', handleRefresh);
    };
  }, [fetchTokenData, fetchChartData, refreshData]);

  const formatNumber = useCallback((num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  }, []);

  const formatLargeNumber = useCallback((num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toString();
  }, []);

  return {
    tokenData,
    chartData,
    loading,
    error,
    lastUpdate,
    refreshData,
    fetchChartData,
    formatNumber,
    formatLargeNumber,
  };
};
