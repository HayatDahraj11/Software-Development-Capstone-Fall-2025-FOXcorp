

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    listText: '#1D2939',
    placeholderText: '#98A2B3',
    background: '#F7F8FA',
    cardBackground: '#f5f5f5ff',
    modalBackground: '#F7F8FA',
    headerBackground: '#F7F8FA',
    fullBright: '#fff',
    buttonBorder: '#E4E7EB',
    listBorderOpaque: 'rgba(29, 41, 57, 1)', 
    listBorderTranslucent: 'rgba(29, 41, 57, 0.25)', 
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    urgent: '#ec5557ff',
    boxBorder: '#11181C',
  },
  dark: {
    text: '#ECEDEE',
    listText: '#abc2e0',
    placeholderText: '#98A2B3',
    background: '#151718',
    cardBackground: '#282828',
    modalBackground: '#101010',
    headerBackground: '#101010',
    fullBright: '#000',
    buttonBorder: '#2c2c2d',
    listBorderOpaque: 'rgba(227, 227, 227, 1)',
    listBorderTranslucent: 'rgba(227, 227, 227, 0.5)', 
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    urgent: '#ec5557ff',
    boxBorder: '#ECEDEE',
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
