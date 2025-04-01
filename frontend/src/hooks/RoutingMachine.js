import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L, { routing } from 'leaflet';
import 'leaflet-routing-machine';

const RoutingMachine = ({ userLocation, destination, setRouteInstructions, setDistance }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !userLocation || !destination) return;


    const waypoints = [
      L.latLng(userLocation[0], userLocation[1]),
      L.latLng(destination.lat, destination.lon)
    ];

    const routingControl = L.Routing.control({
      waypoints: waypoints,
      lineOptions: {
        styles: [{ color: '#6FA1EC', weight: 4, opacity: 1 }],
        extendToWaypoints: true,
        missingRouteTolerance: 0
      },
      show: false,
      addWaypoints: false,
      routeWhileDragging: false,
      draggableWaypoints: false,
      fitSelectedRoutes: false,
      showAlternatives: false,
      createMarker: function() { return null; }
    }).addTo(map);

    routingControl.on("routesfound", function(e){
      const instructions = e.routes[0].instructions.map((inst)=>inst.text);
      const distances = e.routes[0].instructions.map((inst)=>inst.distance);
      setRouteInstructions(instructions);
      setDistance(distances);
    })

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, userLocation, destination, setRouteInstructions, setDistance]);

  return null;
};

export default RoutingMachine;




