import React from 'react';
import { Camera, CheckCircle } from 'lucide-react';

export default function DualImageVerification({ groundImage, satelliteImage, status = 'verified' }) {
  return (
    <div className="bg-slate-900 rounded-sm p-4 border border-slate-700 shadow-sm mt-4">
      <div className="flex items-center justify-between mb-3 border-b border-slate-700 pb-2">
        <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">
          Dual-Verification View
        </h3>
        {status === 'verified' ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-900/30 border border-emerald-500/50 px-2 py-0.5 rounded-sm uppercase tracking-wider">
            <CheckCircle size={10} /> Verified by Satellite
          </span>
        ) : (
          <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-900/30 border border-red-500/50 px-2 py-0.5 rounded-sm uppercase tracking-wider">
            ⚠️ Discrepancy Detected
          </span>
        )}
      </div>
      
      <div className="flex gap-2 h-40">
        <div className="flex-1 relative bg-slate-800 rounded-sm border border-slate-700 overflow-hidden group">
          {groundImage ? (
            <img src={groundImage} alt="Ground Truth" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
              <Camera size={24} className="mb-2 opacity-50" />
              <span className="text-[10px] font-semibold text-center uppercase">Ground-Truth<br/>(DRISHTI)</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 to-transparent p-2 text-[10px] font-bold text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity">
            Ground Photo
          </div>
        </div>
        
        <div className="flex-1 relative bg-slate-800 rounded-sm border border-slate-700 overflow-hidden group">
          {satelliteImage ? (
            <img src={satelliteImage} alt="Satellite Crop" className="w-full h-full object-cover filter saturate-150 contrast-125" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 relative">
               <div className="absolute inset-0 bg-[url('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/29555/46513')] bg-cover bg-center opacity-40"></div>
              <span className="text-[10px] font-semibold z-10 bg-slate-900/80 px-2 py-1 rounded text-center uppercase">SRISHTI 30m<br/>Satellite Patch</span>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900 to-transparent p-2 text-[10px] font-bold text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity">
            Satellite Patch
          </div>
        </div>
      </div>
    </div>
  );
}
