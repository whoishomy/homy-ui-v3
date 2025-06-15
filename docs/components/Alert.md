# Alert Component

The Alert component is used to communicate important messages to users, such as success notifications, error messages, warnings, or general information. It supports various visual styles and can include icons, titles, descriptions, and dismissal functionality.

## Features

- Multiple visual variants (info, success, warning, error)
- Color preset integration
- Optional icon support
- Title and description support
- Dismissible state
- Framer Motion animations
- Dark mode support
- ARIA-compliant
- Keyboard accessible

## Installation

The Alert component is part of the core UI components and is available out of the box.

```tsx
import { Alert } from '@/components/ui/Alert';
```

## Props

| Prop          | Type                                          | Default  | Description                        |
| ------------- | --------------------------------------------- | -------- | ---------------------------------- |
| `variant`     | `'info' \| 'success' \| 'warning' \| 'error'` | `'info'` | Visual variant of the alert        |
| `title`       | `ReactNode`                                   | -        | Alert title                        |
| `description` | `ReactNode`                                   | -        | Alert description                  |
| `icon`        | `ReactNode`                                   | -        | Custom icon                        |
| `dismissible` | `boolean`                                     | `false`  | Whether the alert can be dismissed |
| `onDismiss`   | `() => void`                                  | -        | Callback when alert is dismissed   |

Plus all native div element props.

## Examples

### Basic Usage

```tsx
<Alert
  title="Success!"
  description="Your changes have been saved successfully."
  variant="success"
/>
```

### With Custom Icon

```tsx
import { CheckCircle } from 'lucide-react';

<Alert
  icon={<CheckCircle />}
  title="Profile Updated"
  description="Your profile information has been updated successfully."
  variant="success"
/>;
```

### Dismissible Alert

```tsx
<Alert
  title="New Message"
  description="You have a new message in your inbox."
  variant="info"
  dismissible
  onDismiss={() => console.log('Alert dismissed')}
/>
```

### Different Variants

```tsx
// Info Alert
<Alert
  variant="info"
  title="Information"
  description="This is an informational message."
/>

// Success Alert
<Alert
  variant="success"
  title="Success"
  description="Operation completed successfully."
/>

// Warning Alert
<Alert
  variant="warning"
  title="Warning"
  description="Please review your input before proceeding."
/>

// Error Alert
<Alert
  variant="error"
  title="Error"
  description="An error occurred while processing your request."
/>
```

### Title Only

```tsx
<Alert title="Session expired. Please log in again." variant="warning" />
```

### Description Only

```tsx
<Alert
  description="Your browser is not supported. Please upgrade to a modern browser."
  variant="error"
/>
```

## Best Practices

1. **Clear Communication**: Use clear and concise language in titles and descriptions.
2. **Appropriate Variants**: Choose variants that match the message's importance:
   - `info` for general information
   - `success` for successful operations
   - `warning` for potential issues
   - `error` for critical problems
3. **Icon Usage**: Use icons that enhance the message's meaning, not just for decoration.
4. **Dismissible State**: Make alerts dismissible when they're not critical to the user's task.
5. **Accessibility**: Ensure alerts are announced appropriately to screen readers.

## Accessibility

- Uses `role="alert"` for proper screen reader announcement
- Keyboard accessible dismiss button when dismissible
- Color contrast ratios follow WCAG guidelines
- Focus management for dismissible alerts
- Motion animations respect user's reduced motion preferences

## Design System Integration

The Alert component is a critical part of the feedback system in your application. It should be used in conjunction with:

- Form validation feedback
- System status messages
- User action confirmations
- Error notifications
- Important announcements

## Related Components

- `Toast` - For temporary notifications
- `Dialog` - For more interactive alerts
- `Banner` - For page-level messages
- `Form` - For form validation messages
