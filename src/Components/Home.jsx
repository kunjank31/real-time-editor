import style from "../styles/Home.module.css";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
const Home = () => {
  const navigate = useNavigate();
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const sumbit = (e) => {
    e.preventDefault();
    toast.success(username + "has joined");
    navigate("/editor/" + room, {
      state: {
        username,
      },
    });
  };
  const keyUp = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      sumbit(e);
    }
  };
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className={style.container}>
        <div className={style.center}>
          <div className={style.logo}>
            <img src="/logo.png" alt="" className={style.img} />
            <h1 className={style.h1}>Coding Lab</h1>
          </div>
          <hr />
          <div className={style.form}>
            <div className={style.formGroup}>
              <label htmlFor="id" className={style.label}>
                Room
              </label>
              <input
                type="text"
                id="id"
                name="room"
                className={style.input}
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
            </div>
            <div className={style.formGroup}>
              <label htmlFor="username" className={style.label}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className={style.input}
                value={username}
                onKeyUp={keyUp}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <button className={style.btn} onClick={sumbit}>
              Join
            </button>
          </div>
          <p className={style.p}>
            Create new room
            <button
              className={style.createRoom}
              onClick={() => {
                setRoom(uuidv4());
                toast.success("Room is created...");
              }}
            >
              Create New Room
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
