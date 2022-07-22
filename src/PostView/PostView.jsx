import React, { useEffect, useState } from "react";
import styles from "./PostView.module.css";
import { useSelector } from "react-redux";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
function PostView({ post, modal }) {
  const { user } = useSelector((state) => state.userState);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [saved, setSaved] = useState(false);
  const [like, setLike] = useState(false);
  useEffect(() => {
    //gettin comments of that post
    const commetsDoc = collection(db, "posts", post.id, "Comments");
    const comQuery = query(commetsDoc, orderBy("timeStamp", "desc"));
    const unsub = onSnapshot(comQuery, (com) => {
      setComments(
        com.docs.map((com) => {
          return { ...com.data(), id: com.id };
        })
      );
    });

    //end getting comments
    return () => {
      unsub();
    };
  }, []);
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
    <>
      <div onClick={() => modal(false)} className="overlay"></div>
      <div className={styles.postView}>
        <div className={styles.leftView}>
          <img src={post.image} alt="" />
        </div>
        <div className={styles.rightView}>
          <div className={styles.profileRow}>
            <img src={post.userPic} alt="" />
            <h3>{post.username}</h3>
          </div>
          <div className={styles.postDesc}>
            <div className={styles.profileRow}>
              <img src={post.userPic} alt="" />
              <h3>
                {post.username}{" "}
                <span className={styles.caption}>{post.caption}</span>
              </h3>
            </div>
            <div className={styles.comments}>
              {comments.map((comment) => {
                return (
                  <div key={comment.id} className={styles.comment}>
                    <img src={comment.pic} alt="" />
                    <p>
                      <strong>{comment.username} </strong> {comment.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <form
            onSubmit={(e) => addComment(e, post.id)}
            className={styles.inputDiv}
          >
            <textarea
              onChange={(e) => setNewComment(e.target.value)}
              value={newComment}
              placeholder={"Enter Comment"}
            ></textarea>
            <h5 onClick={(e) => addComment(e, post.id)}>POST</h5>
            <button type="submit" style={{ display: "none" }}></button>
          </form>
        </div>
      </div>
    </>
  );
}

export default PostView;
