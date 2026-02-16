import { ethers } from 'ethers';
import {
  getHttpProviderForChain,
  getWsProviderForChain,
} from '../api/ethProvider';
import { walletStorage } from '../storage/walletStorage';

const ERC20_ABI = [
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
];

const ERC20_IFACE = new ethers.utils.Interface(ERC20_ABI);

export interface DecodedSummary {
  title: string;
  lines: string[];
}

export async function decodeEthSendTransaction(
  tx: any,
  chainId?: string,
): Promise<DecodedSummary | null> {
  try {
    if (!tx?.data || !tx?.to) {
      return null;
    }
    let parsed: any | null = null;
    try {
      parsed = ERC20_IFACE.parseTransaction({ data: tx.data, value: tx.value });
    } catch (_e) {
      parsed = null;
    }

    let tokenSymbol: string | undefined;
    let tokenDecimals: number | undefined;

    // Try to resolve token symbol/decimals on the most relevant chain provider
    try {
      const reqChainId = chainId?.startsWith('eip155:')
        ? Number(chainId.split(':')[1])
        : undefined;
      const selected = await walletStorage.getSelectedChainId();
      const effectiveSelected =
        selected == null ? 1 : selected === 0 ? 56 : selected;
      const cId = reqChainId ?? effectiveSelected;
      const ws = getWsProviderForChain(cId);
      const http = getHttpProviderForChain(cId);
      const provider: ethers.providers.Provider = (ws as any) || http;
      const contract = new ethers.Contract(tx.to, ERC20_ABI, provider);
      tokenSymbol = await contract.symbol().catch(() => undefined);
      tokenDecimals = await contract.decimals().catch(() => undefined);
    } catch {}

    // Fallbacks
    const lines: string[] = [];
    lines.push(`To: ${tx.to}`);
    if (typeof tx.value === 'string') {
      try {
        const val = ethers.BigNumber.from(tx.value);
        lines.push(`Value (wei): ${val.toString()}`);
      } catch {}
    }
    if (!parsed) {
      if (tx.data) lines.push(`Data: ${String(tx.data).slice(0, 66)}…`);
      return { title: 'Send Transaction', lines };
    }

    const name: string = parsed.name;
    if (name === 'approve') {
      const spender: string = parsed.args[0];
      const amount: ethers.BigNumber = parsed.args[1];
      const isUnlimited = amount.gte(ethers.constants.MaxUint256.div(2));
      let pretty = amount.toString();
      if (tokenDecimals != null) {
        try {
          pretty = ethers.utils.formatUnits(amount, tokenDecimals);
        } catch {}
      }
      const token = tokenSymbol || 'Token';
      lines.push(
        `Function: approve(${spender}, ${isUnlimited ? 'Unlimited' : pretty})`,
      );
      return { title: `Approve ${token}`, lines };
    }

    if (name === 'transfer' || name === 'transferFrom') {
      const to: string = name === 'transfer' ? parsed.args[0] : parsed.args[1];
      const amount: ethers.BigNumber = parsed.args[name === 'transfer' ? 1 : 2];
      let pretty = amount.toString();
      if (tokenDecimals != null) {
        try {
          pretty = ethers.utils.formatUnits(amount, tokenDecimals);
        } catch {}
      }
      const token = tokenSymbol || 'Token';
      lines.push(`Function: ${name} → ${to}`);
      lines.push(`Amount: ${pretty} ${token}`);
      return { title: `Send ${token}`, lines };
    }

    lines.push(`Function: ${name}`);
    return { title: 'Contract Interaction', lines };
  } catch {
    return null;
  }
}
