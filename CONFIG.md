# App Configuration

This project uses a centralized configuration file (`app.config.json`) to manage various app settings.

## Configuration File Location

```
YoexWallet/
├── app.config.json  ← Configuration file
├── src/
└── ...
```

## Configuration Options

### Theme Settings

```json
{
  "theme": {
    "mode": "dark", // "light" | "dark" | "auto"
    "allowUserToggle": true, // Allow users to change theme
    "followSystemTheme": false // Follow system dark/light mode
  }
}
```

**Theme Mode Options:**

- `"light"` - Always use light theme
- `"dark"` - Always use dark theme
- `"auto"` - Follow system preference

### Splash Screen Settings

```json
{
  "splash": {
    "duration": 3000, // Splash screen duration (ms)
    "minDuration": 2000, // Minimum duration (ms)
    "showLoadingIndicator": true // Show pulsing dots
  }
}
```

### App Information

```json
{
  "app": {
    "name": "YoexWallet",
    "version": "1.0.0",
    "description": "Modern cryptocurrency wallet application"
  }
}
```

### Feature Flags

```json
{
  "features": {
    "biometricAuth": true, // Enable biometric authentication
    "notifications": true, // Enable push notifications
    "analytics": false // Enable analytics tracking
  }
}
```

## Usage in Code

### Import Configuration

```typescript
import config, { getThemeMode, getAllowUserToggle } from './src/utils/config';
```

### Available Helper Functions

```typescript
// Theme
getThemeMode(); // Returns: 'light' | 'dark' | 'auto'
getAllowUserToggle(); // Returns: boolean
getFollowSystemTheme(); // Returns: boolean

// Splash
getSplashDuration(); // Returns: number (ms)
getSplashMinDuration(); // Returns: number (ms)

// App Info
getAppName(); // Returns: string
getAppVersion(); // Returns: string
```

### Direct Config Access

```typescript
// Access the full config object
console.log(config.app.name); // "YoexWallet"
console.log(config.theme.mode); // "dark"
console.log(config.features.analytics); // false
```

## Examples

### Change Default Theme to Light Mode

```json
{
  "theme": {
    "mode": "light",
    "allowUserToggle": true,
    "followSystemTheme": false
  }
}
```

### Disable User Theme Toggle

```json
{
  "theme": {
    "mode": "dark",
    "allowUserToggle": false,
    "followSystemTheme": false
  }
}
```

### Follow System Theme

```json
{
  "theme": {
    "mode": "auto",
    "allowUserToggle": true,
    "followSystemTheme": true
  }
}
```

### Adjust Splash Screen Duration

```json
{
  "splash": {
    "duration": 5000,
    "minDuration": 3000,
    "showLoadingIndicator": true
  }
}
```

## Development vs Production

You can maintain different configuration files for different environments:

```bash
# Development
app.config.json

# Production (copy and modify)
app.config.prod.json
```

Then modify the import in `src/utils/config/index.ts` based on your build environment.

## Validation

The configuration system includes validation to ensure:

- Theme mode is one of: `'light'`, `'dark'`, `'auto'`
- Durations are positive numbers
- Boolean flags are actual booleans
- Required fields have fallback defaults

Invalid values will automatically fallback to safe defaults.
