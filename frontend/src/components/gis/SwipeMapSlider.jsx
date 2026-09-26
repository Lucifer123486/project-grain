import React, { useState, useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function SwipeMapSlider({ leftYear = 'July 2023', rightYear = 'July 2026', center = [73.1, 19.1], zoom = 12 }) {
  const containerRef = useRef(null);
  const leftMapRef = useRef(null);
  const rightMapRef = useRef(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const isDragging = useRef(false);

  useEffect(() => {
    if (leftMapRef.current || rightMapRef.current) return;

    const leftMap = new maplibregl.Map({
      container: 'left-map',
      style: {
        version: 8,
        sources: {
          'satellite': {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256
          }
        },
        layers: [{
          id: 'satellite-layer-left',
          type: 'raster',
          source: 'satellite',
          paint: {
            'raster-saturation': -0.5,
            'raster-contrast': 0.1
          }
        }]
      },
      center: center,
      zoom: zoom,
    });
    
    const rightMap = new maplibregl.Map({
      container: 'right-map',
      style: {
        version: 8,
        sources: {
          'satellite': {
            type: 'raster',
            tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
            tileSize: 256
          }
        },
        layers: [{
          id: 'satellite-layer-right',
          type: 'raster',
          source: 'satellite',
          paint: {
            'raster-saturation': 0.5,
            'raster-contrast': 0.2
          }
        }]
      },
      center: center,
      zoom: zoom,
    });

    leftMapRef.current = leftMap;
    rightMapRef.current = rightMap;

    const syncMaps = (e) => {
      const { lng, lat } = e.target.getCenter();
      const zm = e.target.getZoom();
      const pitch = e.target.getPitch();
      const bearing = e.target.getBearing();
      
      const otherMap = e.target === leftMapRef.current ? rightMapRef.current : leftMapRef.current;
      otherMap.jumpTo({ center: [lng, lat], zoom: zm, pitch: pitch, bearing: bearing });
    };

    leftMap.on('move', (e) => { if (e.originalEvent) syncMaps(e); });
    rightMap.on('move', (e) => { if (e.originalEvent) syncMaps(e); });

    return () => {
      leftMap.remove();
      rightMap.remove();
      leftMapRef.current = null;
      rightMapRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    if (leftMapRef.current && rightMapRef.current) {
      leftMapRef.current.jumpTo({ center, zoom });
      rightMapRef.current.jumpTo({ center, zoom });
    }
  }, [center, zoom]);

  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSliderPosition((x / rect.width) * 100);
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none z-0"
      onMouseMove={handleMouseMove}
      onMouseUp={() => isDragging.current = false}
      onMouseLeave={() => isDragging.current = false}
    >
      <div id="left-map" className="absolute inset-0 z-0" />
      <div 
        className="absolute inset-0 z-10 pointer-events-none bg-slate-900/10 flex items-start p-4"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <span className="bg-slate-900/80 text-white px-3 py-1 rounded font-bold text-sm shadow-md pointer-events-auto mt-16">Baseline ({leftYear})</span>
      </div>
      
      <div 
        id="right-map" 
        className="absolute inset-0 z-20"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      />
      <div 
        className="absolute inset-0 z-30 pointer-events-none flex items-start justify-end p-4"
        style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
      >
        <span className="bg-[#1D4ED8]/90 text-white px-3 py-1 rounded font-bold text-sm shadow-md pointer-events-auto mt-16">Present ({rightYear})</span>
      </div>
      
      {/* Slider Handle */}
      <div 
        className="absolute top-0 bottom-0 w-1.5 bg-white cursor-ew-resize z-40 flex items-center justify-center hover:bg-blue-400 transition-colors shadow-[0_0_10px_rgba(0,0,0,0.5)]"
        style={{ left: `calc(${sliderPosition}% - 3px)` }}
        onMouseDown={() => isDragging.current = true}
      >
        <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-slate-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </div>
    </div>
  );
}
