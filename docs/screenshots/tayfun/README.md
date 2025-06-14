# 🧪 Tayfun Vaka Sunumu

Bu dokümantasyon, Tayfun vakası için hazırlanan klinik dashboard uygulamasının ekran görüntülerini içermektedir.

## 🔐 Login

![login-filled](./login/login-filled.png)

_Giriş ekranında kullanıcı doğrulama ve yetkilendirme işlemleri yapılmaktadır._

## 📊 Dashboard

![dashboard-insight-open](./dashboard/dashboard-insight-open.png)

_Dashboard ekranında hastanın genel durumu, metabolik risk değerlendirmesi ve kritik laboratuvar sonuçları görüntülenmektedir._

## 🧬 Lab Results

![labresults-multi-results](./lab-results/labresults-multi-results.png)

_Laboratuvar sonuçları ekranında Glukoz, Kreatinin ve HbA1c değerleri, referans aralıkları ve trend analizleri yer almaktadır._

## 🩺 Care Plan

![careplan-generated-plan](./care-plan/careplan-generated-plan.png)

_Bakım planı ekranında önerilen konsültasyonlar, randevular ve takip planları görüntülenmektedir._

## 📋 Teknik Detaylar

- **Framework**: Next.js 14
- **UI Library**: Tailwind CSS
- **State Management**: React Context API
- **Data Flow**: TayfunContext Provider
- **Components**:
  - InsightOverlay
  - LabResultCard
  - CarePlanBuilder

## 🎯 Vaka Özeti

Tayfun vakası, yüksek riskli bir diyabet hastasının takibini içermektedir. Dashboard üzerinden:

- Metabolik risk değerlendirmesi
- Laboratuvar sonuçlarının trend analizi
- Multidisipliner konsültasyon planlaması
- Hasta özelinde bakım planı oluşturulması

gibi işlemler yapılabilmektedir.

## Demo Notları

- Her sayfada Tayfun vakasına özel veriler
- Context üzerinden merkezi veri yönetimi
- Responsive tasarım (mobil uyumlu)
- Türkçe arayüz desteği

## Sonraki Adımlar

1. i18n entegrasyonu
2. UI iyileştirmeleri
3. Toast bildirimleri
4. Error boundary'ler

Son Güncelleme: $(date +"%Y-%m-%d %H:%M:%S")
