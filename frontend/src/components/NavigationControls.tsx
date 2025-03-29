import { Compass, RotateCw } from 'lucide-react';

interface NavigationControlsProps {
  onLocateMe: () => void;
  onRefreshLocation: () => void;
  isLocating?: boolean;
}

export default function NavigationControls({ 
  onLocateMe, 
  onRefreshLocation,
  isLocating 
}: NavigationControlsProps) {
  return (
    <div className="absolute bottom-32 right-5 flex flex-col gap-3 z-10">
      <button
        onClick={onLocateMe}
        className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:shadow-xl"
        disabled={isLocating}
      >
        <Compass className={`w-5 h-5 transition-colors duration-200 ${isLocating ? 'text-blue-300' : 'text-blue-600'}`} />
      </button>
      <button
        onClick={onRefreshLocation}
        className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:shadow-xl"
        disabled={isLocating}
      >
        <RotateCw className={`w-5 h-5 transition-colors duration-200 ${isLocating ? 'text-blue-300 animate-spin' : 'text-blue-600'}`} />
      </button>
    </div>
  );
}