# YoexWallet Theme System

A comprehensive theme system for the YoexWallet React Native application that provides consistent styling, colors, typography, and spacing across the entire app.

## Overview

The theme system consists of several modules:

- **Colors**: Light and dark color palettes with semantic naming
- **Typography**: Font families, sizes, weights, and text styles
- **Dimensions**: Spacing, sizing, and layout constants
- **Shadows**: Platform-specific shadow styles
- **Theme Provider**: React context for theme management

## Quick Start

### 1. Wrap your app with ThemeProvider

```tsx
import React from 'react';
import { ThemeProvider } from './src/utils/theme';
import { YourApp } from './YourApp';

function App() {
  return (
    <ThemeProvider initialMode="auto">
      <YourApp />
    </ThemeProvider>
  );
}
```

### 2. Use theme in components

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme, useColors } from '../utils/theme';

export const MyComponent = () => {
  const { theme, isDark } = useTheme();
  const colors = useColors();

  return (
    <View style={{ backgroundColor: colors.background.primary }}>
      <Text style={{ color: colors.text.primary }}>Hello World!</Text>
    </View>
  );
};
```

### 3. Create themed styles

```tsx
import { StyleSheet } from 'react-native';
import { Theme } from '../utils/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      padding: theme.spacing.lg,
      backgroundColor: theme.colors.background.primary,
      borderRadius: theme.borderRadius.md,
      ...theme.shadows.card,
    },
    title: {
      ...theme.typography.heading.h2,
      color: theme.colors.text.primary,
    },
  });
```

## Colors

### Available Color Categories

#### Background Colors

- `background.primary` - Main background
- `background.secondary` - Secondary background
- `background.tertiary` - Tertiary background
- `background.card` - Card backgrounds
- `background.modal` - Modal backgrounds
- `background.overlay` - Overlay backgrounds

#### Text Colors

- `text.primary` - Primary text
- `text.secondary` - Secondary text
- `text.tertiary` - Tertiary text
- `text.disabled` - Disabled text
- `text.inverse` - Inverse text (for dark backgrounds)
- `text.placeholder` - Placeholder text

#### Interactive Colors

- `interactive.primary` - Primary buttons/links
- `interactive.primaryHover` - Primary hover state
- `interactive.primaryPressed` - Primary pressed state
- `interactive.primaryDisabled` - Primary disabled state
- `interactive.secondary` - Secondary buttons
- `interactive.accent` - Accent elements

#### Status Colors

- `status.success` - Success states
- `status.warning` - Warning states
- `status.error` - Error states
- `status.info` - Info states

#### Wallet-Specific Colors

- `wallet.balance` - Balance text
- `wallet.positiveChange` - Positive price changes
- `wallet.negativeChange` - Negative price changes
- `wallet.transaction` - Transaction text
- `wallet.pending` - Pending transactions
- `wallet.confirmed` - Confirmed transactions

### Usage Example

```tsx
import { useColors } from '../utils/theme';

const MyComponent = () => {
  const colors = useColors();

  return (
    <View style={{ backgroundColor: colors.background.card }}>
      <Text style={{ color: colors.wallet.balance }}>$1,234.56</Text>
      <Text style={{ color: colors.wallet.positiveChange }}>+5.23%</Text>
    </View>
  );
};
```

## Typography

### Text Styles

#### Display Styles (Large Headings)

- `display.large`
- `display.medium`
- `display.small`

#### Heading Styles

- `heading.h1` through `heading.h6`

#### Body Text

- `body.large`
- `body.medium`
- `body.small`

#### Labels

- `label.large`
- `label.medium`
- `label.small`

#### Captions

- `caption.large`
- `caption.small`

#### Buttons

- `button.large`
- `button.medium`
- `button.small`

#### Wallet-Specific

- `wallet.balance` - For balance amounts
- `wallet.currency` - For currency labels
- `wallet.address` - For wallet addresses (monospace)
- `wallet.hash` - For transaction hashes (monospace)
- `wallet.amount` - For transaction amounts

### Usage Example

```tsx
import { useTypography } from '../utils/theme';

const MyComponent = () => {
  const typography = useTypography();

  return (
    <View>
      <Text style={typography.heading.h1}>Wallet Balance</Text>
      <Text style={typography.wallet.balance}>$1,234.56</Text>
      <Text style={typography.wallet.address}>0x1234567890abcdef...</Text>
    </View>
  );
};
```

## Dimensions

### Spacing

- `spacing.xs` (4px)
- `spacing.sm` (8px)
- `spacing.md` (12px)
- `spacing.lg` (16px)
- `spacing.xl` (20px)
- `spacing.xxl` (24px)
- `spacing.xxxl` (32px)
- `spacing.xxxxl` (40px)

### Border Radius

- `borderRadius.none` (0)
- `borderRadius.xs` (2px)
- `borderRadius.sm` (4px)
- `borderRadius.md` (6px)
- `borderRadius.lg` (8px)
- `borderRadius.xl` (12px)
- `borderRadius.xxl` (16px)
- `borderRadius.xxxl` (20px)
- `borderRadius.full` (9999px)

### Icon Sizes

- `iconSize.xs` (12px)
- `iconSize.sm` (16px)
- `iconSize.md` (20px)
- `iconSize.lg` (24px)
- `iconSize.xl` (28px)
- `iconSize.xxl` (32px)
- `iconSize.xxxl` (40px)
- `iconSize.xxxxl` (48px)

### Usage Example

```tsx
import { useDimensions } from '../utils/theme';

const MyComponent = () => {
  const { spacing, borderRadius, iconSize } = useDimensions();

  return (
    <View
      style={{
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        margin: spacing.md,
      }}
    >
      <Icon size={iconSize.lg} />
    </View>
  );
};
```

## Shadows

### Available Shadows

- `none` - No shadow
- `xs` - Extra small shadow
- `sm` - Small shadow
- `md` - Medium shadow
- `lg` - Large shadow
- `xl` - Extra large shadow
- `xxl` - Extra extra large shadow

### Component-Specific Shadows

- `card` - For card components
- `button` - For button components
- `buttonPressed` - For pressed button state
- `modal` - For modal dialogs
- `dropdown` - For dropdown menus
- `balanceCard` - For wallet balance cards
- `transactionCard` - For transaction items

### Usage Example

```tsx
import { useShadows } from '../utils/theme';

const MyComponent = () => {
  const shadows = useShadows();

  return (
    <View style={[{ backgroundColor: 'white' }, shadows.card]}>
      <Text>Card Content</Text>
    </View>
  );
};
```

## Advanced Usage

### Creating Themed Component Styles

```tsx
// Button.styles.ts
import { StyleSheet } from 'react-native';
import { Theme } from '../utils/theme';

export const createButtonStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      padding: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.interactive.primary,
      ...theme.shadows.button,
    },
    text: {
      ...theme.typography.button.medium,
      color: theme.colors.text.inverse,
    },
  });

// Button.tsx
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../utils/theme';
import { createButtonStyles } from './Button.styles';

export const Button = ({ title, onPress }) => {
  const { theme } = useTheme();
  const styles = createButtonStyles(theme);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};
```

### Using Theme Mode

```tsx
import { useTheme } from '../utils/theme';

const ThemeToggle = () => {
  const { themeMode, isDark, toggleTheme, setThemeMode } = useTheme();

  return (
    <View>
      <Text>Current mode: {themeMode}</Text>
      <Text>Is dark: {isDark ? 'Yes' : 'No'}</Text>

      <Button title="Toggle Theme" onPress={toggleTheme} />
      <Button title="Light" onPress={() => setThemeMode('light')} />
      <Button title="Dark" onPress={() => setThemeMode('dark')} />
      <Button title="Auto" onPress={() => setThemeMode('auto')} />
    </View>
  );
};
```

### Color Utilities

```tsx
import { colorUtils } from '../utils/theme';

// Add opacity to any color
const transparentBlue = colorUtils.withOpacity('#0000FF', 0.5);

// Get shadow color based on theme
const shadowColor = colorUtils.getShadowColor(isDark, 0.2);
```

### Responsive Design

```tsx
import { responsive } from '../utils/theme';

const styles = StyleSheet.create({
  container: {
    padding: responsive.spacing(12, 16, 20), // small, medium, large screens
  },
  title: {
    fontSize: responsive.fontSize(18, 1.2), // base size with scale factor
  },
});
```

## Best Practices

1. **Always use the theme system** instead of hardcoded colors or sizes
2. **Use semantic color names** (e.g., `background.primary` instead of `gray[50]`)
3. **Create themed styles** for reusable components
4. **Use the provided hooks** (`useColors`, `useDimensions`, etc.) for simple cases
5. **Test both light and dark themes** during development
6. **Use responsive utilities** for different screen sizes
7. **Follow the component structure** with separate `.styles.ts` files

## Migration from Hardcoded Styles

### Before

```tsx
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### After

```tsx
import { useTheme } from '../utils/theme';

const MyComponent = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background.primary,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      ...theme.shadows.card,
    },
    text: {
      ...theme.typography.label.medium,
      color: theme.colors.text.primary,
    },
  });

  // ... rest of component
};
```

## Contributing

When adding new colors, dimensions, or text styles:

1. Add them to the appropriate theme file
2. Ensure both light and dark variants are defined
3. Use semantic naming conventions
4. Update this README with new additions
5. Test with the theme toggle functionality
