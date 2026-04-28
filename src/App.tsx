import React, { useState, useEffect } from 'react';
import { Room, SystemConfig as ConfigType } from './types';
import { calculateSystemRequirements } from './lib/calculations';
import { LoadBuilder } from './components/LoadBuilder';
import { SystemConfig } from './components/SystemConfig';
import { Dashboard } from './components/Dashboard';
import { BOM } from './components/BOM';
import { LandingPage } from './components/LandingPage';
import { ArrowLeft, User, Moon, Sun, Menu, X, Settings } from 'lucide-react';
import { Button } from './components/ui/Button';
import { Input } from './components/ui/Input';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<'load' | 'config' | 'results'>('load');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const [rooms, setRooms] = useState<Room[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('solaris_rooms');
      if (saved) return JSON.parse(saved);
    }
    return [
      {
        id: '1',
        name: 'Main Living Area',
        appliances: [
          { id: 'a1', name: 'LED Lights', quantity: 4, continuousWatts: 15, surgeWatts: 0, hoursPerDay: 6, dutyCycle: 1 },
          { id: 'a2', name: 'Television', quantity: 1, continuousWatts: 120, surgeWatts: 0, hoursPerDay: 4, dutyCycle: 1 },
          { id: 'a3', name: 'Ceiling Fan', quantity: 1, continuousWatts: 70, surgeWatts: 100, hoursPerDay: 8, dutyCycle: 1 },
        ]
      }
    ];
  });

  const [config, setConfig] = useState<ConfigType>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('solaris_config');
      if (saved) return JSON.parse(saved);
    }
    return {
      daysOfAutonomy: 1.5,
      depthOfDischarge: 50,
      systemVoltage: 24,
      inverterEfficiency: 90,
      sunHours: 4.5
    };
  });

  const hasInvalidInputs = rooms.some(room => 
    room.appliances.some(app => 
      app.quantity < 1 || 
      app.continuousWatts < 0 || 
      app.hoursPerDay < 0 || 
      app.hoursPerDay > 24
    )
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('solaris_rooms', JSON.stringify(rooms));
    }
  }, [rooms]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('solaris_config', JSON.stringify(config));
    }
  }, [config]);

  const results = calculateSystemRequirements(rooms, config);

  if (!isStarted) {
    return <LandingPage onStart={() => setIsStarted(true)} theme={theme} toggleTheme={toggleTheme} />;
  }

  return (
    <div className="h-screen print:h-auto overflow-hidden print:overflow-visible flex flex-col bg-slate-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-white font-sans selection:bg-amber-400 dark:selection:bg-[#FFE600] selection:text-black transition-colors duration-300">
      
      {/* Header */}
      <header className="print:hidden bg-slate-50 dark:bg-[#0a0a0a] border-b border-transparent py-6 px-8 md:px-12 z-30 relative flex-shrink-0 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsStarted(false)} 
              className="text-amber-600 dark:text-[#FFE600] hover:text-amber-700 dark:hover:text-yellow-400 transition-colors uppercase font-bold tracking-[0.15em] text-[10px] hidden sm:block"
            >
              ← Back
            </button>
            <span className="text-sm font-bold tracking-[0.3em] uppercase text-slate-900 dark:text-white pt-0.5">
              SOLARIS
            </span>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
             <button onClick={toggleTheme} className="text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
               {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
             </button>
             
             <div onClick={() => alert('Account Settings coming soon!')} className="hidden lg:flex w-8 h-8 rounded-none border border-slate-200 dark:border-neutral-800 items-center justify-center bg-white dark:bg-transparent transition-colors cursor-pointer hover:border-amber-500 dark:hover:border-[#FFE600] group">
               <User className="w-4 h-4 text-slate-500 dark:text-neutral-400 group-hover:text-amber-500 dark:group-hover:text-[#FFE600] transition-colors" strokeWidth={1.5} />
             </div>

             <motion.button 
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="md:hidden cursor-pointer relative w-9 h-9 rounded-xl border border-slate-200 dark:border-neutral-600 bg-white dark:bg-[#111] flex items-center justify-center transition-colors overflow-hidden text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white"
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
             >
               <AnimatePresence mode="wait">
                 {isSidebarOpen ? (
                   <motion.div
                     key="close"
                     initial={{ rotate: -90, opacity: 0 }}
                     animate={{ rotate: 0, opacity: 1 }}
                     exit={{ rotate: 90, opacity: 0 }}
                     transition={{ duration: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                   >
                     <X className="w-4 h-4" strokeWidth={2} />
                   </motion.div>
                 ) : (
                   <motion.div
                     key="menu"
                     initial={{ rotate: 90, opacity: 0 }}
                     animate={{ rotate: 0, opacity: 1 }}
                     exit={{ rotate: -90, opacity: 0 }}
                     transition={{ duration: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                   >
                     <Menu className="w-4 h-4" strokeWidth={2} />
                   </motion.div>
                 )}
               </AnimatePresence>
             </motion.button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden print:overflow-visible flex-col md:flex-row relative">
        
        {/* Sidebar Overlay for Mobile */}
        <AnimatePresence>
            {isSidebarOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="print:hidden md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </AnimatePresence>

        {/* Sidebar Navigation */}
        <aside className={`print:hidden fixed md:relative inset-y-0 left-0 z-50 md:z-0 w-72 md:w-64 lg:w-80 flex flex-col bg-slate-50 dark:bg-[#0a0a0a] overflow-y-auto print:overflow-visible transition-transform duration-300 transform md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-8 md:p-12">
            <div className="flex items-center justify-between mb-8 pb-4">
               <h3 className="text-[10px] uppercase tracking-[0.15em] text-slate-400 dark:text-neutral-600 font-bold">Engine Stages</h3>
               <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500">
                  <X className="w-4 h-4" />
               </button>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { setActiveTab('load'); setIsSidebarOpen(false); }}
                className={`group cursor-pointer px-5 py-4 text-left transition-all rounded-xl ${activeTab === 'load' ? 'bg-white dark:bg-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200/60 dark:border-transparent' : 'hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'}`}
              >
                <span className={`block text-[11px] font-bold uppercase tracking-[0.1em] ${activeTab === 'load' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-neutral-500 group-hover:text-slate-900 dark:group-hover:text-white'}`}>1. Add Your Usage</span>
                <span className="block max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-2 text-[10px] tracking-normal normal-case font-medium text-slate-500 dark:text-neutral-400">
                  List your rooms and appliances to calculate your energy needs.
                </span>
              </button>
              <button 
                disabled={hasInvalidInputs}
                onClick={() => { setActiveTab('config'); setIsSidebarOpen(false); }}
                className={`group cursor-pointer px-5 py-4 text-left transition-all rounded-xl ${hasInvalidInputs ? 'opacity-50 cursor-not-allowed border flex items-center justify-between' : ''} ${activeTab === 'config' ? 'bg-white dark:bg-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200/60 dark:border-transparent' : 'hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'}`}
              >
                <div>
                  <span className={`block text-[11px] font-bold uppercase tracking-[0.1em] ${activeTab === 'config' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-neutral-500 group-hover:text-slate-900 dark:group-hover:text-white'}`}>2. Review System</span>
                  <span className="block max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-2 text-[10px] tracking-normal normal-case font-medium text-slate-500 dark:text-neutral-400">
                    Fine-tune limits and requirements for your setup.
                  </span>
                </div>
              </button>
              <button 
                disabled={hasInvalidInputs}
                onClick={() => { setActiveTab('results'); setIsSidebarOpen(false); }}
                className={`group cursor-pointer px-5 py-4 text-left transition-all rounded-xl ${hasInvalidInputs ? 'opacity-50 cursor-not-allowed border flex items-center justify-between' : ''} ${activeTab === 'results' ? 'bg-white dark:bg-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-200/60 dark:border-transparent' : 'hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'}`}
              >
                <div>
                  <span className={`block text-[11px] font-bold uppercase tracking-[0.1em] ${activeTab === 'results' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-neutral-500 group-hover:text-slate-900 dark:group-hover:text-white'}`}>3. View Plan</span>
                  <span className="block max-h-0 opacity-0 overflow-hidden transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100 group-hover:mt-2 text-[10px] tracking-normal normal-case font-medium text-slate-500 dark:text-neutral-400">
                    See your recommended system size and equipment breakdown.
                  </span>
                </div>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 w-full overflow-y-auto print:overflow-visible overflow-x-hidden bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300">
          <div className="p-6 md:p-10 lg:p-16 xl:p-20 w-full max-w-7xl mx-auto">
            {activeTab === 'load' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-12 pb-8">
                  <h2 className="text-3xl md:text-4xl font-light text-slate-900 dark:text-white tracking-tight font-sans">Add your rooms and appliances to estimate your solar needs</h2>
                  <p className="text-slate-400 mt-2 text-base font-normal">Start by adding a room, then include the devices you use daily.</p>
                </div>
                <LoadBuilder rooms={rooms} setRooms={setRooms} onNext={() => setActiveTab('config')} />
              </div>
            )}

            {activeTab === 'config' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-12 pb-8">
                  <h2 className="text-3xl md:text-4xl font-light text-slate-900 dark:text-white tracking-tight font-sans">Review System Configuration</h2>
                  <p className="text-slate-400 mt-2 text-base font-normal">Fine-tune your backup needs and limits before viewing your plan.</p>
                </div>
                <SystemConfig config={config} setConfig={setConfig} onCalculate={() => setActiveTab('results')} />
              </div>
            )}

            {activeTab === 'results' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-16">
                <div className="mb-12 pb-8">
                  <h2 className="text-3xl md:text-4xl font-light text-slate-900 dark:text-white tracking-tight font-sans">Your Solar Plan</h2>
                  <p className="text-slate-400 mt-2 text-base font-normal">A complete breakdown of the equipment needed and the estimated cost.</p>
                </div>
                
                <div className="space-y-12">
                  <Dashboard results={results} rooms={rooms} />
                  <BOM results={results} config={config} rooms={rooms} />
                </div>
                
                {/* Lead Gen Form */}
                <div className="print:hidden bg-white dark:bg-[#181818] border border-slate-200/80 dark:border-white/5 p-6 sm:p-8 md:p-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8 mt-12 transition-all duration-300 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none w-full">
                  <div className="flex-1 w-full">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">Initialize Deployment</h3>
                    <p className="text-slate-500 text-sm">Transmit this blueprint to a certified SOLARIS engineer for validation.</p>
                  </div>
                  <div className="flex w-full xl:w-auto flex-col sm:flex-row gap-4 items-stretch sm:items-end mt-2 md:mt-0">
                    <div className="flex flex-col w-full sm:flex-1 xl:w-72">
                      <label className="text-[9px] uppercase tracking-[0.15em] text-slate-500 font-bold mb-2 md:mb-3">Email Authorization</label>
                      <input 
                        type="email" 
                        placeholder="address@domain.com" 
                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-[#FFE600] transition-all"
                      />
                    </div>
                    <button 
                      onClick={() => alert("Verification Email Sent!")}
                      className="bg-[#FFE600] hover:bg-yellow-400 cursor-pointer text-black px-6 py-3 h-[46px] text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.15em] transition-all w-full sm:w-auto rounded-xl shadow-lg shadow-[#FFE600]/20 flex justify-center items-center flex-shrink-0"
                    >
                      Request Review
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
