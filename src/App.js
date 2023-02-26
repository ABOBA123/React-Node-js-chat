import React, { useState } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const input = event.target.elements.message;
    const newMessage = input.value;
    setMessages([...messages, newMessage]);
    input.value = '';
  };

  return (
    <div className="chat">
      <h1>React Chat</h1>
      <div className="messages">
        {messages.map((message, index) => (
          <Message key={index} text={message} />
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" placeholder="Enter message" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

function Message(props) {
  return <div className="message">{props.text}</div>;
}
export default Chat
