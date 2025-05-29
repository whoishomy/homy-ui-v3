# Screenshot Documentation

This directory contains organized screenshots of various UI components and features of the Homy UI application.

## Directory Structure

```
docs/screenshots/
├── README.md
├── mobile-dashboard/
│   ├── dashboard-main.png         # Main mobile dashboard view with health score
│   ├── tabs-switch-daily.png      # Daily tab view of analytics
│   ├── tabs-switch-weekly.png     # Weekly tab view of analytics
│   ├── health-score-trend.png     # Health score trend chart detail
│   ├── category-distribution.png  # Category distribution chart detail
│   └── ai-insight-overlay.png     # AI insights overlay (if applicable)
├── lab-result/                    # Lab results view screenshots
├── insight-overlay/               # Insight overlay screenshots
└── focus-coach/                   # Focus coach feature screenshots
```

## Screenshot Specifications

### Mobile Dashboard Screenshots

All mobile dashboard screenshots follow these specifications:

- **Device Preset**: iPhone 12 Pro (390 x 844)
- **Format**: PNG
- **Scale**: @2x for Retina displays
- **Naming Convention**: `feature-name.png`

### Screenshot Categories

1. **Dashboard Main View**

   - File: `dashboard-main.png`
   - Contains: Health Score, Category Distribution, Trend Charts
   - Resolution: 390 x 844

2. **Tab Navigation**

   - Files:
     - `tabs-switch-daily.png`
     - `tabs-switch-weekly.png`
   - Shows: Tab transitions and different time period views
   - Captures: Active tab states and data visualization

3. **Chart Details**

   - Files:
     - `health-score-trend.png`
     - `category-distribution-chart.png`
   - Purpose: Detailed view of individual charts
   - Focus: Data visualization and interaction states

4. **AI Insights**
   - File: `ai-insight-overlay.png`
   - Shows: AI-powered insights overlay
   - Captures: Interaction states and information display

## Capture Guidelines

1. Use CleanShot Pro with the following settings:

   - Shortcut: `Shift + Cmd + 4`
   - Window Capture Mode
   - Save to designated directory

2. Device Toolbar Settings:

   - Open DevTools: `Cmd + Option + I`
   - Toggle Device Toolbar: `Cmd + Shift + M`
   - Select iPhone 12 Pro preset

3. Capture Process:
   ```bash
   ./take-cleanshot.sh <screenshot-name>
   ```

## Automation

Screenshots can be captured using the `take-cleanshot.sh` script:

```bash
# Example usage
./take-cleanshot.sh dashboard-main
./take-cleanshot.sh tabs-switch-daily
```

## Version Control

- Screenshots are versioned with the codebase
- Each feature branch should update relevant screenshots
- Main branch contains the latest approved screenshots
