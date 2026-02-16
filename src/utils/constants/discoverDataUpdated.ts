/**
 * Updated Discover section dataset with proper icon support
 */

import { DiscoverData, DApp, DiscoverCategory } from '../types/discover.types';
import { getDAppIcon, getCategoryIcon } from './dappIcons';

// Helper function to create DApp with proper icon
const createDApp = (
  id: string,
  title: string,
  description: string,
  url: string,
  category: string,
  tags: string[],
  featured: boolean = false,
): DApp => ({
  id,
  title,
  description,
  url,
  icon: getDAppIcon(id),
  category,
  featured,
  tags,
});

// Helper function to create category
const createCategory = (
  id: string,
  name: string,
  displayName: string,
  description: string,
  dapps: DApp[],
): DiscoverCategory => ({
  id,
  name,
  displayName,
  icon: getCategoryIcon(id),
  description,
  dapps,
});

// Featured DApps
const featuredDApps: DApp[] = [
  createDApp(
    'uniswap',
    'Uniswap',
    'Leading decentralized exchange protocol',
    'https://app.uniswap.org',
    'dex',
    ['DEX', 'Trading', 'Ethereum'],
    true,
  ),
  createDApp(
    'aave',
    'Aave',
    'Decentralized lending and borrowing protocol',
    'https://app.aave.com',
    'lending',
    ['Lending', 'DeFi', 'Yield'],
    true,
  ),
  createDApp(
    'lido',
    'Lido Staking',
    'Liquid staking for Ethereum and other PoS chains',
    'https://lido.fi',
    'liquid-staking',
    ['Staking', 'Ethereum', 'Yield'],
    true,
  ),
  createDApp(
    'dydx',
    'dYdX',
    'Decentralized derivatives trading platform',
    'https://trade.dydx.exchange',
    'featured',
    ['Trading', 'Derivatives', 'Perpetuals'],
    true,
  ),
];

// Category definitions with DApps
const categories: DiscoverCategory[] = [
  createCategory(
    'featured',
    'featured',
    'Featured',
    'Top recommended DeFi protocols and applications',
    [
      ...featuredDApps,
      createDApp(
        'pendle',
        'Pendle',
        'Yield trading protocol for fixed and variable yields',
        'https://app.pendle.finance',
        'featured',
        ['Yield', 'Trading', 'DeFi'],
      ),
      createDApp(
        'instadapp',
        'Instadapp',
        'DeFi management platform and protocol',
        'https://instadapp.io',
        'featured',
        ['DeFi', 'Management', 'Protocol'],
      ),
      createDApp(
        'eigenlayer',
        'EigenLayer',
        'Restaking protocol for Ethereum',
        'https://app.eigenlayer.xyz',
        'featured',
        ['Restaking', 'Ethereum', 'Infrastructure'],
      ),
      createDApp(
        'aerodrome',
        'Aerodrome',
        'Next-generation AMM on Base',
        'https://aerodrome.finance',
        'featured',
        ['DEX', 'Base', 'AMM'],
      ),
      createDApp(
        'beefy',
        'Beefy',
        'Multi-chain yield optimizer',
        'https://beefy.finance',
        'featured',
        ['Yield', 'Multi-chain', 'Optimizer'],
      ),
      createDApp(
        'pancakeswap',
        'PancakeSwap',
        'Leading DEX on BNB Smart Chain',
        'https://pancakeswap.finance',
        'featured',
        ['DEX', 'BSC', 'Trading'],
      ),
      createDApp(
        'ens',
        'Ethereum Name Service',
        'Decentralized domain name system',
        'https://app.ens.domains',
        'featured',
        ['DNS', 'Identity', 'Ethereum'],
      ),
      createDApp(
        'makerdao',
        'MakerDAO',
        'Decentralized stablecoin protocol',
        'https://makerdao.com',
        'featured',
        ['Stablecoin', 'DeFi', 'DAI'],
      ),
    ],
  ),

  createCategory(
    'dex',
    'dex',
    'DEX',
    'Decentralized exchanges for token trading',
    [
      createDApp(
        'uniswap-dex',
        'Uniswap',
        'Leading decentralized exchange protocol',
        'https://app.uniswap.org',
        'dex',
        ['DEX', 'Trading', 'Ethereum'],
      ),
      createDApp(
        'pancakeswap-dex',
        'PancakeSwap',
        'Leading DEX on BNB Smart Chain',
        'https://pancakeswap.finance',
        'dex',
        ['DEX', 'BSC', 'Trading'],
      ),
      createDApp(
        'jupiter',
        'Jupiter Exchange',
        'Key liquidity aggregator for Solana',
        'https://jup.ag',
        'dex',
        ['DEX', 'Solana', 'Aggregator'],
      ),
      createDApp(
        'raydium-dex',
        'Raydium AMM',
        'Automated market maker on Solana',
        'https://raydium.io',
        'dex',
        ['DEX', 'Solana', 'AMM'],
      ),
      createDApp(
        'aerodrome-dex',
        'Aerodrome',
        'Next-generation AMM on Base',
        'https://aerodrome.finance',
        'dex',
        ['DEX', 'Base', 'AMM'],
      ),
      createDApp(
        '1inch',
        '1inch.io',
        'DEX aggregator for best prices',
        'https://1inch.io',
        'dex',
        ['Aggregator', 'DEX', 'Multi-chain'],
      ),
      createDApp(
        'balancer',
        'Balancer',
        'Automated portfolio manager and DEX',
        'https://app.balancer.fi',
        'dex',
        ['DEX', 'Portfolio', 'Multi-token'],
      ),
      createDApp(
        'sushi',
        'Sushi',
        'Multi-chain DEX and DeFi platform',
        'https://www.sushi.com',
        'dex',
        ['DEX', 'Multi-chain', 'DeFi'],
      ),
      createDApp(
        'quickswap',
        'Quickswap',
        'Leading DEX on Polygon',
        'https://quickswap.exchange',
        'dex',
        ['DEX', 'Polygon', 'Trading'],
      ),
    ],
  ),

  createCategory(
    'bsc',
    'bsc',
    'BSC',
    'BNB Smart Chain ecosystem applications',
    [
      createDApp(
        'venus',
        'Venus',
        'Lending and borrowing on BSC',
        'https://app.venus.io',
        'bsc',
        ['Lending', 'BSC', 'DeFi'],
      ),
      createDApp(
        'alpaca-finance',
        'Alpaca Finance',
        'Leveraged yield farming on BSC',
        'https://app.alpacafinance.org',
        'bsc',
        ['Yield Farming', 'Leverage', 'BSC'],
      ),
      createDApp(
        'beefy-yield',
        'Beefy',
        'Multi-chain yield optimizer',
        'https://beefy.finance',
        'bsc',
        ['Yield', 'Multi-chain', 'Optimizer'],
      ),
    ],
  ),

  createCategory(
    'solana',
    'solana',
    'Solana',
    'High-performance Solana ecosystem DApps',
    [
      createDApp(
        'jito',
        'Jito',
        'Liquid staking and MEV on Solana',
        'https://www.jito.network',
        'solana',
        ['Staking', 'MEV', 'Solana'],
      ),
      createDApp(
        'jupiter-solana',
        'Jupiter Exchange',
        'Key liquidity aggregator for Solana',
        'https://jup.ag',
        'solana',
        ['DEX', 'Solana', 'Aggregator'],
      ),
      createDApp(
        'kamino',
        'Kamino Finance',
        'Lending and yield optimization on Solana',
        'https://kamino.finance',
        'solana',
        ['Lending', 'Yield', 'Solana'],
      ),
      createDApp(
        'raydium-solana',
        'Raydium',
        'Automated market maker on Solana',
        'https://raydium.io',
        'solana',
        ['DEX', 'Solana', 'AMM'],
      ),
      createDApp(
        'marginfi',
        'Marginfi',
        'Decentralized lending on Solana',
        'https://www.marginfi.com',
        'solana',
        ['Lending', 'Solana', 'DeFi'],
      ),
    ],
  ),

  createCategory(
    'yield',
    'yield',
    'Yield',
    'Yield farming and optimization protocols',
    [
      createDApp(
        'beefy-yield',
        'Beefy',
        'Multi-chain yield optimizer',
        'https://beefy.finance',
        'yield',
        ['Yield', 'Multi-chain', 'Optimizer'],
      ),
      createDApp(
        'yearn',
        'Yearn.finance',
        'Yield aggregation protocol',
        'https://yearn.finance',
        'yield',
        ['Yield', 'Aggregation', 'DeFi'],
      ),
      createDApp(
        'convex',
        'Convex Finance',
        'Curve yield optimization',
        'https://www.convexfinance.com',
        'yield',
        ['Yield', 'Curve', 'Optimization'],
      ),
      createDApp(
        'harvest',
        'Harvest Finance',
        'Automated yield farming',
        'https://harvest.finance',
        'yield',
        ['Yield Farming', 'Automation', 'DeFi'],
      ),
    ],
  ),

  createCategory(
    'lending',
    'lending',
    'Lending',
    'Decentralized lending and borrowing protocols',
    [
      createDApp(
        'aave-lending',
        'Aave',
        'Leading decentralized lending protocol',
        'https://app.aave.com',
        'lending',
        ['Lending', 'DeFi', 'Protocol'],
      ),
      createDApp(
        'compound',
        'Compound Finance',
        'Algorithmic money markets',
        'https://app.compound.finance',
        'lending',
        ['Lending', 'Algorithmic', 'Markets'],
      ),
      createDApp(
        'morpho',
        'Morpho',
        'Optimized lending protocol',
        'https://app.morpho.xyz',
        'lending',
        ['Lending', 'Optimized', 'Protocol'],
      ),
      createDApp(
        'venus-lending',
        'Venus',
        'Lending protocol on BSC',
        'https://app.venus.io',
        'lending',
        ['Lending', 'BSC', 'Protocol'],
      ),
    ],
  ),

  createCategory(
    'liquid-staking',
    'liquid-staking',
    'Liquid Staking',
    'Liquid staking protocols for various chains',
    [
      createDApp(
        'lido-staking',
        'Lido Staking',
        'Liquid staking for Ethereum and other PoS chains',
        'https://lido.fi',
        'liquid-staking',
        ['Staking', 'Ethereum', 'Liquid'],
      ),
      createDApp(
        'rocket-pool',
        'Rocket Pool',
        'Decentralized Ethereum staking protocol',
        'https://rocketpool.net',
        'liquid-staking',
        ['Staking', 'Ethereum', 'Decentralized'],
      ),
      createDApp(
        'binance-staked-eth',
        'Binance staked ETH',
        'Binance liquid staking for Ethereum',
        'https://www.binance.com/en/eth2',
        'liquid-staking',
        ['Staking', 'Ethereum', 'Binance'],
      ),
      createDApp(
        'marinade',
        'Marinade',
        'Liquid staking for Solana',
        'https://marinade.finance',
        'liquid-staking',
        ['Staking', 'Solana', 'Liquid'],
      ),
      createDApp(
        'jito-staking',
        'Jito',
        'Liquid staking and MEV on Solana',
        'https://www.jito.network',
        'liquid-staking',
        ['Staking', 'MEV', 'Solana'],
      ),
    ],
  ),

  createCategory(
    'marketplaces',
    'marketplaces',
    'Marketplaces',
    'NFT and digital asset marketplaces',
    [
      createDApp(
        'blur',
        'Blur',
        'Professional NFT trading platform',
        'https://blur.io',
        'marketplaces',
        ['NFT', 'Trading', 'Professional'],
      ),
      createDApp(
        'magic-eden',
        'Magic Eden',
        'Leading Solana NFT marketplace',
        'https://magiceden.io',
        'marketplaces',
        ['NFT', 'Solana', 'Marketplace'],
      ),
      createDApp(
        'opensea',
        'OpenSea',
        'Largest NFT marketplace',
        'https://opensea.io',
        'marketplaces',
        ['NFT', 'Marketplace', 'Largest'],
      ),
      createDApp(
        'rarible',
        'Rarible',
        'Creator-centric NFT marketplace',
        'https://rarible.com',
        'marketplaces',
        ['NFT', 'Creator', 'Marketplace'],
      ),
    ],
  ),

  createCategory(
    'games',
    'games',
    'Games',
    'Blockchain gaming and metaverse platforms',
    [
      createDApp(
        'axie-infinity',
        'Axie Infinity',
        'Play-to-earn creature collection game',
        'https://axieinfinity.com',
        'games',
        ['Play-to-earn', 'NFT', 'Gaming'],
      ),
      createDApp(
        'pixels',
        'Pixels',
        'Social farming metaverse game',
        'https://pixels.xyz',
        'games',
        ['Metaverse', 'Farming', 'Social'],
      ),
      createDApp(
        'alien-worlds',
        'Alien Worlds',
        'NFT DeFi metaverse game',
        'https://alienworlds.io',
        'games',
        ['Metaverse', 'NFT', 'DeFi'],
      ),
    ],
  ),

  createCategory(
    'social',
    'social',
    'Social',
    'Decentralized social and community platforms',
    [
      createDApp(
        'lens-protocol',
        'Lens Protocol',
        'Decentralized social graph protocol',
        'https://lens.xyz',
        'social',
        ['Social', 'Protocol', 'Decentralized'],
      ),
      createDApp(
        'galxe',
        'Galxe',
        'Web3 community building platform',
        'https://galxe.com',
        'social',
        ['Community', 'Web3', 'Credentials'],
      ),
    ],
  ),
];

// Main discover data export
export const discoverData: DiscoverData = {
  categories,
  featured: featuredDApps,
};

// Helper functions
export const getCategoryById = (id: string): DiscoverCategory | undefined => {
  return categories.find(category => category.id === id);
};

export const getDAppById = (id: string): DApp | undefined => {
  for (const category of categories) {
    const dapp = category.dapps.find(dapp => dapp.id === id);
    if (dapp) return dapp;
  }
  return undefined;
};

export const searchDApps = (query: string): DApp[] => {
  const lowercaseQuery = query.toLowerCase();
  const results: DApp[] = [];

  for (const category of categories) {
    for (const dapp of category.dapps) {
      if (
        dapp.title.toLowerCase().includes(lowercaseQuery) ||
        dapp.description.toLowerCase().includes(lowercaseQuery) ||
        dapp.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      ) {
        results.push(dapp);
      }
    }
  }

  return results;
};

export const getDAppsByCategory = (categoryId: string): DApp[] => {
  const category = getCategoryById(categoryId);
  return category ? category.dapps : [];
};
