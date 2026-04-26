import { Room } from '../types';

export const appliancePresets = [
  { name: 'LED Light Bulb', continuousWatts: 15, surgeWatts: 0, dutyCycle: 1, defaultQuantity: 4, defaultHours: 6 },
  { name: 'Ceiling Fan', continuousWatts: 70, surgeWatts: 100, dutyCycle: 1, defaultQuantity: 1, defaultHours: 8 },
  { name: 'Standing Fan', continuousWatts: 50, surgeWatts: 70, dutyCycle: 1, defaultQuantity: 1, defaultHours: 12 },
  { name: 'Television (Smart TV)', continuousWatts: 120, surgeWatts: 0, dutyCycle: 1, defaultQuantity: 1, defaultHours: 6 },
  { name: 'Laptop / Computer', continuousWatts: 60, surgeWatts: 0, dutyCycle: 1, defaultQuantity: 1, defaultHours: 8 },
  { name: 'Decoder / Router', continuousWatts: 15, surgeWatts: 0, dutyCycle: 1, defaultQuantity: 1, defaultHours: 12 },
  { name: 'Small Fridge', continuousWatts: 150, surgeWatts: 450, dutyCycle: 0.4, defaultQuantity: 1, defaultHours: 24 },
  { name: 'Large Fridge/Freezer', continuousWatts: 300, surgeWatts: 1000, dutyCycle: 0.35, defaultQuantity: 1, defaultHours: 24 },
  { name: 'Air Conditioner (1 HP)', continuousWatts: 750, surgeWatts: 1500, dutyCycle: 0.6, defaultQuantity: 1, defaultHours: 8 },
  { name: 'Air Conditioner (1.5 HP)', continuousWatts: 1125, surgeWatts: 2000, dutyCycle: 0.6, defaultQuantity: 1, defaultHours: 8 },
  { name: 'Microwave', continuousWatts: 1200, surgeWatts: 1500, dutyCycle: 1, defaultQuantity: 1, defaultHours: 0.5 },
  { name: 'Pumping Machine', continuousWatts: 750, surgeWatts: 2000, dutyCycle: 1, defaultQuantity: 1, defaultHours: 1 },
];

export const homePresets = {
  '1_bedroom': {
    name: '1 Bedroom Apartment',
    rooms: [
      {
        id: '1',
        name: 'Living Space',
        appliances: [
          { id: '1-1', name: 'LED Lights', quantity: 3, continuousWatts: 15, surgeWatts: 0, dutyCycle: 1, hoursPerDay: 5 },
          { id: '1-2', name: 'Television', quantity: 1, continuousWatts: 80, surgeWatts: 0, dutyCycle: 1, hoursPerDay: 4 },
          { id: '1-3', name: 'Standing Fan', quantity: 1, continuousWatts: 50, surgeWatts: 70, dutyCycle: 1, hoursPerDay: 10 },
          { id: '1-4', name: 'Router', quantity: 1, continuousWatts: 10, surgeWatts: 0, dutyCycle: 1, hoursPerDay: 12 },
          { id: '1-5', name: 'Small Fridge', quantity: 1, continuousWatts: 100, surgeWatts: 300, dutyCycle: 0.4, hoursPerDay: 24 }
        ]
      }
    ]
  },
  '3_bedroom': {
    name: '3 Bedroom Home',
    rooms: [
      {
        id: '1',
        name: 'General & Living',
        appliances: [
          { id: '1-1', name: 'LED Lights', quantity: 6, continuousWatts: 15, surgeWatts: 0, dutyCycle: 1, hoursPerDay: 6 },
          { id: '1-2', name: 'Smart TV', quantity: 1, continuousWatts: 120, surgeWatts: 0, dutyCycle: 1, hoursPerDay: 6 },
          { id: '1-3', name: 'Ceiling Fan', quantity: 2, continuousWatts: 70, surgeWatts: 100, dutyCycle: 1, hoursPerDay: 8 },
          { id: '1-4', name: 'Router & Decoder', quantity: 2, continuousWatts: 15, surgeWatts: 0, dutyCycle: 1, hoursPerDay: 12 },
        ]
      },
      {
        id: '2',
        name: 'Kitchen & Utility',
        appliances: [
          { id: '2-1', name: 'Large Fridge', quantity: 1, continuousWatts: 300, surgeWatts: 1000, dutyCycle: 0.35, hoursPerDay: 24 },
          { id: '2-2', name: 'Pumping Machine', quantity: 1, continuousWatts: 750, surgeWatts: 2000, dutyCycle: 1, hoursPerDay: 0.8 },
          { id: '2-3', name: 'Microwave', quantity: 1, continuousWatts: 1200, surgeWatts: 1500, dutyCycle: 1, hoursPerDay: 0.2 },
        ]
      }
    ]
  },
  'office': {
    name: 'Small Office',
    rooms: [
      {
        id: '1',
        name: 'Office Area',
        appliances: [
          { id: '1-1', name: 'LED Lights', quantity: 8, continuousWatts: 20, surgeWatts: 0, dutyCycle: 1, hoursPerDay: 10 },
          { id: '1-2', name: 'Laptops', quantity: 4, continuousWatts: 60, surgeWatts: 0, dutyCycle: 1, hoursPerDay: 8 },
          { id: '1-3', name: 'Router', quantity: 1, continuousWatts: 15, surgeWatts: 0, dutyCycle: 1, hoursPerDay: 24 },
          { id: '1-4', name: 'Air Conditioner (1 HP)', quantity: 1, continuousWatts: 750, surgeWatts: 1500, dutyCycle: 0.6, hoursPerDay: 9 },
          { id: '1-5', name: 'Water Dispenser', quantity: 1, continuousWatts: 500, surgeWatts: 500, dutyCycle: 0.2, hoursPerDay: 10 },
        ]
      }
    ]
  }
} as Record<string, { name: string; rooms: Room[] }>;
