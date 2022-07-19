import { useState } from "react";
import "./App.css";
import Header from "./Header/Header";
import Posts from "./Posts/Posts";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app, db } from "./firebase";
import { addDoc, collection } from "firebase/firestore";
import { useSelector } from "react-redux";

function App() {
  const { user } = useSelector((state) => state.userState);
  const storage = getStorage(app); //for firebase storage so we can store images
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  //getting uploaded file
  const fileUpload = (e) => {
    setImage(e.target.files[0]);
  };
  const uploadImage = () => {
    const fileRef = ref(storage, image.name);
    const uploadTask = uploadBytesResumable(fileRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          addPost(downloadURL);
        });
      }
    );
  };
  const addPost = async (URL) => {
    const postQuery = collection(db, "posts");
    await addDoc(postQuery, {
      username: user.name,
      caption: caption,
      image: URL,
      likes: 0,
    });
  };
  return (
    <div className="App">
      <Header />
      <Posts />
      <div className="uploadPost">
        <input
          type="text"
          placeholder="Write Post Caption Here"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <label htmlFor="addFile">Add Image Please</label>
        <input
          onChange={fileUpload}
          className="file"
          type="file"
          id="addFile"
        />
        <button onClick={uploadImage} className="upload-btn">
          UPLOAD
        </button>
      </div>
    </div>
  );
}

export default App;
