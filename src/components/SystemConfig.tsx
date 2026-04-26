import React from 'react';
import { SystemConfig as ConfigType } from '../types';
import { Label } from './ui/Label';
import { Input } from './ui/Input';
import { Settings, Battery, Zap, Calculator, ChevronDown } from 'lucide-react';

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
    <div className="border border-slate-200/80 dark:border-white/5 bg-white dark:bg-[#181818] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none transition-colors duration-300">
      <div className="py-6 px-8 border-b border-slate-100 dark:border-neutral-800 flex flex-row items-center justify-between transition-colors bg-white dark:bg-transparent">
        <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-4 uppercase tracking-[0.1em] transition-colors">
          <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-neutral-800 flex items-center justify-center transition-colors bg-slate-50 dark:bg-transparent shadow-sm dark:shadow-none">
            <Settings className="w-5 h-5 text-slate-500 dark:text-neutral-500" />
          </div>
          Architectural Parameters
        </div>
      </div>
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
        
        <div className="space-y-8">
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-[0.2em] mb-6 border-b border-slate-200 dark:border-neutral-800 pb-4 transition-colors">
            <Battery className="w-4 h-4 text-slate-400 dark:text-neutral-400" /> Storage Subsystem
          </div>
          
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3 ml-1">
              <Label htmlFor="daysOfAutonomy" className="text-[9px] uppercase tracking-[0.15em] text-slate-500 font-bold">Days of Autonomy</Label>
              <span className="text-[10px] font-mono text-amber-600 dark:text-[#FFE600] tracking-wider">{config.daysOfAutonomy} DAYS</span>
            </div>
            <Input 
              id="daysOfAutonomy" 
              type="number" min="1" max="10" step="0.5"
              value={config.daysOfAutonomy}
              onChange={(e) => handleChange('daysOfAutonomy', parseFloat(e.target.value) || 1)}
              className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200/80 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-[#FFE600] transition-all"
            />
            <p className="text-[10px] text-slate-400 dark:text-neutral-600 mt-2 ml-1">Days the system can run without solar generation.</p>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3 ml-1">
              <Label htmlFor="depthOfDischarge" className="text-[9px] uppercase tracking-[0.15em] text-slate-500 font-bold">Depth of Discharge (DoD) %</Label>
              <span className="text-[10px] font-mono text-amber-600 dark:text-[#FFE600] tracking-wider">{config.depthOfDischarge}%</span>
            </div>
            <Input 
              id="depthOfDischarge" 
              type="number" min="10" max="100"
              value={config.depthOfDischarge}
              onChange={(e) => handleChange('depthOfDischarge', parseFloat(e.target.value) || 50)}
              className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200/80 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-[#FFE600] transition-all"
            />
            <p className="text-[10px] text-slate-400 dark:text-neutral-600 mt-2 ml-1">Safe discharge threshold (e.g., 50% for Lead-Acid, 80% for LiFePO4).</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-[0.2em] mb-6 border-b border-slate-200 dark:border-neutral-800 pb-4 transition-colors">
            <Zap className="w-4 h-4 text-slate-400 dark:text-neutral-400" /> Power Subsystem
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3 ml-1">
              <Label htmlFor="systemVoltage" className="text-[9px] uppercase tracking-[0.15em] text-slate-500 font-bold">System Voltage (DC)</Label>
              <span className="text-[10px] font-mono text-amber-600 dark:text-[#FFE600] tracking-wider">{config.systemVoltage}V</span>
            </div>
            <div className="relative">
              <select 
                id="systemVoltage"
                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200/80 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-[#FFE600] transition-all [&>option]:bg-white dark:[&>option]:bg-[#181818]"
                value={config.systemVoltage}
                onChange={(e) => handleChange('systemVoltage', parseInt(e.target.value))}
              >
                <option value="12">12V DC</option>
                <option value="24">24V DC</option>
                <option value="48">48V DC</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-neutral-500 pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3 ml-1">
              <Label htmlFor="inverterEfficiency" className="text-[9px] uppercase tracking-[0.15em] text-slate-500 font-bold">Inverter Efficiency %</Label>
              <span className="text-[10px] font-mono text-amber-600 dark:text-[#FFE600] tracking-wider">{config.inverterEfficiency}%</span>
            </div>
            <Input 
              id="inverterEfficiency" 
              type="number" min="50" max="100"
              value={config.inverterEfficiency}
              onChange={(e) => handleChange('inverterEfficiency', parseFloat(e.target.value) || 90)}
              className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200/80 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-[#FFE600] transition-all"
            />
          </div>
          
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-3 ml-1">
              <Label htmlFor="sunHours" className="text-[9px] uppercase tracking-[0.15em] text-slate-500 font-bold">Peak Sun Hours</Label>
              <span className="text-[10px] font-mono text-amber-600 dark:text-[#FFE600] tracking-wider">{config.sunHours} HR</span>
            </div>
            <Input 
              id="sunHours" 
              type="number" min="1" max="12" step="0.1"
              value={config.sunHours}
              onChange={(e) => handleChange('sunHours', parseFloat(e.target.value) || 4.5)}
              className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200/80 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-[#FFE600] transition-all"
            />
             <p className="text-[10px] text-slate-400 dark:text-neutral-600 mt-2 ml-1">Regional average effective solar irradiation parameter.</p>
          </div>
        </div>

        {onCalculate && (
          <div className="md:col-span-2 flex justify-end pt-8 mt-4 border-t border-slate-100 dark:border-neutral-800 transition-colors">
            <button onClick={onCalculate} className="bg-[#FFE600] hover:bg-yellow-400 text-black px-8 py-4 text-[11px] font-extrabold uppercase tracking-[0.15em] transition-colors flex items-center gap-3 rounded-xl shadow-lg shadow-[#FFE600]/20">
              Generate Blueprint <Calculator className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
