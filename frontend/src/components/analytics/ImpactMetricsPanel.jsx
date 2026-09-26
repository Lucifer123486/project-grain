import React from 'react';
import { Droplet, Leaf, Map as MapIcon, ArrowUpRight } from 'lucide-react';

export default function ImpactMetricsPanel() {
  return (
    <div className="bg-slate-900 rounded-sm p-4 border border-slate-700 shadow-sm mt-4">
      <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wide border-b border-slate-700 pb-2">
        Intervention Impact Metrics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-800 p-3 rounded-sm border border-slate-700 flex flex-col items-center text-center hover:bg-slate-750 transition-colors">
          <Droplet className="text-blue-500 mb-2" size={24} />
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Capacity Added</div>
          <div className="text-xl font-bold text-white flex items-center gap-1">
            +12,500 <span className="text-[10px] text-slate-400 font-normal">m³</span>
            <ArrowUpRight size={14} className="text-emerald-500" />
          </div>
        </div>
        
        <div className="bg-slate-800 p-3 rounded-sm border border-slate-700 flex flex-col items-center text-center hover:bg-slate-750 transition-colors">
          <Leaf className="text-emerald-500 mb-2" size={24} />
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Delta NDVI</div>
          <div className="text-xl font-bold text-emerald-400 flex items-center gap-1">
            +34%
            <ArrowUpRight size={14} className="text-emerald-500" />
          </div>
        </div>
        
        <div className="bg-slate-800 p-3 rounded-sm border border-slate-700 flex flex-col items-center text-center hover:bg-slate-750 transition-colors">
          <MapIcon className="text-amber-500 mb-2" size={24} />
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Area Reclaimed</div>
          <div className="text-xl font-bold text-white flex items-center gap-1">
            42 <span className="text-[10px] text-slate-400 font-normal">ha</span>
            <ArrowUpRight size={14} className="text-emerald-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
