import React, { useEffect, useState } from "react";
import styles from "../Posts/Posts.module.css";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Post from "../Posts/Post";
import { useSelector } from "react-redux";
import Loader from "../Loader";
function Saved() {
  const { user } = useSelector((state) => state.userState);
  const [likedPosts, setLikedPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (!user) {
      return;
    }
    const q = query(
      collection(db, "users", user.id, "likedPosts"),
      orderBy("timeStamp", "desc")
    );
    const unSub = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
    });
    return () => {
      unSub();
    };
  }, []);
  //getting all the liked posts that have been liked by this user
  useEffect(() => {
    const gettingPosts = async () => {
      if (user) {
        setLoader(true);
        const savedQ = collection(db, "users", user.id, "likedPosts");
        const dataSaved = await getDocs(savedQ);
        if (dataSaved) {
          setLikedPosts(
            dataSaved.docs.map((doc) => {
              return doc.data();
            })
          );
          setLoader(false);
        }
      } else {
        return;
      }
    };
    setLikedPosts([]);
    gettingPosts();
  }, [user]);

  return (
    <div className={styles.posts}>
      {loader && <Loader />}
      {posts.map((post) => {
        return <Post likedPosts={likedPosts} key={post.id} post={post} />;
      })}
    </div>
  );
}

export default Saved;
