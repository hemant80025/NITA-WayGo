import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

const RoutingMachine = ({ userLocation, destination }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !userLocation || !destination) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(destination[0], destination[1])
      ],
      router: new L.Routing.OSRMv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
        profile: 'foot' // 🥾 use walking route for campus
      }),
      lineOptions: {
        styles: [{ color: '#007bff', weight: 5, opacity: 0.8 }],
        extendToWaypoints: true
      },
      addWaypoints: false,
      draggableWaypoints: false,
      fitSelectedRoutes: true,
      showAlternatives: false,
      show: false,
      createMarker: () => null // hide default markers
    });

    routingControl.addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map, userLocation, destination]);

  return null;
};

export default RoutingMachine;
