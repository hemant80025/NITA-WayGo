
import { Link } from "react-router-dom";
import PageNav from "../components/PageNav";
import styles from "./Homepage.module.css";

function HomePage() {
  return (
    <div>
    <main className={styles.homepage}>
      <PageNav />
      <section>
        <h1>
          You travel the NIT Agartala.
          <br />
          NITA-WayGo will guide you at every step in this adventure.
        </h1>
        <h2>
           A very userFriendly Map.
        </h2>
        <Link to="/app" className="cta">
          Start Tracking Now
        </Link>
      </section>
      </main>
      <footer className={styles.footer}>
        <div className={styles.footerBottom}>
          <p>
             NITA-WayGo.  Designed by{" "}
            <span className={styles.designer}>Rohit Kumar</span>
            <span className={styles.designer}>Roushan Kumar</span>
            <span className={styles.designer}>Hemant Kumar</span>

          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
