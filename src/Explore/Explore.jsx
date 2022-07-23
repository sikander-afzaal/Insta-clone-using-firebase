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
import Loader from "../Loader";
import { useSelector } from "react-redux";
function Explore() {
  const { user } = useSelector((state) => state.userState);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timeStamp", "desc"));
    const unSub = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
      setLoader(false);
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
      {posts.length > 0
        ? posts.map((post) => {
            return (
              <Post
                savedPosts={savedPosts}
                likedPosts={likedPosts}
                key={post.id}
                post={post}
              />
            );
          })
        : "Your are Following no one please follow someone"}
    </div>
  );
}

export default Explore;
