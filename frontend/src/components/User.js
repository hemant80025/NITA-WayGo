import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./User.module.css";
import { usePlaces } from "../contexts/PlacesContext";

function User() {
  const {
    user,
    logout,
    isAdmin,
    setIsNotification,
    sidebarOpen,
    setSidebarOpen,
  } = useAuth();
  const navigate = useNavigate();
  const { fetchReqLocations } = usePlaces();
  function handleNotification() {
    fetchReqLocations();
    setIsNotification(true);
    setSidebarOpen(true);
  }

  function handleClick() {
    logout();
    navigate("/");
  }

  return (
    <div
      className={styles.user}
      style={{ display: !sidebarOpen ? "block" : "none" }}
    >
      {isAdmin && (
        <NavLink to="requestedLocations">
          <button
            type="button"
            className="btn btn-primary focus"
            onClick={handleNotification}
          >
            Notifications
          </button>
        </NavLink>
      )}

      <img src={user?.imageUrl} alt={user?.name} />
      <span>Welcome, {user?.name}</span>
      <button
        type="button"
        className="btn btn-primary focus"
        onClick={handleClick}
      >
        Logout
      </button>
    </div>
  );
}

export default User;
