# Toast System Documentation

A modern, accessible, and fully-featured toast notification system for React applications.

## Features

- 🔄 Queue-based toast management with FIFO ordering
- 🎯 ID-based toast updates and overrides
- ⏱️ Configurable auto-dismiss with progress bar
- 🎨 Type-based styling (info, success, warning, error)
- 🌓 Dark mode support
- 📱 Responsive design
- ♿ Full accessibility support
- 🧪 100% test coverage

## Installation

```bash
pnpm add zustand @types/node lucide-react
```

## Quick Start

```tsx
import { useToast } from "@/hooks/useToast";
import { ToastPortal } from "@/components/toast/ToastPortal";

export const App = () => {
  const { toast } = useToast();

  const handleClick = () => {
    toast("Operation successful!", {
      type: "success",
      duration: 5000
    });
  };

  return (
    <>
      <button onClick={handleClick}>Show Toast</button>
      <ToastPortal position="bottom-right" />
    </>
  );
};
```

## Components

### ToastPortal

The root component that renders toasts outside the main app hierarchy using React Portal.

```tsx
<ToastPortal
  position="bottom-right" // Optional: default position
  className="custom-class" // Optional: additional classes
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| position | `"top-right"` \| `"top-left"` \| `"bottom-right"` \| `"bottom-left"` \| `"top-center"` \| `"bottom-center"` | `"bottom-right"` | Toast stack position |
| className | string | undefined | Additional CSS classes |

### useToast Hook

The main hook for managing toasts.

```tsx
const { toast, dismiss, dismissAll, toasts } = useToast();

// Show a toast
toast("Message", {
  id: "unique-id", // Optional: for updates/overrides
  type: "success", // Optional: "info" | "success" | "warning" | "error"
  duration: 5000, // Optional: ms, 0 for permanent
});

// Dismiss specific toast
dismiss("unique-id");

// Dismiss all toasts
dismissAll();
```

#### Toast Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| id | string | auto-generated | Unique identifier |
| type | `"info"` \| `"success"` \| `"warning"` \| `"error"` | `"info"` | Toast type |
| duration | number | 5000 | Duration in ms (0 for permanent) |

## Accessibility

The toast system follows WCAG guidelines:

- Uses `role="alert"` for toast notifications
- Implements `aria-live="polite"` for screen readers
- Provides keyboard navigation for toast dismissal
- Includes proper focus management
- Offers descriptive labels for screen readers

## Examples

### Basic Usage

```tsx
const { toast } = useToast();

// Info toast
toast("New message received");

// Success toast
toast("Profile updated", { type: "success" });

// Warning toast
toast("Low storage space", { type: "warning" });

// Error toast
toast("Failed to save", { type: "error" });
```

### Update Existing Toast

```tsx
const { toast } = useToast();

// Initial toast
toast("Saving...", { id: "save-op", duration: 0 });

// Update same toast
setTimeout(() => {
  toast("Saved successfully!", {
    id: "save-op",
    type: "success",
    duration: 3000
  });
}, 2000);
```

### Permanent Toast

```tsx
const { toast, dismiss } = useToast();

toast("Session expires in 5 minutes", {
  id: "session-warning",
  type: "warning",
  duration: 0 // Stays until manually dismissed
});

// Dismiss when needed
setTimeout(() => {
  dismiss("session-warning");
}, 300000);
```

## Best Practices

1. **Toast Duration**
   - Use shorter durations (3-5s) for simple notifications
   - Use longer durations (5-8s) for messages requiring attention
   - Use permanent toasts (duration: 0) for critical messages

2. **Toast Types**
   - `info`: General information
   - `success`: Successful operations
   - `warning`: Important notices
   - `error`: Failed operations

3. **Message Content**
   - Keep messages concise and clear
   - Use proper grammar and punctuation
   - Include action items when relevant

4. **Toast Management**
   - Limit concurrent toasts (max 5 by default)
   - Update existing toasts instead of creating new ones
   - Clear all toasts when user logs out

## Testing

The toast system includes comprehensive tests:

```bash
# Run all tests
pnpm test

# Run toast-specific tests
pnpm test toast
```

Test coverage includes:
- Component rendering
- User interactions
- Accessibility features
- Edge cases
- Multiple toast scenarios

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Submit a PR

## License

MIT 