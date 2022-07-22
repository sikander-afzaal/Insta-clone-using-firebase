import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Saved from "../Saved/Saved";
import Liked from "../Liked/Liked";
import styles from "./Profile.module.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import MyPosts from "../MyPosts/MyPost";
function Profile() {
  const [headCheck, setHeadCheck] = useState("your");
  const { user } = useSelector((state) => state.userState);
  const [myPosts, setMyPosts] = useState([]);
  useEffect(() => {
    const getMyPosts = async () => {
      const query = collection(db, "users", user.id, "yourPosts");
      const myPosts = await getDocs(query);
      if (myPosts) {
        setMyPosts(
          myPosts.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
          })
        );
      }
    };
    getMyPosts();
  }, [myPosts]);

  return (
    <div className={styles.profCont}>
      <div className={styles.profile}>
        <div className={styles.topProfile}>
          <img src={user?.profilePic} alt="" />
          <div className={styles.rightProfile}>
            <h1>{user?.name}</h1>
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
            <h4
              onClick={() => setHeadCheck("saved")}
              className={`${headCheck === "saved" && styles.active}`}
            >
              Saved Posts
            </h4>

            <h4
              onClick={() => setHeadCheck("liked")}
              className={`${headCheck === "liked" && styles.active}`}
            >
              Liked Posts
            </h4>
          </div>
          {headCheck === "saved" && <Saved />}
          {headCheck === "liked" && <Liked />}
          {headCheck === "your" && <MyPosts posts={myPosts} />}
        </div>
      </div>
    </div>
  );
}

export default Profile;
