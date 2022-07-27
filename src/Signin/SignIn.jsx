import React, { useEffect } from "react";
import "./SignIn.css";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { gettingUser, logOut } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { db } from "../firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
function SignIn({ setModal }) {
  const dispatch = useDispatch();
  const signInGoogle = async () => {
    try {
      const google = new GoogleAuthProvider();
      const data = await signInWithPopup(auth, google);
      if (data) {
        let person = false;
        const queryCol = collection(db, "users");
        const unsub = await getDocs(queryCol);
        if (unsub) {
          //checking if user already exists in the database
          unsub.forEach((doc) => {
            if (doc.data().email === data.email) {
              const newUser = {
                name: doc.data().name,
                profilePic: doc.data().photo,
                email: doc.data().email,
                id: doc.id,
              };
              dispatch(gettingUser(newUser));
              data
                ? localStorage.setItem("User", JSON.stringify(newUser))
                : localStorage.removeItem("User");
              person = true;
            }
          });
          //if not then we add him to the database
          if (!person) {
            const adding = await addDoc(queryCol, {
              name: data.user?.displayName,
              email: data.user?.email,
              photo: data.user?.photoURL,
            });
            if (adding) {
              const newUser = {
                name: data.user?.displayName,
                email: data.user?.email,
                photo: data.user?.photoURL,
                id: adding.id,
              };
              dispatch(gettingUser(newUser));
              data
                ? localStorage.setItem("User", JSON.stringify(newUser))
                : localStorage.removeItem("User");
            }
          }
        }
        setModal(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div onClick={() => setModal(false)} className="overlay"></div>
      <div className="sign-in">
        <input type="email" name="email" placeholder="Enter Email" />
        <input type="password" name="password" placeholder="Enter Password" />
        <h1>
          or <br /> Sign in using
        </h1>
        <button className="google" onClick={signInGoogle}>
          <img
            src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
            alt=""
          />
          Google
        </button>
      </div>
    </>
  );
}

export default SignIn;
