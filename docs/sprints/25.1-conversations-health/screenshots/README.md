# Conversations Health Screenshots

This directory contains screenshots and visual documentation for the Conversations Health feature.

## Directory Structure

```
screenshots/
├── ui/           # UI component screenshots
├── flows/        # User flow diagrams and sequences
└── tests/        # Test results and coverage reports
```

## Naming Convention

Use the following format for screenshot files:

```
{category}-{component}-{state}-{timestamp}.png
```

Example:

```
ui-conversation-panel-dark-20240320.png
flow-message-sequence-error-20240320.png
test-coverage-report-20240320.png
```

## Categories

### UI Screenshots

- Conversation Panel
- History View
- Health Dashboard
- Export Dialog
- Settings Panel

### Flow Diagrams

- Message Sequences
- Error Handling
- State Transitions
- Data Flow

### Test Reports

- Coverage Reports
- Performance Tests
- Integration Tests
- E2E Results

## Guidelines

1. Use CleanShot X for capturing screenshots
2. Set viewport to 1920x1080 for consistency
3. Include both light and dark mode variants
4. Capture responsive breakpoints when relevant
5. Annotate important UI elements
6. Include timestamp in filename for versioning

## Updating Screenshots

When updating screenshots:

1. Archive old screenshots in `archive/` subdirectory
2. Update timestamp in filename
3. Update relevant documentation references
4. Commit changes with descriptive message
