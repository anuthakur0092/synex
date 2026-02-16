/**
 * DApp icon mapping for discover section
 * Maps DApp IDs to their respective icon sources (local assets or remote URLs)
 */

// Local asset imports
const binanceIcon = require('../../assets/tokens/binance.png');
const ethereumIcon = require('../../assets/tokens/ethereum.png');
const polygonIcon = require('../../assets/tokens/polygon.png');
const yoexIcon = require('../../assets/app_icon.png');
const oxylonIcon = require('../../assets/app_new_icon_dapp.png');

export interface IconSource {
  type: 'local' | 'remote' | 'emoji';
  source: any; // Local asset or URL string or emoji string
}

// Icon mapping for DApps
export const dappIconMap: Record<string, IconSource> = {
  // oxylon
  // Featured DApps
  uniswap: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
  },
  aave: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png',
  },
  lido: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8085.png',
  },
  dydx: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28324.png',
  },
  pendle: {
    type: 'remote',
    source:
      'https://assets.coingecko.com/coins/images/15069/large/Pendle_Logo_Normal-03.png',
  },

  // DEX
  'uniswap-dex': {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
  },
  pancakeswap: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png',
  },
  'pancakeswap-dex': {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7186.png',
  },
  jupiter: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png',
  },
  raydium: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8526.png',
  },
  'raydium-dex': {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8526.png',
  },
  aerodrome: {
    type: 'remote',
    source: 'https://assets.coingecko.com/coins/images/31745/large/token.png',
  },
  'aerodrome-dex': {
    type: 'remote',
    source: 'https://assets.coingecko.com/coins/images/31745/large/token.png',
  },
  sushi: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6758.png',
  },
  '1inch': {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8104.png',
  },
  balancer: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5728.png',
  },
  quickswap: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/19966.png',
  },

  // BSC
  venus: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7288.png',
  },
  'venus-lending': {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7288.png',
  },
  'alpaca-finance': {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8707.png',
  },
  beefy: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7311.png',
  },
  'beefy-yield': {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7311.png',
  },

  // Solana
  // jito: {
  //   type: 'remote',
  //   source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28541.png',
  // },
  // 'jito-staking': {
  //   type: 'remote',
  //   source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28541.png',
  // },
  // 'jupiter-solana': {
  //   type: 'remote',
  //   source: 'https://assets.coingecko.com/coins/images/10351/large/jupiter.png',
  // },
  // kamino: {
  //   type: 'remote',
  //   source: 'https://assets.coingecko.com/coins/images/32279/large/kamino.png',
  // },
  // 'kamino-lending': {
  //   type: 'remote',
  //   source: 'https://assets.coingecko.com/coins/images/32279/large/kamino.png',
  // },
  // 'raydium-solana': {
  //   type: 'remote',
  //   source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8526.png',
  // },
  // orca: {
  //   type: 'remote',
  //   source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11165.png',
  // },
  // marginfi: {
  //   type: 'remote',
  //   source:
  //     'https://assets.coingecko.com/coins/images/29419/large/MRGN_token.png',
  // },

  // Yield
  yearn: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5864.png',
  },
  convex: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/9903.png',
  },
  harvest: {
    type: 'remote',
    source: 'https://assets.coingecko.com/coins/images/12304/large/Harvest.png',
  },

  // Lending
  'aave-lending': {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/7278.png',
  },
  compound: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5692.png',
  },
  morpho: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/34104.png',
  },
  'morpho-lending': {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/34104.png',
  },
  cream: {
    type: 'remote',
    source: 'https://cryptologos.cc/logos/cream-finance-cream-logo.png',
  },

  // Liquid Staking
  'lido-staking': {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/8000.png',
  },
  'rocket-pool': {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/2943.png',
  },
  'binance-staked-eth': {
    type: 'local',
    source: binanceIcon,
  },
  marinade: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/13803.png',
  },
  'frax-ether': {
    type: 'remote',
    source: 'https://cryptologos.cc/logos/frax-share-fxs-logo.png',
  },
  stader: {
    type: 'remote',
    source: 'https://assets.coingecko.com/coins/images/20059/large/stader.png',
  },

  // Marketplaces
  blur: {
    type: 'remote',
    source: 'https://assets.coingecko.com/coins/images/28453/large/blur.png',
  },
  // 'magic-eden': {
  //   type: 'remote',
  //   source:
  //     'https://assets.coingecko.com/coins/images/27655/large/magic-eden.png',
  // },
  opensea: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/35744.png',
  },
  rarible: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5877.png',
  },

  // Games
  'axie-infinity': {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/6783.png',
  },
  pixels: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/29335.png',
  },

  // Social
  'lens-protocol': {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/32327.png',
  },
  galxe: {
    type: 'remote',
    source:
      'https://ipfs.sintral.me/cdn-cgi/image/width=480,quality=100,format=webp/ipfs/bafkreietibze7oygite2hod3ckdgnqf2u6o5ov7zov67eoyd5mvlad3tke',
  },

  // Other major protocols
  instadapp: {
    type: 'remote',
    source:
      'https://github.com/Instadapp/brand/blob/master/Instadapp/png/blue_sign.png?raw=true',
  },
  'instadapp-yield': {
    type: 'remote',
    source:
      'https://github.com/Instadapp/brand/blob/master/Instadapp/png/blue_sign.png?raw=true',
  },
  'instadapp-lending': {
    type: 'remote',
    source:
      'https://github.com/Instadapp/brand/blob/master/Instadapp/png/blue_sign.png?raw=true',
  },

  ens: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/13855.png',
  },
  eigenlayer: {
    type: 'remote',
    source: 'https://s2.coinmarketcap.com/static/img/coins/64x64/30494.png',
  },
  curve: {
    type: 'remote',
    source: 'https://cryptologos.cc/logos/curve-dao-token-crv-logo.png',
  },
  yoex: {
    type: 'local',
    source: yoexIcon,
  },
  oxylon: {
    type: 'local',
    source: oxylonIcon,
  },
};

// Default fallback icons for categories
export const categoryFallbackIcons: Record<string, IconSource> = {
  featured: { type: 'emoji', source: '⭐' },
  dex: { type: 'emoji', source: '🔄' },
  bsc: { type: 'local', source: binanceIcon },
  solana: { type: 'emoji', source: '☀️' },
  yield: { type: 'emoji', source: '📈' },
  games: { type: 'emoji', source: '🎮' },
  social: { type: 'emoji', source: '👥' },
  marketplaces: { type: 'emoji', source: '🛒' },
  'liquid-staking': { type: 'emoji', source: '💧' },
  sonic: { type: 'emoji', source: '🔊' },
  lending: { type: 'emoji', source: '🏦' },
};

// Function to get icon source for a DApp
export const getDAppIcon = (dappId: string): IconSource => {
  return dappIconMap[dappId] || { type: 'emoji', source: '🌐' };
};

// Function to get category icon
export const getCategoryIcon = (categoryId: string): IconSource => {
  return categoryFallbackIcons[categoryId] || { type: 'emoji', source: '📱' };
};
