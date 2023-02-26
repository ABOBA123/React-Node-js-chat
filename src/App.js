import React, { useCallback, useEffect, useRef, useState } from "react";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  const [isPaused, setIsPaused] = useState(false);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState("");
  const ws = useRef(null);

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

  return (
    <div className='chat'>
      <h1>React Chat</h1>
      <input
        placeholder='your name'
        value={user}
        onChange={(e) => setUser(e.target.value)}
      />
      <h1>{status}</h1>
      <div className='messages'>
        {data.map((message, index) => (
          <Message key={index} text={message} />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='message'
          placeholder='Enter message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage} type='submit'>
          Send
        </button>
      </form>
    </div>
  );
}

function Message(props) {
  return <div className='message'>{props.text}</div>;
}
export default Chat;
