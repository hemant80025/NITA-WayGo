import { createContext, useContext, useReducer, useState } from "react";
import { usePlaces } from "./PlacesContext";
const AuthContext = createContext();

const initialState = {
    isAdmin: false,
    user: null,
    isAuthenticated: false,
};

function reducer(state, action) {
    switch (action.type) {
        case "loginAdmin":
            return {
                ...state,
                isAdmin: true,
                user: action.payload,
                isAuthenticated: true,
            };
        case "login":
            return { ...state, user: action.payload, isAuthenticated: true };
        case "logout":
            return { initialState };
        default:
            throw new Error("Unknown action type");
    }
}

// Define the base URL for API requests
const BASE_URL = process.env.REACT_APP_Backend_Url || 'http://localhost:5000/';

function AuthProvider({ children }) {
    const [{ user, isAuthenticated, isAdmin }, dispatch] = useReducer(
        reducer,
        initialState
    );
    const [reqNav, setReqNav] = useState(false);
    const { fetchPlaces, getPinLocation } = usePlaces();
    const [isNotification, setIsNotification] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // login function for users
    async function login(email, password) {
        const Response = await fetch(`${BASE_URL}api/authUser/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const res = await Response.json();
        console.log(res);
        if (res.success) {
            localStorage.setItem("token", res.json);
            dispatch({
                type: "login",
                payload: {
                    email,
                    password,
                },
            });
            await fetchPlaces();
            await getPinLocation();
            alert("Logged In Successfully!");
        } else {
            alert(res.msg);
        }
    }

    // login function for admins
    async function loginAdmin(email, password) {
        const Response = await fetch(`${BASE_URL}api/authAdmin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const res = await Response.json();
        console.log(res);
        if (res.success) {
            localStorage.setItem("token", res.json);
            dispatch({
                type: "loginAdmin",
                payload: {
                    email,
                    password,
                },
            });
            await fetchPlaces();
            alert("Logged in successfully");
        } else {
            alert(res.msg);
        }
    }

    // sign up function for users
    async function createUser(
        name,
        email,
        password,
        imageUrl = "https://i.pravatar.cc/100?u=zz"
    ) {
        console.log(name);
        const Response = await fetch(`${BASE_URL}api/authUser/createuser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password, imageUrl }),
        });
        const res = await Response.json();
        console.log(res);
        return res;
    }

    function logout() {
        localStorage.removeItem("token");
        setIsNotification(false);
        setReqNav(false);
        dispatch({ type: "logout" });
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isAdmin,
                reqNav,
                isNotification,
                setIsNotification,
                setReqNav,
                login,
                loginAdmin,
                logout,
                createUser,
                sidebarOpen,
                setSidebarOpen,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("AuthContext was used outside AuthProvider");
    }
    return context;
}

export { useAuth, AuthProvider };
