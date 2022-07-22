import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Saved from "../Saved/Saved";
import Liked from "../Liked/Liked";
import styles from "./Profile.module.css";
import { addDoc, collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import MyPosts from "../MyPosts/MyPost";
import img from "../assets/user.png";
function Profile() {
  const params = useParams();
  const [headCheck, setHeadCheck] = useState("your");
  const [userParam, setUserParam] = useState({});
  const { user } = useSelector((state) => state.userState);
  const [myPosts, setMyPosts] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [checkFollow, setCheckFollow] = useState(false);
  useEffect(() => {
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
    const getUser = async () => {
      const query = doc(db, "users", params.id);
      const data = await getDoc(query);
      setUserParam({ ...data.data() });
    };
    const getFollowingUsers = async () => {
      const query = collection(db, "users", user.id, "followed");
      const data = await getDocs(query);
      if (data) {
        setFollowedUsers(
          data.docs.map((doc) => {
            return { ...doc.data() };
          })
        );
      }
    };
    getPosts();
    getFollowingUsers();
    getUser();
  }, []);
  useEffect(() => {
    followedUsers.forEach((elem) => {
      if (elem.id === params.id) {
        setCheckFollow(true);
        console.log("hi");
      }
    });
  }, [followedUsers]);

  //follow handler -----------
  const followHandler = async () => {
    const queryFollow = collection(db, "users", user.id, "followed");
    const data = await addDoc(queryFollow, {
      ...userParam,
    });
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
                  Follow
                </button>
              )}
            </div>
            <div className={styles.row}>
              <h2>
                <span>{myPosts.length}</span> Your Posts
              </h2>
              <h2>
                <span>0</span> Your Followers
              </h2>
              <h2>
                <span>0</span> Following
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
