# NeuroFocus Coach Accessibility Guide

## Core Principles

1. Every child deserves equal access to learning tools
2. Emotional support should be accessible through multiple channels
3. Navigation must be intuitive for all input methods
4. Progress tracking should be clear and understandable for everyone

## ARIA Landmarks and Roles

### Main Dashboard (`role="main"`)

```html
<main role="main" aria-label="NeuroFocus Dashboard">
  <div role="status" aria-live="polite">
    <!-- Emotional state updates -->
  </div>
</main>
```

### Task Breakdown (`role="region"`)

```html
<section role="region" aria-label="Görev Adımları">
  <div
    role="progressbar"
    aria-valuenow="2"
    aria-valuemin="0"
    aria-valuemax="3"
    aria-label="Görev İlerlemesi"
  ></div>
</section>
```

### Emotional Support Messages (`role="alert"`)

```html
<div role="alert" aria-live="polite">
  <!-- Dynamic emotional support messages -->
</div>
```

## Keyboard Navigation

### Focus Order

1. Task title and description
2. Step navigation buttons
3. Emotional state selectors
4. Support actions

### Keyboard Shortcuts

- `Space/Enter`: Select or activate current item
- `Escape`: Close overlays or return to main view
- `Arrow Keys`: Navigate between steps or emotions
- `Tab`: Move through interactive elements

## Color and Contrast

### Requirements

- Normal text: 4.5:1 minimum contrast ratio
- Large text: 3:1 minimum contrast ratio
- Focus indicators: 3:1 minimum contrast against adjacent colors

### Emotional States

Each emotional state has a verified color scheme:

- Exploring: Blue (#4A90E2) with dark text (#2C3E50)
- Frustrated: Soft red (#E57373) with dark text (#4A4A4A)
- Overwhelmed: Purple (#9575CD) with dark text (#3A3A3A)
- etc.

## Screen Reader Announcements

### Progress Updates

```typescript
announceToScreenReader('Adım 2/3 tamamlandı: Harika ilerliyorsun!', 'polite');
```

### Emotional Support

```typescript
announceToScreenReader('Şu anki duygu durumun: Meraklı. Birlikte keşfedelim!', 'polite');
```

### Error Messages

```typescript
announceToScreenReader('Lütfen bir sonraki adıma geçmeden önce mevcut adımı tamamla', 'assertive');
```

## Focus Management

### Focus Indicators

All interactive elements must have:

- Visible focus indicator
- Minimum 2px border width
- Clear color contrast
- No loss of visibility in any color scheme

### Focus Trapping

Modal dialogs and important messages must:

- Trap focus within their boundaries
- Provide clear escape mechanisms
- Return focus to trigger element on close

## Testing Checklist

1. Keyboard Navigation

   - [ ] All interactive elements are reachable
   - [ ] Focus order is logical
   - [ ] No keyboard traps
   - [ ] Shortcuts work as expected

2. Screen Reader Compatibility

   - [ ] All content is announced
   - [ ] Dynamic updates are communicated
   - [ ] Landmarks are properly labeled
   - [ ] Images have alt text

3. Color and Contrast

   - [ ] All text meets contrast requirements
   - [ ] Color is not sole indicator
   - [ ] Focus indicators are visible
   - [ ] Emotional states are distinguishable

4. Semantic Structure
   - [ ] Proper heading hierarchy
   - [ ] ARIA landmarks used correctly
   - [ ] Interactive elements properly labeled
   - [ ] Dynamic content updates appropriately

## Implementation Example

```tsx
<div className="task-card" role="region" aria-label="Görev Kartı">
  <h2 id="task-title">{task.title}</h2>

  <div role="progressbar"
       aria-labelledby="task-title"
       aria-valuenow={currentStep + 1}
       aria-valuemin={1}
       aria-valuemax={task.steps.length}>
    <!-- Progress visualization -->
  </div>

  <div role="status" aria-live="polite">
    {task.steps[currentStep].instruction}
  </div>

  <div role="group" aria-label="Duygu Durumu Seçimi">
    {emotions.map(emotion => (
      <button
        key={emotion}
        aria-pressed={selectedEmotion === emotion}
        onClick={() => handleEmotionSelect(emotion)}>
        {getEmotionLabel(emotion)}
      </button>
    ))}
  </div>
</div>
```

## Resources

1. [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
2. [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
3. [Inclusive Components](https://inclusive-components.design/)
4. [A11Y Project Checklist](https://www.a11yproject.com/checklist/)
