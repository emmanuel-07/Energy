import React from 'react';
import { SystemConfig as ConfigType } from '../types';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Settings, Battery, Zap, Calculator, ChevronDown } from 'lucide-react';
import { NumericInput } from './LoadBuilder';

interface SystemConfigProps {
  config: ConfigType;
  setConfig: React.Dispatch<React.SetStateAction<ConfigType>>;
  onCalculate?: () => void;
}

export function SystemConfig({ config, setConfig, onCalculate }: SystemConfigProps) {
  const handleChange = (field: keyof ConfigType, value: number) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white dark:bg-[#181818] rounded-3xl transition-colors duration-300 p-8 lg:p-12 mt-12">
      <div className="pb-8">
        <div className="text-2xl font-light text-slate-900 dark:text-white flex items-center gap-4 transition-colors">
          Architectural Parameters
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
        
        <div className="space-y-10">
          <div className="text-[10px] font-medium text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
            Storage Subsystem
          </div>
          
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="daysOfAutonomy" className="text-xs uppercase tracking-widest text-slate-400 dark:text-neutral-500 font-normal">Days of Autonomy</Label>
            </div>
            <NumericInput 
              min={1} max={10} step={0.5}
              value={config.daysOfAutonomy}
              onChange={(val) => handleChange('daysOfAutonomy', val)}
              className="w-full bg-transparent border-0 border-b border-slate-200 focus:border-amber-500 rounded-none p-0 py-2 text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 transition-colors font-light"
            />
            <p className="text-[10px] text-slate-400 dark:text-neutral-600 mt-3 font-light">Days the system can run without solar generation.</p>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="depthOfDischarge" className="text-xs uppercase tracking-widest text-slate-400 dark:text-neutral-500 font-normal">Depth of Discharge (DoD) %</Label>
            </div>
            <NumericInput 
              min={10} max={100}
              value={config.depthOfDischarge}
              onChange={(val) => handleChange('depthOfDischarge', val)}
              className="w-full bg-transparent border-0 border-b border-slate-200 focus:border-amber-500 rounded-none p-0 py-2 text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 transition-colors font-light"
            />
            <p className="text-[10px] text-slate-400 dark:text-neutral-600 mt-3 font-light">Safe discharge threshold (e.g., 50% for Lead-Acid, 80% for LiFePO4).</p>
          </div>
        </div>

        <div className="space-y-10">
          <div className="text-[10px] font-medium text-slate-400 dark:text-neutral-500 uppercase tracking-widest">
            Power Subsystem
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="systemVoltage" className="text-xs uppercase tracking-widest text-slate-400 dark:text-neutral-500 font-normal">System Voltage (DC)</Label>
            </div>
            <div className="relative">
              <select 
                id="systemVoltage"
                className="w-full bg-transparent border-0 border-b border-slate-200 focus:border-amber-500 rounded-none p-0 py-2 text-lg text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-0 transition-colors font-light [&>option]:bg-white dark:[&>option]:bg-[#181818]"
                value={config.systemVoltage}
                onChange={(e) => handleChange('systemVoltage', parseInt(e.target.value))}
              >
                <option value="12">12V DC</option>
                <option value="24">24V DC</option>
                <option value="48">48V DC</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-neutral-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="inverterEfficiency" className="text-xs uppercase tracking-widest text-slate-400 dark:text-neutral-500 font-normal">Inverter Efficiency %</Label>
            </div>
            <NumericInput 
              min={50} max={100}
              value={config.inverterEfficiency}
              onChange={(val) => handleChange('inverterEfficiency', val)}
              className="w-full bg-transparent border-0 border-b border-slate-200 focus:border-amber-500 rounded-none p-0 py-2 text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 transition-colors font-light"
            />
          </div>
          
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="sunHours" className="text-xs uppercase tracking-widest text-slate-400 dark:text-neutral-500 font-normal">Peak Sun Hours</Label>
            </div>
            <NumericInput 
              min={1} max={12} step={0.1}
              value={config.sunHours}
              onChange={(val) => handleChange('sunHours', val)}
              className="w-full bg-transparent border-0 border-b border-slate-200 focus:border-amber-500 rounded-none p-0 py-2 text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-0 transition-colors font-light"
            />
             <p className="text-[10px] text-slate-400 dark:text-neutral-600 mt-3 font-light">Regional average effective solar irradiation parameter.</p>
          </div>
        </div>

        {onCalculate && (
          <div className="md:col-span-2 flex justify-end pt-8 mt-4">
            <button onClick={onCalculate} className="bg-[#FFE600] hover:bg-yellow-400 text-black px-10 py-5 text-sm font-medium uppercase tracking-widest transition-colors flex items-center gap-3 rounded-2xl">
              Generate Blueprint <Calculator className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
