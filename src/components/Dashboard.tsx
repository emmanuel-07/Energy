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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div className="bg-white dark:bg-[#181818] rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-colors duration-300">
          <div className="flex items-center justify-between pb-4 sm:pb-6">
            <div className="group relative">
               <p className="text-[10px] font-semibold text-slate-700 dark:text-neutral-300 uppercase tracking-[0.15em] cursor-help whitespace-nowrap">
                  Total Daily Load
               </p>
               <div className="absolute top-full left-0 mt-2 hidden w-[200px] sm:w-64 p-3 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl group-hover:block z-10 font-medium normal-case tracking-normal border border-white/10 break-words">
                 Sum of all appliance energy usage based on hours used per day.
               </div>
            </div>
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-neutral-300 flex-shrink-0 ml-2" />
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 dark:text-white mt-2 sm:mt-4 transition-colors whitespace-nowrap">
            {(results.totalDailyLoadWh / 1000).toFixed(2)} <span className="text-[10px] sm:text-xs text-slate-500 dark:text-neutral-400 font-normal tracking-wide uppercase ml-1">kWh/day</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181818] rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-colors duration-300">
          <div className="flex items-center justify-between pb-4 sm:pb-6">
            <p className="text-[10px] font-semibold text-slate-700 dark:text-neutral-300 uppercase tracking-[0.15em] whitespace-nowrap">Required Array Size</p>
            <SunMedium className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 ml-2" />
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 dark:text-white mt-2 sm:mt-4 transition-colors whitespace-nowrap">
            {(results.requiredPvArraySizeW / 1000).toFixed(2)} <span className="text-[10px] sm:text-xs text-slate-500 dark:text-neutral-400 font-normal tracking-wide uppercase ml-1">kW</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181818] rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-colors duration-300">
          <div className="flex items-center justify-between pb-4 sm:pb-6">
            <p className="text-[10px] font-semibold text-slate-700 dark:text-neutral-300 uppercase tracking-[0.15em] whitespace-nowrap">Battery Capacity</p>
            <BatteryCharging className="h-4 w-4 sm:h-5 sm:w-5 text-slate-700 dark:text-neutral-300 flex-shrink-0 ml-2" />
          </div>
          <div className="flex flex-col mt-2 sm:mt-4 transition-colors">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 dark:text-white whitespace-nowrap">
              {(results.requiredBatteryCapacityWh / 1000).toFixed(2)} <span className="text-[10px] sm:text-xs text-slate-500 dark:text-neutral-400 font-normal tracking-wide uppercase ml-1">kWh</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-amber-600 dark:text-amber-500 mt-2 sm:mt-3 font-medium tracking-wide uppercase whitespace-nowrap">
              {results.requiredBatteryCapacityAh.toFixed(0)} Ah
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#181818] rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-colors duration-300">
          <div className="flex items-center justify-between pb-4 sm:pb-6">
            <p className="text-[10px] font-semibold text-slate-700 dark:text-neutral-300 uppercase tracking-[0.15em] whitespace-nowrap">Inverter Size</p>
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 ml-2" />
          </div>
          <div className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-900 dark:text-white mt-2 sm:mt-4 transition-colors whitespace-nowrap">
            {(results.requiredInverterSizeW / 1000).toFixed(2)} <span className="text-[10px] sm:text-xs text-slate-500 dark:text-neutral-400 font-normal tracking-wide uppercase ml-1">kW</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
        <div className="bg-white dark:bg-[#181818] rounded-3xl p-8 transition-colors duration-300">
          <div className="pb-8 mb-6">
            <h3 className="text-sm font-normal text-slate-900 dark:text-white uppercase tracking-widest">Load Distribution</h3>
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

        <div className="bg-[#FFE600] p-10 flex flex-col justify-between transition-colors duration-300 rounded-3xl shadow-none">
          <div>
             <h3 className="text-sm font-medium text-black uppercase tracking-widest mb-8 flex items-center gap-3">
               <Zap className="w-4 h-4" /> Your Recommended System
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 mx-auto sm:mx-0 gap-x-6 gap-y-8 sm:gap-y-10">
               <div className="group relative">
                 <p className="text-[10px] font-semibold text-black/70 uppercase tracking-widest mb-2 cursor-help whitespace-nowrap">
                    Total Daily Load
                 </p>
                 <div className="absolute top-full left-0 mt-2 hidden w-[200px] sm:w-64 p-3 bg-slate-900 text-white text-[10px] rounded-lg shadow-xl group-hover:block z-10 font-medium normal-case tracking-normal break-words">
                   Sum of all appliance energy usage based on hours used per day.
                 </div>
                 <p className="text-3xl md:text-4xl font-light text-black mt-1 whitespace-nowrap">{(results.totalDailyLoadWh / 1000).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 2})} <span className="text-sm tracking-wide text-black/70">kWh</span></p>
               </div>
               <div>
                 <p className="text-[10px] font-semibold text-black/70 uppercase tracking-widest mb-2 whitespace-nowrap">Total Active Load</p>
                 <p className="text-3xl md:text-4xl font-light text-black mt-1 whitespace-nowrap">{(results.totalContinuousLoadW / 1000).toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 2})} <span className="text-sm tracking-wide text-black/70">kW</span></p>
               </div>
               <div className="sm:col-span-2 pt-4 border-t sm:border-t-0 border-black/10">
                 <p className="text-[10px] font-semibold text-black/70 uppercase tracking-widest mb-2 whitespace-nowrap">Min. Inverter Rating</p>
                 <p className="text-5xl md:text-6xl font-semibold text-black tracking-tight whitespace-nowrap">{Math.ceil(results.requiredInverterSizeW / 1000)} <span className="text-2xl font-light tracking-wide text-black/70 ml-2">kVA</span></p>
               </div>
             </div>
          </div>
        </div>

        <div className="xl:col-span-2 bg-white dark:bg-[#181818] rounded-3xl p-8 transition-colors duration-300 mt-8">
           <div className="pb-8 mb-6 flex items-center gap-2">
             <Info className="w-5 h-5 text-amber-500" />
             <h3 className="text-sm font-normal text-slate-900 dark:text-white uppercase tracking-widest flex-1">Energy Insights & Optimization</h3>
             <button 
               onClick={() => window.print()} 
               className="text-[10px] font-medium uppercase tracking-wider text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
             >
               Export / Print
             </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-6">
               <h4 className="text-xs font-normal uppercase tracking-widest text-slate-400 dark:text-neutral-500 flex items-center gap-2">
                 <TrendingDown className="w-4 h-4" /> Top Energy Consumers
               </h4>
               {loadData.length > 0 ? (
                 <ul className="space-y-4">
                   {loadData.slice(0, 3).map((item, idx) => (
                     <li key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-normal text-slate-900 dark:text-white truncate pr-4">{item.name}</span>
                        <span className="text-amber-500 font-normal whitespace-nowrap">{(item.value / 1000).toFixed(2)} kWh/d</span>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-sm text-slate-400 font-light">No appliances configured yet.</p>
               )}
             </div>
             <div>
               <h4 className="text-xs font-normal uppercase tracking-widest text-slate-400 dark:text-neutral-500 mb-6">How to reduce cost?</h4>
               <ul className="text-sm text-slate-600 dark:text-neutral-400 space-y-4 list-none p-0 font-light leading-relaxed">
                 <li><strong className="text-slate-900 dark:text-white font-medium block mb-1">Reduce usage hours</strong> For heavy consumers like ACs or Pumps, turning them off just 1-2 hours earlier drastically reduces battery size.</li>
                 <li><strong className="text-slate-900 dark:text-white font-medium block mb-1">Run heavy loads on Sun power</strong> Use pumping machines and microwaves during peak sun hours (10am - 2pm) directly off solar panels to save battery.</li>
                 <li><strong className="text-slate-900 dark:text-white font-medium block mb-1">Upgrade efficiency</strong> Use inverter ACs and inverter fridges to spread the surge and reduce duty cycles.</li>
               </ul>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
