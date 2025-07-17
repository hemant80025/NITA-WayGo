import styles from "./PlaceDetail.module.css";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
import { usePlaces } from "../contexts/PlacesContext";
import { useAuth } from "../contexts/AuthContext";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";
import { useNavigate } from "react-router-dom";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function PlaceDetail() {
  const navigate = useNavigate();
  const latLng = useUrlPosition();
  const {
    isLoading,
    addPlace,
    requestedLocations,
    rejectRequestByAdmin,
    places,
  } = usePlaces();
  const { isAdmin, isNotification } = useAuth();

  function getLocationByLatitude(latitude) {
    if (isNotification) {
      for (const location of requestedLocations) {
        if (location.latitude === latitude) {
          return location;
        }
      }
    } else {
      for (const location of places) {
        if (location.latitude === latitude) {
          return location;
        }
      }
    }

    return null;
  }
  const curP = getLocationByLatitude(latLng[0]);

  function handleAccept() {
    addPlace(curP.name, curP.latitude, curP.longitude, curP.type);
    navigate(-1);
  }
  function handleReject() {
    rejectRequestByAdmin(curP.latitude, curP.longitude);
    navigate(-1);
  }

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.place}>
      <div className={styles.row}>
        <h6>Place name</h6>
        <h3>{curP?.name}</h3>
      </div>
      <div className={styles.row}>
        <h6>Type</h6>
        <h3>{curP?.type}</h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {curP?.name} on</h6>
        <p>{formatDate(Date.now() || null)}</p>
      </div>

      <div className={styles.buttons}>
        {isAdmin && isNotification && (
          <Button type="primary" onClick={handleAccept}>
            Accept
          </Button>
        )}
        {isAdmin && isNotification && (
          <Button type="danger" onClick={handleReject}>
            Reject
          </Button>
        )}
        <BackButton />
      </div>
    </div>
  );
}

export default PlaceDetail;

