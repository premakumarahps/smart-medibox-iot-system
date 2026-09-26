/**
 * Smart Medibox Project Data Model & Architecture Registry
 * Grounded in Semester 4 Embedded & IoT Project Files
 * Developed by: Sadun Premakumara (Index: 210494D)
 */

export interface HardwarePinItem {
  component: string;
  part: string;
  gpio: string;
  signalType: string;
  description: string;
}

export const HARDWARE_PINS: HardwarePinItem[] = [
  { component: 'Microcontroller', part: 'ESP32 DevKit v4', gpio: '—', signalType: '240 MHz Dual-Core', description: 'Master embedded controller running FreeRTOS tasks & WiFi/MQTT stack.' },
  { component: 'Climate Sensor', part: 'DHT22 (AM2302)', gpio: 'GPIO 12', signalType: 'Digital 1-Wire', description: 'Monitors chamber temperature (26–32°C safe) and relative humidity (60–80% safe).' },
  { component: 'Left Light Sensor', part: 'LDR Photoresistor Module', gpio: 'GPIO 35', signalType: 'Analog ADC1', description: 'Measures incoming left-side ambient illumination (calibrated 32 to 4064 counts).' },
  { component: 'Right Light Sensor', part: 'LDR Photoresistor Module', gpio: 'GPIO 32', signalType: 'Analog ADC1', description: 'Measures incoming right-side ambient illumination (calibrated 32 to 4064 counts).' },
  { component: 'Motorized Shading Window', part: 'TowerPro SG90 Servo', gpio: 'GPIO 13', signalType: '50 Hz PWM', description: 'Drives louvre window from 0° (fully open) to 180° (maximum shading).' },
  { component: 'Graphical Display', part: 'SSD1306 OLED (128×64)', gpio: 'GPIO 21 (SDA), 22 (SCL)', signalType: 'I2C (0x3C)', description: 'Displays live NTP clock, warnings, and multi-level interactive configuration menus.' },
  { component: 'Acoustic Melody Buzzer', part: 'Piezo Buzzer', gpio: 'GPIO 5', signalType: 'LEDC PWM Tone', description: 'Emits 8 distinct musical reminder notes (C, D, E, F, G, A, B, C_H) for alarms.' },
  { component: 'Alert Indicator LED', part: '5mm High-Intensity Red LED', gpio: 'GPIO 15', signalType: 'Digital Output', description: 'Flashes synchronously with buzzer alarms during medication dosage windows.' },
  { component: 'OK / Enter Button', part: 'Tactile Pushbutton', gpio: 'GPIO 18', signalType: 'Digital In (Pullup)', description: 'Enters main menu, confirms parameter selections.' },
  { component: 'Cancel / Dismiss Button', part: 'Tactile Pushbutton', gpio: 'GPIO 34', signalType: 'Digital In (Pullup)', description: 'Immediately silences active alarms; exits menus.' },
  { component: 'Up / Increment Button', part: 'Tactile Pushbutton', gpio: 'GPIO 19', signalType: 'Digital In (Pullup)', description: 'Increments hour/minute or navigates menu items upward.' },
  { component: 'Down / Decrement Button', part: 'Tactile Pushbutton', gpio: 'GPIO 33', signalType: 'Digital In (Pullup)', description: 'Decrements hour/minute or navigates menu items downward.' }
];

export interface MqttTopicItem {
  topic: string;
  direction: 'ESP32 → Cloud' | 'Cloud → ESP32';
  payloadExample: string;
  purpose: string;
}

export const MQTT_TOPICS: MqttTopicItem[] = [
  { topic: '210494D/medibox/tempurature', direction: 'ESP32 → Cloud', payloadExample: '29.40', purpose: 'Transmits live chamber temperature in degrees Celsius' },
  { topic: '210494D/medibox/humidity', direction: 'ESP32 → Cloud', payloadExample: '72.50', purpose: 'Transmits live chamber relative humidity in percentage' },
  { topic: '210494D/medibox/light_intensity/left', direction: 'ESP32 → Cloud', payloadExample: '0.67', purpose: 'Transmits normalized left LDR irradiance (0.00 – 1.00)' },
  { topic: '210494D/medibox/light_intensity/right', direction: 'ESP32 → Cloud', payloadExample: '0.98', purpose: 'Transmits normalized right LDR irradiance (0.00 – 1.00)' },
  { topic: '210494D/medibox/light_intensity/max', direction: 'ESP32 → Cloud', payloadExample: '0.98', purpose: 'Transmits peak directional light intensity to trigger alerts' },
  { topic: '210494D/medibox/light_intensity/max/source', direction: 'ESP32 → Cloud', payloadExample: 'Right', purpose: 'Identifies dominant sunlight orientation ("Left" or "Right")' },
  { topic: '210494D/nodeRed/angle/min', direction: 'Cloud → ESP32', payloadExample: '45', purpose: 'Remotely sets baseline minimum servo angle theta_offset' },
  { topic: '210494D/nodeRed/controlling_factor', direction: 'Cloud → ESP32', payloadExample: '0.75', purpose: 'Remotely adjusts light tracking response factor (0.0 – 1.0)' },
  { topic: '210494D/nodeRed/medication_preset', direction: 'Cloud → ESP32', payloadExample: 'tablet_a', purpose: 'Activates medication preset profiles or switches to custom mode' }
];

export interface SlideItem {
  slideNumber: number;
  title: string;
  summary: string;
  image: string;
}

export const SLIDES_DATA: SlideItem[] = [
  { slideNumber: 1, title: 'Title & Author Presentation', summary: 'Medibox Enhancement: Light Sensitivity and Control - Building on Success by 210494D PREMAKUMARA HPS', image: '/slides/slide_01.png' },
  { slideNumber: 2, title: 'Recap of Part 1 Core Achievements', summary: 'Standalone hardware simulation on Wokwi, UTC time zones, NTP sync, alarms, and DHT22 monitoring.', image: '/slides/slide_02.png' },
  { slideNumber: 3, title: 'Phase 1 Wokwi Simulation Interface', summary: 'ESP32 breadboard assembly with OLED, DHT22, 4 pushbuttons, buzzer, and LED.', image: '/slides/slide_03.png' },
  { slideNumber: 4, title: 'The Problem: Photodegradation of Medicines', summary: 'Why light-sensitive pharmaceuticals degrade and how dual LDRs and servo shading solve this.', image: '/slides/slide_04.png' },
  { slideNumber: 5, title: 'System Overview & Core IoT Blocks', summary: 'Dual LDRs, servo motorized window, ESP32, Wokwi, and Node-RED visual programming.', image: '/slides/slide_05.png' },
  { slideNumber: 6, title: 'Light Sensing & Dashboard Gauges', summary: 'Normalizing analog signals, identifying dominant vector, and real-time dashboard visualization.', image: '/slides/slide_06.png' },
  { slideNumber: 7, title: 'Firmware: updateLight() & Loop()', summary: 'C++ code normalizing ADC values, calculating servoAngle, and publishing MQTT telemetry.', image: '/slides/slide_07.png' },
  { slideNumber: 8, title: 'Firmware: MQTT Broker Connection', summary: 'Connecting to test.mosquitto.org:1883 and subscribing to Node-RED command topics.', image: '/slides/slide_08.png' },
  { slideNumber: 9, title: 'Firmware: MQTT receiveCallback()', summary: 'Parsing inbound JSON/char payloads for min angle, controlling factor, and tablet presets.', image: '/slides/slide_09.png' },
  { slideNumber: 10, title: 'Node-RED Visual Flow Architecture', summary: 'Complete flow topology linking MQTT in/out nodes, gauge displays, strip charts, and preset logic.', image: '/slides/slide_10.png' },
  { slideNumber: 11, title: 'Live Test 1: Servo Angle at 125°', summary: 'Side-by-side verification of Node-RED gauges and Wokwi servo positioning under bright light.', image: '/slides/slide_11.png' },
  { slideNumber: 12, title: 'Live Test 2: Dynamic Repositioning at 100°', summary: 'Dynamic responsiveness as sliders and sunlight directions change in real-time.', image: '/slides/slide_12.png' },
  { slideNumber: 13, title: 'Closing Slide & Defense Acknowledgements', summary: 'Conclusion of Phase 2 defense and project demonstration.', image: '/slides/slide_13.png' }
];

export interface PhaseComparisonItem {
  feature: string;
  phase1: string;
  phase2: string;
  benefit: string;
}

export const PHASE_COMPARISONS: PhaseComparisonItem[] = [
  { feature: 'Core Microcontroller', phase1: 'ESP32 (Standalone)', phase2: 'ESP32 + WiFi + MQTT Cloud Stack', benefit: 'Enables remote telemetry and worldwide cloud supervision' },
  { feature: 'Climate Sensing', phase1: 'DHT22 (Temperature & Humidity)', phase2: 'DHT22 + Dual Calibrated LDR Photoresistors', benefit: 'Adds directional solar radiation tracking' },
  { feature: 'Light Protection', phase1: 'None (Unshaded chamber)', phase2: 'SG90 Servo-Driven Motorized Window Louvre', benefit: 'Prevents photodegradation of photosensitive medications' },
  { feature: 'Alarm Scheduling', phase1: '3 Daily Alarms on OLED', phase2: 'Synchronized On-Device + Cloud Telemetry', benefit: 'Assures patient dosage compliance' },
  { feature: 'User Interface', phase1: '128×64 OLED + 4 Physical Buttons', phase2: 'OLED UI + Node-RED Web Dashboard', benefit: 'Doctors & caregivers can supervise and tune parameters remotely' },
  { feature: 'Medication Sensitivity', phase1: 'Fixed safe temperature bands', phase2: 'Tablet A, B, C Clinical Presets & Custom Sliders', benefit: 'Tailored protection profiles for different drug formulations' },
  { feature: 'Simulation Tool', phase1: 'Wokwi Project 391582117646451713', phase2: 'Wokwi Project 397789429671309313', benefit: 'Zero-hardware virtual prototyping with full fidelity' }
];
