import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Homepage";
import "./App.css";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import ProtectedRoutes from "./components/ProtectedRoutes";
import Login from "./pages/Login";
import { PlacesProvider } from "./contexts/PlacesContext";
import { AuthProvider } from "./contexts/AuthContext";
import SignUp from "./pages/SignUp";
import AllList from "./components/AllList";
import PlaceDetail from "./components/PlaceDetail";
import Hostels from "./components/Hostels";
import Restaurants from "./components/Restaurants";
import Playgrounds from "./components/Playgrounds";
import Departments from "./components/Departments";
import Form from "./components/Form";
import RequestPlaces from "./components/RequestPlaces";
import Others from "./components/Others";


function App() {
  return (
    <PlacesProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage />} />
            <Route path="/login" element={<Login  />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="app"
              element={
                <ProtectedRoutes>
                
                  <AppLayout />
                </ProtectedRoutes>
              }
            >
              <Route index element={<Navigate replace to="all" />} />
              <Route path="requestedLocations" element={<RequestPlaces />} />
              <Route path="requestedLocations/:id" element={<PlaceDetail />} />
              <Route path="all" element={<AllList />} />
              <Route path="all/:id" element={<PlaceDetail />} />
              <Route path="departments" element={<Departments />} />
              <Route path="departments/:id" element={<PlaceDetail />} />
              <Route path="others" element={<Others />} />
              <Route path="others/:id" element={<Others />} />
              <Route path="hostels" element={<Hostels />} />
              <Route path="hostels/:id" element={<PlaceDetail />} />
              <Route path="restaurants" element={<Restaurants />} />
              <Route path="restaurants/:id" element={<PlaceDetail />} />
              <Route path="playgrounds" element={<Playgrounds />} />
              <Route path="playgrounds/:id" element={<PlaceDetail />} />
              <Route path="form" element={<Form />} />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </PlacesProvider>
  );
}

export default App;

