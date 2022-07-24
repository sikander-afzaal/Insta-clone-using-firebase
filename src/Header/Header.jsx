import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import logo from "../assets/logo.png";
import SignIn from "../Signin/SignIn.jsx";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import plus from "../assets/plus.png";
import img from "../assets/user.png";
import exploreIco from "../assets/explore.png";
import { logOut } from "../redux/userSlice";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
function Header({ openModal }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userState);
  const [openSignInModal, setOpenSignInModal] = useState(false);
  const [searchedAccounts, setSearchedAccounts] = useState("");
  const [fetchedAcc, setFetchedAcc] = useState([]);

  const fetchAccounts = (name) => {
    const queryAcc = query(
      collection(db, "users"),
      where("name", ">=", name),
      where("name", "<=", name + "z")
    );
    getDocs(queryAcc).then((data) => {
      setFetchedAcc(
        data.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
    });
  };

  const searchHandler = (e) => {
    setSearchedAccounts(e.target.value);
    if (e.target.value !== "") {
      fetchAccounts(e.target.value);
    } else {
      setFetchedAcc([]);
    }
  };

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
      <div className={styles.searchDiv}>
        <input
          type="text"
          placeholder="Search Accounts"
          className={styles.input}
          value={searchedAccounts}
          onChange={searchHandler}
        />
        <div
          className={`${styles.searchedAcc} ${
            fetchedAcc.length > 0 && styles.display
          }`}
        >
          {/* showing the searched users here ---------------------------------- */}
          {fetchedAcc.map((acc) => {
            return (
              <Link
                onClick={() => setFetchedAcc([])}
                to={`/Profile/${acc.id}`}
                key={acc.id}
                className={styles.profileRow}
              >
                <img src={acc.photo || img} alt="" />
                <h3>{acc.name}</h3>
              </Link>
            );
          })}
          {/* --------------------------------------------------------------- */}
        </div>
      </div>
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
