import React, { useEffect, useState } from "react";
import styles from "./Posts.module.css";
import { db } from "../firebase";
import { collection, doc, getDocs } from "firebase/firestore";
import Post from "./Post";
import Loader from "../Loader";
import { useSelector } from "react-redux";
function Posts() {
  const { user } = useSelector((state) => state.userState);
  const [posts, setPosts] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }
    const q = collection(db, "users", user.id, "followed");
    getDocs(q)
      .then((data) => {
        setFollowedUsers(
          data.docs.map((doc) => {
            return { ...doc.data() };
          })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);
  useEffect(() => {
    if (followedUsers.length > 0) {
      followedUsers.forEach((elem) => {
        const postsQ = collection(db, "users", elem.id, "yourPosts");
        getDocs(postsQ).then((data) => {
          setPosts((prev) => {
            const newPosts = data.docs.map((doc) => {
              return { ...doc.data(), userId: elem.id };
            });
            setLoader(false);
            return [...prev, ...newPosts];
          });
        });
      });
    } else {
      setLoader(false);
    }
  }, [followedUsers]);

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
      {posts.map((post) => {
        return (
          <>
            {loader && <Loader />}
            {posts.length > 0 ? (
              <Post
                savedPosts={savedPosts}
                likedPosts={likedPosts}
                key={post.id}
                post={post}
              />
            ) : (
              "Your are Following no one please follow someone"
            )}
          </>
        );
      })}
    </div>
  );
}

export default Posts;
