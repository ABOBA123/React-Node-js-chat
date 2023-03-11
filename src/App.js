import React, { useCallback, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { faPen } from '@fortawesome/free-solid-svg-icons'
import darkMode from "./darkMode.css";
function Chat() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  const [isPaused, setIsPaused] = useState(false);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const ws = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
  const [edit, setEdit] = useState({})
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (!isPaused) {
      ws.current = new WebSocket("ws://localhost:3001/"); // создаем ws соединение
      ws.current.onopen = () => setStatus("Соединение открыто"); // callback на ивент открытия соединения
      ws.current.onclose = () => setStatus("Соединение закрыто"); // callback на ивент закрытия соединения

      gettingData();
    }

    return () => ws.current.close(); // кода меняется isPaused - соединение закрывается
  }, [ws, isPaused]);

  const gettingData = useCallback(() => {
    if (!ws.current) return;

    ws.current.onmessage = (e) => {
      //подписка на получение данных по вебсокету
      if (isPaused) return;
      const message = JSON.parse(e.data);
      setData((prev) => {
        return [...prev, e.data];
      });
    };
  }, [isPaused]);

  const sendMessage = () => {
    ws.current.send(JSON.stringify({ nickname: user, message: message }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const input = event.target.elements.message;
    const newMessage = input.value;
    setMessages([...messages, newMessage]);
    input.value = "";
  };
  useEffect(()=>{
if(edit?.message){
  setMessage(edit?.message)
}
  },[edit])
console.log(edit,message)
  return (
    <div className={`first-slide ${darkMode ? "moon-theme" : ""}`}>
      <div className={`chat ${darkMode ? "moon-theme" : ""}`}>
        <h1>React Chat</h1>
        <button
          class={" " + (!darkMode ? "moon-button " : "light-button")}
          onClick={toggleDarkMode}
        ></button>
        <input
          placeholder="your name"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <h1>{status}</h1>
        <div className="messages">
          {data.map((message, index) => (
            <Message key={index} text={message} user={user} edit ={edit} setEdit = {setEdit} />
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="message"
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage} type="submit">
            Send
          </button>
          {/* type='submit' */}
        </form>
      </div>
    </div>
  );
}

function Message(props) {
  const [data, setData] = useState(null);
  useEffect(() => {
    try {
      let res = JSON.parse(props.text);
      setData(res);
    } catch (error) {}
    // console.log(props);
  }, []);
  if (data?.message) {
    return (
      <div
        className={`message ${
          data?.nickname === props.user ? "message-me" : ""
        }`}
      >
        {data.nickname}:{data.message}
        {data.nickname === props.user && <FontAwesomeIcon onClick={()=>props.setEdit(data)} icon={faPen}/>}
      </div>
    );
  } else {
    return null;
  }
}
export default Chat;