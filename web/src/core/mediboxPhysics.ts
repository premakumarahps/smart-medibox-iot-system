/**
 * Smart Medibox Dual-LDR & Servo Shading Mathematical Physics Engine
 * Grounded in MT/EE Semester 4 Embedded & IoT Project Firmware
 * Designed by: Sadun Premakumara (210494D)
 */

export interface MediboxInputParams {
  rawLdrLeft: number; // 32 to 4064 ADC counts
  rawLdrRight: number; // 32 to 4064 ADC counts
  temperatureC: number; // DHT22 reading (e.g. 28.5 C)
  humidityPercent: number; // DHT22 reading (e.g. 68 %)
  medicationPreset: 'tablet_a' | 'tablet_b' | 'tablet_c' | 'custom';
  customThetaOffset: number; // 0 to 120 degrees
  customControllingFactor: number; // 0.0 to 1.0
}

export interface MediboxSimulationResult {
  normalizedLightLeft: number; // 0.00 to 1.00
  normalizedLightRight: number; // 0.00 to 1.00
  highestLightIntensity: number; // 0.00 to 1.00
  dominantLightSource: 'Left' | 'Right';
  directionFactor: number; // 0.5 for Right, 1.5 for Left
  thetaOffset: number; // degrees
  controllingFactor: number; // 0.0 to 1.0
  servoAngle: number; // 0 to 180 degrees
  isTempSafe: boolean;
  isHumiditySafe: boolean;
  tempStatus: 'Normal' | 'High Warning' | 'Low Warning';
  humidityStatus: 'Normal' | 'High Warning' | 'Low Warning';
  ambientLux: number; // estimated external lux
  internalLux: number; // estimated attenuated lux inside medibox
  lightBlockPercentage: number; // % of harmful light shielded
}

export const PRESET_CONFIGS = {
  tablet_a: { name: 'Tablet A (Light Sensitive)', thetaOffset: 45, controllingFactor: 0.6, description: 'Moderate baseline shade with rapid responsive damping.' },
  tablet_b: { name: 'Tablet B (Ultra-Sensitive)', thetaOffset: 60, controllingFactor: 0.8, description: 'High baseline shade for chemotherapy / injectable compounds.' },
  tablet_c: { name: 'Tablet C (Standard Oral)', thetaOffset: 35, controllingFactor: 0.5, description: 'Gentle shading profile for general antibiotics & tablets.' }
};

export function simulateMedibox(params: MediboxInputParams): MediboxSimulationResult {
  const { 
    rawLdrLeft, 
    rawLdrRight, 
    temperatureC, 
    humidityPercent, 
    medicationPreset, 
    customThetaOffset, 
    customControllingFactor 
  } = params;

  // LDR Calibration Constants from Main_program.ino
  const LDR_MIN = 32.0;
  const LDR_MAX = 4064.0;

  // Normalize light values to 0.00 - 1.00 (Main_program.ino lines 587-588)
  const normLeft = Math.max(0, Math.min(1, (rawLdrLeft - LDR_MAX) / (LDR_MIN - LDR_MAX)));
  const normRight = Math.max(0, Math.min(1, (rawLdrRight - LDR_MAX) / (LDR_MIN - LDR_MAX)));

  const highestIntensity = Math.max(normLeft, normRight);
  const dominantLightSource: 'Left' | 'Right' = normLeft > normRight ? 'Left' : 'Right';

  // Determine active parameters
  let thetaOffset = customThetaOffset;
  let controllingFactor = customControllingFactor;

  if (medicationPreset !== 'custom') {
    thetaOffset = PRESET_CONFIGS[medicationPreset].thetaOffset;
    controllingFactor = PRESET_CONFIGS[medicationPreset].controllingFactor;
  }

  // Exact formula from Main_program.ino (lines 595-597)
  const directionFactor = dominantLightSource === 'Right' ? 0.5 : 1.5;
  const calculatedAngle = thetaOffset * directionFactor + (180 - thetaOffset) * highestIntensity * controllingFactor;
  const servoAngle = Math.min(180, Math.max(0, Math.round(calculatedAngle)));

  // Climate safety limits (Main_program.ino lines 24-27)
  // TEMP_HIGH 32, TEMP_LOW 26
  // HUMIDITY_HIGH 80, HUMIDITY_LOW 60
  const isTempSafe = temperatureC >= 26 && temperatureC <= 32;
  const isHumiditySafe = humidityPercent >= 60 && humidityPercent <= 80;

  let tempStatus: MediboxSimulationResult['tempStatus'] = 'Normal';
  if (temperatureC > 32) tempStatus = 'High Warning';
  else if (temperatureC < 26) tempStatus = 'Low Warning';

  let humidityStatus: MediboxSimulationResult['humidityStatus'] = 'Normal';
  if (humidityPercent > 80) humidityStatus = 'High Warning';
  else if (humidityPercent < 60) humidityStatus = 'Low Warning';

  // Optical estimation
  const ambientLux = Math.round(highestIntensity * 12000); // 0 to 12,000 lux
  const lightBlockPercentage = Math.round((servoAngle / 180) * 94); // up to 94% light blockage
  const internalLux = Math.round(ambientLux * (1 - lightBlockPercentage / 100));

  return {
    normalizedLightLeft: Math.round(normLeft * 100) / 100,
    normalizedLightRight: Math.round(normRight * 100) / 100,
    highestLightIntensity: Math.round(highestIntensity * 100) / 100,
    dominantLightSource,
    directionFactor,
    thetaOffset,
    controllingFactor,
    servoAngle,
    isTempSafe,
    isHumiditySafe,
    tempStatus,
    humidityStatus,
    ambientLux,
    internalLux,
    lightBlockPercentage
  };
}
