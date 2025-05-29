# Fonksiyonel Sağlık Sistemi - Prompt Güncellemeleri

## Genel Değişiklikler

Aşağıdaki terimler tüm prompt'larda güncellenecektir:

| Eski Terim                  | Yeni Terim                                      |
| --------------------------- | ----------------------------------------------- |
| Fonksiyonel Tıp             | Fonksiyonel Sağlık Sistemi                      |
| Fonksiyonel tıpta çözüm     | Fonksiyonel sağlıkta karar desteği              |
| Fonksiyonel tıp platformu   | Fonksiyonel sağlık ekosistemi                   |
| Fonksiyonel tıp kullanıcısı | HOMY fonksiyonel sağlık sistemine entegre birey |

## Prompt Kategorileri ve Güncellemeler

### 1. Insight Generator Prompts

```typescript
// Eski
const insightPrompt = `
Analyze the given health data using functional medicine principles...
`;

// Yeni
const insightPrompt = `
Analyze the given health data using HOMY's functional health system approach...
`;
```

### 2. Lab Result Analysis Prompts

```typescript
// Eski
const labAnalysisPrompt = `
Interpret lab results through functional medicine lens...
`;

// Yeni
const labAnalysisPrompt = `
Interpret lab results through HOMY's functional health system framework...
`;
```

### 3. Health Recommendation Prompts

```typescript
// Eski
const recommendationPrompt = `
Generate functional medicine based recommendations...
`;

// Yeni
const recommendationPrompt = `
Generate recommendations based on HOMY's functional health system principles...
`;
```

### 4. Patient Communication Prompts

```typescript
// Eski
const communicationPrompt = `
Explain the functional medicine approach to the patient...
`;

// Yeni
const communicationPrompt = `
Explain HOMY's functional health system approach to the user...
`;
```

## Prompt Güncelleme Kontrol Listesi

- [ ] Insight Generator prompt'ları
- [ ] Lab Result Analysis prompt'ları
- [ ] Health Recommendation prompt'ları
- [ ] Patient Communication prompt'ları
- [ ] AI Model Training prompt'ları
- [ ] Documentation Generation prompt'ları
- [ ] UI/UX Content prompt'ları

## Prompt Güncelleme Prensipleri

1. **Kapsayıcı Dil**: "Tıp" yerine "sağlık" terimini kullan
2. **Sistem Vurgusu**: "HOMY'nin fonksiyonel sağlık sistemi" ifadesini öne çıkar
3. **Kullanıcı Odaklı**: "Hasta" yerine "kullanıcı" veya "birey" terimlerini tercih et
4. **Bütünsel Yaklaşım**: Tıbbi ve yaşam tarzı verilerinin entegrasyonunu vurgula

## Prompt Test Süreci

1. Her güncellenen prompt'u test ortamında dene
2. Çıktı kalitesini kontrol et
3. Tutarlılığı değerlendir
4. Gerekirse ince ayar yap
5. Onay sonrası production'a al

## Sonraki Adımlar

1. Tüm prompt'ları gözden geçir ve güncelle
2. Test sürecini başlat
3. Sonuçları değerlendir
4. Production'a geçiş planı hazırla
5. Değişiklikleri dokümante et
