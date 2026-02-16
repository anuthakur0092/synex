import { ethers } from 'ethers';
import { Token } from '../../utils/types/dashboard.types';
import { walletStorage } from '../storage/walletStorage';
import { getHttpProvider, getHttpProviderForChain } from '../api/ethProvider';

// ERC20 ABI - minimal interface for transfer
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
];

export interface GasOption {
  label: string;
  speed: 'slow' | 'standard' | 'fast';
  estimatedTime: string;
  gasPrice: string; // in Gwei
  gasLimit: string;
  totalGasFee: string; // in ETH
  totalGasFeeUsd: string;
  // Optional EIP-1559 fields (Gwei) when provided by a chain-specific oracle (e.g., Polygon)
  maxFeePerGasGwei?: string;
  maxPriorityFeePerGasGwei?: string;
}

export class TransactionService {
  private static getProvider(chainId?: number) {
    // Use centralized, chain-aware HTTP provider (Alchemy if configured)
    return typeof chainId === 'number'
      ? getHttpProviderForChain(chainId)
      : getHttpProvider();
  }

  private static isZeroAddress(address: string | undefined | null): boolean {
    return (
      !address ||
      address.toLowerCase() === '0x0000000000000000000000000000000000000000'
    );
  }

  private static isNativeToken(token: Token, chainId: number): boolean {
    // Native if explicitly primary, or zero-address, or symbol equals chain native symbol
    if (token.isPrimary) return true;
    if (this.isZeroAddress(token.contractAddress)) return true;
    try {
      const { supportedChains } = require('../../utils/config/chains');
      const chain = supportedChains.find((c: any) => c.chainId === chainId);
      if (
        chain?.symbol &&
        token.symbol?.toUpperCase() === chain.symbol.toUpperCase()
      ) {
        return true;
      }
    } catch {}
    return false;
  }

  /**
   * Estimate gas fees for a transaction
   */
  static async estimateGasFees(
    from: string,
    to: string,
    amount: string,
    token: Token,
  ): Promise<GasOption[]> {
    try {
      const chainId =
        token.chainId || (await walletStorage.getSelectedChainId()) || 1;
      const provider = this.getProvider(chainId);

      // Base fee metrics
      let baseGasPrice: ethers.BigNumber | null = null;
      let polygonOracle: null | {
        slow: { maxPriority: number; maxFee: number };
        standard: { maxPriority: number; maxFee: number };
        fast: { maxPriority: number; maxFee: number };
      } = null;
      if (chainId === 137) {
        // Use Polygon Gas Station v2 for reliable fee suggestions (Gwei)
        try {
          const res = await fetch('https://gasstation.polygon.technology/v2');
          const j = await res.json();
          const clampPriority = (n: number) => Math.max(n, 30); // enforce >=30 gwei
          polygonOracle = {
            slow: {
              maxPriority: clampPriority(
                Number(j?.safeLow?.maxPriorityFee ?? 30),
              ),
              maxFee: Math.max(
                Number(j?.safeLow?.maxFee ?? 35),
                clampPriority(Number(j?.safeLow?.maxPriorityFee ?? 30)),
              ),
            },
            standard: {
              maxPriority: clampPriority(
                Number(j?.standard?.maxPriorityFee ?? 32),
              ),
              maxFee: Math.max(
                Number(j?.standard?.maxFee ?? 36),
                clampPriority(Number(j?.standard?.maxPriorityFee ?? 32)),
              ),
            },
            fast: {
              maxPriority: clampPriority(Number(j?.fast?.maxPriorityFee ?? 34)),
              maxFee: Math.max(
                Number(j?.fast?.maxFee ?? 38),
                clampPriority(Number(j?.fast?.maxPriorityFee ?? 34)),
              ),
            },
          };
        } catch (_e) {
          // fallback to provider fee data if oracle fails
        }
      }

      if (!polygonOracle) {
        // Prefer EIP-1559 fee data; fallback to legacy gasPrice; final static fallback
        try {
          const feeData = await provider.getFeeData();
          baseGasPrice = feeData.maxFeePerGas ?? feeData.gasPrice ?? null;
        } catch (_e) {}
        if (!baseGasPrice) {
          try {
            baseGasPrice = await provider.getGasPrice();
          } catch (_e) {
            // 30 gwei conservative fallback (aligns with Polygon min tip)
            baseGasPrice = ethers.utils.parseUnits('30', 'gwei');
          }
        }
      }

      // Get ETH price for USD conversion (lightweight endpoint)
      let ethPrice = 0;
      try {
        const { fetchNativeMarketData } = await import('../api/prices');
        const ethPriceData = await fetchNativeMarketData(chainId);
        ethPrice = ethPriceData.price ?? 0;
      } catch (_e) {
        // Keep USD values as 0.00 if price fetch fails
        ethPrice = 0;
      }

      // Estimate gas limit
      let gasLimit: ethers.BigNumber;
      if (this.isNativeToken(token, chainId)) {
        gasLimit = ethers.BigNumber.from(21000);
      } else {
        const contract = new ethers.Contract(
          token.contractAddress,
          ERC20_ABI,
          provider,
        );
        const decimals = token.balance.decimals;
        const amountWei = ethers.utils.parseUnits(amount, decimals);
        try {
          gasLimit = await contract.estimateGas.transfer(to, amountWei, {
            from,
          });
        } catch {
          // Common ERC-20 transfer ranges on mainnet: 50k-90k
          gasLimit = ethers.BigNumber.from(65000);
        }
      }

      // Calculate gas options
      const gasOptions: GasOption[] = (() => {
        if (polygonOracle) {
          // Use oracle-recommended maxFee/maxPriority (Gwei)
          const mk = (
            label: string,
            speed: 'slow' | 'standard' | 'fast',
            recommended: { maxPriority: number; maxFee: number },
          ): GasOption => ({
            label,
            speed,
            estimatedTime:
              speed === 'slow'
                ? '~10 min'
                : speed === 'standard'
                ? '~5 min'
                : '~2 min',
            gasPrice: String(recommended.maxFee),
            gasLimit: gasLimit.toString(),
            totalGasFee: '',
            totalGasFeeUsd: '',
            maxFeePerGasGwei: String(recommended.maxFee),
            maxPriorityFeePerGasGwei: String(recommended.maxPriority),
          });
          return [
            mk('Slow', 'slow', polygonOracle.slow),
            mk('Standard', 'standard', polygonOracle.standard),
            mk('Fast', 'fast', polygonOracle.fast),
          ];
        }
        // Generic scaling when oracle not available
        return [
          {
            label: 'Slow',
            speed: 'slow',
            estimatedTime: '~10 min',
            gasPrice: ethers.utils.formatUnits(baseGasPrice!, 'gwei'),
            gasLimit: gasLimit.toString(),
            totalGasFee: '',
            totalGasFeeUsd: '',
          },
          {
            label: 'Standard',
            speed: 'standard',
            estimatedTime: '~5 min',
            gasPrice: ethers.utils.formatUnits(baseGasPrice!, 'gwei'),
            gasLimit: gasLimit.toString(),
            totalGasFee: '',
            totalGasFeeUsd: '',
          },
          {
            label: 'Fast',
            speed: 'fast',
            estimatedTime: '~2 min',
            gasPrice: ethers.utils.formatUnits(
              baseGasPrice!.mul(12).div(10),
              'gwei',
            ),
            gasLimit: gasLimit.toString(),
            totalGasFee: '',
            totalGasFeeUsd: '',
          },
        ];
      })();

      // Calculate total fees
      for (const option of gasOptions) {
        const gasPriceGwei = option.maxFeePerGasGwei || option.gasPrice;
        const gasPriceWei = ethers.utils.parseUnits(gasPriceGwei, 'gwei');
        const totalGasWei = gasPriceWei.mul(gasLimit);
        const totalGasEth = ethers.utils.formatEther(totalGasWei);
        const totalGasUsd = (parseFloat(totalGasEth) * ethPrice).toFixed(2);

        option.totalGasFee = parseFloat(totalGasEth).toFixed(6);
        option.totalGasFeeUsd = totalGasUsd;
      }

      return gasOptions;
    } catch (error) {
      console.error('Error estimating gas:', error);
      throw new Error('Failed to estimate gas fees');
    }
  }

  /**
   * Send a transaction
   */
  static async sendTransaction(
    walletId: string,
    password: string,
    to: string,
    amount: string,
    token: Token,
    gasOption: GasOption,
  ): Promise<string> {
    try {
      // Retrieve decrypted wallet data using stored password
      const walletData = await walletStorage.getWallet(walletId, password);
      if (!walletData) {
        throw new Error('Wallet not found');
      }

      // Create wallet instance with provider
      const chainId =
        token.chainId || (await walletStorage.getSelectedChainId()) || 1;
      const wallet = new ethers.Wallet(
        walletData.privateKey,
        this.getProvider(chainId),
      );

      // Prepare transaction (re-use chainId computed above)
      const isPolygon = chainId === 137;
      const wantsEip1559 = isPolygon && !!gasOption.maxFeePerGasGwei;
      const gasPrice = ethers.utils.parseUnits(gasOption.gasPrice, 'gwei');
      const gasLimit = ethers.BigNumber.from(gasOption.gasLimit);

      let tx: any;

      if (this.isNativeToken(token, chainId)) {
        // Native coin transfer (ETH/BNB/MATIC...)
        const decimals = 18; // All EVM native assets use 18 decimals
        const amountWei = ethers.utils.parseUnits(amount, decimals);

        const transaction: ethers.providers.TransactionRequest = wantsEip1559
          ? {
              to,
              value: amountWei,
              maxPriorityFeePerGas: ethers.utils.parseUnits(
                gasOption.maxPriorityFeePerGasGwei as string,
                'gwei',
              ),
              maxFeePerGas: ethers.utils.parseUnits(
                gasOption.maxFeePerGasGwei as string,
                'gwei',
              ),
              gasLimit,
            }
          : { to, value: amountWei, gasPrice, gasLimit };

        tx = await wallet.sendTransaction(transaction);
      } else {
        // ERC20 transfer
        const contract = new ethers.Contract(
          token.contractAddress,
          ERC20_ABI,
          wallet,
        );
        const decimals = token.balance.decimals;
        const amountWei = ethers.utils.parseUnits(amount, decimals);
        const overrides = wantsEip1559
          ? {
              maxPriorityFeePerGas: ethers.utils.parseUnits(
                gasOption.maxPriorityFeePerGasGwei as string,
                'gwei',
              ),
              maxFeePerGas: ethers.utils.parseUnits(
                gasOption.maxFeePerGasGwei as string,
                'gwei',
              ),
              gasLimit,
            }
          : { gasPrice, gasLimit };

        tx = await contract.transfer(to, amountWei, overrides);
      }

      console.log('Transaction sent:', tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt?.hash);

      return tx.hash;
    } catch (error: any) {
      console.error('Error sending transaction:', error);

      // Parse error message
      if (error.code === 'INSUFFICIENT_FUNDS') {
        throw new Error('Insufficient funds for gas');
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Network error. Please check your connection.');
      } else if (error.message?.includes('replacement fee too low')) {
        throw new Error('Transaction already pending. Please wait.');
      } else {
        throw new Error(error.message || 'Transaction failed');
      }
    }
  }

  /**
   * Get transaction status
   */
  static async getTransactionStatus(
    txHash: string,
  ): Promise<'pending' | 'confirmed' | 'failed'> {
    try {
      const provider = this.getProvider();
      const receipt = await provider.getTransactionReceipt(txHash);

      if (!receipt) {
        return 'pending';
      }

      return receipt.status === 1 ? 'confirmed' : 'failed';
    } catch (error) {
      console.error('Error getting transaction status:', error);
      return 'pending';
    }
  }
}
