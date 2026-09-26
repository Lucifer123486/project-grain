import React from 'react';
import { Layers } from 'lucide-react';

export default function ThematicLayerControls({ activeLayers, toggleLayer, basemap, setBasemap }) {
  return (
    <div className="absolute top-20 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-sm p-4 shadow-xl text-slate-200 w-64 z-10 print:hidden">
      <h3 className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2 uppercase tracking-wide border-b border-slate-700 pb-2">
        <Layers size={16} className="text-[#1D4ED8]" /> Map Layers
      </h3>
      
      <div className="mb-4">
        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Base Maps</h4>
        <div className="flex flex-col gap-2">
          {['SRISHTI 30m Multispectral', 'DRISHTI Field Layer', 'Standard GIS Topo'].map(base => (
            <label key={base} className="flex items-center gap-2 text-sm cursor-pointer hover:text-white">
              <input 
                type="radio" 
                name="basemap"
                checked={basemap === base}
                onChange={() => setBasemap(base)}
                className="accent-blue-600"
              />
              {base}
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase mb-2">Thematic Overlays</h4>
        <div className="flex flex-col gap-2">
          {['NDVI Heatmap', 'NDWI Water Mask', 'Drainage Streams & Contours', 'LULC Land Classification'].map(layer => (
            <label key={layer} className="flex items-center gap-2 text-sm cursor-pointer hover:text-white">
              <input 
                type="checkbox" 
                checked={activeLayers.includes(layer)}
                onChange={() => toggleLayer(layer)}
                className="accent-blue-600 rounded-sm bg-slate-800 border-slate-600"
              />
              {layer}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
