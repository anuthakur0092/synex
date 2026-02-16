import React from 'react';
import { Alert } from 'react-native';
import { walletConnectRequestEvent } from '../services/walletconnect/events';
import { ethers } from 'ethers';
import { getHttpProvider } from '../services/api/ethProvider';
import { walletStorage } from '../services/storage/walletStorage';
import type { SessionTypes } from '@walletconnect/types';
import { getWalletConnectClient } from '../services/walletconnect/client';
import { useWallet } from './useWallet';
import { navigate } from '../navigation/navigationRef';
// helper to get an ethers Wallet for active account
async function getActiveWallet(): Promise<ethers.Wallet> {
  const id = await walletStorage.getCurrentWalletId();
  if (!id) throw new Error('No active wallet');
  const password = await walletStorage.getStoredPassword(id);
  if (!password) throw new Error('Missing wallet password');
  const data = await walletStorage.getWallet(id, password);
  if (!data) throw new Error('Wallet not found');
  const provider = getHttpProvider();
  return new ethers.Wallet(data.privateKey, provider);
}

interface UseWalletConnect {
  sessions: SessionTypes.Struct[];
  disconnect: (topic: string) => Promise<void>;
}

export function useWalletConnect(): UseWalletConnect {
  const [sessions, setSessions] = React.useState<SessionTypes.Struct[]>([]);
  const { address, selectedChainId } = useWallet();
  const handledProposalsRef = React.useRef<Set<string | number>>(new Set());

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const client = await getWalletConnectClient();
      if (!mounted) return;
      setSessions(client.session.values);

      client.on('session_update', () => setSessions(client.session.values));
      client.on('session_delete', () => setSessions(client.session.values));
      client.on('session_event', () => {});

      // Basic request handler with inline approval dialog
      const onRequest = async (event: any) => {
        try {
          const { id, topic, params } = event || {};
          const request = params?.request || {};
          const method: string = request.method;
          const rpcParams: any[] = request.params || [];

          const approve = async () => {
            try {
              let result: any = null;
              if (method === 'personal_sign' || method === 'eth_sign') {
                // personal_sign can be [message, address] or reversed
                const p0 = rpcParams[0];
                const p1 = rpcParams[1];
                const message = (
                  method === 'personal_sign'
                    ? typeof p0 === 'string' &&
                      p0.startsWith('0x') &&
                      p0.length === 42
                      ? p1
                      : p0
                    : p1
                ) as string;
                const wallet = await getActiveWallet();
                const msg =
                  message.startsWith('0x') && message.length > 42
                    ? ethers.utils.arrayify(message)
                    : message;
                result = await wallet.signMessage(msg);
              } else if (
                method === 'eth_signTypedData' ||
                method === 'eth_signTypedData_v3' ||
                method === 'eth_signTypedData_v4'
              ) {
                const [addressParam, typedDataParam] =
                  rpcParams.length === 2
                    ? rpcParams
                    : [rpcParams[1], rpcParams[0]];
                const wallet = await getActiveWallet();
                const data =
                  typeof typedDataParam === 'string'
                    ? JSON.parse(typedDataParam)
                    : typedDataParam;
                const domain = data.domain || {};
                const types = { ...(data.types || {}) };
                const message = data.message || {};
                // EIP-712 requires removing EIP712Domain from types for ethers
                delete (types as any).EIP712Domain;
                result = await wallet._signTypedData(domain, types, message);
              } else if (method === 'eth_sendTransaction') {
                const [tx] = rpcParams;
                const wallet = await getActiveWallet();
                const provider = getHttpProvider();
                const connected = wallet.connect(provider);
                const sendTx: ethers.providers.TransactionRequest = {
                  to: tx.to,
                  from: tx.from,
                  data: tx.data,
                  value: tx.value ? ethers.BigNumber.from(tx.value) : undefined,
                  gasPrice: tx.gasPrice
                    ? ethers.BigNumber.from(tx.gasPrice)
                    : undefined,
                  gasLimit:
                    tx.gas || tx.gasLimit
                      ? ethers.BigNumber.from(tx.gas || tx.gasLimit)
                      : undefined,
                  nonce: tx.nonce != null ? Number(tx.nonce) : undefined,
                };
                const resp = await connected.sendTransaction(sendTx);
                result = resp.hash;
              } else {
                throw new Error('Unsupported method');
              }
              await client.respond({
                topic,
                response: { id, jsonrpc: '2.0', result },
              });
            } catch (err: any) {
              await client.respond({
                topic,
                response: {
                  id,
                  jsonrpc: '2.0',
                  error: { code: 4000, message: err?.message || 'Failed' },
                },
              });
            }
          };

          const reject = async () => {
            try {
              await client.respond({
                topic,
                response: {
                  id,
                  jsonrpc: '2.0',
                  error: { code: 4001, message: 'User rejected' },
                },
              });
            } catch {}
          };

          walletConnectRequestEvent.emit({
            id,
            topic,
            method,
            params: rpcParams,
            chainId: event?.params?.chainId,
            dappName: event?.params?.requester?.metadata?.name,
            dappIcon: event?.params?.requester?.metadata?.icons?.[0],
            approve: async () => {
              try {
                await approve();
                return { result: true };
              } catch (e: any) {
                return { error: e?.message || 'Failed' };
              }
            },
            reject: async () => {
              await reject();
            },
          });
        } catch {}
      };
      client.on('session_request', onRequest);

      const onProposal = async (proposal: any) => {
        try {
          const pid = proposal?.id as string | number;
          if (handledProposalsRef.current.has(pid)) return;
          handledProposalsRef.current.add(pid);
          // Debug once per proposal
          try {
            console.log('WC proposal params:', proposal?.params);
          } catch {}
          // Ensure we have a wallet address (fallback to storage)
          let addr = address;
          if (!addr) {
            try {
              const id = await walletStorage.getCurrentWalletId();
              const meta = id
                ? await walletStorage.getWalletMetadata(id)
                : null;
              addr = meta?.address || null;
            } catch {}
          }
          if (!addr) throw new Error('Missing address');

          // Build namespaces only when chains are provided and accounts can be constructed
          const required = proposal.params?.requiredNamespaces || {};
          const optional = proposal.params?.optionalNamespaces || {};
          const namespaces: Record<string, any> = {};
          const keys = Array.from(
            new Set<string>([
              ...Object.keys(required),
              ...Object.keys(optional),
            ]),
          );
          keys.forEach(key => {
            const req = required[key] || {};
            const opt = optional[key] || {};
            let chains: string[] = Array.isArray(req?.chains)
              ? req.chains
              : Array.isArray(opt?.chains)
              ? opt.chains
              : [];
            // Fallback for common EVM namespace if no chains provided
            let chainToUse =
              selectedChainId && selectedChainId !== 0 ? selectedChainId : 1;
            if (chains.length === 0 && key === 'eip155' && chainToUse) {
              chains = [`eip155:${chainToUse}`];
            }
            const accounts = chains.map((chain: string) => `${chain}:${addr}`);
            if (accounts.length > 0) {
              namespaces[key] = {
                accounts,
                methods: req.methods || opt.methods || [],
                events: req.events || opt.events || [],
              };
            }
          });
          if (Object.keys(namespaces).length === 0) {
            // Proposal unsupported/invalid; do not attempt invalid approve
            return;
          }
          await client.approve({ id: pid, namespaces });
          navigate('HomeMain');
        } catch (e) {
          try {
            await client.reject({
              id: proposal?.id,
              reason: {
                code: 5000,
                message: 'User rejected',
              },
            } as any);
          } catch {}
        }
      };
      client.on('session_proposal', onProposal);
      return () => {
        client.off('session_proposal', onProposal);
        client.off('session_request', onRequest);
      };
    })();
    return () => {
      mounted = false;
    };
  }, [address]);

  const disconnect = React.useCallback(async (topic: string) => {
    const client = await getWalletConnectClient();
    try {
      await client.disconnect({
        topic,
        reason: { code: 6000, message: 'User disconnected' } as any,
      });
      setSessions(client.session.values);
    } catch {}
  }, []);

  return { sessions, disconnect };
}
