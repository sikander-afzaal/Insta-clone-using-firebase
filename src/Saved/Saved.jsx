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
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    if (!user) {
      return;
    }
    const q = query(
      collection(db, "users", user.id, "savedPosts"),
      orderBy("timeStamp", "desc")
    );
    const unSub = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => {
          return { ...doc.data() };
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
        const likedQ = collection(db, "users", user.id, "likedPosts");
        const savedQ = collection(db, "users", user.id, "savedPosts");
        const data = await getDocs(likedQ);
        const dataSaved = await getDocs(savedQ);
        if (data) {
          setLikedPosts(
            data.docs.map((doc) => {
              return doc.data();
            })
          );
        }
        if (dataSaved) {
          setSavedPosts(
            dataSaved.docs.map((doc) => {
              return doc.data();
            })
          );
        }
      } else {
        return;
      }
    };
    setSavedPosts([]);
    setLikedPosts([]);
    gettingPosts();
  }, [user]);

  return (
    <div className={styles.posts}>
      {loader && <Loader />}
      {posts.map((post) => {
        return (
          <Post
            likedPosts={likedPosts}
            savedPosts={savedPosts}
            key={post.id}
            post={post}
          />
        );
      })}
    </div>
  );
}

export default Saved;
