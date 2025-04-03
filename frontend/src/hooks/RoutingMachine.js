import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

const RoutingMachine = ({ userLocation, destination, setRouteInstructions, setDistance }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !userLocation || !destination) return;

    // Clear existing routes first
    map.eachLayer((layer) => {
      if (layer instanceof L.Routing.Line) {
        map.removeLayer(layer);
      }
    });

    // Create new routing control
    const routingControl = new L.Routing.Control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination.lat, destination.lon)
      ],
      router: new L.Routing.OSRMv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'foot'
      }),
      lineOptions: {
        styles: [{ color: '#6FA1EC', weight: 4, opacity: 0.7 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      createMarker: () => null
    });

    // Add the control to map
    routingControl.addTo(map);

    // Handle route finding
    routingControl.on('routesfound', (e) => {
      if (!e.routes || e.routes.length === 0) return;

      const shortestRoute = e.routes.reduce((shortest, current) => 
        current.summary.totalDistance < shortest.summary.totalDistance ? current : shortest
      , e.routes[0]);

      const instructions = shortestRoute.instructions.map(inst => inst.text);
      const distances = shortestRoute.instructions.map(inst => inst.distance);
      
      setRouteInstructions(instructions);
      setDistance(distances);

      // Fit bounds with padding
      const coords = shortestRoute.coordinates.map(coord => [coord.lat, coord.lng]);
      if (coords.length > 0) {
        map.fitBounds(coords, { padding: [50, 50] });
      }
    });

    // Cleanup function
    return () => {
      if (map && map.removeControl) {
        try {
          // Remove all routing-related layers
          map.eachLayer((layer) => {
            if (layer instanceof L.Routing.Line || layer instanceof L.Polyline) {
              map.removeLayer(layer);
            }
          });
          // Remove the routing control
          map.removeControl(routingControl);
        } catch (error) {
          console.warn('Cleanup error:', error);
        }
      }
    };
  }, [map, userLocation, destination, setRouteInstructions, setDistance]);

  return null;
};

export default RoutingMachine;






