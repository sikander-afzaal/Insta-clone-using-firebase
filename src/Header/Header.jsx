import React, { useEffect } from "react";
import styles from "./Header.module.css";
import logo from "../assets/logo.png";
import { auth } from "../firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { gettingUser } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userState);
  const signIn = async () => {
    const google = new GoogleAuthProvider();
    await signInWithPopup(auth, google);
  };
  useEffect(() => {
    onAuthStateChanged(auth, (data) => {
      if (data) {
        const newUser = {
          name: data.displayName,
          profilePic: data.photoURL,
        };
        dispatch(gettingUser(newUser));
      } else {
        alert("failed");
      }
    });
  }, []);

  return (
    <div className={styles.header}>
      <img src={logo} alt="" />
      {user ? (
        <div className={styles.rightHeader}>
          <img
            className={styles.profile}
            src={user?.profilePic}
            alt={"profile pic"}
          />
          <p>{user?.name}</p>
        </div>
      ) : (
        <div className={styles.rightHeader}>
          <button onClick={signIn}>Sign In</button>
          <button>Sign Up</button>
        </div>
      )}
    </div>
  );
}

export default Header;
