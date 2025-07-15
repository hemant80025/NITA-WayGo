import { usePlaces } from "../contexts/PlacesContext";
import List from "./List";
import Spinner from "./Spinner";

function Departments() {
  const { places, isLoading } = usePlaces();
  const departments = places.filter((place) => {
    return place.type === "department";
  });

  if (isLoading) return <Spinner />;
  if (!departments?.length)
    return <h2 className="text-center">No Departments Available !!</h2>;

  return <List commonLocation={departments} />;
}

export default Departments;
