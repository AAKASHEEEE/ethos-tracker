import { useState, useEffect } from 'react';
import { geckoTerminalApi } from '@/services/geckoTerminalApi';

export function useTokenData() {
  const [tokenData, setTokenData] = useState({
    price: 0.00725,
    priceChange24h: 12.8,
    volume24h: 127350,
    marketCap: 0,
    totalTransactions: 0,
    symbol: 'AIR',
    name: 'Ethereum OS',
    address: '0x8164B40840418C77A68F6f9EEdB5202b36d8b288',
    decimals: 18,
    totalSupply: 0,
  });
  
  const [chartData, setChartData] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toString();
  };

  const fetchChartData = async (timeframe: 'minute' | 'hour' | 'day' = 'hour') => {
    try {
      const ohlcvData = await geckoTerminalApi.getOHLCVData(timeframe);
      const formattedData = geckoTerminalApi.formatChartData(ohlcvData);
      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const refreshData = async () => {
    try {
      const { pool, tokens } = await geckoTerminalApi.getPoolData();
      const formattedData = geckoTerminalApi.formatTokenData(pool, tokens);
      setTokenData(formattedData);
      setLastUpdate(new Date());
      await fetchChartData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return {
    tokenData,
    chartData,
    lastUpdate,
    refreshData,
    fetchChartData,
    formatNumber,
    // Legacy compatibility
    price: tokenData.price,
    priceChange24h: tokenData.priceChange24h,
    volume24h: tokenData.volume24h,
    holders: 12823, // Static for now
    contractAddress: tokenData.address,
  };
}
