import { useAuth } from "../contexts/AuthContext";
import { usePlaces } from "../contexts/PlacesContext";
import List from "./List";
import Spinner from "./Spinner";

function RequestPlaces() {
  const { requestedLocations, isLoading } = usePlaces();
  const { isAdmin } = useAuth();
  console.log(requestedLocations);

  if (isLoading) return <Spinner />;
  if (!requestedLocations?.length)
    return <h2 className="text-center">No Request Place Available !!</h2>;

  return isAdmin ? <List commonLocation={requestedLocations} /> : <h1>PLz enter in admin Mode</h1>;
}

export default RequestPlaces;
