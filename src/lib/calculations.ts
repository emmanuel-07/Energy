import { Room, SystemConfig, CalculationResults } from '../types';

export function calculateSystemRequirements(rooms: Room[], config: SystemConfig): CalculationResults {
  let totalDailyLoadWh = 0;
  let totalContinuousLoadW = 0;
  let maxSurgeW = 0;

  rooms.forEach(room => {
    room.appliances.forEach(app => {
      // Daily Load: watts × hours × quantity
      const dailyWh = app.continuousWatts * app.hoursPerDay * app.quantity;
      totalDailyLoadWh += dailyWh;
      
      // Raw active load
      totalContinuousLoadW += app.continuousWatts * app.quantity;

      if (app.surgeWatts > maxSurgeW) {
        maxSurgeW = app.surgeWatts;
      }
    });
  });

  // Apply a diversity factor of 0.8 for simultaneous running load
  const activeLoadW = totalContinuousLoadW * 0.8;
  const peakLoadW = activeLoadW + maxSurgeW;

  // Inverter rating: (peak load) × 1.25 safety factor
  const rawInverterVA = (peakLoadW * 1.25) / (config.inverterEfficiency / 100);
  const rawInverterKVA = rawInverterVA / 1000;
  
  const standardInverterSizes = [1, 2, 3, 5, 7.5, 10, 15, 20, 30, 50, 100];
  let standardKVA = standardInverterSizes.find(size => size >= rawInverterKVA) || Math.ceil(rawInverterKVA);

  const requiredInverterSizeW = standardKVA * 1000;
  
  // Battery Capacity (Wh) = (Total Daily Load * Days of Autonomy) / Depth of Discharge
  // Applying an additional efficiency factor for inverter losses
  const requiredBatteryCapacityWh = (totalDailyLoadWh * config.daysOfAutonomy) / (config.depthOfDischarge / 100) / (config.inverterEfficiency / 100);
  const requiredBatteryCapacityAh = requiredBatteryCapacityWh / config.systemVoltage;

  // PV Array Size (W) = Total Daily Load / (Sun Hours * System Efficiency)
  // Assuming overall system efficiency of 75% for solar to battery to load
  const requiredPvArraySizeW = totalDailyLoadWh / (config.sunHours * 0.75);

  return {
    totalDailyLoadWh,
    totalSurgeLoadW: maxSurgeW,
    totalContinuousLoadW: activeLoadW,
    requiredBatteryCapacityWh,
    requiredBatteryCapacityAh,
    requiredInverterSizeW,
    requiredPvArraySizeW
  };
}
