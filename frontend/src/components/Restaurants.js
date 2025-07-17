import { usePlaces } from "../contexts/PlacesContext";
import List from "./List";
import Spinner from "./Spinner";

function Restaurants() {
  const { places, isLoading } = usePlaces();
  const restaurants = places.filter((place) => {
    return place.type === "restaurant";
  });

  if (isLoading) return <Spinner />;
  if (!restaurants?.length) return <h2>No Restaurants Available !!</h2>;

  return <List commonLocation={restaurants} />;
}

export default Restaurants;
