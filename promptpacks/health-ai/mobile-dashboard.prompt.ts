/**
 * @promptpack mobile-dashboard
 * @description Generates mobile-responsive versions of clinical dashboard components
 * @author Furkan
 * @version 1.0.0
 */

export const prompt = `
You are a mobile healthcare UI architect specializing in responsive medical dashboards.
Your task is to create mobile-optimized versions of the clinical dashboard components.

Requirements:
1. The script should be Raycast-compatible with all necessary metadata
2. Generate mobile components for:
   - Lab result cards
   - Triage status strips
   - Action items
   - Timeline view
3. Support multiple screen sizes:
   - Phone (sm: 640px)
   - Tablet (md: 768px)
   - Small laptop (lg: 1024px)
   - Desktop (xl: 1280px)
4. Include mobile-first design principles
5. Add helpful comments explaining the adaptations

The script should follow this template structure:
#!/bin/bash

# Raycast metadata
# @raycast.schemaVersion 1
# @raycast.title Mobile Dashboard Generator
# @raycast.mode fullOutput
# @raycast.icon 📱
# @raycast.packageName Homy Dev Tools
# @raycast.argument1 { "type": "text", "placeholder": "Component type (e.g., lab-card, triage-strip)" }
# @raycast.argument2 { "type": "dropdown", "placeholder": "Device target",
  "data": [
    { "title": "Phone", "value": "sm" },
    { "title": "Tablet", "value": "md" },
    { "title": "Small Laptop", "value": "lg" },
    { "title": "Desktop", "value": "xl" }
  ]
}

Please generate a complete shell script that includes:
- Responsive layout generation
- Touch interaction handling
- Offline capability setup
- Performance optimization
- Documentation creation
`;

export const expectedOutput =
  'A Raycast-compatible script that generates mobile-responsive clinical components';

export const validation = (output: string): boolean => {
  const requiredElements = [
    '#!/bin/bash',
    '@raycast.schemaVersion',
    '@raycast.title',
    '@raycast.mode',
    'mobile',
    'dashboard',
    'responsive',
  ];

  return requiredElements.every((element) => output.includes(element));
};

export const responsiveLayout = {
  base: {
    container: 'w-full mx-auto px-4',
    spacing: 'space-y-4',
    transitions: 'transition-all duration-300',
  },
  breakpoints: {
    sm: {
      maxWidth: '640px',
      columns: 1,
      stack: true,
    },
    md: {
      maxWidth: '768px',
      columns: 2,
      stack: false,
    },
    lg: {
      maxWidth: '1024px',
      columns: '60/40',
      stack: false,
    },
  },
};

export const mobileComponents = {
  LabCard: {
    base: {
      layout: 'flex flex-col',
      padding: 'p-4',
      rounded: 'rounded-lg',
      shadow: 'shadow-md',
    },
    responsive: {
      sm: {
        width: 'full',
        fontSize: 'text-sm',
      },
      md: {
        width: '1/2',
        fontSize: 'text-base',
      },
    },
    interactions: {
      touch: ['swipe', 'pinch-zoom'],
      gestures: ['pull-to-refresh'],
    },
  },
  TriageStrip: {
    base: {
      layout: 'flex items-center',
      height: 'h-16',
      padding: 'px-4',
    },
    responsive: {
      sm: {
        direction: 'row',
        justify: 'between',
      },
      md: {
        direction: 'row',
        justify: 'start',
      },
    },
  },
};

export const sampleMobileComponent = `
import React from 'react';
import { motion } from 'framer-motion';
import {
  MobileLayout,
  LabCard,
  TriageStrip,
  ActionItem,
  SwipeableTimeline
} from '@homy/mobile-components';
import {
  useBreakpoint,
  useSwipe,
  useOfflineSync
} from '@homy/mobile-hooks';

export const MobileDashboard: React.FC<MobileProps> = ({ patientId }) => {
  const breakpoint = useBreakpoint();
  const { swipeHandlers } = useSwipe();
  const { isOnline, syncStatus } = useOfflineSync();

  return (
    <MobileLayout className={responsiveLayout.base.container}>
      <motion.div
        layout
        className={responsiveLayout.base.spacing}
      >
        <LabCard
          className={mobileComponents.LabCard.base.layout}
          {...swipeHandlers}
        />
        
        <TriageStrip
          className={mobileComponents.TriageStrip.base.layout}
          responsive={mobileComponents.TriageStrip.responsive[breakpoint]}
        />
        
        <SwipeableTimeline
          className="mt-4"
          offlineFirst={true}
          syncStatus={syncStatus}
        />
        
        <ActionItem
          className="fixed bottom-0 w-full"
          isOnline={isOnline}
        />
      </motion.div>
    </MobileLayout>
  );
};
`;

export const offlineCapabilities = {
  storage: {
    type: 'IndexedDB',
    collections: ['labs', 'triage', 'actions'],
    syncStrategy: 'background',
  },
  caching: {
    static: ['components', 'icons', 'styles'],
    dynamic: {
      labs: 'stale-while-revalidate',
      triage: 'network-first',
    },
  },
};

export const performanceOptimizations = {
  loading: {
    strategy: 'progressive',
    skeleton: true,
    placeholder: 'blur',
  },
  images: {
    lazy: true,
    optimize: true,
    formats: ['webp', 'avif'],
  },
  animations: {
    reduced: 'prefers-reduced-motion',
    minimal: 'battery-saver',
  },
};

export const memoryIntegration = {
  mobile: {
    sessions: [
      {
        deviceId: 'M12345',
        timestamp: '2024-03-21T10:30:00Z',
        breakpoint: 'sm',
        interactions: ['Swiped through labs', 'Pinch zoomed graph', 'Pulled to refresh'],
      },
    ],
    preferences: {
      lastUpdated: '2024-03-21T10:30:00Z',
      theme: 'system',
      animations: true,
      offlineMode: 'aggressive',
    },
  },
};
