import { Outlet } from "react-router-dom";
import AppNav from "./AppNav";
import Button from "./Button";
import styles from "./Sidebar.module.css";
import SearchPosts from "./SearchQuery";
import { useAuth } from "../contexts/AuthContext";
import ReqNav from "./ReqNav";

function Sidebar() {
  const handleOpen = () => {
    setSidebarOpen(true);
  };
  const handleClose = () => {
    setSidebarOpen(false);
  };
  const { reqNav, isAdmin } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useAuth();
  if (!sidebarOpen)
    return (
      <i
        className="fa-solid fa-bars hamburger-icon"
        style={{
          color: "black",
          fontSize: "30px",
          position: "absolute",
          zIndex: "100000",
          padding: "2rem",
          backgroundColor: "#ffffffcc"
        }}
        onClick={handleOpen}
      ></i>
    );

  return (
    <>
      <div
        className={styles.sidebar}
        style={{ display: sidebarOpen ? "block" : "none" }}
      >
        <nav className={styles.nav}>
          <SearchPosts />
          <ul onClick={handleClose}>
            <li>
              <Button type="primary">&times;</Button>
            </li>
          </ul>
        </nav>
        {!isAdmin ? <AppNav /> : reqNav ? <ReqNav /> : <AppNav />}
        <Outlet />
        <footer className={`${styles.footer} text-center`}>
          <p className={styles.copyright}>
            @ Copyright {new Date().getFullYear} by Maply Inc.
          </p>
        </footer>
      </div>
    </>
  );
}

export default Sidebar;
