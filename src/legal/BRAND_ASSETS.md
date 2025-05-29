# HOMY™ Marka Varlıkları Kılavuzu

## 🎨 Görsel Kimlik Sistemi

### Logo Kullanımı

```
PRIMARY LOGO
├── Digital
│   ├── homy-logo-color.svg    // Web, mobil
│   ├── homy-logo-dark.svg     // Karanlık mod
│   └── homy-logo-light.svg    // Açık mod
│
├── Print
│   ├── homy-logo-cmyk.ai     // Baskı
│   └── homy-logo-spot.eps    // Özel baskı
│
└── Accessibility
    ├── homy-high-contrast.svg // Yüksek kontrast
    └── homy-simplified.svg    // Basitleştirilmiş
```

### Marka İşaretleri

```css
/* Trademark Sembolleri */
.trademark {
  &-tm { content: "™"; }  /* Başvuru öncesi */
  &-r  { content: "®"; }  /* Tescil sonrası */
}

/* Kullanım Örnekleri */
HOMY™              /* Standart kullanım */
@homy/package™     /* NPM paketleri */
HOMY® (gelecekte)  /* Tescil sonrası */
```

### Renk Sistemi

```scss
// Ana Renkler
$homy-primary: (
  accessibility-blue: #4a90e2,
  success-green: #4caf50,
  focus-purple: #9575cd,
  energy-orange: #ffb74d,
);

// Erişilebilirlik Paleti
$homy-accessible: (
  contrast-ratio: 4.5,
  dark-mode: true,
  color-blind: true,
);
```

## 📱 Dijital Varlıklar

### Web Varlıkları

```typescript
interface DigitalAssets {
  favicon: {
    ico: '/favicon.ico';
    png: '/favicon-32x32.png';
    apple: '/apple-touch-icon.png';
  };
  og_images: {
    default: '/og-image.jpg';
    twitter: '/twitter-card.jpg';
    linkedin: '/linkedin-banner.jpg';
  };
  app_icons: {
    maskable: '/maskable-icon.png';
    adaptive: '/adaptive-icon.png';
  };
}
```

### Sosyal Medya

```yaml
LinkedIn:
  banner: 1128x191px
  logo: 400x400px
  watermark: true

Twitter:
  header: 1500x500px
  profile: 400x400px
  card: 1200x628px

Instagram:
  profile: 320x320px
  story: 1080x1920px
  post: 1080x1080px
```

## 📝 Metin Varlıkları

### Marka Adı Kullanımı

```markdown
✅ Doğru Kullanımlar:

- HOMY™
- HOMY™ Health
- HOMY™ NeuroFocus
- @homy/a11y-foundation™

❌ Yanlış Kullanımlar:

- Homy
- HOMY
- @Homy
- homy health
```

### Slogan Kullanımı

```yaml
Kurumsal:
  TR: 'Erişilebilir. Kişisel. Regüle.'
  EN: 'Accessible. Personal. Regulated.'

Motivasyonel:
  TR: 'Koş Oğlum Koş, Sağlığın İçin'
  EN: 'RunBoyRun for Health'
```

## 🖼 Uygulama Örnekleri

### UI Komponentleri

```tsx
// Logo Komponenti
<HomyLogo
  variant="primary"
  mode="light"
  trademark={true}
  size="medium"
/>

// Marka Metni
<BrandText
  product="HOMY™"
  trademark={true}
  locale="tr-TR"
/>
```

### Doküman Şablonları

```
/templates/
├── presentations/
│   ├── pitch-deck.key
│   └── investor-deck.pptx
│
├── documents/
│   ├── letterhead.docx
│   └── report.docx
│
└── marketing/
    ├── email-signature.html
    └── newsletter.mjml
```

## 📏 Teknik Özellikler

### Minimum Boyutlar

```css
.homy-logo {
  --min-width-digital: 32px;
  --min-width-print: 10mm;
  --clear-space: 1x; /* x = logo yüksekliği */
}
```

### Dosya Formatları

```yaml
Vector:
  - .svg # Web için
  - .ai # Adobe Illustrator
  - .eps # Baskı için

Raster:
  - .png # Web için
  - .jpg # Sosyal medya
  - .webp # Performans için
```

## ⚖️ Yasal Kullanım

### Telif Hakkı Bildirimi

```
© 2024 HOMY™ Health. Tüm hakları saklıdır.
HOMY™, Avrupa Birliği'nde tescil başvurusu yapılmış bir markadır.
```

### Lisans Bildirimi

```
@homy/a11y-foundation™ MIT Lisansı altında açık kaynak olarak sunulmuştur.
Diğer tüm marka varlıkları HOMY™ Health'in tescilli ticari markalarıdır.
```

---

Bu kılavuz, HOMY™'nin marka kimliğini korumak ve tutarlı bir şekilde kullanmak için hazırlanmıştır.
Güncellemeler için: brand@homy.health
