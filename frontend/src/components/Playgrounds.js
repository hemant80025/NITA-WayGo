import { usePlaces } from "../contexts/PlacesContext";
import List from "./List";
import Spinner from "./Spinner";

function Playgrounds() {
  const { places, isLoading } = usePlaces();
  const playgrounds = places.filter((place) => {
    return place.type === "playground";
  });

  if (isLoading) return <Spinner />;
  if (!playgrounds?.length) return <h2 className="text-center">No Playgrounds Available !!</h2>;

  return <List commonLocation={playgrounds} />;
}

export default Playgrounds;
