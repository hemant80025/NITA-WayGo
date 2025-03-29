import { Route } from '../types';
import { X } from 'lucide-react';

interface NavigationPanelProps {
  isActive: boolean;
  destinationName: string;
  route: Route | null;
  onClose: () => void;
  onStartNavigation: () => void;
  isNavigating: boolean;
  isLoading?: boolean;
}

export default function NavigationPanel({
  isActive,
  destinationName,
  route,
  onClose,
  onStartNavigation,
  isNavigating,
  isLoading
}: NavigationPanelProps) {
  if (!isActive) return null;

  return (
    <div className="absolute bottom-5 left-5 right-5 bg-white rounded-xl shadow-lg p-4 z-10 transition-all duration-300 transform translate-y-0">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="text-2xl font-bold text-blue-600">
            {route ? `${Math.ceil(route.summary.totalTime / 60)} min` : '--'}
          </div>
          <div className="text-gray-600">{destinationName}</div>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>
      </div>

      {route && (
        <div className="max-h-48 overflow-y-auto mb-4 divide-y divide-gray-100">
          {route.instructions.map((instruction, index) => (
            <div 
              key={index} 
              className="flex items-start py-2 transition-colors duration-150 hover:bg-gray-50"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium mr-3">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="text-gray-800">{instruction.text}</div>
                <div className="text-sm text-gray-500">{Math.round(instruction.distance)}m</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onStartNavigation}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
          isNavigating 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isNavigating ? 'Stop Navigation' : 'Start Navigation'}
      </button>
    </div>
  );
}