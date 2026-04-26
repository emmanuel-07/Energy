import React, { useMemo } from 'react';
import { CalculationResults, Room } from '../types';
import { Activity, BatteryCharging, SunMedium, Zap, Info, TrendingDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface DashboardProps {
  results: CalculationResults;
  rooms: Room[];
}

export function Dashboard({ results, rooms }: DashboardProps) {
  
  const loadData = useMemo(() => {
    // Generate data for pie chart from top 5 consuming appliances
    const appConsumption: {name: string, value: number}[] = [];
    rooms.forEach(r => {
      r.appliances.forEach(a => {
        const duty = a.dutyCycle ?? 1;
        const dailyWh = a.continuousWatts * a.hoursPerDay * a.quantity * duty;
        if (dailyWh > 0) {
           const existing = appConsumption.find(x => x.name === a.name);
           if (existing) {
             existing.value += dailyWh;
           } else {
             appConsumption.push({ name: a.name, value: dailyWh });
           }
        }
      });
    });
    return appConsumption.sort((a,b) => b.value - a.value).slice(0, 5);
  }, [rooms]);

  const totalPieValue = useMemo(() => loadData.reduce((acc, curr) => acc + curr.value, 0), [loadData]);

  const getPieColor = (value: number) => {
    if (totalPieValue === 0) return '#22c55e';
    const percent = value / totalPieValue;
    if (percent >= 0.35) return '#ef4444'; // Red
    if (percent >= 0.20) return '#f97316'; // Orange
    if (percent >= 0.10) return '#f59e0b'; // Amber/Yellow
    if (percent >= 0.05) return '#84cc16'; // Light Green
    return '#22c55e'; // Green
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
        
        <div className="bg-white dark:bg-[#181818] border border-slate-200/80 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none p-5 sm:p-6 xl:p-8 flex flex-col justify-between transition-colors duration-300">
          <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-100 dark:border-neutral-800 transition-colors">
            <div className="group relative">
               <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-[0.2em] border-b border-slate-300 dark:border-neutral-600 border-dashed pb-[1px] inline-block cursor-help">
                  Total Daily Load
               </p>
               <div className="absolute top-full left-0 mt-2 hidden w-48 sm:w-64 p-3 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl group-hover:block z-10 font-medium normal-case tracking-normal border border-white/10">
                 Calculated by multiplying the wattage of each appliance by its quantity, duty cycle, and daily hours of use.
               </div>
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-transparent shadow-sm dark:shadow-none transition-colors">
              <Activity className="h-4 w-4 text-slate-500 dark:text-neutral-400" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tighter mt-4 sm:mt-6 transition-colors truncate">
            {(results.totalDailyLoadWh / 1000).toFixed(2)} <span className="text-[8px] sm:text-[10px] text-slate-500 dark:text-neutral-500 font-sans tracking-[0.1em] uppercase ml-1">kWh/day</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181818] border border-slate-200/80 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none p-5 sm:p-6 xl:p-8 flex flex-col justify-between transition-colors duration-300">
          <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-100 dark:border-neutral-800 transition-colors">
            <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-[0.2em]">Required Array Size</p>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-transparent shadow-sm dark:shadow-none transition-colors">
              <SunMedium className="h-4 w-4 text-amber-600 dark:text-[#FFE600]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tighter mt-4 sm:mt-6 transition-colors truncate">
            {(results.requiredPvArraySizeW / 1000).toFixed(2)} <span className="text-[8px] sm:text-[10px] text-slate-500 dark:text-neutral-500 font-sans tracking-[0.1em] uppercase ml-1">kW</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181818] border border-slate-200/80 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none p-5 sm:p-6 xl:p-8 flex flex-col justify-between transition-colors duration-300">
          <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-100 dark:border-neutral-800 transition-colors">
            <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-[0.2em]">Battery Capacity</p>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-transparent shadow-sm dark:shadow-none transition-colors">
              <BatteryCharging className="h-4 w-4 text-slate-900 dark:text-white" />
            </div>
          </div>
          <div className="flex flex-col mt-4 sm:mt-6 transition-colors">
            <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tighter truncate">
              {(results.requiredBatteryCapacityWh / 1000).toFixed(2)} <span className="text-[8px] sm:text-[10px] text-slate-500 dark:text-neutral-500 font-sans tracking-[0.1em] uppercase ml-1">kWh</span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-amber-600 dark:text-[#FFE600] mt-1 sm:mt-2 font-mono tracking-widest uppercase truncate">
              {results.requiredBatteryCapacityAh.toFixed(0)} Ah
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181818] border border-slate-200/80 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none p-5 sm:p-6 xl:p-8 flex flex-col justify-between transition-colors duration-300">
          <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-slate-100 dark:border-neutral-800 transition-colors">
            <p className="text-[8px] sm:text-[9px] font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-[0.2em]">Inverter Size</p>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-transparent shadow-sm dark:shadow-none transition-colors">
              <Zap className="h-4 w-4 text-amber-600 dark:text-[#FFE600]" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tighter mt-4 sm:mt-6 transition-colors truncate">
            {(results.requiredInverterSizeW / 1000).toFixed(2)} <span className="text-[8px] sm:text-[10px] text-slate-500 dark:text-neutral-500 font-sans tracking-[0.1em] uppercase ml-1">kW</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-8 mt-6 xl:mt-8">
        <div className="bg-white dark:bg-[#181818] border border-slate-200/80 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none p-6 sm:p-8 transition-colors duration-300">
          <div className="pb-4 border-b border-slate-100 dark:border-neutral-800 mb-6 transition-colors">
            <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">Load Distribution</h3>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={loadData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  className="cursor-pointer"
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, value, name, percent }) => {
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 2;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return percent > 0.05 ? (
                      <text x={x} y={y} fill="currentColor" className="text-[9px] fill-slate-700 dark:fill-slate-400 font-medium whitespace-pre cursor-pointer" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                        {`${name} ${(percent * 100).toFixed(0)}%`}
                      </text>
                    ) : null;
                  }}
                >
                  {loadData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getPieColor(entry.value)} style={{ cursor: 'pointer' }} className="cursor-pointer" />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => `${value} W`}
                  contentStyle={{ backgroundColor: '#111111', borderRadius: '0px', border: '1px solid rgba(255,255,255,0.1)' }}
                  itemStyle={{ color: '#FFE600', fontSize: '12px', fontFamily: 'monospace' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 text-[9px] font-bold text-slate-500 dark:text-neutral-400 mt-4 uppercase tracking-[0.1em]">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-amber-600 dark:bg-[#FFE600]"></div> Total Power Load</div>
            </div>
          </div>
        </div>

        <div className="bg-[#FFE600] p-6 sm:p-8 lg:p-10 flex flex-col justify-between transition-colors duration-300 rounded-3xl shadow-xl shadow-[#FFE600]/20 border border-[#FFE600] dark:border-transparent">
          <div>
             <h3 className="text-[11px] sm:text-[12px] font-extrabold text-black uppercase tracking-[0.2em] mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
               <Zap className="w-4 h-4" /> System Blueprint Summary
             </h3>
             <div className="grid grid-cols-2 sm:grid-cols-2 mx-auto sm:mx-0 gap-4 sm:gap-10">
               <div className="group relative">
                 <p className="text-[8px] sm:text-[9px] font-bold text-black/60 uppercase tracking-[0.15em] mb-1 sm:mb-2 border-b border-black/20 border-dashed pb-[1px] inline-block cursor-help">
                    Total Daily Load
                 </p>
                 <div className="absolute top-full left-0 mt-2 hidden sm:w-64 p-3 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl group-hover:block z-10 font-medium normal-case tracking-normal">
                   Calculated by multiplying the wattage of each appliance by its quantity, duty cycle, and daily hours of use.
                 </div>
                 <p className="font-mono text-lg sm:text-2xl md:text-3xl font-extrabold text-black tracking-tighter truncate mt-1">{(results.totalDailyLoadWh / 1000).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 2})} <span className="text-[8px] sm:text-[10px] font-sans tracking-widest text-black/60">kWh</span></p>
               </div>
               <div>
                 <p className="text-[8px] sm:text-[9px] font-bold text-black/60 uppercase tracking-[0.15em] mb-1 sm:mb-2">Total Active Load</p>
                 <p className="font-mono text-lg sm:text-2xl md:text-3xl font-extrabold text-black tracking-tighter truncate mt-1">{(results.totalContinuousLoadW / 1000).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 2})} <span className="text-[8px] sm:text-[10px] font-sans tracking-widest text-black/60">kW</span></p>
               </div>
               <div className="col-span-2 pt-4 sm:pt-6 border-t border-black/10">
                 <p className="text-[8px] sm:text-[9px] font-bold text-black/60 uppercase tracking-[0.15em] mb-1 sm:mb-2">Min. Inverter Rating</p>
                 <p className="font-mono text-2xl sm:text-4xl md:text-5xl font-extrabold text-black tracking-tighter truncate">{Math.ceil(results.requiredInverterSizeW / 1000)} <span className="text-[10px] sm:text-sm font-sans tracking-widest text-black/60 ml-1 sm:ml-2">kVA</span></p>
               </div>
               <div className="col-span-2 pt-4 sm:pt-6 border-t border-black/10">
                 <p className="text-[8px] sm:text-[9px] font-bold text-black/60 uppercase tracking-[0.15em] mb-1 sm:mb-2">Estimated Investment</p>
                 <p className="font-mono text-xl sm:text-3xl md:text-4xl font-extrabold text-black tracking-tighter truncate">₦ {results.totalEstimatedCostNGN.toLocaleString('en-US', {maximumFractionDigits:0})}</p>
                 <p className="text-[9px] sm:text-xs text-black/60 mt-2 font-medium">Includes Panels, Batteries, Inverter & Standard Installation</p>
               </div>
             </div>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white dark:bg-[#181818] border border-slate-200/80 dark:border-white/5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none p-6 sm:p-8 transition-colors duration-300">
           <div className="pb-4 border-b border-slate-100 dark:border-neutral-800 mb-6 flex items-center gap-2">
             <Info className="w-5 h-5 text-amber-500" />
             <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em] flex-1">Energy Insights & Optimization</h3>
             <button 
               onClick={() => window.print()} 
               className="text-[9px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors bg-slate-100 dark:bg-white/5 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-white/10"
             >
               Export / Print
             </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
               <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-500 flex items-center gap-2">
                 <TrendingDown className="w-4 h-4" /> Top Energy Consumers
               </h4>
               {loadData.length > 0 ? (
                 <ul className="space-y-3">
                   {loadData.slice(0, 3).map((item, idx) => (
                     <li key={idx} className="flex justify-between items-center text-sm p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                        <span className="font-medium text-slate-900 dark:text-white truncate pr-4">{item.name}</span>
                        <span className="font-mono text-amber-600 dark:text-amber-500 font-bold whitespace-nowrap">{(item.value / 1000).toFixed(2)} kWh/d</span>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-sm text-slate-500 italic">No appliances configured yet.</p>
               )}
             </div>
             <div>
               <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-500 mb-4">How to reduce cost?</h4>
               <ul className="text-sm text-slate-600 dark:text-neutral-400 space-y-3 list-disc pl-5 marker:text-amber-500">
                 <li><strong className="text-slate-900 dark:text-white">Reduce usage hours:</strong> For heavy consumers like ACs or Pumps, turning them off just 1-2 hours earlier drastically reduces battery size.</li>
                 <li><strong className="text-slate-900 dark:text-white">Run heavy loads on Sun power:</strong> Use pumping machines and microwaves during peak sun hours (10am - 2pm) directly off solar panels to save battery.</li>
                 <li><strong className="text-slate-900 dark:text-white">Upgrade efficiency:</strong> Use inverter ACs and inverter fridges to spread the surge and reduce duty cycles.</li>
               </ul>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
