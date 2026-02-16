import { TokenListByChain } from '../types/token.types';

// Dummy Ethereum token list placeholder. The user will replace/extend this.
// Keep essential fields for transactions.
export const ETHEREUM_TOKEN_LIST: TokenListByChain = {
  chainId: 1,
  tokens: [
    {
      // Stablecoins
      chainId: 1,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      logoURI:
        'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
      tags: ['stablecoin'],
    },
    {
      chainId: 1,
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      logoURI:
        'https://assets.coingecko.com/coins/images/325/small/Tether-logo.png',
      tags: ['stablecoin'],
    },
    {
      chainId: 1,
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      name: 'Dai',
      symbol: 'DAI',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png',
      tags: ['stablecoin'],
    },

    {
      chainId: 1,
      address: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
      name: 'Binance USD',
      symbol: 'BUSD',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/9576/small/BUSD.png',
      tags: ['stablecoin'],
    },
    {
      chainId: 1,
      address: '0x8E870D67F660D95d5be530380D0eC0bd388289E1',
      name: 'Pax Dollar',
      symbol: 'USDP',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/6013/small/Pax_Dollar.png',
      tags: ['stablecoin'],
    },
    {
      chainId: 1,
      address: '0x0000000000085d4780B73119b644AE5ecd22b376',
      name: 'TrueUSD',
      symbol: 'TUSD',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/3449/small/tusd.png',
      tags: ['stablecoin'],
    },

    // Wrapped Assets
    {
      chainId: 1,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
      tags: ['wrapped'],
    },
    {
      chainId: 1,
      address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
      logoURI:
        'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
      tags: ['wrapped', 'bitcoin'],
    },
    {
      chainId: 1,
      address: '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D',
      name: 'renBTC',
      symbol: 'renBTC',
      decimals: 8,
      logoURI:
        'https://assets.coingecko.com/coins/images/11370/small/Bitcoin.jpg',
      tags: ['wrapped', 'bitcoin'],
    },

    // DeFi Tokens
    {
      chainId: 1,
      address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      name: 'ChainLink Token',
      symbol: 'LINK',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
      tags: ['defi', 'oracle'],
    },
    {
      chainId: 1,
      address: '0x1f9840a85d5aF5bf1d1762F925BDADdC4201F984',
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
      tags: ['defi', 'dex'],
    },
    {
      chainId: 1,
      address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
      name: 'Aave Token',
      symbol: 'AAVE',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
      tags: ['defi', 'lending'],
    },
    {
      chainId: 1,
      address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
      name: 'Maker',
      symbol: 'MKR',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png',
      tags: ['defi', 'governance'],
    },
    {
      chainId: 1,
      address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
      name: 'SushiToken',
      symbol: 'SUSHI',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12271/small/512x512_Logo_no_chop.png',
      tags: ['defi', 'dex'],
    },
    {
      chainId: 1,
      address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
      name: 'Compound',
      symbol: 'COMP',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/10775/small/COMP.png',
      tags: ['defi', 'lending'],
    },
    {
      chainId: 1,
      address: '0xD533a949740bb3306d119CC777fa900bA034cd52',
      name: 'Curve DAO Token',
      symbol: 'CRV',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12124/small/Curve.png',
      tags: ['defi', 'dex'],
    },
    {
      chainId: 1,
      address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
      name: 'Synthetix Network Token',
      symbol: 'SNX',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/3406/small/SNX.png',
      tags: ['defi', 'derivatives'],
    },
    {
      chainId: 1,
      address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
      name: 'yearn.finance',
      symbol: 'YFI',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/11849/small/yfi-192x192.png',
      tags: ['defi', 'yield'],
    },

    {
      chainId: 1,
      address: '0x111111111117dC0aa78b770fA6A738034120C302',
      name: '1inch Token',
      symbol: '1INCH',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/13469/small/1inch-token.png',
      tags: ['defi', 'dex-aggregator'],
    },
    {
      chainId: 1,
      address: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
      name: 'Ethereum Name Service',
      symbol: 'ENS',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/19785/small/acatxTm8_400x400.jpg',
      tags: ['infrastructure'],
    },
    {
      chainId: 1,
      address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
      name: 'ApeCoin',
      symbol: 'APE',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/24383/small/apecoin.jpg',
      tags: ['nft', 'metaverse'],
    },

    // Layer 2 & Sidechains
    {
      chainId: 1,
      address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
      name: 'Matic Token',
      symbol: 'MATIC',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
      tags: ['layer2'],
    },
    {
      chainId: 1,
      address: '0x4200000000000000000000000000000000000042',
      name: 'Optimism',
      symbol: 'OP',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
      tags: ['layer2'],
    },
    {
      chainId: 1,
      address: '0x42bBFa2e77757C645eeaAd1655E0911a7553Efbc',
      name: 'Boba Network',
      symbol: 'BOBA',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/20285/small/BOBA.png',
      tags: ['layer2'],
    },

    // Meme Coins
    {
      chainId: 1,
      address: '0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE',
      name: 'SHIBA INU',
      symbol: 'SHIB',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
      tags: ['meme'],
    },

    {
      chainId: 1,
      address: '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
      name: 'Pepe',
      symbol: 'PEPE',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
      tags: ['meme'],
    },

    // Gaming & Metaverse
    {
      chainId: 1,
      address: '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c',
      name: 'Enjin Coin',
      symbol: 'ENJ',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/1102/small/enjin-coin-logo.png',
      tags: ['gaming', 'nft'],
    },
    {
      chainId: 1,
      address: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
      name: 'The Sandbox',
      symbol: 'SAND',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12129/small/sandbox_logo.jpg',
      tags: ['gaming', 'metaverse'],
    },
    {
      chainId: 1,
      address: '0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b',
      name: 'Axie Infinity',
      symbol: 'AXS',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/13029/small/axie_infinity_logo.png',
      tags: ['gaming', 'nft'],
    },
    {
      chainId: 1,
      address: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
      name: 'Decentraland',
      symbol: 'MANA',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png',
      tags: ['gaming', 'metaverse'],
    },
    {
      chainId: 1,
      address: '0x4E15361FD6b4BB609Fa63C81A2be19d873717870',
      name: 'Fantom',
      symbol: 'FTM',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/4001/small/Fantom.png',
      tags: ['infrastructure'],
    },

    // Exchange Tokens
    {
      chainId: 1,
      address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
      tags: ['exchange'],
    },
    {
      chainId: 1,
      address: '0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3',
      name: 'LEO Token',
      symbol: 'LEO',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/8418/small/leo-token.png',
      tags: ['exchange'],
    },
    {
      chainId: 1,
      address: '0x6f259637dcD74C767781E37Bc6133cd6A68aa161',
      name: 'HuobiToken',
      symbol: 'HT',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/2822/small/huobi-token-logo.png',
      tags: ['exchange'],
    },
    {
      chainId: 1,
      address: '0x8290333ceF9e6D528dD5618Fb97a76f268f3EDD4',
      name: 'Ankr',
      symbol: 'ANKR',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/4324/small/U85xTl2.png',
      tags: ['infrastructure'],
    },

    // Infrastructure & Utility
    {
      chainId: 1,
      address: '0x6810e776880C02933D47DB1b9fc05908e5386b96',
      name: 'Gnosis',
      symbol: 'GNO',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/662/small/logo_square_simple_300px.png',
      tags: ['infrastructure'],
    },
    {
      chainId: 1,
      address: '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07',
      name: 'OMG Network',
      symbol: 'OMG',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/776/small/OMG_Network.jpg',
      tags: ['infrastructure'],
    },

    {
      chainId: 1,
      address: '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
      name: '0x Protocol',
      symbol: 'ZRX',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/863/small/0x.png',
      tags: ['infrastructure'],
    },
    {
      chainId: 1,
      address: '0xc944E90C64B2c07662A292be6244BDf05Cda44a7',
      name: 'Graph Token',
      symbol: 'GRT',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png',
      tags: ['infrastructure'],
    },

    {
      chainId: 1,
      address: '0x0391D2021f89DC339F60Fff84546EA23E337750f',
      name: 'BarnBridge',
      symbol: 'BOND',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12811/small/barnbridge.jpg',
      tags: ['defi'],
    },
    {
      chainId: 1,
      address: '0x221657776846890989a759BA2973e427DfF5C9bB',
      name: 'Reputation',
      symbol: 'REPv2',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/309/small/REP.png',
      tags: ['prediction-market'],
    },

    {
      chainId: 1,
      address: '0xDDB3422497E61e13543BeA06989C0789117555c5',
      name: 'COTI',
      symbol: 'COTI',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/2962/small/Coti.png',
      tags: ['payments'],
    },

    // Algorithmic Stablecoins
    {
      chainId: 1,
      address: '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
      name: 'Frax Share',
      symbol: 'FXS',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/13423/small/frax_share.png',
      tags: ['defi', 'stablecoin-protocol'],
    },
    {
      chainId: 1,
      address: '0x956F47F50A910163D8BF957Cf5846D573E7f87CA',
      name: 'Fei USD',
      symbol: 'FEI',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/14570/small/ZqsF51Re_400x400.png',
      tags: ['stablecoin'],
    },
    {
      chainId: 1,
      address: '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828',
      name: 'UMA',
      symbol: 'UMA',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/10951/small/UMA.png',
      tags: ['defi', 'derivatives'],
    },

    // Data & AI Tokens
    {
      chainId: 1,
      address: '0xFE18be6b3Bd88A2D2A7f928d00292E7a9963CfC6',
      name: 'Fetch.ai',
      symbol: 'FET',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/5681/small/Fetch.jpg',
      tags: ['ai', 'data'],
    },
    {
      chainId: 1,
      address: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',
      name: 'Loopring',
      symbol: 'LRC',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/913/small/LRC.png',
      tags: ['layer2', 'dex'],
    },
    {
      chainId: 1,
      address: '0xc770EEfAd204B5180dF6a14Ee197D99d808ee52d',
      name: 'Perpetual Protocol',
      symbol: 'PERP',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12381/small/60d18e06844a844ad75901a9_mark_only_03.png',
      tags: ['defi', 'derivatives'],
    },
    {
      chainId: 1,
      address: '0x9E32b13ce7f2E80A01932B42553652E053D6ed8e',
      name: 'Metis',
      symbol: 'METIS',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/15595/small/metis.jpeg',
      tags: ['layer2'],
    },
    {
      chainId: 1,
      address: '0xF57e7e7C23978C3cAEC3C3548E3D615c346e79fF',
      name: 'Immutable X',
      symbol: 'IMX',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/17233/small/imx.png',
      tags: ['layer2', 'nft'],
    },

    // Social Tokens
    {
      chainId: 1,
      address: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
      name: 'Basic Attention Token',
      symbol: 'BAT',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/677/small/basic-attention-token.png',
      tags: ['advertising'],
    },
    {
      chainId: 1,
      address: '0x4691937a7508860F876c9c0a2a617E7d9E945D4B',
      name: 'Woo Network',
      symbol: 'WOO',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12921/small/w2UiemF__400x400.jpg',
      tags: ['dex'],
    },

    // Additional DeFi Protocols
    {
      chainId: 1,
      address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
      name: 'Lido DAO',
      symbol: 'LDO',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png',
      tags: ['defi', 'staking'],
    },
    {
      chainId: 1,
      address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
      name: 'Lido Staked ETH',
      symbol: 'stETH',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/13442/small/steth_logo.png',
      tags: ['defi', 'staking'],
    },
    {
      chainId: 1,
      address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      name: 'Wrapped stETH',
      symbol: 'wstETH',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/18834/small/wstETH.png',
      tags: ['defi', 'staking'],
    },
    {
      chainId: 1,
      address: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
      name: 'Coinbase Wrapped Staked ETH',
      symbol: 'cbETH',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/27008/small/cbeth.png',
      tags: ['defi', 'staking'],
    },

    {
      chainId: 1,
      address: '0xA8b919680258d369114910511cc87595aec0be6D',
      name: 'LUKSO',
      symbol: 'LYXe',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/11423/small/LYX.png',
      tags: ['infrastructure'],
    },
    {
      chainId: 1,
      address: '0x5fAa989Af96Af85384b8a938c2EdE4A7378D9875',
      name: 'Project Galaxy',
      symbol: 'GAL',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/24530/small/GAL-Token-Icon.png',
      tags: ['web3'],
    },

    {
      chainId: 1,
      address: '0x467719aD09025FcC6cF6F8311755809d45a5E5f3',
      name: 'Axl Inu',
      symbol: 'AXL',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/27277/small/V-65_xQ1_400x400.jpeg',
      tags: ['meme'],
    },
    {
      chainId: 1,
      address: '0x43Dfc4159D86F3A37A5A4B3D4580b888ad7d4DDd',
      name: 'DODO',
      symbol: 'DODO',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12651/small/dodo_logo.png',
      tags: ['defi', 'dex'],
    },
    {
      chainId: 1,
      address: '0xa1faa113cbE53436Df28FF0aEe54275c13B40975',
      name: 'Alpha Finance Lab',
      symbol: 'ALPHA',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12738/small/AlphaToken_256x256.png',
      tags: ['defi'],
    },
    {
      chainId: 1,
      address: '0x0f2D719407FdBeFF09D87557AbB7232601FD9F29',
      name: 'Synapse',
      symbol: 'SYN',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/18024/small/syn.png',
      tags: ['bridge'],
    },
    {
      chainId: 1,
      address: '0x674C6Ad92Fd080e4004b2312b45f796a192D27a0',
      name: 'Neutrino USD',
      symbol: 'USDN',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/10117/small/78GWcZu.png',
      tags: ['stablecoin'],
    },
    {
      chainId: 1,
      address: '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E',
      name: 'Status',
      symbol: 'SNT',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/779/small/status.png',
      tags: ['social'],
    },
    {
      chainId: 1,
      address: '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B',
      name: 'Convex Finance',
      symbol: 'CVX',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/15585/small/convex.png',
      tags: ['defi'],
    },
    {
      chainId: 1,
      address: '0x6DEA81C8171D0bA574754EF6F8b412F2Ed88c54D',
      name: 'Liquity',
      symbol: 'LQTY',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/14665/small/200-lqty-icon.png',
      tags: ['defi'],
    },
    {
      chainId: 1,
      address: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
      name: 'LUSD Stablecoin',
      symbol: 'LUSD',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/14666/small/Group_3.png',
      tags: ['stablecoin'],
    },
    {
      chainId: 1,
      address: '0x31c8EAcBFFdD875c74b94b077895Bd78CF1E64A3',
      name: 'Radicle',
      symbol: 'RAD',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/14013/small/radicle.png',
      tags: ['dao'],
    },
    {
      chainId: 1,
      address: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E',
      name: 'crvUSD',
      symbol: 'crvUSD',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/30118/small/crvusd.jpeg',
      tags: ['stablecoin'],
    },
    {
      chainId: 1,
      address: '0xAC51066d7bEC65Dc4589368da368b212745d63E8',
      name: 'ALICE',
      symbol: 'ALICE',
      decimals: 6,
      logoURI:
        'https://assets.coingecko.com/coins/images/14375/small/alice_logo.jpg',
      tags: ['gaming'],
    },
    {
      chainId: 1,
      address: '0x7420B4b9a0110cdC71fB720908340C03F9Bc03EC',
      name: 'JasmyCoin',
      symbol: 'JASMY',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/13876/small/JASMY200x200.jpg',
      tags: ['iot'],
    },
    {
      chainId: 1,
      address: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
      name: 'PoolTogether',
      symbol: 'POOL',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/14003/small/PoolTogether.png',
      tags: ['defi'],
    },
    {
      chainId: 1,
      address: '0xd084B83C305daFD76AE3E1b4E1F1fe2eCcCb3988',
      name: 'Tribe',
      symbol: 'TRIBE',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/14575/small/tribe.PNG',
      tags: ['defi'],
    },
    {
      chainId: 1,
      address: '0xbc396689893D065F41bc2C6EcbeE5e0085233447',
      name: 'Perpetual',
      symbol: 'PERP',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12381/small/60d18e06844a844ad75901a9_mark_only_03.png',
      tags: ['defi', 'derivatives'],
    },
    {
      chainId: 1,
      address: '0x967da4048cD07aB37855c090aAF366e4ce1b9F48',
      name: 'Ocean Protocol',
      symbol: 'OCEAN',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/3687/small/ocean-protocol-logo.jpg',
      tags: ['data'],
    },
    {
      chainId: 1,
      address: '0xC581b735A1688071A1746c968e0798D642EDE491',
      name: 'Euro Tether',
      symbol: 'EURT',
      decimals: 6,
      logoURI:
        'https://assets.coingecko.com/coins/images/17385/small/Tether_new.png',
      tags: ['stablecoin'],
    },
    {
      chainId: 1,
      address: '0x491604c0FDF08347Dd1fa4Ee062a822A5DD06B5D',
      name: 'Cartesi',
      symbol: 'CTSI',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/11038/small/cartesi.png',
      tags: ['infrastructure'],
    },
    {
      chainId: 1,
      address: '0x6B0b3a982b4634aC68dD83a4DBF02311cE324181',
      name: 'Alethea AI',
      symbol: 'ALI',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/22062/small/alethea-logo-transparent-colored.png',
      tags: ['ai', 'nft'],
    },
    {
      chainId: 1,
      address: '0x4a220E6096B25EADb88358cb44068A3248254675',
      name: 'Quant',
      symbol: 'QNT',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/3370/small/5ZOu7brX_400x400.jpg',
      tags: ['infrastructure'],
    },
    {
      chainId: 1,
      address: '0x6c6EE5e31d828De241282B9606C8e98Ea48526E2',
      name: 'Holo',
      symbol: 'HOT',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/3348/small/Holologo_Profile.png',
      tags: ['infrastructure'],
    },
  ],
};
//0x4e842b78e401078a09319b73f5bcd9916ecb1699
export const BSC_TOKEN_LIST: TokenListByChain = {
  chainId: 56,
  tokens: [
    {
      chainId: 56,
      address: '0xbCA067Ee0042101bb44e91CdcC2EA3F22E377742',
      name: 'OXYLON',
      symbol: 'OXL',
      decimals: 18,
      logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/38164.png',
      tags: ['native', 'wallet'],
    },
    {
      // Native & Wrapped
      chainId: 56,
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      name: 'Wrapped BNB',
      symbol: 'WBNB',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
      tags: ['wrapped', 'native'],
    },
    {
      chainId: 56,
      address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      name: 'Ethereum Token',
      symbol: 'ETH',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
      tags: ['wrapped'],
    },
    {
      chainId: 56,
      address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c',
      name: 'BTCB Token',
      symbol: 'BTCB',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/14108/small/Binance-bitcoin.png',
      tags: ['wrapped', 'bitcoin'],
    },

    // Stablecoins
    {
      chainId: 56,
      address: '0x55d398326f99059fF775485246999027B3197955',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/325/small/Tether-logo.png',
      tags: ['stablecoin'],
    },
    {
      chainId: 56,
      address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
      tags: ['stablecoin'],
    },
    {
      chainId: 56,
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      name: 'BUSD Token',
      symbol: 'BUSD',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/9576/small/BUSD.png',
      tags: ['stablecoin'],
    },
    {
      chainId: 56,
      address: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
      name: 'Dai Token',
      symbol: 'DAI',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png',
      tags: ['stablecoin'],
    },
    {
      chainId: 56,
      address: '0x14016E85a25aeb13065688cAFB43044C2ef86784',
      name: 'TrueUSD',
      symbol: 'TUSD',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/3449/small/tusd.png',
      tags: ['stablecoin'],
    },

    // PancakeSwap Ecosystem
    {
      chainId: 56,
      address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
      name: 'PancakeSwap Token',
      symbol: 'CAKE',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo_%281%29.png',
      tags: ['defi', 'dex'],
    },

    // DeFi Tokens
    {
      chainId: 56,
      address: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
      tags: ['defi', 'dex'],
    },
    {
      chainId: 56,
      address: '0xfb6115445Bff7b52FeB98650C87f44907E58f802',
      name: 'Aave Token',
      symbol: 'AAVE',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
      tags: ['defi', 'lending'],
    },
    {
      chainId: 56,
      address: '0x947950BcC74888a40Ffa2593C5798F11Fc9124C4',
      name: 'SushiToken',
      symbol: 'SUSHI',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12271/small/512x512_Logo_no_chop.png',
      tags: ['defi', 'dex'],
    },
    {
      chainId: 56,
      address: '0x52CE071Bd9b1C4B00A0b92D298c512478CaD67e8',
      name: 'Compound',
      symbol: 'COMP',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/10775/small/COMP.png',
      tags: ['defi', 'lending'],
    },
    {
      chainId: 56,
      address: '0x5f0Da599BB2ccCfcf6Fdfd7D81743B6020864350',
      name: 'Maker',
      symbol: 'MKR',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png',
      tags: ['defi', 'governance'],
    },
    {
      chainId: 56,
      address: '0x111111111117dC0aa78b770fA6A738034120C302',
      name: '1inch Token',
      symbol: '1INCH',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/13469/small/1inch-token.png',
      tags: ['defi', 'dex-aggregator'],
    },
    {
      chainId: 56,
      address: '0xa2B726B1145A4773F68593CF171187d8EBe4d495',
      name: 'Injective Protocol',
      symbol: 'INJ',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12882/small/Secondary_Symbol.png',
      tags: ['defi', 'derivatives'],
    },
    {
      chainId: 56,
      address: '0xCa3F508B8e4Dd382eE878A314789373D80A5190A',
      name: 'beefy.finance',
      symbol: 'BIFI',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12704/small/token_profile_bifi.png',
      tags: ['defi', 'yield'],
    },
    {
      chainId: 56,
      address: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
      name: 'BakeryToken',
      symbol: 'BAKE',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12588/small/bakerytoken_logo.jpg',
      tags: ['defi', 'dex'],
    },

    {
      chainId: 56,
      address: '0xcF6BB5389c92Bdda8a3747Ddb454cB7a64626C63',
      name: 'Venus',
      symbol: 'XVS',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12677/small/venus.png',
      tags: ['defi', 'lending'],
    },
    {
      chainId: 56,
      address: '0x0Eb3a705fc54725037CC9e008bDede697f62F335',
      name: 'Cosmos Token',
      symbol: 'ATOM',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png',
      tags: ['cosmos'],
    },
    {
      chainId: 56,
      address: '0x88f1A5ae2A3BF98AEAF342D26B30a79438c9142e',
      name: 'yearn.finance',
      symbol: 'YFI',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/11849/small/yfi-192x192.png',
      tags: ['defi', 'yield'],
    },
    {
      chainId: 56,
      address: '0xa1faa113cbE53436Df28FF0aEe54275c13B40975',
      name: 'AlphaToken',
      symbol: 'ALPHA',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12738/small/AlphaToken_256x256.png',
      tags: ['defi'],
    },
    {
      chainId: 56,
      address: '0x67ee3Cb086F8a16f34beE3ca72FAD36F7Db929e2',
      name: 'DODO bird',
      symbol: 'DODO',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12651/small/dodo_logo.png',
      tags: ['defi', 'dex'],
    },

    // BSC Native Projects
    {
      chainId: 56,
      address: '0x965F527D9159dCe6288a2219DB51fc6Eef120dD1',
      name: 'Biswap',
      symbol: 'BSW',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/16845/small/biswap.png',
      tags: ['defi', 'dex'],
    },
    {
      chainId: 56,
      address: '0xD41FDb03Ba84762dD66a0af1a6C8540FF1ba5dfb',
      name: 'SafePal',
      symbol: 'SFP',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/13905/small/sfp.png',
      tags: ['wallet'],
    },
    {
      chainId: 56,
      address: '0x8519EA49c997f50cefFa444d240fB655e89248Aa',
      name: 'RAMP',
      symbol: 'RAMP',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12837/small/RAMP-Logo-v2-1000pxsq.png',
      tags: ['defi'],
    },
    {
      chainId: 56,
      address: '0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD',
      name: 'ChainLink Token',
      symbol: 'LINK',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
      tags: ['defi', 'oracle'],
    },
    {
      chainId: 56,
      address: '0xAD6cAEb32CD2c308980a548bD0Bc5AA4306c6c18',
      name: 'Band Protocol Token',
      symbol: 'BAND',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/9545/small/band-protocol.png',
      tags: ['defi', 'oracle'],
    },
    {
      chainId: 56,
      address: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE',
      name: 'XRP Token',
      symbol: 'XRP',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
      tags: ['payments'],
    },
    {
      chainId: 56,
      address: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47',
      name: 'Cardano Token',
      symbol: 'ADA',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/975/small/cardano.png',
      tags: ['smart-contract'],
    },
    {
      chainId: 56,
      address: '0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402',
      name: 'Polkadot Token',
      symbol: 'DOT',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
      tags: ['smart-contract'],
    },
    {
      chainId: 56,
      address: '0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153',
      name: 'Filecoin',
      symbol: 'FIL',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12817/small/filecoin.png',
      tags: ['storage'],
    },
    {
      chainId: 56,
      address: '0xbA2aE424d960c26247Dd6c32edC70B295c744C43',
      name: 'Dogecoin',
      symbol: 'DOGE',
      decimals: 8,
      logoURI: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
      tags: ['meme'],
    },
    {
      chainId: 56,
      address: '0x2859e4544C4bB03966803b044A93563Bd2D0DD4D',
      name: 'SHIBA INU',
      symbol: 'SHIB',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
      tags: ['meme'],
    },
    {
      chainId: 56,
      address: '0xCC42724C6683B7E57334c4E856f4c9965ED682bD',
      name: 'Matic Token',
      symbol: 'MATIC',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
      tags: ['layer2'],
    },
    {
      chainId: 56,
      address: '0x4338665CBB7B2485A8855A139b75D5e34AB0DB94',
      name: 'Litecoin Token',
      symbol: 'LTC',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/2/small/litecoin.png',
      tags: ['payments'],
    },
    {
      chainId: 56,
      address: '0x56b6fB708fC5732DEC1Afc8D8556423A2EDcCbD6',
      name: 'EOS Token',
      symbol: 'EOS',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/738/small/eos-eos-logo.png',
      tags: ['smart-contract'],
    },
    {
      chainId: 56,
      address: '0xF21768cCBC73Ea5B6fd3C687208a7c2def2d966e',
      name: 'Reef',
      symbol: 'REEF',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/13504/small/Group_10572.png',
      tags: ['defi'],
    },
    {
      chainId: 56,
      address: '0x762539b45A1dCcE3D36d080F74d1AED37844b878',
      name: 'Linear Token',
      symbol: 'LINA',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12509/small/linear.jpg',
      tags: ['defi', 'derivatives'],
    },
    {
      chainId: 56,
      address: '0xba5Fe23f8a3a24BEd3236F05F2FcF35fd0BF0B5C',
      name: 'ApeCoin',
      symbol: 'APE',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/24383/small/apecoin.jpg',
      tags: ['nft', 'metaverse'],
    },

    // Gaming & Metaverse
    {
      chainId: 56,
      address: '0x67b725d7e342d7B611fa85e859Df9697D9378B2e',
      name: 'The Sandbox',
      symbol: 'SAND',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12129/small/sandbox_logo.jpg',
      tags: ['gaming', 'metaverse'],
    },
    {
      chainId: 56,
      address: '0x715D400F88C167884bbCc41C5FeA407ed4D2f8A0',
      name: 'Axie Infinity',
      symbol: 'AXS',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/13029/small/axie_infinity_logo.png',
      tags: ['gaming', 'nft'],
    },
    {
      chainId: 56,
      address: '0x9Ac983826058b8a9C7Aa1C9171441191232E8404',
      name: 'Synthetix Network Token',
      symbol: 'SNX',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/3406/small/SNX.png',
      tags: ['defi', 'derivatives'],
    },
    {
      chainId: 56,
      address: '0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F',
      name: 'Alpaca Finance',
      symbol: 'ALPACA',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/14165/small/Logo200.png',
      tags: ['defi', 'lending'],
    },
    {
      chainId: 56,
      address: '0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6',
      name: 'Coin98',
      symbol: 'C98',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/17117/small/logo.png',
      tags: ['defi', 'wallet'],
    },
    {
      chainId: 56,
      address: '0x3019BF2a2eF8040C242C9a4c5c4BD4C81678b2A1',
      name: 'Green Metaverse Token',
      symbol: 'GMT',
      decimals: 8,
      logoURI: 'https://assets.coingecko.com/coins/images/23597/small/gmt.png',
      tags: ['gaming', 'move-to-earn'],
    },

    {
      chainId: 56,
      address: '0xBC5609612b7C44BEf426De600B5fd1379DB2EcF1',
      name: 'Paris Saint-Germain',
      symbol: 'PSG',
      decimals: 2,
      logoURI: 'https://assets.coingecko.com/coins/images/11620/small/psg.png',
      tags: ['fan-token', 'sports'],
    },
    {
      chainId: 56,
      address: '0x5cd50Aae14E14B3fdF3fF13c7A40e8cf5ae8b0A5',
      name: 'Smooth Love Potion',
      symbol: 'SLP',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/10366/small/SLP.png',
      tags: ['gaming'],
    },
    {
      chainId: 56,
      address: '0xCa3e902eFdb2a410C952Fd3e4ac38d7DBDCB8E96',
      name: 'Hashflow',
      symbol: 'HFT',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/26136/small/hashflow-icon-cmc.png',
      tags: ['defi', 'dex'],
    },
    {
      chainId: 56,
      address: '0x8b303d5BbfBbf46F1a4d9741E491e06986894e18',
      name: 'WEMIX TOKEN',
      symbol: 'WEMIX',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12998/small/wemixcoin_color_200.png',
      tags: ['gaming'],
    },
  ],
};

export const POLYGON_TOKEN_LIST: TokenListByChain = {
  chainId: 137,
  // tokens: [
  //   {
  //     // Native & Wrapped
  //     chainId: 137,
  //     address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
  //     name: 'Wrapped Matic',
  //     symbol: 'WMATIC',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  //     tags: ['wrapped', 'native'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  //     name: 'Wrapped Ether',
  //     symbol: 'WETH',
  //     decimals: 18,
  //     logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
  //     tags: ['wrapped'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x1bfd67037b42cf73acF2047067bd4F2C47D9BfD6',
  //     name: 'Wrapped BTC',
  //     symbol: 'WBTC',
  //     decimals: 8,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
  //     tags: ['wrapped', 'bitcoin'],
  //   },

  //   // Stablecoins
  //   {
  //     chainId: 137,
  //     address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  //     name: 'USD Coin (PoS)',
  //     symbol: 'USDC',
  //     decimals: 6,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  //     tags: ['stablecoin'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  //     name: 'USD Coin',
  //     symbol: 'USDC',
  //     decimals: 6,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
  //     tags: ['stablecoin'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  //     name: 'Tether USD (PoS)',
  //     symbol: 'USDT',
  //     decimals: 6,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/325/small/Tether-logo.png',
  //     tags: ['stablecoin'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  //     name: 'Dai Stablecoin (PoS)',
  //     symbol: 'DAI',
  //     decimals: 18,
  //     logoURI: 'https://assets.coingecko.com/coins/images/9956/small/4943.png',
  //     tags: ['stablecoin'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x9aF3b7DC29D3C4B1A5731408B6A9656fA7aC3b72',
  //     name: 'BUSD Token',
  //     symbol: 'BUSD',
  //     decimals: 18,
  //     logoURI: 'https://assets.coingecko.com/coins/images/9576/small/BUSD.png',
  //     tags: ['stablecoin'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89',
  //     name: 'Frax',
  //     symbol: 'FRAX',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/13422/small/frax_logo.png',
  //     tags: ['stablecoin'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x40379a439D4F6795B6fc9aa5687dB461677A2dBa',
  //     name: 'TrueUSD',
  //     symbol: 'TUSD',
  //     decimals: 18,
  //     logoURI: 'https://assets.coingecko.com/coins/images/3449/small/tusd.png',
  //     tags: ['stablecoin'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xB0B195aEFA3650A6908f15CdaC7D92F8a5791B0B',
  //     name: 'BOB',
  //     symbol: 'BOB',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/30001/small/bob_logo.png',
  //     tags: ['stablecoin'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x2e1AD108fF1D8C782fcBbB89AAd783aC49586756',
  //     name: 'TrueUSD',
  //     symbol: 'TUSD',
  //     decimals: 18,
  //     logoURI: 'https://assets.coingecko.com/coins/images/3449/small/tusd.png',
  //     tags: ['stablecoin'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x236eeC6359fb44CCe8f97E99387aa7F8cd5cdE1f',
  //     name: 'USD+',
  //     symbol: 'USD+',
  //     decimals: 6,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/25757/small/USD__logo.png',
  //     tags: ['stablecoin'],
  //   },

  //   // DeFi Tokens
  //   {
  //     chainId: 137,
  //     address: '0xb33EaAd8d922B1083446DC23f610c2567fB5180f',
  //     name: 'Uniswap (PoS)',
  //     symbol: 'UNI',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/12504/small/uniswap-uni.png',
  //     tags: ['defi', 'dex'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
  //     name: 'Aave (PoS)',
  //     symbol: 'AAVE',
  //     decimals: 18,
  //     logoURI: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
  //     tags: ['defi', 'lending'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a',
  //     name: 'SushiToken (PoS)',
  //     symbol: 'SUSHI',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/12271/small/512x512_Logo_no_chop.png',
  //     tags: ['defi', 'dex'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x8505b9d2254A7Ae468c0E9dd10Ccea3A837aef5c',
  //     name: 'Compound (PoS)',
  //     symbol: 'COMP',
  //     decimals: 18,
  //     logoURI: 'https://assets.coingecko.com/coins/images/10775/small/COMP.png',
  //     tags: ['defi', 'lending'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x6f7C932e7684666C9fd1d44527765433e01fF61d',
  //     name: 'Maker (PoS)',
  //     symbol: 'MKR',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png',
  //     tags: ['defi', 'governance'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
  //     name: 'ChainLink Token',
  //     symbol: 'LINK',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
  //     tags: ['defi', 'oracle'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x172370d5Cd63279eFa6d502DAB29171933a610AF',
  //     name: 'Curve DAO Token (PoS)',
  //     symbol: 'CRV',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/12124/small/Curve.png',
  //     tags: ['defi', 'dex'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xDA537104D6A5edd53c6fBba9A898708E465260b6',
  //     name: 'yearn.finance (PoS)',
  //     symbol: 'YFI',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/11849/small/yfi-192x192.png',
  //     tags: ['defi', 'yield'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3',
  //     name: 'Balancer (PoS)',
  //     symbol: 'BAL',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/11683/small/Balancer.png',
  //     tags: ['defi', 'dex'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39',
  //     name: 'BUSD Token',
  //     symbol: 'BUSD',
  //     decimals: 18,
  //     logoURI: 'https://assets.coingecko.com/coins/images/9576/small/BUSD.png',
  //     tags: ['stablecoin'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x9C2C5fd7b07E95EE044DDeba0E97a665F142394f',
  //     name: '1inch',
  //     symbol: '1INCH',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/13469/small/1inch-token.png',
  //     tags: ['defi', 'dex-aggregator'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xa3Fa99A148fA48D14Ed51d610c367C61876997F1',
  //     name: 'miMATIC',
  //     symbol: 'miMATIC',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/15264/small/mimatic-red.png',
  //     tags: ['stablecoin'],
  //   },

  //   // Polygon Native Projects
  //   {
  //     chainId: 137,
  //     address: '0x0B220b82F3eA3B7F6d9A1D8ab58930C064A2b5Bf',
  //     name: 'Golem Network Token',
  //     symbol: 'GLM',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/542/small/Golem_Submark_Positive_RGB.png',
  //     tags: ['computing'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b',
  //     name: 'Avalanche Token',
  //     symbol: 'AVAX',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png',
  //     tags: ['smart-contract'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xBbba073C31bF03b8ACf7c28EF0738DeCF3695683',
  //     name: 'SAND',
  //     symbol: 'SAND',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/12129/small/sandbox_logo.jpg',
  //     tags: ['gaming', 'metaverse'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x61299774020dA444Af134c82fa83E3810b309991',
  //     name: 'Render Token',
  //     symbol: 'RNDR',
  //     decimals: 18,
  //     logoURI: 'https://assets.coingecko.com/coins/images/11636/small/rndr.png',
  //     tags: ['computing', 'ai'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x1C954E8fe737F99f68Fa1CCda3e51ebDB291948C',
  //     name: 'Kyber Network Crystal v2',
  //     symbol: 'KNC',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/14899/small/RwdVsGcw_400x400.jpg',
  //     tags: ['defi', 'dex'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xAdBe0eac80F955363f4Ff47B0f70189093908c04',
  //     name: 'XEN Crypto',
  //     symbol: 'mXEN',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/27569/small/MXEN_Token_Logo.png',
  //     tags: ['defi'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xa1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4',
  //     name: 'Decentraland MANA',
  //     symbol: 'MANA',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/878/small/decentraland-mana.png',
  //     tags: ['gaming', 'metaverse'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x2bc07124D8dAc638E290f401046Ad584546BC47b',
  //     name: 'TOWER',
  //     symbol: 'TOWER',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/19865/small/tower-circular-1000.png',
  //     tags: ['gaming'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x6968105460f67c3BF751bE7C15f92F5286Fd0CE5',
  //     name: 'Monavale',
  //     symbol: 'MONA',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/13298/small/monavale_logo.jpg',
  //     tags: ['gaming'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xE261D618a959aFfFd53168Cd07D12E37B26761db',
  //     name: 'DinoSwap',
  //     symbol: 'DINO',
  //     decimals: 18,
  //     logoURI: 'https://assets.coingecko.com/coins/images/17103/small/DINO.png',
  //     tags: ['defi', 'dex'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x9Fb83c0635De2E815fd1c21b3a292277540C2e8d',
  //     name: 'Adamant',
  //     symbol: 'ADDY',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/16076/small/adamant.PNG',
  //     tags: ['defi', 'yield'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x03b54A6e9a984069379fae1a4fC4dBAE93B3bCCD',
  //     name: 'Wrapped stETH',
  //     symbol: 'wstETH',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/18834/small/wstETH.png',
  //     tags: ['defi', 'staking'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xfa68FB4628DFF1028CFEc22b4162FCcd0d45efb6',
  //     name: 'MaticX',
  //     symbol: 'MaticX',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/24185/small/maticX.png',
  //     tags: ['defi', 'staking'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4',
  //     name: 'Staked MATIC',
  //     symbol: 'stMATIC',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/24186/small/stMATIC.png',
  //     tags: ['defi', 'staking'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x0e9b89007eEE9c958c0EDA24eF70723C2C93dD58',
  //     name: 'Lido DAO Token',
  //     symbol: 'LDO',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png',
  //     tags: ['defi', 'staking'],
  //   },

  //   // QuickSwap Ecosystem
  //   {
  //     chainId: 137,
  //     address: '0xB5C064F955D8e7F38fE0460C556a72987494eE17',
  //     name: 'QuickSwap',
  //     symbol: 'QUICK',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/13970/small/1_pOU6pBMEmiL-ZJVb0CYRjQ.png',
  //     tags: ['defi', 'dex'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x958d208Cdf087843e9AD98d23823d32E17d723A1',
  //     name: 'QuickSwap',
  //     symbol: 'QUICK',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/31045/small/quick.jpg',
  //     tags: ['defi', 'dex'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xf28164A485B0B2C90639E47b0f377b4a438a16B1',
  //     name: 'dQUICK',
  //     symbol: 'dQUICK',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/17860/small/dquick.jpg',
  //     tags: ['defi', 'dex'],
  //   },

  //   // Gaming & NFT
  //   {
  //     chainId: 137,
  //     address: '0x6863BD30C9e313B264657B107352bA246F8Af8e0',
  //     name: 'Aavegotchi',
  //     symbol: 'GHST',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/12467/small/ghst_200.png',
  //     tags: ['gaming', 'nft'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xB6bcae6468760bc0CDFb9C8ef4Ee75C9dd23e1Ed',
  //     name: 'Aurory',
  //     symbol: 'AURY',
  //     decimals: 9,
  //     logoURI: 'https://assets.coingecko.com/coins/images/19324/small/Seek.png',
  //     tags: ['gaming'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x2AB4f9aC80F33071211729e45Cfc346C1f8446d5',
  //     name: 'ChainGuardians',
  //     symbol: 'CGG',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/14326/small/cgg_logo.png',
  //     tags: ['gaming', 'nft'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x9c891326Fd8b1a713974f73bb604677E1E63396D',
  //     name: 'Inverse Finance',
  //     symbol: 'INV',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/14205/small/inverse_finance.jpg',
  //     tags: ['defi'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xD86b5923F3AD7b585eD81B448170ae026c65ae9a',
  //     name: 'Stader',
  //     symbol: 'SD',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/20658/small/staderlabs_logo.png',
  //     tags: ['defi', 'staking'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x614389EaAE0A6821DC49062D56BDA3d9d45Fa2ff',
  //     name: 'Orbs',
  //     symbol: 'ORBS',
  //     decimals: 18,
  //     logoURI: 'https://assets.coingecko.com/coins/images/4630/small/Orbs.jpg',
  //     tags: ['infrastructure'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x42d61D766B85431666B39B89C43011f24451bFf6',
  //     name: 'ParaSwap',
  //     symbol: 'PSP',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/20403/small/ep299twG_400x400.jpg',
  //     tags: ['defi', 'dex-aggregator'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x4e78011Ce80ee02d2c3e649Fb657E45898257815',
  //     name: 'Klima DAO',
  //     symbol: 'KLIMA',
  //     decimals: 9,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/20468/small/KLIMA.jpg',
  //     tags: ['defi', 'carbon'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB',
  //     name: 'JPYC',
  //     symbol: 'JPYC',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/17044/small/jpyc_icon_20220214_1x.png',
  //     tags: ['stablecoin'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x840195888Db4D6A99ED9F73FcD3B225Bb3cB1A79',
  //     name: 'SportX',
  //     symbol: 'SX',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/19092/small/sx-logo-circle.png',
  //     tags: ['sports', 'betting'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xbD7A5Cf51d22930B8B3Df6d834F9BCEf90EE7c4f',
  //     name: 'Ethereum Name Service',
  //     symbol: 'ENS',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/19785/small/acatxTm8_400x400.jpg',
  //     tags: ['infrastructure'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x4C16f69302CcB511c5Fac682c7626B9eF0Dc126a',
  //     name: 'Polygon Ecosystem Token',
  //     symbol: 'POL',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/32440/small/polygon.png',
  //     tags: ['native', 'governance'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xf8b726f3c37DC58a30Ab45e8C3067acaE5f93b88',
  //     name: 'Router Protocol',
  //     symbol: 'ROUTE',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/13709/small/router_protocol.png',
  //     tags: ['bridge', 'infrastructure'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x82362Ec182Db3Cf7829014Bc61E9BE8a2E82868a',
  //     name: 'Meshswap Protocol',
  //     symbol: 'MESH',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/24417/small/MESH_logo.jpg',
  //     tags: ['defi', 'dex'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x1B815d120B3eF02039Ee11dC2d33DE7aA4a8C603',
  //     name: 'WOO Network',
  //     symbol: 'WOO',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/12921/small/w2UiemF__400x400.jpg',
  //     tags: ['dex'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x6f8a06447Ff6FcF75d803135a7de15CE88C1d4ec',
  //     name: 'SHIBA INU',
  //     symbol: 'SHIB',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
  //     tags: ['meme'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xB7b31a6BC18e48888545CE79e83E06003bE70930',
  //     name: 'ApeCoin',
  //     symbol: 'APE',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/24383/small/apecoin.jpg',
  //     tags: ['nft', 'metaverse'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x0C8C8Ae8bc3a69dC8482C01CEacfB588bc516100',
  //     name: 'DePay',
  //     symbol: 'DEPAY',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/24223/small/depay_logo.jpeg',
  //     tags: ['payments'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x8f36Cc333F55B09Bb71091409A3d7ADE399e3b1C',
  //     name: 'Dogelon Mars',
  //     symbol: 'ELON',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/14962/small/6GS9FGsx_400x400.jpg',
  //     tags: ['meme'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xDBf31dF14B66535aF65AaC99C32e9eA844e14501',
  //     name: 'renBTC',
  //     symbol: 'renBTC',
  //     decimals: 8,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/11370/small/Bitcoin.jpg',
  //     tags: ['wrapped', 'bitcoin'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xE06Bd4F5aAc8D0Aa337D13eC88dB6defC6eAEefE',
  //     name: 'PlanetIX',
  //     symbol: 'IXT',
  //     decimals: 18,
  //     logoURI: 'https://assets.coingecko.com/coins/images/21753/small/ixt.png',
  //     tags: ['gaming'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x23D29D30e35C5e8D321e1dc9A8a61BFD846D4C5C',
  //     name: 'HEX',
  //     symbol: 'HEX',
  //     decimals: 8,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/10103/small/HEX-logo.png',
  //     tags: ['defi'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xAa9654BECca45B5BDFA5ac646c939C62b527D394',
  //     name: 'DinoX',
  //     symbol: 'DNXC',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/17394/small/token_200x200.png',
  //     tags: ['gaming', 'nft'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x7DfF46370e9eA5f0Bad3C4E29711aD50062EA7A4',
  //     name: 'Solana',
  //     symbol: 'SOL',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  //     tags: ['wrapped'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x5fe2B58c013d7601147DcdD68C143A77499f5531',
  //     name: 'Graph Token',
  //     symbol: 'GRT',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png',
  //     tags: ['infrastructure'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xd0258a3fD00f38aa8090dfee343f10A9D4d30D3F',
  //     name: 'Voxel X Network',
  //     symbol: 'VOXEL',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/21260/small/voxel.png',
  //     tags: ['gaming', 'metaverse'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0x2C91D908E9fab2dD2441532a04182d791e590f2d',
  //     name: 'Klaytn',
  //     symbol: 'KLAY',
  //     decimals: 18,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/9672/small/klaytn.png',
  //     tags: ['wrapped'],
  //   },
  //   {
  //     chainId: 137,
  //     address: '0xcC1B9517460D8aE86fe576f614d091fCa65a28Fc',
  //     name: 'Falcon 9',
  //     symbol: 'F9',
  //     decimals: 9,
  //     logoURI:
  //       'https://assets.coingecko.com/coins/images/24988/small/F9-logo-transp-200.png',
  //     tags: ['meme'],
  //   },
  // ],
  tokens: [
    {
      chainId: 137,
      address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      name: 'Wrapped Matic',
      symbol: 'WMATIC',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
      tags: ['wrapped', 'native'],
    },
    {
      chainId: 137,
      address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      logoURI:
        'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png',
      tags: ['stablecoin'],
    },
    {
      chainId: 137,
      address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      name: 'Tether USD (PoS)',
      symbol: 'USDT',
      decimals: 6,
      logoURI:
        'https://assets.coingecko.com/coins/images/325/small/Tether-logo.png',
      tags: ['stablecoin'],
    },
    {
      chainId: 137,
      address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
      tags: ['wrapped'],
    },
    {
      chainId: 137,
      address: '0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b',
      name: 'Avalanche Token',
      symbol: 'AVAX',
      decimals: 18,
      logoURI:
        'https://assets.coingecko.com/coins/images/12559/small/coin-round-red.png',
      tags: ['smart-contract'],
    },
    {
      chainId: 137,
      address: '0xD6DF932A45C0f255f85145f286eA0b292B21C90B',
      name: 'Aave (PoS)',
      symbol: 'AAVE',
      decimals: 18,
      logoURI: 'https://assets.coingecko.com/coins/images/12645/small/AAVE.png',
      tags: ['defi', 'lending'],
    },
  ],
};

// // Type definition for the token list structure
// interface Token {
//   chainId: number;
//   address: string;
//   name: string;
//   symbol: string;
//   decimals: number;
//   logoURI: string;
//   tags: string[];
// }

// interface TokenListByChain {
//   chainId: number;
//   tokens: Token[];
// }
