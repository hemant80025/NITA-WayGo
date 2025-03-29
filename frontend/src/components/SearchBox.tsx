import { useState } from 'react';
import { Location } from '../types';
import { campusLocations } from '../data/locations';
import { Search, MapPin } from 'lucide-react';

interface SearchBoxProps {
  onLocationSelect: (location: Location) => void;
  isLoading?: boolean;
}

export default function SearchBox({ onLocationSelect, isLoading }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredLocations = query.length >= 2
    ? campusLocations.filter(location =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.address.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="absolute top-5 left-5 right-5 max-w-2xl mx-auto z-10">
      <div className="bg-white rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
        <div className="flex items-center p-4">
          <MapPin className={`w-5 h-5 text-gray-500 mr-3 transition-colors duration-200 ${isLoading ? 'text-blue-500' : ''}`} />
          <input
            type="text"
            placeholder="Search in NIT Agartala"
            className="flex-1 outline-none text-gray-700 bg-transparent transition-colors duration-200"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
          <Search className={`w-5 h-5 text-gray-500 ml-3 transition-colors duration-200 ${isLoading ? 'text-blue-500' : ''}`} />
        </div>
        
        {showResults && filteredLocations.length > 0 && (
          <div className="border-t border-gray-100 max-h-80 overflow-y-auto divide-y divide-gray-100">
            {filteredLocations.map(location => (
              <div
                key={location.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => {
                  onLocationSelect(location);
                  setQuery('');
                  setShowResults(false);
                }}
              >
                <div className="font-medium text-gray-900">{location.name}</div>
                <div className="text-sm text-gray-500">{location.address}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}