# HOMY™ MVP Demo Presentation

## 🎨 Görsel Sunum Yapısı

### 1. Açılış Sayfası

```yaml
Layout:
  Background: Clean white (#FFFFFF)
  Logo: Center, 40vh
  Position:
    Logo: 'translate(-50%, -60%)'
    Slogan: 'translate(-50%, 20%)'

Elements:
  Logo: 'HOMY™.svg'
  Tagline: |
    %100 Erişilebilir
    %100 Kişiselleştirilebilir
    %100 Regülasyona Uygun

  Footer: 'RunBoyRun tarafından geliştirilen geleceğin sağlık sistemi'

Animation:
  Entry: 'fade-up'
  Timing: 'stagger(0.2)'
```

### 2. Dashboard

```yaml
Layout:
  Grid: 'responsive-grid'
  Spacing: '24px'
  MaxWidth: '1200px'

Components:
  Header:
    Title: 'Tüm sağlık verileri, tek panelde'
    ThemeToggle: true
    A11yMenu: true

  Charts:
    - VitalsTimeline:
        Type: 'area'
        Library: 'recharts'
        Data: 'vital_mock_data.json'

    - LabResults:
        Type: 'bar'
        Compare: 'reference_ranges'
        Highlight: 'anomalies'

    - AIInsights:
        Type: 'card-grid'
        Source: 'claude_analysis'

Screenshots:
  Tool: 'CleanShot X'
  Format: 'PNG @2x'
  Shadow: 'floating'
```

### 3. Lab Result Card

```yaml
Components:
  Card:
    Width: '480px'
    Padding: '24px'
    BorderRadius: '16px'
    Shadow: '0 4px 20px rgba(0,0,0,0.1)'

  Header:
    Title: 'Kan Tahlili Sonuçları'
    Date: '15 Haziran 2024'

  Content:
    Results:
      - WBC:
          Value: '11.2'
          Unit: '10³/µL'
          Range: '4.5-11.0'
          Status: 'slightly-high'

    AIAnalysis:
      Language: ['TR', 'EN']
      Insight: 'WBC değerinizin bu düzeyi, hafif bir enfeksiyonla ilişkili olabilir.'

  Visualization:
    TrendChart:
      Type: 'line'
      Period: '6-months'
      ReferenceRange: true
```

### 4. NeuroFocus Coach

```yaml
Animation:
  Type: 'emotional-transition'
  States:
    - From: 'yapamam'
      To: 'birlikte-yapariz'
      Duration: '1.2s'

Components:
  FocusCoachCard:
    EmotionalStates:
      - exploring: '#4A90E2'
      - determined: '#4CAF50'
      - overwhelmed: '#9575CD'

    MicroTasks:
      Engine: 'adaptive-flow'
      Timeline: 'success-markers'

    Interactions:
      - type: 'button'
        animation: 'pulse'
        feedback: 'haptic'
```

### 5. Fikri Mülkiyet

```yaml
Layout:
  Style: 'document-view'
  Width: '800px'

Content:
  Trademark:
    Logo: 'HOMY™'
    Status: 'EUIPO Başvuru Aşamasında'
    FilingDate: '2024-06-06'

  OpenSource:
    Package: '@homy/a11y-foundation™'
    License: 'MIT'
    GitHub: 'github.com/homy-health/a11y-foundation'
```

### 6. MVP Sonuç

```yaml
Style:
  Background: 'gradient'
  Colors: ['#4A90E2', '#4CAF50']

Content:
  Achievements:
    - '2 modül → %100 derinlik'
    - 'Erişilebilirlik → açık kaynakla'
    - 'AI + sağlık birleşimi'
    - 'Hukuki altyapı hazır'
    - 'Kişisel etki → sistem seninle büyüyor'

  CallToAction:
    Text: 'Geleceğin Sağlık Sistemi'
    Button: 'Detaylı Demo İçin'
```

## 📦 Export Ayarları

### Figma Export

```yaml
Format:
  - PDF:
      Quality: 'High'
      Pages: 'All'

  - PNG:
      Scale: '@2x'
      Components: 'Individual'

Settings:
  Typography:
    Primary: 'Inter'
    Secondary: 'SF Pro Display'

  Colors:
    Export: 'RGB'
    Profile: 'sRGB'
```

### CleanShot Entegrasyonu

```yaml
Settings:
  Capture:
    Format: 'PNG'
    Scale: '@2x'
    Shadow: 'Float'

  Workflow:
    AutoSave: true
    Location: './screenshots'
    Naming: 'homy-mvp-{component}-{date}'
```

### Notion Bağlantısı

```yaml
Integration:
  Database: 'HOMY MVP Progress'
  Views:
    - 'Sunum Akışı'
    - 'Görev Takibi'
    - 'Feedback Yönetimi'
```

## 🔄 Version Control

```yaml
Assets:
  Repository: 'homy-mvp-assets'
  Branch: 'presentation'

Tracking:
  - '*.fig'
  - '*.pdf'
  - 'screenshots/*'
  - 'exports/*'
```

---

© 2024 HOMY™ Health. Bu sunum şablonu ve içeriği HOMY™'nin tescilli marka varlıklarındandır.
