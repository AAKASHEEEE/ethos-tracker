// hooks/useTokenData.ts
import { useState, useEffect } from 'react';

export function useTokenData() {
  const [price, setPrice] = useState(0);
  const [priceChange24h, setPriceChange24h] = useState(0);
  const [volume24h, setVolume24h] = useState(0);
  const [holders, setHolders] = useState(0);

  const contractAddress = '0x8164B40840418C77A68F6f9EEdB5202b36d8b288';

  useEffect(() => {
    // ✅ Replace with your real price feed or API call
    setPrice(0.00725);
    setPriceChange24h(12.8);
    setVolume24h(127.35);

    // ✅ Live Holders from Etherscan
    const fetchHolders = async () => {
      const res = await fetch(
        `https://api.etherscan.io/v2/api?chainid=1&module=token&action=tokenholdercount&contractaddress=${contractAddress}&apikey=YOUR_API_KEY`
      );
      const data = await res.json();
      setHolders(Number(data.result) || 0);
    };

    fetchHolders();
  }, []);

  return {
    price,
    priceChange24h,
    volume24h,
    holders,
    contractAddress,
  };
}
