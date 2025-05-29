import type { EmotionalResponse } from '../core/types';

export const GrowthPromptPack = {
  taskBreakdown: {
    introduction: (taskName: string) => `
      Hadi ${taskName} görevini birlikte keşfedelim! 🌱
      Bu yolculukta yanındayım ve her adımda sana destek olacağım.
      Önce küçük adımlarla başlayacağız, hazır mısın?
    `,

    stepStart: (stepName: string) => `
      ${stepName} adımına başlıyoruz!
      Bu adımda sadece keşfediyoruz, acele yok.
      Birlikte yapacağız! 🤝
    `,

    stepComplete: (stepName: string) => `
      ${stepName} adımını tamamladın! 🌟
      Bu çok önemli bir başarı!
      Her küçük adım, büyük yolculuğun bir parçası.
    `,
  },

  emotionalSupport: {
    exploring: {
      message: 'Keşfetmek çok güzel! Merak ettiğin her şeyi sorabilirsin.',
      support: 'Birlikte öğrenmek daha keyifli! 🔍',
    },
    frustrated: {
      message: 'Bazen zorlanmak çok normal. Bu da öğrenmenin bir parçası.',
      support: 'Biraz nefes alalım, sonra birlikte deneyelim. 🫂',
    },
    overwhelmed: {
      message: 'Çok fazla gibi görünebilir, ama birlikte küçük parçalara böleceğiz.',
      support: 'Önce bir adım, sonra diğeri. Acele yok! 🌱',
    },
    discouraged: {
      message: 'Her "yapamıyorum" aslında "henüz yapamıyorum" demek.',
      support: 'Birlikte denemeye devam edelim! 💪',
    },
    tired: {
      message: 'Yorulmak çok normal! İyi bir mola vermek de başarının parçası.',
      support: 'Dinlendikten sonra daha güçlü döneceksin! 😴',
    },
    proud: {
      message: 'İşte bu! Kendine güvendiğinde neler yapabildiğini gördün mü?',
      support: 'Bu gurur senin hakkın! 🌟',
    },
    curious: {
      message: 'Merak etmek öğrenmenin ilk adımı! Harika sorular soruyorsun!',
      support: 'Birlikte keşfedelim! 🔍',
    },
    determined: {
      message: 'Bu kararlılık çok değerli! Seninle gurur duyuyorum!',
      support: 'Yanında olduğumu unutma! 🚀',
    },
  },

  streakCelebrations: [
    'Her adımda daha da güçleniyorsun! 💪',
    'İnanılmaz bir ilerleme kaydediyorsun! 🌟',
    'Bu azim bambaşka! Seninle gurur duyuyorum! 🏆',
  ],

  dailyReflections: {
    morning: 'Yeni bir gün, yeni keşifler! Bugün neler öğreneceğiz?',
    evening: (achievements: number) => `
      Bugün ${achievements} başarı elde ettin!
      Her biri senin büyüme hikayenin bir parçası.
      Yarın yeni maceralar bizi bekliyor! ✨
    `,
  },

  generateResponse: (emotion: EmotionalResponse['type']) => {
    const support = GrowthPromptPack.emotionalSupport[emotion];
    return {
      message: support.message,
      encouragement: support.support,
      timestamp: new Date().toISOString(),
    };
  },
} as const;
