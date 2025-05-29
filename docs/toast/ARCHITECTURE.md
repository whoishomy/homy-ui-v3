# Toast System Architecture

## Overview

The toast system follows a layered architecture with clear separation of concerns:

```
src/
├── store/
│   └── toast/
│       └── toastStore.ts      # State management
├── hooks/
│   └── useToast.ts           # Business logic & lifecycle
└── components/
    └── toast/
        ├── Toast.tsx         # Individual toast UI
        ├── ToastStack.tsx    # Toast layout & positioning
        └── ToastPortal.tsx   # DOM portal management
```

## Core Components

### 1. State Management (toastStore.ts)

The Zustand store manages the toast queue and operations:

```typescript
interface ToastState {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "createdAt">) => void;
  removeToast: (id: string) => void;
  updateToast: (id: string, updates: Partial<Toast>) => void;
  clearAllToasts: () => void;
}
```

Key features:
- FIFO queue implementation
- Maximum toast limit (5)
- ID-based toast management
- Immutable state updates

### 2. Business Logic (useToast.ts)

The hook manages toast lifecycle and provides the public API:

```typescript
interface UseToastReturn {
  toasts: Toast[];
  toast: (message: string, options?: ToastOptions) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}
```

Responsibilities:
- Auto-dismiss timing
- Toast creation & updates
- Cleanup & memory management
- Type safety

### 3. UI Components

#### Toast.tsx
Individual toast component with:
- Type-based styling
- Progress bar animation
- Accessibility attributes
- Dark mode support

#### ToastStack.tsx
Layout manager handling:
- Toast positioning
- Stack ordering
- Responsive design
- Event bubbling control

#### ToastPortal.tsx
Portal management for:
- SSR compatibility
- DOM mounting
- Cleanup
- Props forwarding

## Data Flow

1. **Toast Creation**
   ```
   useToast.toast() → toastStore.addToast() → state update → UI update
   ```

2. **Auto Dismissal**
   ```
   useEffect timer → toastStore.removeToast() → state update → UI update
   ```

3. **Manual Dismissal**
   ```
   UI click → useToast.dismiss() → toastStore.removeToast() → state update → UI update
   ```

## State Management

### Toast Queue
- Maximum 5 toasts
- FIFO ordering
- ID-based updates
- Immutable updates

```typescript
// Add new toast
const updatedToasts = [newToast, ...state.toasts].slice(0, MAX_TOASTS);

// Update existing toast
const updatedToasts = state.toasts.map(toast =>
  toast.id === id ? { ...toast, ...updates } : toast
);
```

## Animations

### Entry Animation
```css
@keyframes slide-in {
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}
```

### Progress Bar
```typescript
useEffect(() => {
  if (!progressRef.current || duration === 0) return;
  progressRef.current.style.transition = `width ${duration}ms linear`;
  progressRef.current.style.width = "0%";
}, [duration]);
```

## Accessibility

### ARIA Attributes
```tsx
<div
  role="alert"
  aria-live="polite"
  aria-label="Notification"
>
  {/* Toast content */}
</div>
```

### Keyboard Navigation
- Tab navigation between toasts
- Escape to dismiss
- Focus management
- Screen reader support

## Performance Considerations

1. **State Updates**
   - Immutable updates
   - Batched state changes
   - Memoized callbacks

2. **Rendering**
   - React Portal for isolation
   - Conditional rendering
   - CSS-based animations

3. **Memory Management**
   - Cleanup on unmount
   - Timer clearance
   - Event listener removal

## Testing Strategy

1. **Unit Tests**
   - Store operations
   - Hook functionality
   - Component rendering

2. **Integration Tests**
   - Toast lifecycle
   - User interactions
   - Animation behavior

3. **Accessibility Tests**
   - ARIA attributes
   - Keyboard navigation
   - Screen reader compatibility

## Future Improvements

1. **Features**
   - Custom animation options
   - Toast actions (buttons/links)
   - Toast groups/categories
   - Toast priorities

2. **Performance**
   - Virtual list for large queues
   - Animation optimization
   - State persistence

3. **Accessibility**
   - Region announcements
   - Custom timing
   - Role configurations 