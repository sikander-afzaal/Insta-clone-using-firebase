import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Saved from "../Saved/Saved";
import Liked from "../Liked/Liked";
import styles from "./Profile.module.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import MyPosts from "../MyPosts/MyPost";
import img from "../assets/user.png";
function Profile() {
  const params = useParams();
  const [headCheck, setHeadCheck] = useState("your");
  const [userParam, setUserParam] = useState({});
  const { user } = useSelector((state) => state.userState); //logged in user
  const [myPosts, setMyPosts] = useState([]); //your posts that you have posted
  const [followedUsers, setFollowedUsers] = useState([]); //the users that the profile has followed
  const [checkFollow, setCheckFollow] = useState(false); //checking if the logged in user has followed the profile
  const [totalFollowers, setTotalFollowers] = useState(0); //total followers the profile has

  //function to get all the profiles that the logged in user has followed
  const getFollowingUsers = async () => {
    const query = collection(db, "users", params.id, "followed");
    const data = await getDocs(query);
    if (data) {
      setFollowedUsers(
        data.docs.map((doc) => {
          return { ...doc.data() };
        })
      );
    }
  };

  //function to get the total followers of the profile
  const getTotalFollowers = async () => {
    const query = collection(db, "users", params.id, "followers");
    const data = await getDocs(query);
    if (data) {
      setTotalFollowers(data.docs.length);
    }
  };

  useEffect(() => {
    //function to get the posts that this profile has posted
    const getPosts = async () => {
      const query = collection(db, "users", params.id, "yourPosts");
      const data = await getDocs(query);
      if (data) {
        setMyPosts(
          data.docs.map((doc) => {
            return { ...doc.data };
          })
        );
      }
    };
    //function to get the profile
    const getUser = async () => {
      const query = doc(db, "users", params.id);
      const data = await getDoc(query);
      setUserParam({ ...data.data() });
    };

    getPosts();
    getFollowingUsers();
    getTotalFollowers();
    getUser();
  }, []);

  //use effect function to check if the logged in user has followed this profile or not
  useEffect(() => {
    const query = collection(db, "users", user.id, "followed");
    const data = getDocs(query).then((docs) => {
      docs.forEach((doc) => {
        if (doc.data().id === params.id) {
          setCheckFollow(true);
        }
      });
    });
  }, [followedUsers, params.id]);

  //follow handler (function that add a follower to the profile) --------------------
  const followHandler = async () => {
    if (!checkFollow) {
      const queryFollow = doc(db, "users", user.id, "followed", params.id);
      //adding a follower to the profile
      await setDoc(queryFollow, {
        ...userParam,
        id: params.id,
      });
      //adding a this profile to the followed list of the logged in user
      await setDoc(doc(db, "users", params.id, "followers", user.id), {
        ...user,
      });
    } else {
      //removing a follower to the profile
      const queryFollow = doc(db, "users", user.id, "followed", params.id);
      await deleteDoc(queryFollow);
      //removing a this profile to the followed list of the logged in user
      await deleteDoc(doc(db, "users", params.id, "followers", user.id));

      setCheckFollow(false);
    }
    getFollowingUsers();
    getTotalFollowers();
  };
  return (
    <div className={styles.profCont}>
      <div className={styles.profile}>
        <div className={styles.topProfile}>
          <img src={userParam?.photo || img} alt="" />
          <div className={styles.rightProfile}>
            <div className={styles.row}>
              <h1>{userParam?.name || "USER NOT FOUND"}</h1>
              {user.id !== params.id && userParam.name && (
                <button
                  onClick={followHandler}
                  className={`${checkFollow && styles.followed}  ${
                    styles.followBtn
                  }`}
                >
                  {checkFollow ? "Followed" : "Follow"}
                </button>
              )}
            </div>
            <div className={styles.row}>
              <h2>
                <span>{myPosts.length}</span> Your Posts
              </h2>
              <h2>
                <span>{totalFollowers}</span> Your Followers
              </h2>
              <h2>
                <span>{followedUsers.length}</span> Following
              </h2>
            </div>
          </div>
        </div>
        <div className={styles.bottomProfile}>
          <div className={styles.header}>
            <h4
              onClick={() => setHeadCheck("your")}
              className={`${headCheck === "your" && styles.active}`}
            >
              Your Posts
            </h4>
            {user.id === params.id && (
              <h4
                onClick={() => setHeadCheck("saved")}
                className={`${headCheck === "saved" && styles.active}`}
              >
                Saved Posts
              </h4>
            )}

            <h4
              onClick={() => setHeadCheck("liked")}
              className={`${headCheck === "liked" && styles.active}`}
            >
              Liked Posts
            </h4>
          </div>
          {headCheck === "saved" && <Saved />}
          {headCheck === "liked" && <Liked />}
          {headCheck === "your" && <MyPosts />}
        </div>
      </div>
    </div>
  );
}

export default Profile;
