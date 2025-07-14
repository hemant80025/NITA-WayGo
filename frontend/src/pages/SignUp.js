
import { useState } from "react";
import styles from "./SignUp.module.css";
import { useAuth } from "../contexts/AuthContext";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";

function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { createUser } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    if (email && password && name) {
      console.log(name);
      const res = await createUser(name, email, password);
      if(res.error){
        alert(res.error)
        setEmail("");
        setName("");
        setPassword("");
      }
      else  {
        alert("User created Successfully!")
        navigate("/login");
      }
    }
  }
  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="name">Name</label>
          <input
            type="name"
            id="name"
            placeholder="Enter your name"
            minLength={3}
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            required
            placeholder="Enter your Email Address"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            minLength={7}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">SignUp</Button>
        </div>
      </form>
    </main>
  );
}

export default SignUp;