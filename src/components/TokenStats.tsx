import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Activity, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TokenStats = () => {
  const [price, setPrice] = useState(0);
  const [priceChange24h, setPriceChange24h] = useState(0);
  const [volume24h, setVolume24h] = useState(0);
  const [holders, setHolders] = useState(0);

  const contractAddress = '0x8164B40840418C77A68F6f9EEdB5202b36d8b288';

  useEffect(() => {
    // Replace with your real API or logic
    setPrice(0.00725);
    setPriceChange24h(12.8);
    setVolume24h(127.35);

    // Get holders from Etherscan
    const fetchHolders = async () => {
      const res = await fetch(
        `https://api.etherscan.io/v2/api?chainid=1&module=token&action=tokenholdercount&contractaddress=${contractAddress}&apikey=YOUR_API_KEY`
      );
      const data = await res.json();
      setHolders(Number(data.result) || 0);
    };
    fetchHolders();
  }, []);

  const copyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    alert('Contract address copied!');
  };

  return (
    <div className="retro-window">
      <div className="window-titlebar">
        <div className="window-controls">
          <div className="window-control control-close"></div>
          <div className="window-control control-minimize"></div>
          <div className="window-control control-maximize"></div>
        </div>
        <h2 className="font-orbitron font-bold text-sm text-black ml-2">$AIR Token Stats</h2>
      </div>

      <div className="p-6 space-y-4">
        {/* Price */}
        <Card className="data-panel">
          <h3 className="text-sm font-medium font-orbitron mb-2">Live Price</h3>
          <div className="flex items-center gap-2 mb-1">
            {priceChange24h >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-400" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-400" />
            )}
            <p className="text-2xl font-bold font-orbitron">${price.toFixed(6)}</p>
          </div>
          <p className={`text-sm ${priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {priceChange24h >= 0 ? '+' : ''}
            {priceChange24h.toFixed(2)}%
          </p>
        </Card>

        {/* Volume */}
        <Card className="data-panel">
          <h3 className="text-sm font-medium font-orbitron mb-2">24h Volume</h3>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-4 w-4 text-accent" />
            <p className="text-2xl font-bold font-orbitron">${volume24h.toFixed(2)}K</p>
          </div>
          <p className="text-sm text-muted-foreground">Trading Volume</p>
        </Card>

        {/* Holders */}
        <Card className="data-panel">
          <h3 className="text-sm font-medium font-orbitron mb-2">Holders</h3>
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-accent" />
            <p className="text-2xl font-bold font-orbitron">{holders.toLocaleString()}</p>
          </div>
          <p className="text-sm text-muted-foreground">Unique Wallets</p>
        </Card>

        {/* Contract */}
        <Card className="data-panel">
          <h3 className="text-sm font-medium font-orbitron mb-2">Contract</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm font-mono break-all">{contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}</p>
            <Copy className="h-4 w-4 cursor-pointer text-blue-400" onClick={copyAddress} />
          </div>
          <p className="text-sm text-muted-foreground">Ethereum Network</p>
        </Card>
      </div>
    </div>
  );
};
