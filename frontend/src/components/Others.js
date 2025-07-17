import { usePlaces } from "../contexts/PlacesContext";
import List from "./List";
import Spinner from "./Spinner";

function Others() {
  const { places, isLoading } = usePlaces();
  const others = places.filter((place) => {
    return place.type === "others";
  });

  if (isLoading) return <Spinner />;
  if (!others?.length) return <h2 className="text-center">No Other Place Available !!</h2>;

  return <List commonLocation={others} />;
}

export default Others;
