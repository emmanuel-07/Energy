import React, { useState, useRef, useEffect } from 'react';
import { Room, Appliance } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Plus, Trash2, Zap, Settings2, ArrowRight, Home } from 'lucide-react';
import { homePresets, appliancePresets } from '../lib/presets';

interface LoadBuilderProps {
  rooms: Room[];
  setRooms: React.Dispatch<React.SetStateAction<Room[]>>;
  onNext?: () => void;
}

function ApplianceComboBox({ 
  value, 
  onChange, 
  onSelectPreset 
}: { 
  value: string, 
  onChange: (val: string) => void, 
  onSelectPreset: (preset: any) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const filteredPresets = appliancePresets.filter(preset => 
    preset.name.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    setFocusedIndex(-1);
  }, [value, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => (prev < filteredPresets.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      if (focusedIndex >= 0 && focusedIndex < filteredPresets.length) {
        e.preventDefault();
        const preset = filteredPresets[focusedIndex];
        onChange(preset.name);
        onSelectPreset(preset);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
           setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Type to search appliances..."
        className="w-full bg-slate-50 dark:bg-[#111] border border-slate-200/80 dark:border-neutral-800 focus:border-amber-500 rounded-xl px-4 py-2.5 outline-none text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all relative z-10 font-medium"
        autoComplete="off"
      />
      
      {isOpen && (
        <div className="absolute z-20 w-fit min-w-[200px] max-w-full mt-1 bg-white dark:bg-[#181818] border border-slate-200 dark:border-neutral-800 rounded-xl shadow-xl shadow-black/5 dark:shadow-none max-h-[200px] overflow-y-auto">
          {filteredPresets.length === 0 ? (
            <div className="p-3 text-xs text-slate-400 text-center font-medium">No matches</div>
          ) : (
            filteredPresets.map((preset, index) => (
              <div 
                key={preset.name}
                className={`px-3 py-2 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-100 dark:border-neutral-800/50 last:border-0 ${
                  focusedIndex === index ? 'bg-slate-100 dark:bg-white/10' : 'hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(preset.name);
                  onSelectPreset(preset);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                <span className="text-sm font-medium text-slate-900 dark:text-white truncate mr-4">{preset.name}</span>
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-neutral-400 shrink-0">{preset.continuousWatts}W</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function NumericInput({ 
  value, 
  onChange, 
  min = 0, 
  max,
  step,
  className
}: { 
  value: number; 
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: string | number;
  className?: string;
}) {
  const [localValue, setLocalValue] = useState<string>(value.toString());

  // Update local value if external value changes (e.g. preset loaded)
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    let parsed = parseFloat(localValue);
    if (isNaN(parsed)) {
      parsed = min;
    } else {
      if (typeof max !== 'undefined' && parsed > max) parsed = max;
      if (typeof min !== 'undefined' && parsed < min) parsed = min;
    }
    setLocalValue(parsed.toString());
    onChange(parsed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <input
      type="number"
      min={min}
      max={max}
      step={step}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={className}
    />
  );
}

export function LoadBuilder({ rooms, setRooms, onNext }: LoadBuilderProps) {
  const [newRoomName, setNewRoomName] = useState('');
  const [itemToDelete, setItemToDelete] = useState<{ type: 'room' | 'appliance', roomId: string, appId?: string } | null>(null);
  const [presetToLoad, setPresetToLoad] = useState<string | null>(null);

  const addRoom = () => {
    if (!newRoomName.trim()) return;
    setRooms([...rooms, { id: Date.now().toString(), name: newRoomName, appliances: [] }]);
    setNewRoomName('');
  };

  const loadPresetHome = (presetKey: string) => {
    if (!homePresets[presetKey]) return;
    // deep replace with new IDs to avoid key collisions
    const presetData = homePresets[presetKey].rooms.map(r => ({
      ...r,
      id: Date.now().toString() + Math.random(),
      appliances: r.appliances.map(a => ({ ...a, id: Date.now().toString() + Math.random() }))
    }));
    setRooms(presetData);
  };

  const removeRoom = (roomId: string) => {
    setRooms(rooms.filter(r => r.id !== roomId));
  };

  const addAppliance = (roomId: string) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          appliances: [...room.appliances, {
            id: Date.now().toString(),
            name: 'New Appliance',
            quantity: 1,
            continuousWatts: 100,
            surgeWatts: 0,
            hoursPerDay: 4
          }]
        };
      }
      return room;
    }));
  };

  const updateAppliance = (roomId: string, appId: string, field: keyof Appliance, value: string | number) => {
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          appliances: room.appliances.map(app => {
            if (app.id === appId) {
              return { ...app, [field]: value };
            }
            return app;
          })
        };
      }
      return room;
    }));
  };

  const removeAppliance = (roomId: string, appId: string) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          appliances: room.appliances.filter(app => app.id !== appId)
        };
      }
      return room;
    }));
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.type === 'room') {
      setRooms(rooms.filter(r => r.id !== itemToDelete.roomId));
    } else if (itemToDelete.type === 'appliance' && itemToDelete.appId) {
      setRooms(rooms.map(room => {
        if (room.id === itemToDelete.roomId) {
          return {
            ...room,
            appliances: room.appliances.filter(app => app.id !== itemToDelete.appId)
          };
        }
        return room;
      }));
    }
    setItemToDelete(null);
  };

  const hasInvalidInputs = rooms.some(room => 
    room.appliances.some(app => 
      app.quantity < 1 || 
      app.continuousWatts < 0 || 
      app.hoursPerDay < 0 || 
      app.hoursPerDay > 24
    )
  );

  return (
    <div className="space-y-16">
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="bg-white dark:bg-[#181818] p-10 lg:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-slate-200/50 dark:border-white/5 flex flex-col transition-colors duration-300 flex-1 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div className="mb-8">
            <span className="inline-block bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-neutral-300 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">Start Here</span>
            <p className="text-slate-500 dark:text-neutral-400 font-light text-lg">Add a room to begin mapping your energy usage</p>
          </div>
          <div className="flex flex-col sm:flex-row items-end gap-4 sm:gap-6 w-full mt-auto">
            <div className="flex-1 w-full relative">
              <input 
                id="newRoom" 
                placeholder="e.g., Living Room, Kitchen, Bedroom" 
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addRoom()}
                className="w-full bg-slate-50 dark:bg-[#111] border border-slate-200/80 dark:border-neutral-800 focus:border-amber-500 rounded-xl px-5 py-3 outline-none text-base text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:ring-2 focus:ring-amber-500/20 transition-all font-light h-14"
              />
            </div>
            <button onClick={addRoom} className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black rounded-xl text-sm font-medium h-14 px-8 w-full sm:w-auto transition-all flex justify-center items-center gap-2 shadow-lg shadow-black/5 dark:shadow-white/5 shrink-0 cursor-pointer">
              <Plus className="w-5 h-5" /> Add Room
            </button>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-[#141414] border border-slate-200/50 dark:border-white/5 p-10 lg:p-12 rounded-3xl flex flex-col justify-center gap-2 transition-colors duration-300 xl:w-[400px]">
           <div>
             <h3 className="text-sm font-medium text-slate-700 dark:text-neutral-300 mb-1">Quick Presets</h3>
             <p className="text-xs text-slate-500 dark:text-neutral-500 font-light mb-6">Or start instantly with a preset</p>
           </div>
           <div className="flex flex-wrap gap-2">
             {Object.keys(homePresets).map(presetKey => (
               <button
                  key={presetKey}
                  onClick={() => {
                     setPresetToLoad(presetKey);
                  }}
                  className="bg-white dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-neutral-400 border border-slate-200/80 dark:border-white/10 rounded-lg px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-black/5 dark:shadow-none"
               >
                 <Home className="w-3.5 h-3.5" />
                 {homePresets[presetKey].name}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="space-y-12">
        {rooms.length === 0 && (
          <div className="text-center py-20 bg-white/50 dark:bg-[#181818]/50 rounded-3xl border border-dashed border-slate-300 dark:border-neutral-800">
            <p className="text-slate-500 dark:text-neutral-400 font-light text-lg">Create a room to begin adding appliances</p>
          </div>
        )}
        {rooms.map(room => (
          <div key={room.id} className="bg-white dark:bg-[#181818] rounded-3xl transition-colors duration-300 p-8 lg:p-12">
            <div className="pb-8 flex flex-row items-center justify-between transition-colors">
              <div className="text-2xl font-light text-slate-900 dark:text-white flex items-center gap-4 transition-colors">
                {room.name}
              </div>
              <div className="flex gap-4">
                <button onClick={() => addAppliance(room.id)} className="text-xs uppercase tracking-widest text-amber-600 hover:text-amber-700 dark:text-amber-500 px-4 py-2 transition-colors font-medium flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Load
                </button>
                <button onClick={() => setItemToDelete({ type: 'room', roomId: room.id })} className="text-slate-400 hover:text-red-500 transition-colors p-2">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-0">
              {room.appliances.length === 0 ? (
                <div className="py-12 text-center text-slate-400 dark:text-neutral-600 text-sm font-light">
                  No loads parameterized in this zone.
                </div>
              ) : (
                <div className="space-y-6">
                  {room.appliances.map(app => (
                    <div key={app.id} className="group grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-6 xl:gap-8 items-end p-4 -mx-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <div className="sm:col-span-2 xl:col-span-3">
                        <Label className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-neutral-500 font-normal mb-2 block">Appliance Profile</Label>
                        <ApplianceComboBox 
                          value={app.name}
                          onChange={(val) => {
                             updateAppliance(room.id, app.id, 'name', val);
                             const preset = appliancePresets.find(p => p.name.toLowerCase() === val.toLowerCase());
                             if (preset) {
                                updateAppliance(room.id, app.id, 'continuousWatts', preset.continuousWatts);
                                updateAppliance(room.id, app.id, 'surgeWatts', preset.surgeWatts);
                                updateAppliance(room.id, app.id, 'dutyCycle', preset.dutyCycle);
                             }
                          }}
                          onSelectPreset={(preset) => {
                             updateAppliance(room.id, app.id, 'continuousWatts', preset.continuousWatts);
                             updateAppliance(room.id, app.id, 'surgeWatts', preset.surgeWatts);
                             updateAppliance(room.id, app.id, 'dutyCycle', preset.dutyCycle);
                          }}
                        />
                      </div>
                      <div className="xl:col-span-2">
                        <Label className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-neutral-500 font-normal mb-2 block">Qty</Label>
                        <NumericInput 
                          min={1}
                          value={app.quantity} 
                          onChange={(val) => updateAppliance(room.id, app.id, 'quantity', val)}
                          className={`w-full bg-slate-50 dark:bg-[#111] border ${app.quantity < 1 ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20 text-red-500' : 'border-slate-200/80 dark:border-neutral-800 focus:border-amber-500 focus:ring-amber-500/20'} rounded-xl px-4 py-2.5 outline-none text-base font-normal text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
                        />
                      </div>
                      <div className="xl:col-span-2">
                        <Label className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-neutral-500 font-normal mb-2 block">Watts</Label>
                        <NumericInput 
                          min={0}
                          value={app.continuousWatts} 
                          onChange={(val) => updateAppliance(room.id, app.id, 'continuousWatts', val)}
                          className={`w-full bg-slate-50 dark:bg-[#111] border ${app.continuousWatts < 0 ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20 text-red-500' : 'border-slate-200/80 dark:border-neutral-800 focus:border-amber-500 focus:ring-amber-500/20'} rounded-xl px-4 py-2.5 outline-none text-base font-normal text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
                        />
                      </div>
                      <div className="xl:col-span-2">
                        <Label className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-neutral-500 font-normal mb-2 block">Total</Label>
                        <div className="w-full bg-slate-50 dark:bg-[#111] border border-transparent rounded-xl px-4 py-2.5 text-base font-normal text-slate-500 dark:text-neutral-400 flex items-center h-[46px]">
                          {app.continuousWatts * app.quantity} W
                        </div>
                      </div>
                      <div className="xl:col-span-2">
                        <Label className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-neutral-500 font-normal mb-2 block">Hrs / Day</Label>
                        <NumericInput 
                          min={0} max={24} step={0.5}
                          value={app.hoursPerDay} 
                          onChange={(val) => updateAppliance(room.id, app.id, 'hoursPerDay', val)}
                          className={`w-full bg-slate-50 dark:bg-[#111] border ${app.hoursPerDay < 0 || app.hoursPerDay > 24 ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20 text-red-500' : 'border-slate-200/80 dark:border-neutral-800 focus:border-amber-500 focus:ring-amber-500/20'} rounded-xl px-4 py-2.5 outline-none text-base font-normal text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all`}
                        />
                      </div>
                      <div className="sm:col-span-2 xl:col-span-1 flex justify-end mt-4 xl:mt-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setItemToDelete({ type: 'appliance', roomId: room.id, appId: app.id })} className="w-10 h-[46px] flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {onNext && (
        <div className="flex justify-end pt-8">
          <button 
            onClick={onNext} 
            disabled={hasInvalidInputs}
            className={`px-8 py-4 text-[11px] font-extrabold uppercase tracking-[0.15em] transition-colors flex items-center gap-3 rounded-xl shadow-lg ${hasInvalidInputs ? 'bg-slate-300 dark:bg-neutral-800 text-slate-500 dark:text-neutral-500 cursor-not-allowed shadow-none' : 'bg-[#FFE600] hover:bg-yellow-400 text-black shadow-[#FFE600]/20'}`}
          >
            Next: System Config <ArrowRight className="w-5 h-5 flex-shrink-0" />
          </button>
        </div>
      )}

      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181818] border border-slate-200 dark:border-white/10 p-10 max-w-sm w-full animate-in zoom-in-95 duration-200 rounded-3xl shadow-2xl dark:shadow-none transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-[0.1em]">
               Action Required
            </h3>
            <p className="text-slate-500 dark:text-neutral-400 text-sm mb-10 leading-relaxed">
              Confirm deletion of this {itemToDelete.type}. This operation is irreversible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button onClick={() => setItemToDelete(null)} className="border border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-neutral-400 hover:text-slate-900 hover:bg-slate-50 dark:hover:text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors bg-white dark:bg-transparent rounded-xl">
                Cancel
              </button>
              <button onClick={confirmDelete} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors rounded-xl shadow-lg shadow-red-600/20">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {presetToLoad && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#181818] border border-slate-200 dark:border-white/10 p-10 max-w-sm w-full animate-in zoom-in-95 duration-200 rounded-3xl shadow-2xl dark:shadow-none transition-colors">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-[0.1em]">
               Load Preset
            </h3>
            <p className="text-slate-500 dark:text-neutral-400 text-sm mb-10 leading-relaxed">
              This will replace your current room configurations. Continue?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button onClick={() => setPresetToLoad(null)} className="border border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-neutral-400 hover:text-slate-900 hover:bg-slate-50 dark:hover:text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors bg-white dark:bg-transparent rounded-xl">
                Cancel
              </button>
              <button onClick={() => { loadPresetHome(presetToLoad); setPresetToLoad(null); }} className="bg-[#FFE600] hover:bg-yellow-400 text-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] transition-colors rounded-xl shadow-lg shadow-[#FFE600]/20">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
