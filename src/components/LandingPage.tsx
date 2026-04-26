import React, { useState } from 'react';
import { Zap, Cpu, LineChart, User, ChevronDown, Moon, Sun, Menu, X, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onStart: () => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}

export function LandingPage({ onStart, theme, toggleTheme }: LandingPageProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0a0a0a] text-slate-900 dark:text-white font-sans selection:bg-amber-400 dark:selection:bg-[#FFE600] selection:text-black flex flex-col transition-colors duration-300 relative overflow-hidden">
      
      {/* Dynamic Background Graphics */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-400/20 dark:bg-amber-400/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-70 animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-blue-300/20 dark:bg-blue-500/10 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen opacity-50"></div>
        <div className="absolute -bottom-32 left-0 w-[500px] h-[500px] bg-yellow-200/20 dark:bg-yellow-400/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen opacity-60"></div>
      </div>

      {/* Navbar */}
      <nav className="w-full px-6 md:px-12 py-8 flex justify-between items-center z-20 relative transition-colors duration-300">
        <div className="flex-1">
          <span className="text-sm font-bold tracking-[0.3em] uppercase text-slate-900 dark:text-white">
            SOLARIS
          </span>
        </div>
        
        <div className="hidden lg:flex flex-1 justify-center items-center gap-10">
          <a href="#" onClick={(e) => { e.preventDefault(); onStart(); }} className="text-[10px] font-bold tracking-[0.15em] text-amber-600 dark:text-[#FFE600] uppercase border-b-2 border-amber-600 dark:border-[#FFE600] pb-1">Calculators</a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Systems module coming soon!'); }} className="text-[10px] font-bold tracking-[0.15em] text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white transition-colors uppercase">Systems</a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Technical Docs coming soon!'); }} className="text-[10px] font-bold tracking-[0.15em] text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white transition-colors uppercase">Technical Docs</a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Case Studies coming soon!'); }} className="text-[10px] font-bold tracking-[0.15em] text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white transition-colors uppercase">Case Studies</a>
        </div>

        <div className="flex-1 flex justify-end items-center gap-4 md:gap-6">
          <button onClick={onStart} className="hidden sm:block text-[10px] font-bold tracking-[0.15em] text-amber-600 dark:text-[#FFE600] uppercase transition-colors">
            Calculate Load
          </button>
          
          {toggleTheme && (
            <button onClick={toggleTheme} className="text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          <div onClick={() => alert('Account Settings coming soon!')} className="hidden lg:flex w-8 h-8 rounded-none border border-slate-200 dark:border-neutral-600 bg-white dark:bg-transparent items-center justify-center transition-colors cursor-pointer hover:border-amber-500 dark:hover:border-[#FFE600] group">
            <User className="w-4 h-4 text-slate-500 dark:text-neutral-400 group-hover:text-amber-500 dark:group-hover:text-[#FFE600] transition-colors" strokeWidth={1.5} />
          </div>

          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden relative w-9 h-9 rounded-none border border-slate-200 dark:border-neutral-600 bg-white dark:bg-[#111] flex items-center justify-center transition-colors overflow-hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                >
                  <X className="w-4 h-4 text-slate-900 dark:text-amber-400" strokeWidth={2} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2, type: "spring", stiffness: 200, damping: 20 }}
                >
                  <Menu className="w-4 h-4 text-slate-700 dark:text-neutral-300" strokeWidth={2} />
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Technical scanning ring on active */}
            {isMobileMenuOpen && (
              <motion.div 
                className="absolute inset-0 rounded-none border border-amber-400 dark:border-[#FFE600] pointer-events-none"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-[88px] left-0 right-0 py-8 px-6 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 rounded-none z-50 flex flex-col gap-6 lg:hidden shadow-2xl origin-top"
          >
            <a href="#" onClick={(e) => { e.preventDefault(); onStart(); }} className="text-[10px] font-bold tracking-[0.15em] text-amber-600 dark:text-[#FFE600] uppercase border-b border-amber-100 dark:border-amber-900/30 pb-4 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">Calculators</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Systems module coming soon!'); }} className="text-[10px] font-bold tracking-[0.15em] text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-neutral-500 transition-colors uppercase border-b border-slate-100 dark:border-white/5 pb-4">Systems</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Technical Docs coming soon!'); }} className="text-[10px] font-bold tracking-[0.15em] text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-neutral-500 transition-colors uppercase border-b border-slate-100 dark:border-white/5 pb-4">Technical Docs</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Case Studies coming soon!'); }} className="text-[10px] font-bold tracking-[0.15em] text-slate-500 dark:text-neutral-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-neutral-500 transition-colors uppercase border-b border-slate-100 dark:border-white/5 pb-4">Case Studies</a>
            <div onClick={() => alert('Account Settings coming soon!')} className="flex items-center gap-4 pt-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-none border border-slate-200 dark:border-neutral-600 bg-slate-50 dark:bg-white/5 flex items-center justify-center transition-colors group-hover:border-amber-500 dark:group-hover:border-[#FFE600] group-hover:text-amber-600 dark:group-hover:text-[#FFE600]">
                <User className="w-4 h-4 text-slate-500 dark:text-neutral-400 group-hover:text-amber-600 dark:group-hover:text-[#FFE600] transition-colors" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500 dark:text-neutral-400 uppercase group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Account Settings</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[1240px] mx-auto px-6 pt-16 md:pt-24 pb-20 md:pb-32 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 w-full items-center">
          
          {/* Hero Left */}
          <div className="flex flex-col items-center lg:items-start lg:pr-10 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-[4rem] leading-[1.1] md:leading-[1.05] font-bold text-slate-900 dark:text-white tracking-tight mb-6 font-sans w-full">
              Smart Solar<br className="hidden sm:block" />
              Sizing Assistant.
            </h1>
            <p className="text-sm md:text-[15px] leading-relaxed text-slate-500 dark:text-neutral-400 mb-10 max-w-md mx-auto lg:mx-0 font-medium">
              Calculate your exact energy requirements using real-world presets, and instantly get your estimated solar investment in Naira (₦). A clean and trustworthy planning tool.
            </p>
            <div className="w-full flex justify-center lg:justify-start">
              <button 
                onClick={onStart}
                className="bg-[#FFE600] hover:bg-yellow-400 text-black px-6 py-4 sm:px-8 sm:py-4 md:px-10 md:py-5 text-[10.5px] sm:text-[11px] md:text-[12px] font-extrabold uppercase tracking-[0.15em] transition-all duration-300 w-full max-w-[300px] sm:max-w-none sm:w-auto rounded-none shadow-[0_8px_30px_rgb(255,230,0,0.3)] hover:shadow-[0_12px_40px_rgb(255,230,0,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center justify-center gap-3"
              >
                Plan Your Setup
              </button>
            </div>

            {/* Random Useful Metric Box */}
            <div className="mt-16 hidden lg:inline-flex items-center gap-6 bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 dark:bg-amber-400/10 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-2xl bg-amber-400/20 animate-ping opacity-20"></div>
                <Activity className="w-6 h-6 text-amber-600 dark:text-[#FFE600]" strokeWidth={1.5} />
              </div>
              <div className="pr-4">
                <p className="text-[9px] font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-widest mb-1">Pricing Estimates</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-mono font-extrabold text-slate-900 dark:text-white tracking-tighter">Real-time <span className="text-sm text-slate-400 dark:text-neutral-500">Guides</span></p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold tracking-widest uppercase bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">NGN (₦)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right - Form Card */}
          <div className="bg-white dark:bg-[#181818] p-8 md:p-12 border border-slate-200/80 dark:border-white/5 w-full max-w-[480px] mx-auto lg:ml-auto shadow-[0_20px_60px_rgb(0,0,0,0.06)] dark:shadow-none rounded-[2rem] transition-colors duration-300">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8 border-b border-slate-100 dark:border-neutral-800 pb-6 transition-colors">
              Intelligent Setup Guide
            </h3>
            
            <div className="space-y-6">
              <div className="flex flex-col">
                <label className="text-[9px] uppercase tracking-[0.15em] text-slate-500 font-bold mb-3 ml-1">Building/Home Type</label>
                <PremiumSelect 
                  options={['1-2 Bedroom Combo', '3-4 Bedroom Home', 'Small Office', 'Large Duplex']}
                  defaultValue="3-4 Bedroom Home"
                />
              </div>

              <div className="flex flex-col relative z-20">
                <label className="text-[9px] uppercase tracking-[0.15em] text-slate-500 font-bold mb-3 ml-1">Backup Target</label>
                <PremiumSelect 
                  options={['Essential Loads Only', 'Whole House', 'Hybrid (Solar + Grid)']}
                  defaultValue="Essential Loads Only"
                />
              </div>

              <div className="flex flex-col relative z-10">
                <label className="text-[9px] uppercase tracking-[0.15em] text-slate-500 font-bold mb-3 ml-1">Current Power Outages</label>
                <PremiumSelect 
                  options={['Rare (1-2x/month)', 'Frequent (Daily)', 'Off-grid completely']}
                  defaultValue="Frequent (Daily)"
                />
              </div>

              <button 
                onClick={onStart}
                className="w-full mt-8 border border-slate-200/80 dark:border-neutral-800 hover:border-amber-600 hover:bg-slate-50 dark:hover:bg-white/5 dark:hover:border-[#FFE600] bg-white dark:bg-transparent text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white py-4 text-[10px] font-bold uppercase tracking-[0.15em] transition-all rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                Start Planner
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Features Section */}
      <div className="w-full border-t border-slate-200/80 dark:border-white/5 bg-slate-50 dark:bg-[#111111] transition-colors duration-300 relative z-10">
        <div className="max-w-[1240px] mx-auto px-6 py-16 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Zap className="w-5 h-5 text-slate-900 dark:text-white mb-6" strokeWidth={1.5} />
            <h4 className="text-[13px] font-bold text-slate-900 dark:text-white mb-3">Real-time Surge Analysis</h4>
            <p className="text-slate-500 dark:text-[#888888] text-[12px] leading-[1.8] max-w-[280px]">
              Dynamically compute starting watts vs running watts across infinite appliance permutations.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Cpu className="w-5 h-5 text-slate-900 dark:text-white mb-6" strokeWidth={1.5} />
            <h4 className="text-[13px] font-bold text-slate-900 dark:text-white mb-3">Appliance Profiling</h4>
            <p className="text-slate-500 dark:text-[#888888] text-[12px] leading-[1.8] max-w-[280px]">
              Access an extensive, continually updated database of modern residential electrical loads.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <LineChart className="w-5 h-5 text-slate-900 dark:text-white mb-6" strokeWidth={1.5} />
            <h4 className="text-[13px] font-bold text-slate-900 dark:text-white mb-3">System Efficiency Modeling</h4>
            <p className="text-slate-500 dark:text-[#888888] text-[12px] leading-[1.8] max-w-[280px]">
              Simulate inverter clipping and battery degradation over 25-year operational lifecycles.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="w-full bg-slate-100 dark:bg-[#0a0a0a] transition-colors duration-300 relative z-10 py-20 md:py-32">
        <div className="max-w-[1240px] mx-auto px-6">
          
          {/* 50/50 Split - Mission */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center mb-24 lg:mb-32">
            <div className="order-2 md:order-1 flex flex-col justify-center lg:pr-10">
              <span className="text-[10px] font-bold tracking-[0.2em] text-amber-600 dark:text-[#FFE600] uppercase mb-4">Our Mission</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 font-sans leading-[1.1]">
                Democratizing<br className="hidden lg:block"/> Energy Independence.
              </h2>
              <p className="text-slate-500 dark:text-neutral-400 text-sm md:text-base leading-[1.8] font-medium mb-10">
                We built SOLARIS to bridge the gap between complex electrical engineering and accessible residential solar. Our mission is to empower homeowners, installers, and architects with military-grade load calculation tools that eliminate guesswork and ensure absolute operational resilience.
              </p>
              <div className="flex flex-col items-start text-slate-900 dark:text-white transition-colors border-l-2 border-amber-500 pl-6">
                <Zap className="w-6 h-6 mb-3 text-amber-500 dark:text-[#FFE600]" strokeWidth={1.5} />
                <h3 className="text-base font-bold tracking-tight mb-2">Zero Guesswork</h3>
                <p className="text-[13px] text-slate-500 dark:text-neutral-400 font-medium leading-relaxed">
                  Proprietary algorithmic load profiling replaces spreadsheets with instant, hyper-accurate data constraints.
                </p>
              </div>
            </div>
            <div className="order-1 md:order-2 w-full aspect-square bg-slate-200 dark:bg-black/50 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none rounded-none relative">
              <img 
                src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="Modern solar home" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80 pointer-events-none"></div>
            </div>
          </div>

          {/* 50/50 Split - Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="w-full aspect-square bg-slate-200 dark:bg-black/50 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none rounded-none relative">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3" 
                alt="Global smart grid network" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none"></div>
            </div>
            <div className="flex flex-col justify-center lg:pl-10 pt-8 md:pt-0">
              <span className="text-[10px] font-bold tracking-[0.2em] text-blue-500 dark:text-blue-400 uppercase mb-4">Our Vision</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 font-sans leading-[1.1]">
                The Distributed<br className="hidden lg:block"/> Smart Grid.
              </h2>
              <p className="text-slate-500 dark:text-neutral-400 text-sm md:text-base leading-[1.8] font-medium mb-10">
                The future of human infrastructure relies on decentralized, self-sustaining micro-grids. We envision a world where every structure produces, stores, and intelligently routes its own power.
              </p>
              <div className="flex flex-col items-start text-slate-900 dark:text-white transition-colors border-l-2 border-blue-500 pl-6 mb-10">
                <LineChart className="w-6 h-6 mb-3 text-blue-500" strokeWidth={1.5} />
                <h3 className="text-base font-bold tracking-tight mb-2">Resilient Systems</h3>
                <p className="text-[13px] text-slate-500 dark:text-neutral-400 font-medium leading-relaxed">
                  Configure battery autonomy margins explicitly designed for long-term grid outages and extreme weather.
                </p>
              </div>
              <button onClick={onStart} className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-slate-900 dark:text-white flex items-center gap-2 group transition-all self-start">
                Explore The Systems 
                <span className="text-lg leading-none transform group-hover:translate-x-2 transition-transform text-blue-500 dark:text-blue-400">&rarr;</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-white/5 px-6 md:px-12 py-8 bg-slate-100 dark:bg-[#0a0a0a] transition-colors duration-300 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 max-w-[1400px] mx-auto auto-cols-min">
          <div className="flex-1">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-slate-900 dark:text-white">
              SOLARIS
            </span>
          </div>
          
          <div className="flex-[2] flex justify-center flex-wrap gap-6 md:gap-10 text-[9px] font-bold tracking-[0.2em] text-slate-500 dark:text-neutral-600 uppercase text-center">
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy Policy coming soon'); }} className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Terms of Service coming soon'); }} className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Engineering Standards coming soon'); }} className="hover:text-slate-900 dark:hover:text-white transition-colors">Engineering Standards</a>
            <a href="#" onClick={(e) => { e.preventDefault(); alert('Contact us coming soon'); }} className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</a>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end text-center mt-4 lg:mt-0">
            <span className="text-[9px] font-bold tracking-[0.1em] text-slate-400 dark:text-neutral-600 uppercase whitespace-nowrap">
              © 2026 SOLARIS PRECISION SYSTEMS. ALL RIGHTS RESERVED.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PremiumSelect({ options, defaultValue }: { options: string[], defaultValue: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);

  return (
    <div className="relative w-full">
      <button 
        type="button"
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200/80 dark:border-neutral-800 rounded-none px-4 py-3.5 text-sm text-slate-900 dark:text-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-[#FFE600] transition-all hover:bg-slate-100 dark:hover:bg-black/40 group relative"
      >
        <span className="font-medium">{selected}</span>
        <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-neutral-300 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 right-0 py-1 bg-white/95 dark:bg-[#181818]/95 backdrop-blur-xl border border-slate-200/80 dark:border-neutral-800 rounded-none shadow-[0_20px_60px_rgb(0,0,0,0.1)] dark:shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                setSelected(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-5 py-3 text-sm transition-all duration-150 block ${
                selected === opt 
                  ? 'text-amber-600 dark:text-[#FFE600] font-bold bg-amber-50/50 dark:bg-amber-500/10' 
                  : 'text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800 font-medium'
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {selected === opt && (
                  <div className="w-1.5 h-1.5 rounded-none bg-amber-500 dark:bg-[#FFE600] animate-pulse"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
