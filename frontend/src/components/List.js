import Item from "./Item";
import styles from "./List.module.css";
import Spinner from "./Spinner";
import { usePlaces } from "../contexts/PlacesContext";
import { useAuth } from "../contexts/AuthContext";

function List({ commonLocation }) {
  const { isNotification } = useAuth();
  const { isLoading } = usePlaces();
  if (isLoading) return <Spinner />;

  return (
    <>
      {isNotification && <h1>Requested Locations</h1>}
      <hr></hr>
      <ul className={styles.placeList}>
        {commonLocation.map((place) => (
          <Item key={place._id} currentPlace={place} />
        ))}
      </ul>
    </>
  );
}

export default List;
