import { Icon } from "leaflet";
import { createContext, useContext, useReducer, useState } from "react";
const PlacesContext = createContext();

const initialState = {
    isLoading: false,
    currentPlace: {},
    pinLocation: [],
    error: "",
    requestedLocations: [],
};

function reducer(state, action) {
    switch (action.type) {
        case "stopLoading":
            return {
                ...state,
                isLoading: false,
            };
        case "loading":
            return {
                ...state,
                isLoading: !state.isLoading,
            };
        case "places/loaded":
            return {
                ...state,
                isLoading: false,
            };
        case "places/deleted":
            return {
                ...state,
                isLoading: false,
                currentPlace: {},
            };
        case "getPinLocation":
            return {
                ...state,
                isLoading: false,
                pinLocation: action.payload,
            };
        case "reqLocation/loaded":
            return {
                ...state,
                isLoading: false,
                requestedLocations: action.payload,
            };
        case "addPinLocation":
            return {
                ...state,
                isLoading: false,
            };
        case "rejected":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        default:
            throw new Error("Action type not defined");
    }
}

const BASE_URL = process.env.REACT_APP_Backend_Url || 'http://localhost:5000/';

function PlacesProvider({ children }) {
    const [
        { currentPlace, isLoading, error, pinLocation, requestedLocations },
        dispatch,
    ] = useReducer(reducer, initialState);
    const [places, setPlaces] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const searchedPlaces =
        searchQuery.length > 0
            ? places.filter((place) =>
                `${place.name} ${place.type}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            )
            : places;

    async function fetchPlaces() {
        dispatch({ type: "loading" });
        try {
            const response = await fetch(`${BASE_URL}api/user/places`, {
                method: "GET",
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            });
            const res = await response.json();
            console.log(res.msg);
            setPlaces(res.msg);
        } catch {
            dispatch({
                type: "rejected",
                payload: "There is an error fetching PLaces...",
            });
        } finally {
            dispatch({ type: "stopLoading" });
        }
    }

    async function fetchReqLocations() {
        dispatch({ type: "loading" });
        try {
            const response = await fetch(
                `${BASE_URL}api/admin/getuserlocationupdates`,
                {
                    method: "GET",
                    headers: {
                        Authorization: localStorage.getItem("token"),
                    },
                }
            );
            const res = await response.json();
            console.log(res.msg);
            dispatch({ type: "reqLocation/loaded", payload: res.msg });
        } catch {
            dispatch({
                type: "rejected",
                payload: "There is an error fetching PLaces...",
            });
        } finally {
            dispatch({ type: "stopLoading" });
        }
    }

    async function addPlace(
        name,
        latitude,
        longitude,
        type,
        imageUrl,
        importantData
    ) {
        dispatch({ type: "loading" });

        try {
            const Response = await fetch(`${BASE_URL}api/admin/addplace`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    name,
                    latitude,
                    longitude,
                    type,
                    imageUrl,
                    importantData,
                }),
            });
            const res = await Response.json();
            console.log(res);
            dispatch({ type: "loading" });
            await fetchPlaces();
            await fetchReqLocations();
        } catch {
            dispatch({
                type: "rejected",
                payload: "There is an error Adding Place...",
            });
        } finally {
            dispatch({ type: "stopLoading" });
        }
    }

    async function addPinLocation(name, latitude, longitude, type, message) {
        dispatch({ type: "loading" });
        try {
            const Response = await fetch(`${BASE_URL}api/user/addpinlocation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ name, latitude, longitude, type, message }),
            });
            const res = await Response.json();
            console.log(res);
            dispatch({ type: "addPinLocation", payload: res.data });
            await getPinLocation();
        } catch {
            dispatch({
                type: "rejected",
                payload: "There is an error in Pinning Location...",
            });
        } finally {
            dispatch({ type: "stopLoading" });
        }
    }

    async function deleteLocationByAdmin(latitude, longitude) {
        dispatch({ type: "loading" });
        try {
            const Response = await fetch(`${BASE_URL}api/admin/deletePlace`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ latitude, longitude }),
            });
            const res = await Response.json();
            console.log(res);
            await fetchPlaces();
        } catch {
            dispatch({
                type: "rejected",
                payload: "There is an error in Deleting Location...",
            });
        } finally {
            dispatch({ type: "stopLoading" });
        }
    }

    async function pinDeleteByUser(latitude, longitude) {
        dispatch({ type: "loading" });
        try {
            const Response = await fetch(`${BASE_URL}api/user/deletepinlocation`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ latitude, longitude }),
            });
            const res = await Response.json();
            console.log(res);
            await getPinLocation();
        } catch {
            dispatch({
                type: "rejected",
                payload: "There is an error in Deleting Location...",
            });
        } finally {
            dispatch({ type: "stopLoading" });
        }
    }

    async function rejectRequestByAdmin(latitude, longitude) {
        dispatch({ type: "loading" });
        try {
            const Response = await fetch(
                `${BASE_URL}api/admin/deleteuserlocationupdates`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                    body: JSON.stringify({ latitude, longitude }),
                }
            );
            const res = await Response.json();
            console.log(res);
            await fetchReqLocations();
        } catch {
            dispatch({
                type: "rejected",
                payload: "There is an error in Deleting Requested Location...",
            });
        } finally {
            dispatch({ type: "stopLoading" });
        }
    }

    async function addFeedback(message) {
        dispatch({ type: "loading" });

        try {
            const Response = await fetch(`${BASE_URL}api/user/feedback`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ message }),
            });
            const res = await Response.json();
            console.log(res);
            dispatch({ type: "loading" });
        } catch {
            dispatch({
                type: "rejected",
                payload: "There is an error adding Feedback...",
            });
        } finally {
            dispatch({ type: "stopLoading" });
        }
    }

    async function getPinLocation() {
        console.log("Fetching pin Location");
        dispatch({ type: "loading" });
        try {
            const Response = await fetch(`${BASE_URL}api/user/pinlocations`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
            });
            const res = await Response.json();
            console.log(res.msg);
            dispatch({ type: "getPinLocation", payload: res.msg });
        } catch {
            dispatch({
                type: "rejected",
                payload: "There is an getting Pinned Locations...",
            });
        } finally {
            dispatch({ type: "stopLoading" });
        }
    }

    async function reqLocation(name, latitude, longitude, type) {
        dispatch({ type: "loading" });

        try {
            const Response = await fetch(`${BASE_URL}api/user/reqplace`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token"),
                },
                body: JSON.stringify({ name, latitude, longitude, type }),
            });
            const res = await Response.json();
            dispatch({ type: "loading" });
        } catch {
            dispatch({
                type: "rejected",
                payload: "There is an error in requesting Loaction..",
            });
        } finally {
            dispatch({ type: "stopLoading" });
        }
    }

    const presentLocationIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
        iconSize: [38, 38],
    });
    const departmentLocationIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/2231/2231492.png",
        iconSize: [38, 38],
    });
    const hostelLocationIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/10607/10607354.png",
        iconSize: [38, 38],
    });
    const restaurantLocationIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/8503/8503966.png",
        iconSize: [38, 38],
    });
    const playgroundLocationIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/7153/7153217.png",
        iconSize: [38, 38],
    });

    const otherLocationIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/5817/5817144.png",
        iconSize: [38, 38],
    });

    const pinLocationIcon = new Icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/149/149059.png",
        iconSize: [38, 38],
    });

    return (
        <PlacesContext.Provider
            value={{
                places: searchedPlaces,
                setPlaces,
                isLoading,
                error,
                searchQuery,
                setSearchQuery,
                currentPlace,
                presentLocationIcon,
                departmentLocationIcon,
                hostelLocationIcon,
                restaurantLocationIcon,
                playgroundLocationIcon,
                pinLocationIcon,
                otherLocationIcon,
                pinLocation,
                requestedLocations,
                pinDeleteByUser,
                rejectRequestByAdmin,
                deleteLocationByAdmin,
                fetchReqLocations,
                fetchPlaces,
                addPlace,
                addPinLocation,
                reqLocation,
                addFeedback,
                getPinLocation,
            }}
        >
            {children}
        </PlacesContext.Provider>
    );
}

function usePlaces() {
    const context = useContext(PlacesContext);
    if (context === undefined)
        throw new Error("UserContext is outside the UsercontextProvider");
    return context;
}

export { PlacesProvider, usePlaces };
