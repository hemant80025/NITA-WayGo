import { NavLink } from "react-router-dom";
import styles from "./AppNav.module.css";
import { useAuth } from "../contexts/AuthContext";

function AppNav() {
  const { setIsNotification } = useAuth();

  function handleClick() {
    setIsNotification(false);
  }

  return (
    <nav className={styles.nav}>
      <ul onClick={handleClick}>
        <li>
          <NavLink to="all">All</NavLink>
        </li>
        <li>
          <NavLink to="departments">Departments</NavLink>
        </li>
        <li>
          <NavLink to="restaurants">Restaurants</NavLink>
        </li>
        <li>
          <NavLink to="hostels">Hostels</NavLink>
        </li>
        <li>
          <NavLink to="playgrounds">PlayGrounds</NavLink>
        </li>
        <li>
          <NavLink to="others">Others</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default AppNav;
