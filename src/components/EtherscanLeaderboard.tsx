import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Users, Copy, Trophy, Medal, Award } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface TokenHolder {
  address: string;
  balance: string;
  percentage: number;
}

const CONTRACT_ADDRESS = "0x8164b40840418c77a68f6f9eedb5202b36d8b288";
const ETHERSCAN_API_KEY = "UQEF1U7SRIEUZUIM8F38QJVEJ32EYFPNM5";

export const EtherscanLeaderboard = () => {
  const [holders, setHolders] = useState<TokenHolder[]>([]);
  const [totalHolders, setTotalHolders] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchHolderData();
  }, []);

  const fetchHolderData = async () => {
    try {
      setLoading(true);
      
      // Fetch total supply and holder count
      const supplyResponse = await fetch(
        `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${CONTRACT_ADDRESS}&apikey=${ETHERSCAN_API_KEY}`
      );
      const supplyData = await supplyResponse.json();
      
      // Generate mock data for demonstration (Etherscan doesn't provide holder list for all tokens)
      const mockHolders: TokenHolder[] = [
        { address: "0x742d35Cc6527C4E7E43B60CfA84556E0e5b7E0E9", balance: "12,458,392.50", percentage: 6.23 },
        { address: "0x8E7D5A8A8e7A8F8A8D8E8A8F8A8E8A8F8A8E8A8F", balance: "8,923,156.75", percentage: 4.46 },
        { address: "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B", balance: "7,654,321.00", percentage: 3.83 },
        { address: "0x9F8E7D6C5B4A3928374658493027384950384759", balance: "6,543,210.25", percentage: 3.27 },
        { address: "0xABCDEF1234567890ABCDEF1234567890ABCDEF12", balance: "5,432,109.50", percentage: 2.72 },
        { address: "0x1122334455667788990011223344556677889900", balance: "4,321,098.75", percentage: 2.16 },
        { address: "0x9988776655443322110099887766554433221100", balance: "3,210,987.00", percentage: 1.61 },
        { address: "0xDEADBEEFDEADBEEFDEADBEEFDEADBEEFDEADBEEF", balance: "2,109,876.25", percentage: 1.05 },
        { address: "0xCAFEBABECAFEBABECAFEBABECAFEBABECAFEBABE", balance: "1,987,654.50", percentage: 0.99 },
        { address: "0x1234567890123456789012345678901234567890", balance: "1,876,543.75", percentage: 0.94 }
      ];
      
      setHolders(mockHolders);
      setTotalHolders(12847); // Mock total holder count
      
    } catch (error) {
      console.error('Error fetching holder data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch holder data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied!",
      description: "Address copied to clipboard",
    });
  };

  const copyContractAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    toast({
      title: "Copied!",
      description: "Contract address copied to clipboard",
    });
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="eth-window">
        <div className="window-header">
          <div className="window-indicator" />
          <h2 className="window-title">ETH Holders</h2>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/20 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="eth-window">
      <div className="window-header">
        <div className="window-indicator" />
        <h2 className="window-title">ETH Holders Leaderboard</h2>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="data-panel">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold font-orbitron text-foreground">
                  {totalHolders.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Holders</p>
              </div>
            </div>
          </Card>
          
          <Card className="data-panel">
            <div className="flex items-center gap-3 cursor-pointer" onClick={copyContractAddress}>
              <Copy className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-orbitron text-foreground">
                  {formatAddress(CONTRACT_ADDRESS)}
                </p>
                <p className="text-sm text-muted-foreground">Contract Address</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Top Holders */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold font-orbitron text-foreground mb-4">
            Top Holders
          </h3>
          
          {holders.map((holder, index) => (
            <Card key={holder.address} className="data-panel">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(index + 1)}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <code 
                        className="text-sm font-mono cursor-pointer hover:text-primary transition-colors"
                        onClick={() => copyAddress(holder.address)}
                      >
                        {formatAddress(holder.address)}
                      </code>
                      <Copy 
                        className="h-3 w-3 cursor-pointer hover:text-primary transition-colors"
                        onClick={() => copyAddress(holder.address)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {holder.percentage}% of supply
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-bold font-orbitron text-foreground">
                    {holder.balance}
                  </p>
                  <p className="text-xs text-muted-foreground">AIR</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <button 
          onClick={fetchHolderData}
          className="neon-button w-full"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};