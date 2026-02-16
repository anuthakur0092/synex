## WalletConnect Integration Notes

### What was added

- Camera scan entry in dashboard header (`WalletConnect` icon)
- `WalletConnectScanScreen` using VisionCamera's built-in `useCodeScanner`
- WalletConnect SignClient singleton with AsyncStorage persistence
- Global proposal handler that approves `eip155` sessions with the active wallet address
- Deep-link support for `wc:` URIs and `NavigationContainer` linking prefixes
- Platform permissions (Android `CAMERA`, iOS `NSCameraUsageDescription`)

### Dependencies

- `@walletconnect/sign-client`, `@walletconnect/react-native-compat`
- `react-native-vision-camera`
- `@react-native-community/netinfo`

Removed: `vision-camera-code-scanner` (VisionCamera v4 provides `useCodeScanner`)

### Configuration

- `app.config.json`:
  - `walletConnect.projectId` set to your WC Cloud Project ID
  - `walletConnect.relayUrl` default `wss://relay.walletconnect.com`

### Flow

1. Tap scan icon on dashboard header → navigates to `WalletConnectScan`
2. Camera scans QR, extracts `wc:` URI → `client.pair({ uri })`
3. On `session_proposal`:
   - Build namespaces from `requiredNamespaces` or `optionalNamespaces`
   - For `eip155`, construct `accounts` as `["eip155:<chainId>:<address>"]`
   - Approve session; navigate back to dashboard

### Notes

- Uses a guarded singleton to avoid duplicate `SignClient.init()` during fast refresh
- Approves only when a non-empty `namespaces` object is built
- Falls back to stored wallet address and selected chain if hook values are not ready
