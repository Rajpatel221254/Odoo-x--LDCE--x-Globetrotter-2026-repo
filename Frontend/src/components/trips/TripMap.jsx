import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers, Hotel, Navigation, Plus, Minus } from 'lucide-react';

const TripMap = ({ 
  places = [], 
  center = [23.0225, 72.5714], 
  zoom = 12,
  destinationName = 'Ahmedabad'
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const tileLayerRef = useRef(null);
  const [mapStyle, setMapStyle] = useState('voyager'); // 'voyager', 'dark', 'osm'

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
        attributionControl: false
      });

      tileLayerRef.current = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    }
  }, []);

  // Update Center / Zoom when center coordinates change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !center) return;

    map.flyTo(center, zoom, {
      animate: true,
      duration: 1.2
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [center[0], center[1], zoom]);

  // Update Markers when places change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    if (places && places.length > 0) {
      places.forEach((item) => {
        if (!item.lat || !item.lng) return;

        const customIcon = L.divIcon({
          className: 'custom-map-pin-wrapper',
          html: `
            <div class="custom-map-pin" style="background-color: ${item.color || '#f05a36'};">
              <span class="pin-icon">${item.icon || '📍'}</span>
              <span class="pin-label">${item.name || item.title}</span>
            </div>
          `,
          iconSize: [140, 36],
          iconAnchor: [70, 36]
        });

        const marker = L.marker([item.lat, item.lng], { icon: customIcon });
        marker.bindPopup(`
          <div style="font-family: 'Outfit', sans-serif; padding: 6px; background: #181622; color: #ffffff; border-radius: 8px;">
            <strong style="color: #ffffff; font-size: 14px;">${item.name || item.title}</strong>
            <p style="margin: 4px 0 0 0; color: #a5a1b8; font-size: 12px;">${item.category || 'Point of Interest'}</p>
          </div>
        `);
        marker.addTo(markersLayerRef.current);
      });
    }
  }, [places]);

  // Toggle map tile styles (Voyager -> Dark Matter -> OSM)
  const toggleMapStyle = () => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    let newStyle = 'voyager';
    let newUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    if (mapStyle === 'voyager') {
      newStyle = 'dark';
      newUrl = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
    } else if (mapStyle === 'dark') {
      newStyle = 'osm';
      newUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    } else {
      newStyle = 'voyager';
      newUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    }

    tileLayerRef.current = L.tileLayer(newUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(mapInstanceRef.current);

    setMapStyle(newStyle);
  };

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(center, 12);
    }
  };

  return (
    <div className="trip-map-container dark-theme-map">
      {/* Top Right Floating Controls */}
      <div className="map-floating-top-right">
        <button 
          className="map-icon-btn" 
          onClick={toggleMapStyle} 
          title={`Switch Map Theme (Current: ${mapStyle.toUpperCase()})`}
        >
          <Layers size={18} />
        </button>
        <button className="map-icon-btn" title="Hotel Accommodations">
          <Hotel size={18} />
        </button>
      </div>

      {/* The Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="leaflet-map-canvas" />

      {/* Bottom Right Floating Controls */}
      <div className="map-floating-bottom-right">
        <button className="map-zoom-btn" onClick={handleZoomIn} title="Zoom In">
          <Plus size={18} />
        </button>
        <button className="map-zoom-btn" onClick={handleZoomOut} title="Zoom Out">
          <Minus size={18} />
        </button>
        <button className="map-icon-btn locate-btn" onClick={handleRecenter} title="Re-center Map">
          <Navigation size={18} />
        </button>
      </div>

      {/* Map Attribution Footer */}
      <div className="map-bottom-attribution">
        <span>Map data ©2026 Globetrotter • OpenStreetMap contributors</span>
      </div>
    </div>
  );
};

export default TripMap;
