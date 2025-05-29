# HOMY™ MVP Sunum Varlıkları

## 📸 Screenshot Kılavuzu

### 1. Dashboard Ekranı

```yaml
Capture:
  Resolution: '1440x900'
  Components:
    - MainDashboard:
        Path: './src/components/Dashboard/MainView.tsx'
        State: 'loaded'
        Theme: 'light'

    - VitalsWidget:
        Path: './src/components/Charts/VitalsTimeline.tsx'
        Data: 'sample_vitals.json'
        Animation: 'active'

    - LabResults:
        Path: './src/components/LabResults/ResultCard.tsx'
        Highlight: 'anomaly-detection'
```

### 2. Lab Sonuç Kartı

```yaml
Capture:
  Resolution: '480x640'
  States:
    - Normal:
        Values: 'within-range'
        Theme: 'calm'

    - Anomaly:
        Values: 'out-of-range'
        Theme: 'attention'
        AIInsight: true
```

### 3. NeuroFocus Coach

```yaml
Capture:
  Resolution: '600x800'
  Sequence:
    1: 'initial-state'
    2: 'emotion-selection'
    3: 'adaptive-response'
    4: 'success-celebration'
```

## 🎨 Figma Hazırlığı

### Ana Şablon

```yaml
Frame:
  Name: 'HOMY-MVP-Demo'
  Size: '1920x1080'
  Grid: '8px'

Styles:
  Colors:
    Primary: '#4A90E2'
    Success: '#4CAF50'
    Focus: '#9575CD'
    Warning: '#FFB74D'

  Typography:
    Title: 'Inter/Bold/48px'
    Subtitle: 'Inter/Medium/24px'
    Body: 'Inter/Regular/16px'
```

### Komponent Kütüphanesi

```yaml
Components:
  - CardBase:
      Variants:
        - Default
        - Elevated
        - Interactive

  - DataVisuals:
      - Charts
      - Graphs
      - Indicators

  - Navigation:
      - Tabs
      - Breadcrumbs
      - Menu
```

## 📦 Asset Organizasyonu

```
/assets
├── logos/
│   ├── homy-logo-primary.svg
│   ├── homy-logo-dark.svg
│   └── homy-trademark.svg
│
├── screenshots/
│   ├── dashboard/
│   │   ├── main-view.png
│   │   ├── vitals-widget.png
│   │   └── lab-results.png
│   │
│   ├── lab-card/
│   │   ├── normal-state.png
│   │   └── anomaly-state.png
│   │
│   └── neurofocus/
│       ├── coach-initial.png
│       ├── coach-response.png
│       └── success-state.png
│
├── icons/
│   ├── accessibility/
│   ├── navigation/
│   └── indicators/
│
└── backgrounds/
    ├── gradient-light.png
    └── gradient-dark.png
```

## 🔍 Kalite Kontrol

### Screenshot Checklist

```yaml
Resolution:
  - Minimum: '2x'
  - Format: 'PNG'
  - Compression: 'Lossless'

Visibility:
  - Text: 'Crisp'
  - Icons: 'Sharp'
  - Colors: 'Accurate'

States:
  - Loading: 'Captured'
  - Error: 'Documented'
  - Success: 'Highlighted'
```

### Erişilebilirlik Kontrolü

```yaml
Contrast:
  - Text: '4.5:1 minimum'
  - UI: '3:1 minimum'

Color:
  - Blindness: 'Tested'
  - Schemes: 'Verified'

Motion:
  - Reduced: 'Supported'
  - Paused: 'Available'
```

## 📤 Export Spesifikasyonları

### Figma Export Settings

```yaml
PDF:
  Quality: 'High'
  Format: 'Single PDF'
  Pages: 'All'

PNG:
  Scale: '2x'
  Format: 'PNG'
  Suffix: '@2x'

SVG:
  Format: 'SVG'
  Include: 'id'
```

### CleanShot Settings

```yaml
Capture:
  Format: 'PNG'
  Scale: '2x'
  Shadow: 'Float'

Workflow:
  AutoSave: true
  Location: './screenshots'
  Naming: 'homy-mvp-{component}-{date}'
```

---

© 2024 HOMY™ Health. Bu asset kılavuzu HOMY™'nin tescilli marka varlıklarındandır.
