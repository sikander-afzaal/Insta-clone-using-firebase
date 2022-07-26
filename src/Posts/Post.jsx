import React, { useEffect, useState } from "react";
import styles from "./Posts.module.css";
import { db } from "../firebase";
import { serverTimestamp } from "@firebase/firestore";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import saveIco from "../assets/save.svg";
import savedIco from "../assets/saved.svg";
import PostView from "../PostView/PostView";
import img from "../assets/user.png";
function Post({ post, likedPosts, savedPosts }) {
  const { user } = useSelector((state) => state.userState);
  const [newComment, setNewComment] = useState("");
  const [viewComments, setViewComments] = useState(false);
  const [saved, setSaved] = useState(false);
  const [like, setLike] = useState(false);

  //checking if the user has liked this post or not
  useEffect(() => {
    if (likedPosts) {
      if (likedPosts.length > 0) {
        likedPosts.forEach((liked) => {
          if (liked.id === post.id) {
            setLike(true);
          }
        });
      } else {
        setLike(false);
      }
    }
    if (savedPosts) {
      if (savedPosts.length > 0) {
        savedPosts.forEach((savedP) => {
          if (savedP.id === post.id) {
            setSaved(true);
          }
        });
      } else {
        setSaved(false);
      }
    }
  }, [likedPosts?.length, savedPosts?.length]);

  const DislikePost = async (specificPost) => {
    if (!user) {
      alert("please sign in");
    }
    if (specificPost.likes <= 0) {
      return;
    }
    const query = doc(db, "posts", specificPost.id);
    const queryUser = doc(db, "users", user.id, "likedPosts", specificPost.id);
    const likeFinal = specificPost.likes - 1;
    await updateDoc(query, {
      likes: likeFinal,
    });
    await deleteDoc(queryUser);
  };

  //liking post ---------------------------------------------
  const LikePost = async (specificPost) => {
    if (!user) {
      alert("please sign in");
    }
    const query = doc(db, "posts", specificPost.id);
    const queryUser = doc(db, "users", user.id, "likedPosts", specificPost.id);
    const likeFinal = specificPost.likes + 1;
    await updateDoc(query, {
      likes: likeFinal,
    });
    await setDoc(queryUser, {
      ...specificPost,
      likes: likeFinal,
    });
  };
  //saving posts
  const savedHandler = async (specificPost) => {
    if (!user) {
      return;
    }
    setSaved((prev) => !prev);
    const saveQuery = doc(db, "users", user.id, "savedPosts", specificPost.id);
    if (saved) {
      await deleteDoc(saveQuery);
    } else {
      await setDoc(saveQuery, {
        ...post,
      });
    }
  };
  //adding comment
  const addComment = async (e, id) => {
    e.preventDefault();
    if (!newComment) {
      return;
    }
    const query = collection(db, "posts", id, "Comments");
    await addDoc(query, {
      username: user.name,
      comment: newComment,
      timeStamp: serverTimestamp(),
      pic: user.profilePic,
    });
    setNewComment("");
  };
  return (
    <div
      key={post.id}
      className={`${styles.post} ${viewComments && styles.addRow}`}
    >
      <Link to={`/Profile/${post.userId}`} className={styles.profileRow}>
        <img src={post.userPic || img} alt="" />
        <h3>{post.username}</h3>
      </Link>
      <img className={styles.postImg} src={post?.image} alt="" />
      <div className={styles.row}>
        <svg
          onClick={() => {
            if (!user) {
              return alert("Please Sign in");
            }
            setLike(true);
            LikePost(post);
          }}
          aria-label="Like"
          className={`${styles.heartRed} ${like ? styles.none : ""}`}
          role="img"
          viewBox="0 0 24 24"
        >
          <path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z"></path>
        </svg>
        <svg
          onClick={() => {
            if (!user) {
              return alert("Please Sign in");
            }
            setLike(false);
            DislikePost(post);
          }}
          aria-label="Unlike"
          className={`${styles.heart} ${like ? styles.display : ""}`}
          role="img"
          viewBox="0 0 48 48"
        >
          <path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path>
        </svg>
        <img
          onClick={() => savedHandler(post)}
          className={styles.savedIco}
          src={saved ? savedIco : saveIco}
          alt=""
        />
      </div>
      <h4 className={styles.likes}>
        {post?.likes} {post?.likes > 1 ? "Likes" : "Like"}
      </h4>
      <h2 className={styles.caption}>{post?.caption}</h2>

      <div className={styles.commentDiv}>
        <p
          className={styles.viewCom}
          onClick={() => setViewComments((prev) => !prev)}
        >
          View Comments
        </p>
        {viewComments && <PostView post={post} modal={setViewComments} />}
      </div>
      <form onSubmit={(e) => addComment(e, post.id)}>
        <textarea
          onChange={(e) => setNewComment(e.target.value)}
          value={newComment}
          type="text"
          placeholder="Enter Comment"
        ></textarea>
        <button type="submit" style={{ display: "none" }}></button>
      </form>
    </div>
  );
}

export default Post;
