import Avtaar from "react-avatar";
import style from "../styles/Client.module.css";

const Client = ({ username }) => {
  return (
    <>
      <div className={style.users}>
        <Avtaar name={username} size={50} round="10px" />
        <h4 className={style.h4}>{username}</h4>
      </div>
    </>
  );
};

export default Client;
