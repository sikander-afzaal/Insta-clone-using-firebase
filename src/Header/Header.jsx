import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import logo from "../assets/logo.png";
import SignIn from "../Signin/SignIn.jsx";
import { useSelector, useDispatch } from "react-redux";

import plus from "../assets/plus.png";
import { logOut } from "../redux/userSlice";
import { auth } from "../firebase";
function Header({ openModal, saved, savedState }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userState);
  const [openSignInModal, setOpenSignInModal] = useState(false);

  const signOutFunc = () => {
    auth.signOut().then(() => {
      dispatch(logOut());
      localStorage.removeItem("User");
    });
  };
  return (
    <div className={styles.header}>
      {openSignInModal && <SignIn setModal={setOpenSignInModal} />}
      <img onClick={() => saved(false)} src={logo} alt="" />
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
          <button onClick={() => saved((prev) => !prev)}>
            {savedState ? "All Posts" : "Saved Posts"}
          </button>
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
