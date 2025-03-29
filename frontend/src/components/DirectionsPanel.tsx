interface DirectionsPanelProps {
  isVisible: boolean;
  nextStep: string;
  distance: string;
  arrivalTime: string;
  remainingDistance: string;
}

export default function DirectionsPanel({
  isVisible,
  nextStep,
  distance,
  arrivalTime,
  remainingDistance
}: DirectionsPanelProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute top-5 left-5 right-5 bg-white rounded-xl shadow-lg p-4 z-10 animate-fadeIn">
      <div className="flex items-center mb-2">
        <div className="text-blue-600 mr-3 animate-pulse">→</div>
        <div className="text-lg font-medium">{nextStep}</div>
      </div>
      <div className="text-gray-500 ml-6 mb-4">{distance}</div>
      
      <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
        <div className="font-medium">{arrivalTime}</div>
        <div className="text-gray-500">{remainingDistance}</div>
      </div>
    </div>
  );
}