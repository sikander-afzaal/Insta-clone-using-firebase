import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import logo from "../assets/logo.png";
import SignIn from "../Signin/SignIn.jsx";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import plus from "../assets/plus.png";
import exploreIco from "../assets/explore.png";
import { logOut } from "../redux/userSlice";
import { auth } from "../firebase";
function Header({ openModal }) {
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
      <Link to={"/"}>
        <img src={logo} alt="" />
      </Link>
      {user ? (
        <div className={styles.rightHeader}>
          <img onClick={() => openModal(true)} src={plus} alt="" />
          <Link to={"/Explore"}>
            <img src={exploreIco} alt="" />
          </Link>
          <Link to={`/Profile/${user.id}`}>
            <img
              className={styles.profile}
              src={user?.profilePic}
              alt={"profile pic"}
            />
            <p>{user?.name}</p>
          </Link>

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
