# Toast System Migration Guide

## Overview

This guide helps you migrate from the old notification system to the new Toast system in Sprint 23.8.

## Key Changes

1. **State Management**

   - Moved from Context to Zustand
   - Added queue management
   - Introduced ID-based updates

2. **Component Structure**

   - Separated into Toast, ToastStack, and ToastPortal
   - Added position configuration
   - Improved accessibility

3. **API Changes**
   - New hook-based API
   - Type-safe options
   - Enhanced customization

## Step-by-Step Migration

### 1. Update Dependencies

```diff
// package.json
{
  "dependencies": {
+   "zustand": "^5.0.5",
+   "@types/node": "^20.0.0",
+   "lucide-react": "^0.300.0"
  }
}
```

### 2. Replace Context Provider

```diff
// Old
- import { NotificationProvider } from './old-notifications';
-
- const App = () => (
-   <NotificationProvider>
-     <YourApp />
-   </NotificationProvider>
- );

// New
+ import { ToastPortal } from '@/components/toast/ToastPortal';
+
+ const App = () => (
+   <>
+     <YourApp />
+     <ToastPortal position="bottom-right" />
+   </>
+ );
```

### 3. Update Hook Usage

```diff
// Old
- import { useNotification } from './old-notifications';
-
- const Component = () => {
-   const { showNotification } = useNotification();
-
-   const handleClick = () => {
-     showNotification({
-       message: 'Hello',
-       type: 'success',
-       timeout: 5000
-     });
-   };
- };

// New
+ import { useToast } from '@/hooks/useToast';
+
+ const Component = () => {
+   const { toast } = useToast();
+
+   const handleClick = () => {
+     toast('Hello', {
+       type: 'success',
+       duration: 5000
+     });
+   };
+ };
```

### 4. Update Styling

```diff
// Old
- <div className="notification success">
-   {message}
- </div>

// New
// Styling is handled automatically by the Toast component
// Just use the type prop:
+ toast(message, { type: 'success' });
```

### 5. Handle Persistent Notifications

```diff
// Old
- showNotification({
-   message: 'Please wait...',
-   persistent: true,
-   id: 'loading'
- });
-
- // Later
- hideNotification('loading');

// New
+ toast('Please wait...', {
+   id: 'loading',
+   duration: 0  // Makes it permanent
+ });
+
+ // Later
+ dismiss('loading');
```

### 6. Update Event Handlers

```diff
// Old
- onNotificationClick={handler}
- onNotificationClose={handler}

// New
// Use the Toast component's built-in handlers
+ toast('Click me', {
+   id: 'interactive',
+   onClick: handler,
+   onClose: handler
+ });
```

## Breaking Changes

1. **API Changes**

   - `showNotification` → `toast`
   - `hideNotification` → `dismiss`
   - `clearNotifications` → `dismissAll`

2. **Props Changes**

   - `timeout` → `duration`
   - `persistent` → `duration: 0`
   - `variant` → `type`

3. **Style Changes**
   - Custom CSS classes no longer needed
   - Built-in dark mode support
   - Tailwind-based styling

## Type Changes

```typescript
// Old
interface Notification {
  message: string;
  type?: string;
  timeout?: number;
  persistent?: boolean;
}

// New
interface ToastOptions {
  id?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}
```

## Common Migration Scenarios

### 1. Global Notifications

```typescript
// Old
const showGlobalError = (error) => {
  showNotification({
    message: error.message,
    type: 'error',
    timeout: -1,
  });
};

// New
const showGlobalError = (error) => {
  toast(error.message, {
    type: 'error',
    duration: 0,
    id: 'global-error',
  });
};
```

### 2. Progress Updates

```typescript
// Old
let notificationId = null;
const updateProgress = (progress) => {
  if (notificationId) {
    updateNotification(notificationId, {
      message: `Progress: ${progress}%`,
    });
  } else {
    notificationId = showNotification({
      message: 'Starting...',
      persistent: true,
    });
  }
};

// New
const updateProgress = (progress) => {
  toast(`Progress: ${progress}%`, {
    id: 'progress-update',
    duration: 0,
  });
};
```

### 3. Multiple Notifications

```typescript
// Old
showNotification({ message: 'First' });
showNotification({ message: 'Second' });
// Would show both, possibly overlapping

// New
toast('First');
toast('Second');
// Properly queued and managed
```

## Testing Updates

```diff
// Old
- import { NotificationContext } from './old-notifications';
-
- const mockContext = {
-   showNotification: jest.fn()
- };
-
- render(
-   <NotificationContext.Provider value={mockContext}>
-     <Component />
-   </NotificationContext.Provider>
- );

// New
+ import { useToast } from '@/hooks/useToast';
+
+ vi.mock('@/hooks/useToast', () => ({
+   useToast: () => ({
+     toast: vi.fn(),
+     dismiss: vi.fn()
+   })
+ }));
+
+ render(<Component />);
```

## Troubleshooting

### Common Issues

1. **Toast not showing**

   - Check if ToastPortal is mounted
   - Verify z-index values
   - Check duration values

2. **Style conflicts**

   - Remove old notification styles
   - Use className prop for custom styles
   - Check dark mode configuration

3. **Type errors**
   - Update type imports
   - Use correct type values
   - Check optional properties

## Support

For additional help:

1. Check the full documentation in README-toast.md
2. Review the architecture in ARCHITECTURE.md
3. Run the test suite for examples
4. Submit issues for bugs or questions
