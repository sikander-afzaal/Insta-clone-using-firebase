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
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import Loader from "./Loader";

function App() {
  const { user } = useSelector((state) => state.userState);
  const storage = getStorage(app); //for firebase storage so we can store images
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [modal, setModal] = useState(false);
  const [loader, setLoader] = useState(false);
  //getting uploaded file
  const fileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        setImageUrl(e.target.result);
      };

      reader.readAsDataURL(e.target.files[0]);
      setImage(e.target.files[0]);
    }
  };
  //uploading the file to fireabase storage
  const uploadImage = () => {
    const fileRef = ref(storage, image.name);
    const uploadTask = uploadBytesResumable(fileRef, image);
    setModal(false);
    setLoader(true);
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
  //adding post to the database
  const addPost = async (URL) => {
    const postQuery = collection(db, "posts");
    const res = await addDoc(postQuery, {
      username: user.name,
      caption: caption,
      image: URL,
      likes: 0,
      timeStamp: serverTimestamp(),
    });
    if (res) {
      setLoader(false);
      setCaption("");
      setImageUrl("");
    }
  };
  return (
    <div className="App">
      {loader && <Loader />}
      <Header openModal={setModal} />
      <Posts />
      {modal && (
        <>
          <div className="overlay" onClick={() => setModal(false)}></div>
          <div className="uploadPost">
            {imageUrl ? (
              <>
                <img className="uploadedImg" src={imageUrl} alt="" />
                <button
                  onClick={() => {
                    setImageUrl("");
                    setImage("");
                  }}
                  className="upload-btn"
                >
                  Discard Image
                </button>
              </>
            ) : (
              <>
                <label htmlFor="addFile">Add Image from computer</label>
                <input
                  onChange={fileUpload}
                  className="file"
                  type="file"
                  id="addFile"
                />
              </>
            )}
            <input
              type="text"
              className="caption"
              placeholder="Write Post Caption Here"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <button onClick={uploadImage} className="upload-btn">
              UPLOAD
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
