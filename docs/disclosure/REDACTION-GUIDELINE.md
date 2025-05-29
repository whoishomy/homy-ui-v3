# HOMY Redaction Guidelines

## Overview

This document outlines the automatic redaction rules for screenshots, test logs, and pitch materials. Follow these guidelines to ensure sensitive information is properly protected before sharing.

## Screenshot Redaction

### Always Redact

- Patient identifiers
- API keys and tokens
- Database connection strings
- Internal URLs and endpoints
- Version numbers of unreleased features
- Debug information
- Internal metrics dashboards

### Redaction Zones

1. Top Navigation Bar

   - User profile information
   - Environment indicators
   - Internal tool links

2. Data Displays

   - Patient IDs
   - Raw health metrics
   - Location data
   - Timestamp details

3. System Information
   - Server names
   - IP addresses
   - Build versions
   - Error stack traces

## Test Log Redaction

### Automatic Redaction Patterns

```
- UUID: [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}
- API Keys: [A-Za-z0-9-]{32,}
- Email: [A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}
- IP Address: \d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}
```

### Log Sections to Remove

- Stack traces with internal paths
- Database query results
- Authentication tokens
- Session IDs
- Internal metric values

## Pitch Material Guidelines

### Technical Slides

- Remove specific algorithm details
- Blur performance metrics
- Redact customer names unless approved
- Remove architecture diagrams

### Demo Environment

- Use synthetic data
- Remove version information
- Hide backend URLs
- Blur monitoring metrics

## CleanShot Integration

### Automatic Blur Regions

```json
{
  "topNav": {
    "height": "60px",
    "blur": "heavy"
  },
  "sideNav": {
    "width": "250px",
    "blur": "medium"
  },
  "dataTable": {
    "selector": ".patient-data",
    "blur": "smart"
  }
}
```

### Export Pipeline

1. Capture screenshot
2. Apply automatic redaction
3. Run OCR check for sensitive terms
4. Apply manual review flags
5. Generate export-safe version

## Compliance Check

### Pre-share Checklist

- [ ] No patient identifiers visible
- [ ] No internal URLs or endpoints
- [ ] No API keys or tokens
- [ ] No debug information
- [ ] No internal metrics
- [ ] No unreleased feature details

### Version Control

- Document Version: 1.0.0
- Last Updated: 2024-03-27
- Review Cycle: Monthly
