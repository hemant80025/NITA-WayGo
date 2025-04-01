import React from 'react'
import { X } from 'lucide-react'

const CustomRoutingPanel = ({instructions, distances, closePanel}) => {
    return (
        <div className="top-150 bg-white rounded-lg shadow-xl p-4 w-[90%] max-h-[35vh] mx-auto overflow-y-auto mt-5 z-[1000] border-2 border-black-200">

            <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h3 className="font-semibold text-red-600">Route Instructions</h3>
                <button 
                    onClick={closePanel}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} className="text-gray-600" />
                </button>
            </div>

            <div className="space-y-2">
                {instructions && instructions.map((instruction, index) => (
                    <div 
                        key={index} 
                        className="flex justify-between items-start p-2 hover:bg-gray-50 rounded-lg"
                    >
                        <div className="flex-1 text-sm text-black">
                            {instruction}
                        </div>

                        {distances && distances[index] && (
                            <div className="ml-2 text-xs text-black font-bold whitespace-nowrap">
                                {distances[index] >= 1000 
                                    ? `${(distances[index] / 1000).toFixed(1)} km`
                                    : `${Math.round(distances[index])} m`
                                }
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {(!instructions || instructions.length === 0) && (
                <div className="text-center text-gray-500 py-4">
                    No route instructions available
                </div>
            )}

        </div>
    )
}

export default CustomRoutingPanel

