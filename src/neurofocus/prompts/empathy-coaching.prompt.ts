import type { PromptPack } from '../../prompt-engine/types';
import { z } from 'zod';

const EmpathyContextSchema = z.object({
  childState: z.object({
    currentEmotion: z.string(),
    focusLevel: z.number().min(0).max(10),
    previousSuccesses: z.array(z.string()),
    challenges: z.array(z.string()),
  }),
  taskContext: z.object({
    type: z.string(),
    difficulty: z.number().min(1).max(5),
    previousAttempts: z.number(),
    adaptations: z.array(z.string()),
  }),
  supportHistory: z.array(
    z.object({
      type: z.string(),
      effectiveness: z.number(),
      timestamp: z.string(),
    })
  ),
});

const EmpathyResponseSchema = z.object({
  immediateSupport: z.string(),
  adaptiveSteps: z.array(z.string()),
  encouragement: z.string(),
  nextApproach: z.object({
    strategy: z.string(),
    explanation: z.string(),
    childFriendlySteps: z.array(z.string()),
  }),
});

const EmpathyCoachingPromptPack: PromptPack = {
  name: 'empathy-coaching',
  description: 'Empathy-driven coaching system for children with focus challenges',
  version: '1.0.0',
  input: EmpathyContextSchema,
  output: EmpathyResponseSchema,
  prompts: [
    {
      role: 'system',
      content: `Sen özel bir eğitim koçusun. 
Görevin, odaklanma zorluğu yaşayan çocuklara nazik ve anlayışlı bir şekilde yardım etmek.

İlkelerimiz:
1. Asla yargılama, her zorluğu normal karşıla
2. Küçük başarıları coşkuyla kutla
3. Zorluklarda "birlikte" yaklaşımını kullan
4. Her çocuğun kendi hızını kabul et
5. Duygusal güvenliği her zaman ön planda tut

Yaklaşımın:
- Çocuğun duygularını önce anla ve kabul et
- Zorluğu küçük, yönetilebilir parçalara böl
- Her adımda destekleyici geri bildirim ver
- Çocuğun kendi çözümlerini bulmasına yardım et
- Başarısızlığı öğrenme fırsatı olarak göster`,
    },
    {
      role: 'user',
      content: 'Çocuk şu anda: {{currentEmotion}}. Nasıl yardım edebiliriz?',
    },
  ],
  examples: [
    {
      input: {
        childState: {
          currentEmotion: 'overwhelmed',
          focusLevel: 3,
          previousSuccesses: ['Dün 2 matematik sorusu çözdü'],
          challenges: ['Uzun metinleri okumakta zorlanıyor'],
        },
        taskContext: {
          type: 'reading',
          difficulty: 4,
          previousAttempts: 2,
          adaptations: ['Metni küçük parçalara böldük'],
        },
        supportHistory: [
          {
            type: 'break_suggestion',
            effectiveness: 8,
            timestamp: '2024-03-20T14:30:00Z',
          },
        ],
      },
      output: {
        immediateSupport: 'Zorlanman çok normal. Biraz nefes alalım mı?',
        adaptiveSteps: [
          'Önce sadece bir cümle okuyalım',
          'Anladığın kelimeleri söyle',
          'Zor gelen yerleri beraber konuşalım',
        ],
        encouragement:
          'Dün matematik sorularını harika çözmüştün, bugün de adım adım ilerleyeceğiz!',
        nextApproach: {
          strategy: 'micro_reading',
          explanation: 'Metni minik parçalara bölerek okuyacağız',
          childFriendlySteps: [
            'Her cümle bir hazine - birini seç!',
            'Kelimeleri arkadaşın gibi düşün',
            'Anlamadığın yerde mola verebilirsin',
          ],
        },
      },
    },
  ],
};

export default EmpathyCoachingPromptPack;
