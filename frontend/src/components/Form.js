// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";

import styles from "./Form.module.css";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useUrlPosition } from "../hooks/useUrlPosition";
import Message from "./Message";
import Spinner from "./Spinner";
import { usePlaces } from "../contexts/PlacesContext";
import { useAuth } from "../contexts/AuthContext";

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

function Form() {
  const [latitude, longitude] = useUrlPosition();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [geoCodingError, setGeoCodingError] = useState();

  const { isLoading, reqLocation, addPinLocation } = usePlaces();
  const navigate = useNavigate();

  const { isAdmin } = useAuth();
  const { addPlace } = usePlaces();

  useEffect(
    function () {
      async function fetchPlaceData() {
        try {
          setIsLoadingGeocoding(true);
          setGeoCodingError("");
          const res = await fetch(
            `${BASE_URL}?latitude=${latitude}&longitude=${longitude}`
          );
          const data = await res.json();
          // console.log(data);
          if (!data.countryCode)
            throw new Error(
              "🤨That doesn't seem to be a Valid Location. Plz Click somewhere else 🫠"
            );
        } catch (err) {
          setGeoCodingError(err.message);
        } finally {
          setIsLoadingGeocoding(false);
        }
      }
      fetchPlaceData();
    },
    [latitude, longitude]
  );


  async function handleReqAddPlace(e) {
    e.preventDefault();
    if (!name || !type) return;
    if (isAdmin) {
      addPlace(name, latitude, longitude, type);
    } else {
      reqLocation(name, latitude, longitude, type);
    }
    navigate("/app");
  }
  async function handlePinPlace(e) {
    e.preventDefault();
    if (!name || !type || !message) return;
    addPinLocation(name, latitude, longitude, type, message);
    navigate("/app");
  }

  if (isLoadingGeocoding) return <Spinner />;

  if (!latitude && !longitude)
    return <Message message="Start by clicking somewhere in the map" />;

  if (geoCodingError) return <Message message={geoCodingError} />;

  return (
    <form className={`${styles.form} ${isLoading ? styles.loading : ""}`}>
      <div className={styles.row}>
        <label htmlFor="name">Place name</label>
        <input
          id="name"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </div>
      <div className={styles.row}>
        <label htmlFor="type">Choose Type</label>
        <select
          onChange={(e) => setType(e.target.value)}
          value={type}
          required
          id="cars"
        >
          <option>--Select Type--</option>
          <option value="department">Department</option>
          <option value="hostel">Hostel</option>
          <option value="restaurant">Restaurant</option>
          <option value="playground">Playground</option>
          <option value="others">Other</option>
        </select>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Give some message about {name}</label>
        <textarea
          id="notes"
          required
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary" onClick={handleReqAddPlace}>
          {isAdmin ? "Add Location" : "Req Add Location"}
        </Button>
        {!isAdmin && (
          <Button type="primary" onClick={handlePinPlace}>
            Pin Location
          </Button>
        )}
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
