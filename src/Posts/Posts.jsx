import React, { useEffect, useState } from "react";
import styles from "./Posts.module.css";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Post from "./Post";
import { useSelector } from "react-redux";
function Posts() {
  const { user } = useSelector((state) => state.userState);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timeStamp", "desc"));
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
    const gettingLiked = async () => {
      if (user) {
        const likedQ = collection(db, "users", user.id, "likedPosts");
        const data = await getDocs(likedQ);
        if (data) {
          setLikedPosts(
            data.docs.map((doc) => {
              return doc.data();
            })
          );
        }
      }
    };
    gettingLiked();
  }, [user.id]);

  return (
    <div className={styles.posts}>
      {posts.map((post) => {
        return <Post likedPosts={likedPosts} key={post.id} post={post} />;
      })}
    </div>
  );
}

export default Posts;
