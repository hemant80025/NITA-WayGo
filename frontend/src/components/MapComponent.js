import React, { useEffect, useState, useContext } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
import SearchBox from './SearchBox'
import RoutingMachine from '../hooks/RoutingMachine'
import { useMapContext } from '../contexts/MapContext';
import CustomRoutingPanel from './CustomRoutingPanel'

const userIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  iconSize: [12, 19],
  iconAnchor: [5, 18],
  popupAnchor: [1, -34]
});

const destinationIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [12, 19],
  iconAnchor: [5, 18],
  popupAnchor: [1, -34]
});

const MapComponent = () => {

  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  
  const [instructions, setInstructions] = useState(null);
  const [distances, setDistances] = useState(null);

  const { destination } = useContext(useMapContext);

  const getUserLocation = () => {
    setIsLoading(true);
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const newLocation = [
        position.coords.latitude,
        position.coords.longitude
      ]
      setUserLocation(newLocation);
      setLocationError("");
      setIsLoading(false);
    }, (error) => {
      console.log("error getting user location", error);
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setLocationError("Please allow location access to use this feature")
          break
        case error.POSITION_UNAVAILABLE:
          setLocationError("Location information is unavailable, Connect to INTERNET")
          break
        case error.TIMEOUT:
          setLocationError("Location request timed out")
          break
        default:
          setLocationError("An unknown error occurred")
      }

      setIsLoading(false);
    }, {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 0
    })
  }

  useEffect(() => {
    getUserLocation()
  }, []);

  const handleRequestLocation = () => {
    getUserLocation();
  };

  return (
    <div className='relative w-[90%] h-[60%] mx-auto mt-16'>

      <SearchBox 
        userLocation={userLocation} 
        locationError={locationError}
        setInstructions={setInstructions}
        setShowPanel={setShowPanel}
      />

      {isLoading && (
        <div className="bg-blue-100 border w-[90%] border-blue-400 text-blue-700 px-4 py-2 rounded mx-auto">
          Getting your location...
        </div>
      )}

      {!isLoading && locationError && (
        <div className="bg-red-100 border w-[90%] border-red-400 text-red-700 px-4 py-2 rounded mx-auto">
          {locationError}
          <button
            onClick={handleRequestLocation}
            className="ml-2 underline"
          >
            Try Again
          </button>
        </div>
      )}

      <div className='relative w-full h-full z-0'>

        {/* our custom map starts */}
        <MapContainer center={[23.84227954498771, 91.42278081296641]} zoom={14} className='w-[80%] h-[80%] mt-2 mx-auto'>

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User's location marker */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup className="leaflet-popup-content">
                <div>
                  <p className="leaflet-popup-para1">Your Current Location</p>
                  <p className="leaflet-popup-para2">You are here</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Destination marker */}
          {destination && instructions && (
            <Marker position={[destination.lat, destination.lon]} icon={destinationIcon}>
              <Popup className="leaflet-popup-content">
                <div>
                  <p className="leaflet-popup-para1">{destination.name}</p>
                  <p className="leaflet-popup-para2">{destination.address}</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Routing Machine Component */}
          {userLocation && destination && (
            <RoutingMachine 
              userLocation={userLocation} 
              destination={destination}
              setRouteInstructions={setInstructions}
              setDistance={setDistances}
            />
          )}

          {/* Button to show route details */}
          { userLocation && destination && (
            <button
              onClick={()=>setShowPanel(!showPanel)}
              disabled={!instructions}
              className={`absolute text-[10px] md:text-xs right-2 top-3 z-[1000] px-3 py-2 rounded shadow-lg transition-all duration-200 
              ${instructions ? 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
            >
              {!instructions ? (
                <div className='flex items-center gap-2'>
                  <span className='text-red-600 font-bold'>Loading Path</span>
                  <div className='animate-spin h-4 w-4 border-2 text-red-600 border-gray-600 border-t-transparent rounded-full'/>
                </div>
              ) : (
                showPanel ? "Hide Instructions" : "Show Instructions"
              )}
            </button>
          )}
          
        </MapContainer>
        {/* our custom map ends */}

        {/* warning message with refresh button*/}
        {userLocation && destination && instructions && (
          <div className='w-[80%] mx-auto mt-1 flex items-center justify-between gap-2'>
            <div className='text-red-600 mt-1 text-[13px] font-bold'>
              We're sorry! we can't afford Real-time GPS tracking. So you have to manually move 5-10 meters to your destination and press this refresh button to update your location.
            </div>
            <button onClick={getUserLocation} className='bg-green-500 hover:bg-green-600 active:bg-green-700 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 transition-colors'>
              <svg className='w-4 h-4' fill="none" stroke="currentColor" viewBox='0 0 24 24'>
                <path 
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
              Refresh Location
            </button>
          </div>
        )}
        

        {/* custom route panel */}
        {showPanel && <CustomRoutingPanel instructions={instructions} distances={distances} closePanel={()=>setShowPanel(false)}/>}

      </div>

    </div>
  )
}

export default MapComponent
