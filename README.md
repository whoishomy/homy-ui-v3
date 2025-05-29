# HOMY UI v3

Modern health analytics dashboard built with Next.js and Tailwind CSS.

## 📦 Kurulum

```bash
pnpm install
pnpm dev
```

## 🧪 Test

```bash
pnpm test
```

## 🚀 Bileşenler

- ✅ ThemeProvider + useHomyTheme
- ✅ StatusBadge + ColorPresetSystem
- ✅ ProfileVitalsCard
- ✅ ThemeToggleButton
- ✅ DataTrendChart
- ✅ LabResultCard

## 🖼️ CleanShot Dizinleri

- `docs/screenshots/theme-toggle/`
- `docs/screenshots/profile-vitals-card/`
- `docs/screenshots/data-trend-chart/`
- `docs/screenshots/lab-result-card/`

## 🧩 Özellikler

- 🎨 Tam Dark Mode Desteği
- ♿️ ARIA Erişilebilirlik
- 📱 Responsive Tasarım
- 🧪 %100 Test Coverage
- 📊 Veri Görselleştirme
- 🔄 Tema Geçişleri

## 🛠️ Teknolojiler

- React + TypeScript
- Tailwind CSS
- Vitest + Testing Library
- Recharts
- Lucide Icons

## 📚 Kullanım Örnekleri

```tsx
// Tema Değiştirme
<ThemeToggleButton />

// Durum Göstergeleri
<StatusBadge status="warning" label="Beklemede" />

// Vital Bulgular
<ProfileVitalsCard />

// Laboratuvar Sonuçları
<LabResultCard
  title="HbA1c"
  description="Son 3 aylık ortalama şeker düzeyi"
  unit="%"
  data={[
    { date: "2025-05-01", value: 6.2 },
    { date: "2025-05-15", value: 6.0 }
  ]}
/>
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📸 CleanShot Documentation – Sprint 25.0

### 🧪 Lab Result Card

- ✅ `27-May-2025-labresult-default-1440px@2x.png`
- ✅ `27-May-2025-labresult-expanded-darkmode-768px@2x.png`

### 🧠 Insight Overlay

- ✅ `27-May-2025-insight-overlay-hover-1440px@2x.png`

### 🎯 Focus Coach

- 🔄 `27-May-2025-focus-coach-default-1024px@2x.png` (Loading...)

### 📱 Mobile Dashboard

- 🔄 `27-May-2025-mobile-dashboard-default-375px@2x.png` (Loading...)

## Component Status

| Component        | Status | Dark Mode | Responsive |
| ---------------- | ------ | --------- | ---------- |
| Lab Result Card  | ✅     | ✅        | ✅         |
| Insight Overlay  | ✅     | ⚠️        | ✅         |
| Focus Coach      | 🔄     | 🔄        | 🔄         |
| Mobile Dashboard | 🔄     | 🔄        | ✅         |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e
```

## License

MIT © HOMY Health Technologies
