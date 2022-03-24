import Avatar from "react-avatar";
import { useLocation } from "react-router-dom";
import style from "../styles/MessageBox.module.css";

const MessageBox = ({ message, username }) => {
  const { state } = useLocation();
  return (
    <>
      <span
        className={`${style.span} ${
          state?.username === username && style.right
        }`}
      >
        <Avatar name={username} size={20} round="5px" /> {username}
      </span>
      <div
        className={`${style.main} ${
          state?.username === username ? style.marginAdd : style.marginLess
        }`}
      >
        <div
          className={`${style.messageBox} ${
            state?.username === username ? style.primary : style.secondary
          }`}
        >
          {message}
        </div>
      </div>
    </>
  );
};

export default MessageBox;
