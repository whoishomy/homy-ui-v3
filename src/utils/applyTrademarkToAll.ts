import { defaultTrademarkKit } from '../../promptpacks/trademark-visual-kit.prompt';
import { getTrademarkName } from './trademark';

const CSS_VARIABLES = `
:root {
  --homy-primary: ${defaultTrademarkKit.visualIdentity.colors.primary};
  --homy-success: ${defaultTrademarkKit.visualIdentity.colors.success};
  --homy-focus: ${defaultTrademarkKit.visualIdentity.colors.focus};
  --homy-warning: ${defaultTrademarkKit.visualIdentity.colors.warning};

  --homy-font-title: ${defaultTrademarkKit.visualIdentity.typography.title.split('/')[0]};
  --homy-font-subtitle: ${defaultTrademarkKit.visualIdentity.typography.subtitle.split('/')[0]};
  --homy-font-body: ${defaultTrademarkKit.visualIdentity.typography.body.split('/')[0]};

  --homy-spacing-grid: ${defaultTrademarkKit.visualIdentity.spacing.grid};
  --homy-spacing-padding: ${defaultTrademarkKit.visualIdentity.spacing.padding};
}

/* Global Typography */
h1, h2 {
  font-family: var(--homy-font-title);
  font-weight: bold;
  color: var(--homy-primary);
}

h3, h4 {
  font-family: var(--homy-font-subtitle);
  font-weight: 500;
  color: var(--homy-primary);
}

body {
  font-family: var(--homy-font-body);
  font-weight: normal;
}

/* Interactive Elements */
button {
  font-family: var(--homy-font-body);
  transition: all 0.2s;
}

button:focus {
  outline: 2px solid var(--homy-focus);
  outline-offset: 2px;
}

/* Accessibility Enhancements */
*[role="region"] {
  margin: var(--homy-spacing-grid) 0;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Status Colors */
.success { color: var(--homy-success); }
.focus { color: var(--homy-focus); }
.warning { color: var(--homy-warning); }
`;

export function injectTrademarkStyles() {
  // Create and inject global styles
  const styleElement = document.createElement('style');
  styleElement.textContent = CSS_VARIABLES;
  document.head.appendChild(styleElement);

  // Add meta tags for branding
  const metaTags = [
    { name: 'application-name', content: defaultTrademarkKit.brandName },
    { name: 'theme-color', content: defaultTrademarkKit.visualIdentity.colors.primary },
    { property: 'og:site_name', content: defaultTrademarkKit.brandName },
  ];

  metaTags.forEach(({ name, content, property }) => {
    const meta = document.createElement('meta');
    if (name) meta.setAttribute('name', name);
    if (property) meta.setAttribute('property', property);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  });
}

export function updateComponentName(element: HTMLElement) {
  const currentLabel = element.getAttribute('aria-label');
  if (currentLabel) {
    element.setAttribute('aria-label', getTrademarkName(currentLabel));
  }
}

// Font loading utility
export function loadTrademarkFonts() {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

// Initialize all trademark styles
export function initializeTrademarkSystem() {
  loadTrademarkFonts();
  injectTrademarkStyles();

  // Add observer for dynamically added components
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          updateComponentName(node);
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
