import React from "react";
import styles from "./Header.module.css";
import logo from "../assets/logo.png";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { gettingUser, logOut } from "../redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

import plus from "../assets/plus.png";
function Header({ openModal }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userState);
  const signIn = async () => {
    const google = new GoogleAuthProvider();
    const data = await signInWithPopup(auth, google);
    const newUser = {
      name: data.user.displayName,
      profilePic: data.user.photoURL,
    };
    dispatch(gettingUser(newUser));
  };

  const signOut = async () => {
    const res = await auth.signOut();
    dispatch(logOut);
  };
  return (
    <div className={styles.header}>
      <img src={logo} alt="" />
      {user ? (
        <div className={styles.rightHeader}>
          <img onClick={() => openModal(true)} src={plus} alt="" />
          <img
            className={styles.profile}
            src={user?.profilePic}
            alt={"profile pic"}
          />
          <p>{user?.name}</p>
          <button onClick={signOut}>Sign Out</button>
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
