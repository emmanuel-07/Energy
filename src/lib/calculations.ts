import { Room, SystemConfig, CalculationResults } from '../types';

export function calculateSystemRequirements(rooms: Room[], config: SystemConfig): CalculationResults {
  let totalDailyLoadWh = 0;
  let totalSurgeLoadW = 0;
  let totalContinuousLoadW = 0;

  rooms.forEach(room => {
    room.appliances.forEach(app => {
      // Duty cycle logic (e.g. fridge runs 8 hours a day, but duty cycle is 50%, so it uses half the power per hour)
      const dutyCycle = app.dutyCycle ?? 1;
      const dailyWh = app.continuousWatts * app.hoursPerDay * app.quantity * dutyCycle;
      totalDailyLoadWh += dailyWh;
      
      const continuousW = app.continuousWatts * app.quantity;
      totalContinuousLoadW += continuousW;

      if (app.surgeWatts > totalSurgeLoadW) {
        totalSurgeLoadW = app.surgeWatts;
      }
    });
  });

  const requiredInverterSizeW = (totalContinuousLoadW + totalSurgeLoadW) / (config.inverterEfficiency / 100);
  
  // Battery Capacity (Wh) = (Total Daily Load * Days of Autonomy) / Depth of Discharge
  // Applying an additional efficiency factor for inverter losses
  const requiredBatteryCapacityWh = (totalDailyLoadWh * config.daysOfAutonomy) / (config.depthOfDischarge / 100) / (config.inverterEfficiency / 100);
  const requiredBatteryCapacityAh = requiredBatteryCapacityWh / config.systemVoltage;

  // PV Array Size (W) = Total Daily Load / (Sun Hours * System Efficiency)
  // Assuming overall system efficiency of 75% for solar to battery to load
  const requiredPvArraySizeW = totalDailyLoadWh / (config.sunHours * 0.75);

  // Cost Estimations (NGN)
  // PV Panels: ~600 NGN per Watt
  const estimatedPvCostNGN = requiredPvArraySizeW * 600;
  // Inverter: ~250 NGN per Watt (using kVA sizing practically, but rough estimate per W)
  const estimatedInverterCostNGN = requiredInverterSizeW * 250;
  // Battery: ~250,000 NGN per kWh
  const estimatedBatteryCostNGN = (requiredBatteryCapacityWh / 1000) * 250000;
  
  // Total plus ~20% for installation/accessories
  const accessoriesAndInstall = (estimatedPvCostNGN + estimatedInverterCostNGN + estimatedBatteryCostNGN) * 0.2;
  const totalEstimatedCostNGN = estimatedPvCostNGN + estimatedInverterCostNGN + estimatedBatteryCostNGN + accessoriesAndInstall;

  return {
    totalDailyLoadWh,
    totalSurgeLoadW,
    totalContinuousLoadW,
    requiredBatteryCapacityWh,
    requiredBatteryCapacityAh,
    requiredInverterSizeW,
    requiredPvArraySizeW,
    estimatedBatteryCostNGN,
    estimatedInverterCostNGN,
    estimatedPvCostNGN,
    totalEstimatedCostNGN
  };
}
