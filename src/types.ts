export interface Appliance {
  id: string;
  name: string;
  quantity: number;
  continuousWatts: number;
  surgeWatts: number;
  hoursPerDay: number;
  dutyCycle?: number; // Added for fridge cycling, etc. (0-1)
}

export interface Room {
  id: string;
  name: string;
  appliances: Appliance[];
}

export interface SystemConfig {
  daysOfAutonomy: number;
  depthOfDischarge: number; // Percentage (e.g., 80 for 80%)
  systemVoltage: number; // 12, 24, 48
  inverterEfficiency: number; // Percentage (e.g., 90 for 90%)
  sunHours: number; // Average peak sun hours per day
}

export interface CalculationResults {
  totalDailyLoadWh: number;
  totalSurgeLoadW: number;
  totalContinuousLoadW: number;
  requiredBatteryCapacityWh: number;
  requiredBatteryCapacityAh: number;
  requiredInverterSizeW: number;
  requiredPvArraySizeW: number;
  // Costs in NGN
  estimatedBatteryCostNGN: number;
  estimatedInverterCostNGN: number;
  estimatedPvCostNGN: number;
  totalEstimatedCostNGN: number;
}
