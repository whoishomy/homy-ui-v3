import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { InsightOverlay } from '../components/InsightOverlay';
import { withThemeByClassName } from '@storybook/addon-themes';

const meta: Meta<typeof InsightOverlay> = {
  title: 'Components/InsightOverlay/Test',
  component: InsightOverlay,
  parameters: {
    layout: 'fullscreen',
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'aria-dialog',
            enabled: true,
          },
        ],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
        'high-contrast': 'high-contrast dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default meta;
type Story = StoryObj<typeof InsightOverlay>;

const mockInsights = [
  {
    id: 'vital-1',
    title: 'Yüksek Tansiyon Riski',
    description: 'Son ölçümlerinize göre tansiyon değerleriniz yükseliş eğiliminde.',
    severity: 'high',
    category: 'vital',
    date: new Date(),
  },
  {
    id: 'activity-1',
    title: 'Düşük Aktivite Seviyesi',
    description: 'Bu hafta hedeflenen aktivite seviyesinin altında kaldınız.',
    severity: 'medium',
    category: 'activity',
    date: new Date(),
  },
  {
    id: 'sleep-1',
    title: 'Uyku Düzeni İyileşiyor',
    description: 'Uyku düzeniniz son 2 haftada belirgin şekilde iyileşme gösterdi.',
    severity: 'low',
    category: 'sleep',
    date: new Date(),
  },
];

export const AccessibilityTest: Story = {
  name: 'Accessibility Test',
  args: {
    insights: mockInsights,
    onClose: () => console.log('Close clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: `
### Accessibility Features

1. Keyboard Navigation
- Escape tuşu overlay'i kapatır
- Tab tuşu ile tüm etkileşimli öğeler arasında gezinebilirsiniz
- Arrow tuşları ile insight'lar arasında gezinebilirsiniz
- Focus trap aktif (focus overlay içinde kalır)

2. ARIA Attributes
- role="dialog"
- aria-label="İçgörü Telemetrisi"
- aria-live regions for dynamic content
- aria-expanded state management

3. Color Contrast
- WCAG AA standartlarına uygun kontrast oranları
- Dark mode desteği
- High contrast theme desteği

4. Motion & Animation
- prefers-reduced-motion desteği
- Kontrollü geçiş animasyonları

### Test Kılavuzu

1. Klavye Testi:
   - Tab ile tüm öğeleri gezin
   - Escape ile kapatmayı deneyin
   - Arrow tuşları ile insight'lar arası geçişi kontrol edin

2. Ekran Okuyucu Testi:
   - Başlık ve açıklamaların okunmasını dinleyin
   - Severity badge'lerinin doğru okunduğunu kontrol edin
   - Dinamik içeriğin güncellendiğini doğrulayın

3. Görsel Test:
   - Light/Dark mode geçişlerini kontrol edin
   - Focus ring görünürlüğünü doğrulayın
   - Animasyon akıcılığını gözlemleyin
        `,
      },
    },
  },
};

export const LightTheme: Story = {
  name: 'Light Theme',
  args: {
    insights: mockInsights,
    onClose: () => console.log('Close clicked'),
  },
  parameters: {
    theme: 'light',
    docs: {
      description: {
        story: `
### Light Theme Testing

1. Visual States
- Default State: Check contrast and readability
- Expanded State: Verify content visibility
- Hover State: Confirm hover effects
- Focus State: Validate focus indicators

2. Accessibility Features
- Color contrast meets WCAG AA standards
- Focus indicators are clearly visible
- Text is readable at all sizes
        `,
      },
    },
  },
};

export const DarkTheme: Story = {
  name: 'Dark Theme',
  args: {
    insights: mockInsights,
    onClose: () => console.log('Close clicked'),
  },
  parameters: {
    theme: 'dark',
    docs: {
      description: {
        story: `
### Dark Theme Testing

1. Visual States
- Default State: Verify dark mode colors
- Expanded State: Check content visibility
- Hover State: Test hover effects
- Focus State: Validate focus rings

2. Accessibility Features
- Dark mode color contrast meets WCAG AA
- Focus indicators visible against dark bg
- Text remains readable in dark mode
        `,
      },
    },
  },
};

export const HighContrastTheme: Story = {
  name: 'High Contrast Theme',
  args: {
    insights: mockInsights,
    onClose: () => console.log('Close clicked'),
  },
  parameters: {
    theme: 'high-contrast',
    docs: {
      description: {
        story: `
### High Contrast Theme Testing

1. Visual States
- Default State: Maximum contrast colors
- Expanded State: Enhanced visibility
- Hover State: Clear state changes
- Focus State: Prominent indicators

2. Accessibility Features
- Meets WCAG AAA contrast requirements
- Enhanced focus indicators
- Maximum readability for all text
        `,
      },
    },
  },
};
