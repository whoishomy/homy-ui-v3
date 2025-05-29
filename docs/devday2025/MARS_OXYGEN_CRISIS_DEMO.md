# Mars Oxygen Crisis - Technical Demo Script

## Overview

**Duration:** 60-90 seconds
**Theme:** Emergency oxygen regulation during Mars dust storm
**Focus:** Autonomous health protocol generation via QLLM

## Technical Setup

### Environment Requirements

```bash
# Core Services
npm run dev # HOMY UI
npm run api # Telemetry Service

# Demo Recording
cleanshot record --format mp4 --quality high
```

### Scene Configuration

#### Scene 1: Telemetry Alert (0:00-0:15)

```yaml
Components:
  - TelemetryPanel:
      State: 'alert'
      Data:
        Subject: 'EREN-8'
        VitalSigns:
          SpO2: '88%'
          HeartRate: '110bpm'
          RespiratoryRate: '24/min'
        Alert:
          Type: 'critical'
          Message: 'Oxygen saturation below threshold'

Visual:
  Background: 'mars-habitat-interior.png'
  Overlay: 'telemetry-grid-alert.png'
  Animation: 'data-stream-continuous'
```

#### Scene 2: QLLM Analysis (0:15-0:30)

```yaml
Components:
  - QuantumCircuit:
      State: 'processing'
      Visualization:
        Type: 'bloch-sphere'
        Elements:
          - 'qubit-states'
          - 'quantum-gates'
          - 'measurement-ops'

  - BiometricAnalysis:
      Data:
        - Type: 'SpO2_Trend'
        - Type: 'Environmental_Impact'
        - Type: 'Historical_Response'

Visual:
  Background: 'quantum-compute-grid.png'
  Animation: 'circuit-activation'
  Effects: 'quantum-particles'
```

#### Scene 3: Protocol Generation (0:30-0:45)

```yaml
Components:
  - AutoRegula:
      Output:
        Format: 'JSON'
        Protocol:
          Type: 'OXYGEN_SUPPORT'
          Priority: 'IMMEDIATE'
          Actions:
            - 'Increase O2 Flow: 5L/min'
            - 'Activate Backup System'
            - 'Monitor SpO2 Continuous'

Visual:
  Background: 'protocol-matrix.png'
  Animation: 'json-formation'
  Highlight: 'key-decisions'
```

#### Scene 4: Implementation (0:45-0:60)

```yaml
Components:
  - AstronautInterface:
      Display:
        - Status: 'Protocol Accepted'
        - Action: 'Commence Assisted Flow'
        - Confirmation: 'System Active'

  - VitalMonitor:
      Display:
        - SpO2: 'Trending Up'
        - Flow: '5L/min Active'
        - System: 'Stable'

Visual:
  Background: 'astronaut-hud.png'
  Animation: 'protocol-activation'
  Effects: 'success-indicators'
```

### Audio Configuration

```yaml
Voiceover:
  Style: 'Neutral GPT'
  Tone: 'Calm, Authoritative'
  Language: 'English'

SoundEffects:
  - Type: 'Alert'
    Timing: '0:00'
  - Type: 'Quantum_Activation'
    Timing: '0:15'
  - Type: 'Protocol_Generation'
    Timing: '0:30'
  - Type: 'Success_Confirmation'
    Timing: '0:45'

Background:
  Music: 'ambient-mars-base.mp3'
  Volume: '15%'
```

### Visual Style Guide

```yaml
ColorPalette:
  Primary: '#FF3B30' # Emergency Red
  Secondary: '#30D158' # Success Green
  Background: '#1C1C1E' # Dark Mode
  Accent: '#0A84FF' # Info Blue

Typography:
  Title: 'SF Pro Display/Bold/48px'
  Data: 'SF Mono/Regular/16px'
  Alert: 'SF Pro Text/Medium/24px'

Animations:
  Style: 'Fluid, Technical'
  Duration: '0.4s'
  Easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
```

## Post-Production

### Export Settings

```yaml
Video:
  Format: 'MP4'
  Resolution: '1920x1080'
  Framerate: '60fps'
  Codec: 'H.264'
  Quality: 'High (10Mbps)'

Audio:
  Format: 'AAC'
  Channels: 'Stereo'
  SampleRate: '48kHz'
  Bitrate: '320kbps'
```

### Delivery Package

```yaml
Files:
  - mars-oxygen-crisis.mp4
  - homy-mars-devday2025-pitch.pdf
  - demo-screenshots/
  - technical-specs.md
```

---

_Last updated: May 27, 2024_
