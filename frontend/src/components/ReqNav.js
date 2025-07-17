import { NavLink } from "react-router-dom";
import styles from "./ReqNav.module.css";

function ReqNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="/app/requestedLocations" autoFocus>All Requested Location</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default ReqNav;
