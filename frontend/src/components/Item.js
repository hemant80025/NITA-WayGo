import { Link } from "react-router-dom";
import styles from "./Item.module.css";
import { useAuth } from "../contexts/AuthContext.js";
import { usePlaces } from "../contexts/PlacesContext.js";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function Item({ currentPlace }) {
  const { name, date, latitude, longitude, _id } = currentPlace;
  const { isAdmin, isNotification } = useAuth();
  const { deleteLocationByAdmin } = usePlaces();

  function handleDelete(e) {
    e.preventDefault();
    deleteLocationByAdmin(latitude, longitude);
  }

  return (
    <li>
      <Link
        className={`${styles.placeItem} ${
          currentPlace._id === _id ? styles["placeItem--active"] : ""
        }`}
        to={`${_id}?lat=${latitude}&lng=${longitude}`}
      >
        <h3 className={styles.name}>{name}</h3>
        {/* <time className={styles.date}>({formatDate(date)})</time> */}
        {isAdmin && !isNotification &&  (
          <button className={styles.deleteBtn} onClick={handleDelete}>
            x
          </button>
        )}
      </Link>
    </li>
  );
}

export default Item;
