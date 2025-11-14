/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#111827',
    background: '#f0fdf4',
    tint: '#10b981',
    icon: '#6b7280',
    tabIconDefault: '#6b7280',
    tabIconSelected: '#10b981',
    button: {
      backgroundColor: '#10b981',
      textColor: '#fff',
      borderColor: '#10b981',
    }, 
    input: {
      background: '#f9fafb',
      text: '#111827',
      placeholder: '#6b7280',
    },
    card: {
      background: '#ffffff',
      text: '#111827',
      border: '#e5e7eb',
    } 
  },
  dark: {
    text: '#ecfdf5',
    background: '#064e3b',
    tint: '#34d399',
    icon: '#a7f3d0',
    tabIconDefault: '#a7f3d0',
    tabIconSelected: '#34d399',
    button: {
      backgroundColor : '#34d399',
      textColor: '#064e3b',
      borderColor: '#34d399',
    },
    input: {
      background: '#065f46',
      text: '#ecfdf5',
      placeholder: '#a7f3d0',
    },
    card: {
      background: '#0f5132',
      text: '#ecfdf5',
      border: '#065f46',
    }, 
  },
}; 

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
