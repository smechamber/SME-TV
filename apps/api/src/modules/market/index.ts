import { Router, Request, Response } from 'express';
import YahooFinance from 'yahoo-finance2';

const router = Router();
const yahooFinance = new YahooFinance();


let cachedMarketData: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute

const formatPrice = (val?: number) => {
  if (val === undefined || val === null) return '0.00';
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(val);
};

const formatPercent = (val?: number) => {
  if (val === undefined || val === null) return '0.00%';
  const prefix = val >= 0 ? '+' : '';
  return `${prefix}${val.toFixed(2)}%`;
};

router.get('/market-data', async (req: Request, res: Response) => {
  try {
    const now = Date.now();


    if (cachedMarketData.length > 0 && now - lastFetchTime < CACHE_DURATION) {
      return res.json(cachedMarketData);
    }

    
    const symbols = [
      '^NSEI',       // Nifty 50
      '^BSESN',      // Sensex
      '^NSEBANK',    // Bank Nifty
      '^CNXIT',      // Nifty IT
      '^CNXAUTO',    // Nifty Auto
      '^CNXPHARMA',  // Nifty Pharma
      'INR=X',       // USD / INR
      'EURINR=X',    // EUR / INR
      'GC=F',        // Gold
      'SI=F',        // Silver
      'CL=F'         // Crude Oil
    ];

    const quotes: any[] = await yahooFinance.quote(symbols);

    const symbolMap: Record<string, string> = {
      '^NSEI': 'NIFTY 50',
      '^BSESN': 'SENSEX',
      '^NSEBANK': 'BANK NIFTY',
      '^CNXIT': 'NIFTY IT',
      '^CNXAUTO': 'NIFTY AUTO',
      '^CNXPHARMA': 'NIFTY PHARMA',
      'INR=X': 'USD/INR',
      'EURINR=X': 'EUR/INR',
      'GC=F': 'GOLD (10g)',
      'SI=F': 'SILVER',
      'CL=F': 'CRUDE OIL',
    };

    const formattedData = quotes.map((q) => {
      const changePercent = q.regularMarketChangePercent ?? 0;
      return {
        symbol: q.symbol,
        name: symbolMap[q.symbol] || q.shortName || q.symbol,
        value: formatPrice(q.regularMarketPrice),
        change: formatPercent(changePercent),
        isUp: changePercent >= 0,
      };
    });

    cachedMarketData = formattedData;
    lastFetchTime = now;

    return res.json(formattedData);
  } catch (error) {
    console.error('Yahoo Finance API Error:', error);

    if (cachedMarketData.length > 0) {
      return res.json(cachedMarketData);
    }

    return res.status(500).json({
      error: 'Failed to fetch market data',
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;