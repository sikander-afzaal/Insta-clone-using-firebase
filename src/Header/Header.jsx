import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import logo from "../assets/logo.png";
import SignIn from "../Signin/SignIn.jsx";
import { auth } from "../firebase";
import { logOut } from "../redux/userSlice";
import { useSelector, useDispatch } from "react-redux";

import plus from "../assets/plus.png";
import { onAuthStateChanged, signOut } from "firebase/auth";
function Header({ openModal }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userState);
  const [openSignInModal, setOpenSignInModal] = useState(false);
  useEffect(() => {
    onAuthStateChanged(auth, (data) => {
      if (!data) {
        dispatch(logOut());
      }
    });
  }, []);

  const signOutFunc = async () => {
    const res = await signOut(auth);
  };
  return (
    <div className={styles.header}>
      {openSignInModal && <SignIn setModal={setOpenSignInModal} />}
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
          <button onClick={signOutFunc}>Sign Out</button>
        </div>
      ) : (
        <div className={styles.rightHeader}>
          <button onClick={() => setOpenSignInModal(true)}>Sign In</button>
          <button>Sign Up</button>
        </div>
      )}
    </div>
  );
}

export default Header;
