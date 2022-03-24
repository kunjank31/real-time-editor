import React, { useEffect, useRef, useState } from "react";
import style from "../styles/EditorPage.module.css";
import Client from "./Client";
import Editor from "./Editor";
import { initSocket } from "../socket-io";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import ACTIONS from "../Actions";
import toast, { Toaster } from "react-hot-toast";
import ChatBox from "./ChatBox";

const EditorPage = () => {
  const [users, setUsers] = useState([]);
  const [srcDoc, setSrcDoc] = useState("");
  const [code, setCode] = useState("");
  const [closeMenu, setCloseMenu] = useState(false);
  const codeRef = useRef(null);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setSrcDoc(`<html>
  //                   <body></body>
  //                   <script>${code}</script>
  //                </html>
  //               `);
  //   }, 250);
  //   return () => clearTimeout(timeout);
  // }, [code]);

  const socketRef = useRef(null);
  const navigator = useNavigate();
  const location = useLocation();
  const { roomId } = useParams();
  const handleErr = (err) => {
    console.log("socket err", err);
    toast.error("Socket connection failed, try again later.");
    navigator("/");
  };
  useEffect(() => {
    const init = async () => {
      socketRef.current = initSocket();
      socketRef.current.on("connect_error", (err) => handleErr(err));
      socketRef.current.on("connect_failed", (err) => handleErr(err));

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room.`);
          }
          setUsers(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        }
      );
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setUsers((prev) => prev.filter((u) => u.socketId !== socketId));
      });
    };
    init();
    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, []);

  const copyRoom = () => {
    window.navigator.clipboard.writeText(roomId);
    toast.success("Copy Room Id");
  };

  if (!location.state) {
    return <Navigate to="/" />;
  }
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div
        className={style.container}
      >
        <div className={`${style.left}  ${
          closeMenu ? style.open : style.close
        }`}>
          <div className={style.logo}>
            <img src="/logo.png" alt="" className={style.img} />
            <h1 className={style.h1}>Coding Lab</h1>
            <img
              src="/ham.png"
              alt=""
              className={style.closeImg}
              onClick={() => setCloseMenu(!closeMenu)}
            />
          </div>
          <hr />
          <h2 className={style.h2}>Connected User</h2>
          <div className={style.flexbox}>
            {users.map((u, i) => {
              return <Client key={i} username={u.username} />;
            })}
          </div>
          <div className={style.btnGroup}>
            <button className={style.btn1} onClick={copyRoom} title="Copy">
              Copy Room ID
            </button>
            <button className={style.btn2} onClick={() => navigator("/")}>
              Leave the Room
            </button>
          </div>
        </div>
        <div className={style.right}>
          <Editor
            socketRef={socketRef}
            onCodeChange={(code) => {
              setCode(code);
              codeRef.current = code;
            }}
          />
          {/* <iframe
            srcDoc={srcDoc}
            width="100%"
            height="100%"
            sandbox="allow-scripts"
            frameBorder="0"
          ></iframe> */}
        </div>
        <ChatBox username={location.state?.username} roomId={roomId} socketRef={socketRef} />
      </div>
    </>
  );
};

export default EditorPage;
