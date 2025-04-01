import React, { createContext, useState } from 'react';

export const useMapContext = createContext();

export const MapProvider = ({ children }) => {
    const [destination, setDestination] = useState(null);

    const value = {
        destination,
        setDestination
    };

    return (
        <useMapContext.Provider 
            value={value}
        >
            {children}
        </useMapContext.Provider>
    );
};


