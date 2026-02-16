# Logo Component

A comprehensive, themed Logo component for the YoexWallet React Native application.

## Features

- 🎨 **Theme Integration** - Automatically adapts to light/dark themes
- 📱 **Responsive Design** - Multiple size variants and responsive behavior
- 🖼️ **Image Support** - Handles PNG, JPG, and other image formats
- 🔄 **Loading States** - Built-in loading and error handling
- 📝 **Text Support** - Optional text with customizable positioning
- 🎯 **Interactive** - Optional onPress handling
- ♿ **Accessibility** - Full accessibility support
- 🎨 **Multiple Variants** - Different styling options

## Installation

Place your logo file in `src/assets/logo.png`. The component will automatically load this file.

**Recommended logo specifications:**

- Format: PNG with transparency
- Size: 512x512px or higher
- Aspect ratio: 1:1 (square) works best

## Basic Usage

```tsx
import { Logo } from '../components/common/Logo';

// Basic logo
<Logo />

// Logo with text
<Logo showText={true} />

// Large logo with interaction
<Logo
  size="xl"
  showText={true}
  onPress={() => console.log('Logo pressed!')}
/>
```

## Props

### Size & Dimensions

| Prop     | Type                                            | Default | Description                    |
| -------- | ----------------------------------------------- | ------- | ------------------------------ |
| `size`   | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'xxl'` | `'md'`  | Predefined size variants       |
| `width`  | `number`                                        | -       | Custom width (overrides size)  |
| `height` | `number`                                        | -       | Custom height (overrides size) |

**Size Reference:**

- `xs`: 32x32px
- `sm`: 40x40px
- `md`: 48x48px (default)
- `lg`: 64x64px
- `xl`: 80x80px
- `xxl`: 120x120px

### Image & Source

| Prop     | Type                  | Default    | Description         |
| -------- | --------------------- | ---------- | ------------------- |
| `source` | `ImageSourcePropType` | `logo.png` | Custom image source |

### Text Content

| Prop           | Type                            | Default        | Description                    |
| -------------- | ------------------------------- | -------------- | ------------------------------ |
| `showText`     | `boolean`                       | `false`        | Whether to show text with logo |
| `text`         | `string`                        | `'YoexWallet'` | Text content                   |
| `textPosition` | `'bottom' \| 'right' \| 'none'` | `'bottom'`     | Text positioning               |

### Interaction

| Prop       | Type         | Default | Description                          |
| ---------- | ------------ | ------- | ------------------------------------ |
| `onPress`  | `() => void` | -       | Press handler (makes logo touchable) |
| `disabled` | `boolean`    | `false` | Disable interaction                  |

### Styling Variants

| Prop      | Type                                                                                                | Default     | Description    |
| --------- | --------------------------------------------------------------------------------------------------- | ----------- | -------------- |
| `variant` | `'default' \| 'elevated' \| 'bordered' \| 'circular' \| 'background-light' \| 'background-primary'` | `'default'` | Visual variant |

**Variant Examples:**

- `default`: Clean logo without decoration
- `elevated`: Logo with shadow
- `bordered`: Logo with border
- `circular`: Circular container
- `background-light`: Light background
- `background-primary`: Primary color background

### Custom Styling

| Prop         | Type         | Default | Description               |
| ------------ | ------------ | ------- | ------------------------- |
| `style`      | `ViewStyle`  | -       | Container style overrides |
| `imageStyle` | `ImageStyle` | -       | Image style overrides     |
| `textStyle`  | `TextStyle`  | -       | Text style overrides      |

### States

| Prop      | Type      | Default | Description        |
| --------- | --------- | ------- | ------------------ |
| `loading` | `boolean` | `false` | Show loading state |

### Accessibility

| Prop                 | Type     | Default             | Description         |
| -------------------- | -------- | ------------------- | ------------------- |
| `accessibilityLabel` | `string` | `'YoexWallet Logo'` | Accessibility label |
| `testID`             | `string` | `'logo'`            | Test identifier     |

### Responsive

| Prop         | Type      | Default | Description                |
| ------------ | --------- | ------- | -------------------------- |
| `responsive` | `boolean` | `true`  | Enable responsive behavior |

## Examples

### Basic Logos

```tsx
// Simple logo
<Logo />

// Small logo
<Logo size="sm" />

// Large logo
<Logo size="xl" />
```

### Logo with Text

```tsx
// Logo with text below
<Logo showText={true} />

// Logo with text on the right
<Logo
  showText={true}
  textPosition="right"
/>

// Custom text
<Logo
  showText={true}
  text="My Wallet"
/>
```

### Interactive Logo

```tsx
// Clickable logo
<Logo
  onPress={() => navigation.navigate('Home')}
  variant="elevated"
/>

// Disabled logo
<Logo
  onPress={handlePress}
  disabled={true}
/>
```

### Styled Variants

```tsx
// Elevated with shadow
<Logo variant="elevated" />

// Circular logo
<Logo variant="circular" />

// Logo with border
<Logo variant="bordered" />

// Logo with background
<Logo variant="background-primary" />
```

### Custom Styling

```tsx
// Custom dimensions
<Logo
  width={100}
  height={100}
/>

// Custom styles
<Logo
  style={{ marginTop: 20 }}
  imageStyle={{ tintColor: 'red' }}
  textStyle={{ color: 'blue' }}
/>
```

### Loading and Error States

```tsx
// Loading state
<Logo loading={true} />

// The component automatically handles image loading errors
// and shows a placeholder when the image fails to load
```

### Custom Image Source

```tsx
// Using a different image
<Logo
  source={require('../assets/custom-logo.png')}
/>

// Using a remote image
<Logo
  source={{ uri: 'https://example.com/logo.png' }}
/>
```

## Theme Integration

The Logo component automatically adapts to your app's theme:

```tsx
// The logo will automatically use theme colors for text
// and adapt to light/dark mode
<Logo showText={true} variant="elevated" />
```

## Responsive Behavior

When `responsive={true}` (default), the logo automatically:

- Adjusts to different screen sizes
- Maintains proper proportions
- Scales text appropriately

## Error Handling

The component gracefully handles:

- Missing logo files (shows placeholder)
- Image load failures (shows error state)
- Network errors for remote images

## Accessibility

The Logo component includes:

- Proper accessibility labels
- Screen reader support
- Touch target sizing
- Semantic roles for interactive logos

## Best Practices

1. **Use appropriate sizes** - Choose sizes that fit your layout context
2. **Provide custom accessibility labels** for different contexts
3. **Test with missing logo** - The component handles missing assets gracefully
4. **Use consistent variants** throughout your app
5. **Consider theme compatibility** when using custom colors

## Migration Guide

If you have existing logo implementations:

### Before

```tsx
<Image
  source={require('../assets/logo.png')}
  style={{ width: 48, height: 48 }}
/>
```

### After

```tsx
<Logo size="md" />
```

This provides automatic theming, error handling, and responsive behavior.
