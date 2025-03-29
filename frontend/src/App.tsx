import { useState, useCallback, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { Location, Route } from './types/index.ts';
import Map from './components/Map.tsx';
import SearchBox from './components/SearchBox.tsx';
import NavigationControls from './components/NavigationControls.tsx';
import NavigationPanel from './components/NavigationPanel.tsx';
import DirectionsPanel from './components/DirectionsPanel.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';

export default function App() {
  const [map, setMap] = useState<L.Map | null>(null);
  const [userMarker, setUserMarker] = useState<L.Marker | null>(null);
  const [destinationMarker, setDestinationMarker] = useState<L.Marker | null>(null);
  const [routingControl, setRoutingControl] = useState<L.Routing.Control | null>(null);
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [destinationName, setDestinationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [navigationInfo, setNavigationInfo] = useState({
    nextStep: '',
    distance: '',
    arrivalTime: '',
    remainingDistance: ''
  });

  const handleMapInit = useCallback((newMap: L.Map) => {
    setMap(newMap);
  }, []);

  const handleLocationSelect = useCallback(async (location: Location) => {
    if (!map) return;

    setIsLoading(true);
    try {
      if (destinationMarker) {
        map.removeLayer(destinationMarker);
      }

      const marker = L.marker([location.lat, location.lon]).addTo(map);
      setDestinationMarker(marker);
      setDestinationName(location.name);

      if (userMarker) {
        if (routingControl) {
          map.removeControl(routingControl);
        }

        const control = L.Routing.control({
          waypoints: [
            userMarker.getLatLng(),
            L.latLng(location.lat, location.lon)
          ],
          routeWhileDragging: false,
          showAlternatives: false,
          addWaypoints: false,
          lineOptions: {
            styles: [{ color: '#1a73e8', opacity: 0.7, weight: 5 }],
            extendToWaypoints: true,
            missingRouteTolerance: 0
          }
        }).addTo(map);

        await new Promise((resolve) => {
          control.on('routesfound', (e) => {
            setCurrentRoute(e.routes[0] as Route);
            resolve(null);
          });
        });

        setRoutingControl(control);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
    } finally {
      setIsLoading(false);
    }
  }, [map, userMarker, destinationMarker, routingControl]);

  useEffect(() => {
    if (!map) return;

    setIsLocating(true);
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setIsLocating(false);

          if (!userMarker) {
            const marker = L.marker([latitude, longitude], {
              icon: L.divIcon({
                className: 'animate-pulse bg-blue-500 rounded-full w-4 h-4 border-2 border-white shadow-lg',
                iconSize: [16, 16]
              })
            }).addTo(map);
            setUserMarker(marker);
          } else {
            userMarker.setLatLng([latitude, longitude]);
          }

          if (!isNavigating) {
            map.setView([latitude, longitude], 18, {
              animate: true,
              duration: 1
            });
          }
        },
        (error) => {
          setIsLocating(false);
          if (error.code === error.TIMEOUT) {
            console.warn('Location request timed out. Please ensure location services are enabled and try again.');
            alert('Unable to get your location. Please check if location services are enabled and try refreshing the page.');
          } else {
            console.error('Error getting location:', error);
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 10000
        }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      setIsLocating(false);
      alert('Geolocation is not supported by your browser. Some features may not work.');
    }
  }, [map, userMarker, isNavigating]);

  const handleLocateMe = useCallback(() => {
    if (userMarker && map) {
      const pos = userMarker.getLatLng();
      map.setView([pos.lat, pos.lng], 18, {
        animate: true,
        duration: 0.5
      });
    }
  }, [userMarker, map]);

  const handleRefreshLocation = useCallback(() => {
    if (userMarker && map) {
      setIsLocating(true);
      const pos = userMarker.getLatLng();
      map.setView([pos.lat, pos.lng], 18, {
        animate: true,
        duration: 0.5
      });
      setTimeout(() => setIsLocating(false), 1000);
    }
  }, [userMarker, map]);

  const handleStartNavigation = useCallback(() => {
    setIsNavigating(!isNavigating);
    if (!isNavigating) {
      setNavigationInfo({
        nextStep: currentRoute?.instructions[0]?.text || '',
        distance: `${Math.round(currentRoute?.instructions[0]?.distance || 0)}m`,
        arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        remainingDistance: `${((currentRoute?.summary.totalDistance || 0) / 1000).toFixed(1)} km`
      });
    }
  }, [isNavigating, currentRoute]);

  return (
    <div className="relative w-screen h-screen">
      <Map onMapInit={handleMapInit} />
      <SearchBox onLocationSelect={handleLocationSelect} isLoading={isLoading} />
      <NavigationControls
        onLocateMe={handleLocateMe}
        onRefreshLocation={handleRefreshLocation}
        isLocating={isLocating}
      />
      <NavigationPanel
        isActive={!!destinationMarker && !isNavigating}
        destinationName={destinationName}
        route={currentRoute}
        onClose={() => setDestinationMarker(null)}
        onStartNavigation={handleStartNavigation}
        isNavigating={isNavigating}
        isLoading={isLoading}
      />
      <DirectionsPanel
        isVisible={isNavigating}
        {...navigationInfo}
      />
      {(isLoading || isLocating) && <LoadingSpinner />}
    </div>
  );
}
