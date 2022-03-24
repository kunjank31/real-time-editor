import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ACTIONS from "../Actions";
import style from "../styles/ChatBox.module.css";
import MessageBox from "./MessageBox";

const ChatBox = ({ roomId, username, socketRef }) => {
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageRef = useRef(null);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.RECEIVE_MESSAGE, ({ msg, username }) => {
        setMessages((prev) => [...prev, { message: msg, username }]);
      });
    }
    return () => socketRef.current.off(ACTIONS.RECEIVE_MESSAGE);
  }, [socketRef.current]);
  const sendMsg = (e) => {
    e.preventDefault();
    if (message === "") {
      toast.error("Please enter message!");
    } else {
      socketRef.current.emit(ACTIONS.SEND_MESSAGE, {
        msg: message,
        roomId,
        username,
      });
      setMessages([...messages, { message, username }]);
      setMessage("");
    }
  };

  const keyUp = (e) => {
    if (e.code === "Enter" || e.code === "NumpadEnter") {
      sendMsg(e);
    }
  };

  return (
    <>
      <div className={`${style.box} ${active ? "transform" : "transformZero"}`}>
        <div className={style.header} onClick={() => setActive(!active)}>
          <h3 className={style.h3}>Chat Room</h3>
          <img src="/minimize.ico" className={style.img} alt="" />
        </div>
        <div className={style.message_box_wrapper}>
          {messages.map(({ message, username }, i) => {
            return <MessageBox message={message} username={username} key={i} />;
          })}
        </div>
        <div className={style.inputBox}>
          <input
            type="text"
            name=""
            id=""
            className={style.input}
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            onKeyUp={keyUp}
          />
          <button className={style.btn} onClick={sendMsg}>
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
