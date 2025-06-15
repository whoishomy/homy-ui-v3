# 📸 Sprint {SPRINT_NUMBER} CleanShot Gallery

## 📊 Sprint Overview

**Sprint Period:** {START_DATE} - {END_DATE}
**Focus Areas:** {FOCUS_AREAS}
**Total Screenshots:** {SCREENSHOT_COUNT}

## 🖼️ Gallery Index

| Screenshot                | Type          | Description                     | Impact                         |
| ------------------------- | ------------- | ------------------------------- | ------------------------------ |
| `problems-tab-final.png`  | 🔍 Debug      | VSCode Problems tab final state | Sprint completion verification |
| `ts-indexing-error.png`   | 🔧 TypeScript | Type system improvements        | Enhanced type safety           |
| `readme-lint-warning.png` | 📝 Lint       | Markdown documentation issues   | Better readability             |

## 🏷️ Categories

### 🔧 TypeScript Issues

Screenshots related to type system improvements and static analysis.

- Naming Pattern: `ts-*-error.png`
- Key Focus: Type safety, interfaces, generics

### 📝 Lint & Format

Documentation and code style consistency checks.

- Naming Pattern: `lint-*-warning.png`
- Key Focus: Markdown rules, code style

### 🎨 UI Components

Visual feedback and component state documentation.

- Naming Pattern: `ui-*-state.png`
- Key Focus: Visual regressions, responsive design

## 📋 Usage Guidelines

1. **Capture Standards**

   - Full context in view
   - Relevant error messages visible
   - Clear, readable text
   - Consistent window size

2. **Naming Convention**

   - Use kebab-case
   - Include category prefix
   - Add descriptive suffix
   - Example: `ts-button-prop-error.png`

3. **Organization**
   - Store in `/screenshots` directory
   - Group by category
   - Reference in sprint docs

## 🔄 Automation

```bash
# Organize screenshots
./scripts/cleanshot-auto-sort.sh

# Update README
# Replace placeholders in this template:
# {SPRINT_NUMBER}, {START_DATE}, {END_DATE}, {FOCUS_AREAS}, {SCREENSHOT_COUNT}
```

## 📌 Notes

- All screenshots are archived in this directory
- Each image documents a specific technical aspect
- Reference these in sprint retrospectives
- Use for regression testing

---

Generated with 💝 by HOMY UI Team
