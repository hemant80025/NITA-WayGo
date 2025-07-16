import { usePlaces } from "../contexts/PlacesContext";
import List from "./List";
import Spinner from "./Spinner";

function Hostels() {
  const { places, isLoading } = usePlaces();
  const hostels = places.filter((place) => {
    return place.type === "hostel";
  });

  if (isLoading) return <Spinner />;
  if (!hostels?.length) return <h2 className="text-center">No Hostels Available !!</h2>;

  return <List commonLocation={hostels} />;
}

export default Hostels;
