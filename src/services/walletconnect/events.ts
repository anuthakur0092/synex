type Listener<T> = (payload: T) => void;

export interface WalletConnectUIRequest {
  id: number | string;
  topic: string;
  method: string;
  params: any[];
  chainId?: string;
  dappName?: string;
  dappIcon?: string;
  approve: () => Promise<{ result?: any; error?: string }>;
  reject: () => Promise<void>;
}

class SimpleEvent<T> {
  private listeners: Set<Listener<T>> = new Set();
  emit(payload: T) {
    for (const l of Array.from(this.listeners)) {
      try {
        l(payload);
      } catch {}
    }
  }
  subscribe(listener: Listener<T>) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const walletConnectRequestEvent =
  new SimpleEvent<WalletConnectUIRequest>();
