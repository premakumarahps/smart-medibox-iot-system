# Comprehensive Master Blueprint
## Project: Smart Medibox – Embedded Healthcare Storage & IoT Automated Light Shading System
### Developer & Lead Architect: Sadun Premakumara (Index: 210494D) | University Semester 4 Embedded & IoT Project

---

## 1. Executive Overview & Two-Phase Evolution

The **Smart Medibox** is an intelligent, connected biomedical storage platform engineered to safeguard critical pharmaceuticals from heat, humidity, and photolytic degradation while ensuring patient medication adherence through synchronized alarms and cloud telemetry.

The project is structured in **two progressive evolutionary phases**:
1. **Phase 1: Core Embedded Hardware & On-Device RTOS State Machine**:
   - ESP32 micro-controller architecture with SSD1306 OLED interface.
   - DHT22 micro-climate monitoring (temperature & relative humidity thresholds).
   - NTP real-time clock synchronization (`pool.ntp.org`) with 57 global UTC offsets.
   - 3 programmable musical alarms with buzzer melodies, warning LED, and tactile push-button menu.
   - Simulated on Wokwi (`https://wokwi.com/projects/391582117646451713`).
   - Presentation Video: `210494D_explanation_presentation1.mp4`.
2. **Phase 2: IoT Cloud Ecosystem & Automated Motorized Light Shading**:
   - Solution to light-sensitive drug degradation (e.g. nifedipine, nitroprusside, furosemide, vitamins).
   - Dual calibrated photoresistors (Left LDR Pin 35, Right LDR Pin 32) capturing directional ambient irradiance.
   - Motorized shaded window driven by an SG90 servo motor (Pin 13) adjusting shading angles dynamically.
   - Bi-directional MQTT broker connection (`test.mosquitto.org:1883`) over Wi-Fi.
   - Complete Node-RED visual dashboard with real-time radial gauges, historical trending charts, and remote parameter tuning.
   - Clinical Medication Presets: Tablet A (45°, 0.6), Tablet B (60°, 0.8), Tablet C (35°, 0.5), and Custom mode.
   - Simulated on Wokwi (`https://wokwi.com/projects/397789429671309313`).
   - Presentation Video: `210494D_presentation.mp4`.
   - Presentation Deck: 13-slide defense presentation PDF (`medibox presentation 2_Complete final.pdf`).

---

## 2. Technical Hardware & Firmware Architecture

### 2.1 Hardware Pinout & Schematics
| Component | Part / IC | ESP32 GPIO Pin | Protocol / Signal | Function |
| :--- | :--- | :--- | :--- | :--- |
| **Microcontroller** | ESP32 DevKit v4 | — | 240 MHz Dual-Core | Data acquisition, state machine & MQTT client |
| **OLED Display** | SSD1306 (128×64) | GPIO 21 (SDA), 22 (SCL) | I2C (Address 0x3C) | Real-time clock, menu, status & warnings |
| **Climate Sensor** | DHT22 (AM2302) | GPIO 12 | Digital 1-Wire | Temperature (26–32°C safe), Humidity (60–80% safe) |
| **Left Light Sensor**| Analog LDR Module | GPIO 35 | ADC1 (0–4095) | Calibrated light intensity (0.00 – 1.00) |
| **Right Light Sensor**| Analog LDR Module | GPIO 32 | ADC1 (0–4095) | Calibrated light intensity (0.00 – 1.00) |
| **Servo Actuator** | TowerPro SG90 | GPIO 13 | 50 Hz PWM | Shaded window orientation (0° – 180°) |
| **Buzzer** | Piezo Speaker | GPIO 5 | LEDC PWM Tone (2 kHz)| Multi-frequency musical reminder notes |
| **Alert LED** | 5mm High-Bright Red| GPIO 15 | Digital Output | Alarm flashing indicator |
| **Pushbutton: OK** | Tactile Switch | GPIO 18 | Digital Input (Pull-up)| Menu entry, confirm selection |
| **Pushbutton: Cancel**| Tactile Switch | GPIO 34 | Digital Input (Pull-up)| Dismiss active alarm, back menu |
| **Pushbutton: Up** | Tactile Switch | GPIO 19 | Digital Input (Pull-up)| Increment parameters, scroll up |
| **Pushbutton: Down** | Tactile Switch | GPIO 33 | Digital Input (Pull-up)| Decrement parameters, scroll down |

---

### 2.2 Mathematical Shading Algorithm & Formulas

#### LDR Normalization & Calibration Formula:
Both photoresistors are calibrated against experimental sensor limits ($LDR_{\text{MIN}} = 32.0$ in pitch darkness, $LDR_{\text{MAX}} = 4064.0$ under direct intense spotlight):
$$I_{\text{left}} = \frac{\text{raw}_{\text{left}} - LDR_{\text{MAX}}}{LDR_{\text{MIN}} - LDR_{\text{MAX}}} \in [0.00, 1.00]$$
$$I_{\text{right}} = \frac{\text{raw}_{\text{right}} - LDR_{\text{MAX}}}{LDR_{\text{MIN}} - LDR_{\text{MAX}}} \in [0.00, 1.00]$$

#### Highest Intensity & Dominant Vector Determination:
$$I_{\text{highest}} = \max(I_{\text{left}}, I_{\text{right}})$$
$$\text{Direction} = \begin{cases} \text{"Left"}, & \text{if } I_{\text{left}} > I_{\text{right}} \\ \text{"Right"}, & \text{otherwise} \end{cases}$$

#### Dynamic Servo Shading Angle Calculation:
$$\gamma_{\text{direction}} = \begin{cases} 0.5, & \text{if Direction} = \text{"Right"} \\ 1.5, & \text{if Direction} = \text{"Left"} \end{cases}$$
$$\theta_{\text{servo}} = \min\Big(180^{\circ}, \, \big(\theta_{\text{offset}} \cdot \gamma_{\text{direction}}\big) + \big(180^{\circ} - \theta_{\text{offset}}\big) \cdot I_{\text{highest}} \cdot \gamma_{\text{control}}\Big)$$

Where:
- $\theta_{\text{offset}}$: Minimum shading baseline angle ($0^{\circ} - 120^{\circ}$).
- $\gamma_{\text{control}}$: User or clinical controlling sensitivity factor ($0.0 - 1.0$).

---

### 2.3 MQTT Telemetry & Node-RED Broker Topology

#### MQTT Broker Configuration:
- **Host**: `test.mosquitto.org`
- **Port**: `1883` (Standard TCP)
- **Client ID**: `ESP32Client-465456464S645`

#### Topic Registry:
| Direction | MQTT Topic | Payload Example | Function |
| :--- | :--- | :--- | :--- |
| **ESP32 $\to$ Node-RED** | `210494D/medibox/tempurature` | `29.40` | Live DHT22 temperature in Celsius |
| **ESP32 $\to$ Node-RED** | `210494D/medibox/humidity` | `72.50` | Live DHT22 relative humidity in % |
| **ESP32 $\to$ Node-RED** | `210494D/medibox/light_intensity/left` | `0.65` | Left LDR normalized light index |
| **ESP32 $\to$ Node-RED** | `210494D/medibox/light_intensity/right` | `0.88` | Right LDR normalized light index |
| **ESP32 $\to$ Node-RED** | `210494D/medibox/light_intensity/max` | `0.88` | Peak incident light level |
| **ESP32 $\to$ Node-RED** | `210494D/medibox/light_intensity/max/source` | `Right` | Dominant light vector direction |
| **Node-RED $\to$ ESP32** | `210494D/nodeRed/angle/min` | `45` | Minimum baseline servo angle $\theta_{\text{offset}}$ |
| **Node-RED $\to$ ESP32** | `210494D/nodeRed/controlling_factor` | `0.60` | Light sensitivity factor $\gamma_{\text{control}}$ |
| **Node-RED $\to$ ESP32** | `210494D/nodeRed/medication_preset` | `tablet_a` | Selected clinical preset name |

---

## 3. Web Platform Architectural Specification

### 3.1 Tech Stack & Port Allocation
- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 with custom dark medical IoT theme (`#030712`, `#06b6d4`, `#10b981`, `#f97316`, `#8b5cf6`)
- **Interactive Visualizers**: Chart.js for real-time telemetry curves, HTML5 dual video players, interactive servo angle gauge
- **Designated Port**: `http://localhost:5177/`

### 3.2 Key Web Application Modules
1. **Interactive IoT Dashboard & Live Simulator**:
   - Recreates the complete Node-RED dashboard with live interactive sliders for Left & Right light, temperature, and humidity.
   - Interactive servo arm and louvre window graphic updating in real time as sliders move.
   - Preset buttons: Tablet A, Tablet B, Tablet C, and Custom.
2. **Phase 1 vs Phase 2 Architecture Explorer**:
   - Side-by-side comparison of standalone embedded features vs IoT-connected features.
   - Interactive Wokwi project embed buttons and live links (`391582117646451713` and `397789429671309313`).
3. **Dual Presentation Video Theater**:
   - Integrated HTML5 video player for **Phase 1 Presentation** (`210494D_explanation_presentation1.mp4`).
   - Integrated HTML5 video player for **Phase 2 IoT Presentation** (`210494D_presentation.mp4`).
4. **13-Slide Defense Presentation Carousel**:
   - Slide-by-slide viewer with thumbnails, full-screen expansion, and direct PDF download.
5. **Full C++ Firmware & Node-RED Flow Code Explorer**:
   - Syntax-highlighted viewer for `Main_program.ino` (Phase 1 & Phase 2) with copy button.
   - Complete `flows_210494D_node-red.json` and Wokwi `diagram.json` inspection.
6. **Author & Academic Attribution**:
   - Spotlight on **Sadun Premakumara (Index: 210494D)**.
