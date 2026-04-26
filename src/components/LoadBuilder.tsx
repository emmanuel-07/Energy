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

  return (
    <div ref={wrapperRef} className="relative w-full">
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onFocus={() => {
           setIsOpen(true);
        }}
        placeholder="Search modern electric appliances..."
        className="w-full bg-white dark:bg-black/20 border border-slate-200/80 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-[#FFE600] transition-all relative z-10"
        autoComplete="off"
      />
      
      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white dark:bg-[#181818] border border-slate-200 dark:border-neutral-800 rounded-xl shadow-xl shadow-black/5 dark:shadow-none max-h-[240px] overflow-y-auto">
          {filteredPresets.length === 0 ? (
            <div className="p-4 text-xs text-slate-500 dark:text-neutral-500 text-center font-bold tracking-[0.1em] uppercase">No presets matching "{value}"</div>
          ) : (
            filteredPresets.map((preset) => (
              <div 
                key={preset.name}
                className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer flex justify-between items-center transition-colors border-b border-slate-100 dark:border-neutral-800/50 last:border-0"
                onClick={() => {
                  onChange(preset.name);
                  onSelectPreset(preset);
                  setIsOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{preset.name}</span>
                  <span className="text-[10px] text-slate-500 dark:text-neutral-500 tracking-wider">
                     {preset.surgeWatts > preset.continuousWatts ? `Surge: ${preset.surgeWatts}W` : 'No surge'}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-xs font-mono font-bold text-amber-600 dark:text-[#FFE600]">{preset.continuousWatts}W</span>
                   <span className="text-[9px] text-slate-400 dark:text-neutral-600 uppercase tracking-widest mt-0.5">{preset.dutyCycle * 100}% DC</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
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
    setRooms(rooms.map(room => {
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
    <div className="space-y-12">
      <div className="flex flex-col xl:flex-row gap-6">
        <div className="bg-white dark:bg-[#181818] p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-slate-200/80 dark:border-white/5 flex flex-col sm:flex-row items-end gap-6 transition-colors duration-300 flex-1">
          <div className="grid gap-3 flex-1 w-full">
            <Label htmlFor="newRoom" className="text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-neutral-500 font-bold ml-1">Add New Zone / Room</Label>
            <Input 
              id="newRoom" 
              placeholder="e.g., Kitchen, Server Room, Main Office" 
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addRoom()}
              className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200/80 dark:border-neutral-800 rounded-xl px-4 py-3 outline-none text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-[#FFE600] transition-all h-12"
            />
          </div>
          <button onClick={addRoom} className="bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-900 dark:text-white border border-slate-200/80 dark:border-white/10 rounded-xl text-[10px] uppercase tracking-[0.15em] h-12 px-8 font-bold w-full sm:w-auto transition-all flex justify-center items-center gap-2">
            <Plus className="w-4 h-4" /> Add Zone
          </button>
        </div>

        <div className="bg-white dark:bg-[#181818] p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none border border-slate-200/80 dark:border-white/5 flex flex-col gap-4 transition-colors duration-300 xl:w-96">
           <Label className="text-[10px] uppercase tracking-[0.15em] text-slate-500 dark:text-neutral-500 font-bold ml-1">Quick Presets</Label>
           <div className="flex flex-wrap gap-2">
             {Object.keys(homePresets).map(presetKey => (
               <button
                  key={presetKey}
                  onClick={() => {
                     setPresetToLoad(presetKey);
                  }}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-[#FFE600] border border-amber-500/20 rounded-lg px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] transition-colors flex items-center gap-2"
               >
                 <Home className="w-3 h-3" />
                 {homePresets[presetKey].name}
               </button>
             ))}
           </div>
        </div>
      </div>

      <div className="space-y-8">
        {rooms.map(room => (
          <div key={room.id} className="border border-slate-200/80 dark:border-white/5 bg-white dark:bg-[#181818] rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-none transition-colors duration-300">
            <div className="py-6 px-8 border-b border-slate-100 dark:border-neutral-800 flex flex-row items-center justify-between transition-colors bg-white dark:bg-transparent">
              <div className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-4 transition-colors">
                <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-neutral-800 flex items-center justify-center transition-colors bg-slate-50 dark:bg-transparent shadow-sm dark:shadow-none">
                  <Settings2 className="w-5 h-5 text-slate-400 dark:text-neutral-500" />
                </div>
                {room.name}
              </div>
              <div className="flex gap-4">
                <button onClick={() => addAppliance(room.id)} className="text-[10px] uppercase tracking-[0.15em] border border-slate-200 dark:border-neutral-700 text-slate-500 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white hover:border-amber-600 dark:hover:border-[#FFE600] px-4 py-2 rounded-xl transition-all font-bold flex items-center gap-2 bg-slate-50 dark:bg-transparent shadow-sm dark:shadow-none">
                  <Plus className="w-3 h-3" /> Add Load
                </button>
                <button onClick={() => setItemToDelete({ type: 'room', roomId: room.id })} className="text-slate-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-0">
              {room.appliances.length === 0 ? (
                <div className="p-12 text-center text-slate-400 dark:text-neutral-600 text-xs font-bold uppercase tracking-[0.1em]">
                  No loads parameterized in this zone.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-neutral-800/50">
                  {room.appliances.map(app => (
                    <div key={app.id} className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-6 xl:gap-8 items-end bg-slate-50 dark:bg-transparent transition-colors">
                      <div className="sm:col-span-2 xl:col-span-3">
                        <Label className="text-[9px] uppercase tracking-[0.15em] text-slate-500 dark:text-neutral-500 font-bold mb-3 block ml-1">Appliance Profile</Label>
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
                        <Label className="text-[9px] uppercase tracking-[0.15em] text-slate-500 dark:text-neutral-500 font-bold mb-3 block ml-1">Quantity</Label>
                        <Input 
                          type="number" min="1"
                          value={app.quantity} 
                          onChange={(e) => updateAppliance(room.id, app.id, 'quantity', parseInt(e.target.value) || 0)}
                          className={`w-full bg-white dark:bg-black/20 border ${app.quantity < 1 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200/80 dark:border-neutral-800 focus:border-amber-500 dark:focus:border-[#FFE600] focus:ring-amber-500/20'} rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 transition-all`}
                        />
                      </div>
                      <div className="xl:col-span-2">
                        <Label className="text-[9px] uppercase tracking-[0.15em] text-slate-500 dark:text-neutral-500 font-bold mb-3 block ml-1">Cont. Watts</Label>
                        <Input 
                          type="number" min="0"
                          value={app.continuousWatts} 
                          onChange={(e) => updateAppliance(room.id, app.id, 'continuousWatts', parseInt(e.target.value) || 0)}
                          className={`w-full bg-white dark:bg-black/20 border ${app.continuousWatts < 0 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200/80 dark:border-neutral-800 focus:border-amber-500 dark:focus:border-[#FFE600] focus:ring-amber-500/20'} rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 transition-all`}
                        />
                      </div>
                      <div className="xl:col-span-2">
                        <Label className="text-[9px] uppercase tracking-[0.15em] text-slate-500 dark:text-neutral-500 font-bold mb-3 block ml-1">Total Watts</Label>
                        <div className="w-full bg-white/50 dark:bg-black/10 border border-transparent rounded-xl px-4 py-2.5 text-sm font-mono text-slate-500 dark:text-neutral-400 flex items-center h-[42px]">
                          {app.continuousWatts * app.quantity} W
                        </div>
                      </div>
                      <div className="xl:col-span-2">
                        <Label className="text-[9px] uppercase tracking-[0.15em] text-slate-500 dark:text-neutral-500 font-bold mb-3 block ml-1">Hrs / Day</Label>
                        <Input 
                          type="number" min="0" max="24" step="0.5"
                          value={app.hoursPerDay} 
                          onChange={(e) => updateAppliance(room.id, app.id, 'hoursPerDay', parseFloat(e.target.value) || 0)}
                          className={`w-full bg-white dark:bg-black/20 border ${app.hoursPerDay < 0 || app.hoursPerDay > 24 ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-slate-200/80 dark:border-neutral-800 focus:border-amber-500 dark:focus:border-[#FFE600] focus:ring-amber-500/20'} rounded-xl px-4 py-2.5 text-sm font-mono text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 transition-all`}
                        />
                      </div>
                      <div className="sm:col-span-2 xl:col-span-1 flex justify-end mt-4 xl:mt-0 pb-1">
                        <button onClick={() => setItemToDelete({ type: 'appliance', roomId: room.id, appId: app.id })} className="w-10 h-[42px] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:text-neutral-600 dark:hover:text-red-500 dark:hover:bg-red-500/10 rounded-xl transition-all -mr-1">
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
