export interface PoolData {
  id: string;
  type: string;
  attributes: {
    name: string;
    address: string;
    base_token_price_usd: string;
    quote_token_price_usd: string;
    base_token_price_native_currency: string;
    quote_token_price_native_currency: string;
    pool_created_at: string;
    fdv_usd: string;
    market_cap_usd: string;
    price_change_percentage: {
      h24: string;
      h6: string;
      h1: string;
      m5: string;
    };
    transactions: {
      h24: {
        buys: number;
        sells: number;
      };
      h6: {
        buys: number;
        sells: number;
      };
      h1: {
        buys: number;
        sells: number;
      };
      m5: {
        buys: number;
        sells: number;
      };
    };
    volume_usd: {
      h24: string;
      h6: string;
      h1: string;
      m5: string;
    };
  };
  relationships: {
    base_token: {
      data: {
        id: string;
        type: string;
      };
    };
    quote_token: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}

export interface TokenInfo {
  id: string;
  type: string;
  attributes: {
    address: string;
    name: string;
    symbol: string;
    image_url: string;
    coingecko_coin_id: string;
    decimals: number;
    total_supply: string;
  };
}

export interface OHLCVData {
  data: {
    id: string;
    type: string;
    attributes: {
      ohlcv_list: Array<[number, number, number, number, number, number]>; // [timestamp, open, high, low, close, volume]
    };
  };
}

const BASE_URL = 'https://api.geckoterminal.com/api/v2';
const POOL_ADDRESS = '0xd277b8bef27af6c2dc0a8aeddd23a57637892270';
const NETWORK = 'eth'; // Ethereum mainnet

class GeckoTerminalService {
  private async makeRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('GeckoTerminal API Error:', error);
      throw error;
    }
  }

  async getPoolData(): Promise<{ pool: PoolData; tokens: TokenInfo[] }> {
    const endpoint = `/networks/${NETWORK}/pools/${POOL_ADDRESS}?include=base_token,quote_token`;
    const response = await this.makeRequest<{
      data: PoolData;
      included: TokenInfo[];
    }>(endpoint);

    return {
      pool: response.data,
      tokens: response.included,
    };
  }

  async getOHLCVData(timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' = '1h', limit = 100): Promise<OHLCVData> {
    const endpoint = `/networks/${NETWORK}/pools/${POOL_ADDRESS}/ohlcv/${timeframe}?limit=${limit}`;
    return this.makeRequest<OHLCVData>(endpoint);
  }

  async getPoolsData(addresses: string[]): Promise<{ data: PoolData[] }> {
    const addressList = addresses.join(',');
    const endpoint = `/networks/${NETWORK}/pools/multi/${addressList}`;
    return this.makeRequest<{ data: PoolData[] }>(endpoint);
  }

  // Helper method to format data for our components
  formatTokenData(poolData: PoolData, tokens: TokenInfo[]) {
    const baseToken = tokens.find(token => 
      token.id === poolData.relationships.base_token.data.id
    );

    const price = parseFloat(poolData.attributes.base_token_price_usd);
    const priceChange24h = parseFloat(poolData.attributes.price_change_percentage.h24) || 0;
    const marketCap = parseFloat(poolData.attributes.market_cap_usd) || 0;
    const volume24h = parseFloat(poolData.attributes.volume_usd.h24) || 0;
    const totalTransactions = (poolData.attributes.transactions.h24.buys + poolData.attributes.transactions.h24.sells);

    return {
      price,
      priceChange24h,
      marketCap,
      volume24h,
      totalTransactions,
      symbol: baseToken?.attributes.symbol || 'AIR',
      name: baseToken?.attributes.name || 'Ethereum OS',
      address: baseToken?.attributes.address || POOL_ADDRESS,
      decimals: baseToken?.attributes.decimals || 18,
      totalSupply: baseToken?.attributes.total_supply ? parseFloat(baseToken.attributes.total_supply) : 0,
    };
  }

  // Format OHLCV data for charts
  formatChartData(ohlcvData: OHLCVData) {
    return ohlcvData.data.attributes.ohlcv_list.map(([timestamp, open, high, low, close, volume]) => ({
      timestamp: timestamp * 1000, // Convert to milliseconds
      time: new Date(timestamp * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      date: new Date(timestamp * 1000).toLocaleDateString(),
      open,
      high,
      low,
      close,
      volume,
      price: close, // For simple line charts
    }));
  }
}

export const geckoTerminalApi = new GeckoTerminalService();