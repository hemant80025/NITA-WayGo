import { useContext, useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useMapContext } from '../contexts/MapContext';
import { campusLocations } from '../utils/locations';

const SearchBox = ({ userLocation, locationError, setInstructions, setShowPanel }) => {
    const [query, setQuery] = useState("");
    
    const { setDestination } = useContext(useMapContext);

    const isDisabled = !userLocation || locationError;

    const filteredLocations = query.length >= 1 
        ? campusLocations.filter(location =>
            location.name.toLowerCase().includes(query.toLowerCase()) ||
            location.address.toLowerCase().includes(query.toLowerCase())
        ) : [];


    const handleLocationSelect = (location) => {
        setShowPanel(false);
        setInstructions(null);
        setDestination(location);
        setQuery("");
    };

    return (
        <div 
            className={`absolute -top-10 z-[1000] w-[60%] lg:w-[50%] left-1/2 transform -translate-x-1/2 ${
                isDisabled ? 'pointer-events-none' : ''
            }`}
        >
            <div className="bg-white rounded-lg shadow-lg">

                <div className={`flex items-center p-2 ${isDisabled ? 'opacity-50' : ''}`}>
                    <MapPin className="w-4 mr-1 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search in NIT Agartala Campus"
                        className="flex-1 text-[15px] outline-none h-[30px]"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Search className="w-4 ml-1 text-gray-500"/>
                </div>

                {filteredLocations.length > 0 && (
                    <div className="border-t max-h-72 overflow-y-auto">
                        {filteredLocations.map(location => (
                            <div
                                key={location.id}
                                className="p-4 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleLocationSelect(location)}
                            >
                                <div className="font-medium hover:underline">{location.name}</div>
                                <div className="text-sm text-gray-600">{location.address}</div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};


export default SearchBox;


