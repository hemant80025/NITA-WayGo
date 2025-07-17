import { NavLink } from "react-router-dom";
import styles from "./Logo.module.css";
function Logo() {
  return (
    <>
      <div className="container">
        <NavLink to="/">
          <img src="/nita_logo.jpg" alt="NITA logo" className={styles.logo} />
        </NavLink>
      </div>
    </>
  );
}

export default Logo;
