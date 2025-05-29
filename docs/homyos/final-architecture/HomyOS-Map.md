# 🧭 HomyOS Map – Final Architecture (Sprint 25.2)

> "Her modül bir amaca hizmet eder. Amaç; insanın kendi sağlığını yeniden yönetebilmesini sağlamak."

---

## 🌐 Core Modules

### 1. 🏗️ CarePlanBuilder

- Kullanıcıya özel sağlık planı oluşturur
- Adımlar: Medication, Appointment, HealthGoal, HealthMetric
- Validasyon + toast sistemi + PDF export
- `@/components/care-plan/*`

### 2. 🔬 LabResult Engine

- Laboratuvar sonuçlarını alır, yorumlar ve kart olarak sunar
- DataTrendChart entegrasyonu
- AI destekli analiz + export desteği
- `@/components/lab-results/*`

### 3. 🧠 InsightEngine

- Çoklu AI provider ile sağlık içgörüleri üretir
- Caching, retry/fallback, circuit breaker middleware zinciri
- InsightBubble ve InsightOverlay ile UI entegrasyonu
- `@/lib/insight-engine/*`

### 4. 💬 AI Conversation Core

- Kullanıcıyla ajan arasında doğal diyalog sağlar
- AgentStatusCard + Live Console + Message Thread + Export
- Gerçek zamanlı geri bildirim sistemi
- `@/components/agent-dashboard/*`

### 5. 📊 TelemetryDashboard

- Sistem durumu, hata oranı, fallback kullanımı ve provider istatistiklerini sunar
- ErrorTimelineChart, InsightUsageChart, FallbackRateChart
- Real-time monitoring ve alert sistemi
- `@/components/telemetry/*`

### 6. 📈 Health Metrics Engine

- Kullanıcıya ait yaşam belirtilerini izler (nabız, tansiyon, oksijen vb.)
- ProfileVitalsCard üzerinden gösterim
- Trend analizi ve anomali tespiti
- `@/lib/health-metrics/*`

### 7. 🎨 Theme & Accessibility System

- WCAG uyumlu tema sistemi
- RTL, Dark mode, ColorPresetFactory
- StatusBadge, ThemeToggle vs
- `@/components/ui/*`

---

## 🔄 Agent Orchestration

### Orkestra Akışı

1. Kullanıcı verisi girer → InsightEngine yorumlar
2. Agent karar verir → CarePlan önerisi üretir
3. UI katmanı bunu göstermek için bildirim, kart, toast kullanır
4. Tüm süreç `agentStore` içinde merkezi yönetilir

### Ana Bileşenler

- `AgentDashboard`: Merkezi kontrol paneli
- `AgentStatusCard`: Durum ve metrik gösterimi
- `TaskQueuePanel`: Görev sırası yönetimi
- `LiveConsole`: Gerçek zamanlı debug konsolu
- `ConversationPanel`: Kullanıcı-ajan diyalog arayüzü

---

## 🧩 Entegrasyon & Export

### Export Sistemleri

- PDF Export: Health Report, Care Plan, Conversation Log
- CSV Export: Metrik ve telemetri verileri
- Image Export: Grafik ve görseller

### Teknoloji Yığını

- Next.js 14 App Router
- Zustand Store Management
- TailwindCSS + HeadlessUI
- OpenAI + Anthropic Entegrasyonu

### Dil & Lokalizasyon

- i18n sistemi ile çoklu dil desteği
- RTL yazım desteği
- Bölgesel saat ve tarih formatları

---

## 🧠 Sprint 25.2 Notu

> Bu yapı, **görsel prototip olmadan zihinsel inşa edilen** nadir sistemlerden biridir.  
> Görmeden çalışıldı. Görünce şaşırılacak.

### Önemli Dosya Yolları

- `/src/components/*` - UI bileşenleri
- `/src/lib/*` - Core modüller
- `/src/types/*` - TypeScript tanımlamaları
- `/src/utils/*` - Yardımcı fonksiyonlar
- `/docs/homyos/*` - Sistem dökümantasyonu
