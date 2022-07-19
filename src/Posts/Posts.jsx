import React, { useEffect, useState } from "react";
import styles from "./Posts.module.css";
import { db } from "../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import Post from "./Post";
function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "posts"));
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

  return (
    <div className={styles.posts}>
      {posts.map((post) => {
        return <Post key={post.id} post={post} />;
      })}
    </div>
  );
}

export default Posts;
