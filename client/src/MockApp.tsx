import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SERVER_ORIGIN);

const App2 = () => {
  const [msg, setMsg] = useState("");
  const [msgReceived, setMsgReceived] = useState("");
   const [room, setRoom] = useState("");

    const joinRoom = () => {
      if (room !== "") {
        console.log(room);
        socket.emit("join_room", room);
      }
    };

  const sendMsg = () => {
    console.log(msg);
    socket.emit("send_message", { message: msg, room  });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log("received data: ", data);
      setMsgReceived(data.message);
    });
  }, [socket]);
  
  return (
    <div>
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        placeholder="Message..."
        onChange={(event) => {
          setMsg(event.target.value);
        }}
      />
      <button onClick={sendMsg}> Send Message</button>
      <h1> Message:</h1>
      {msgReceived}
    </div>
  );
};

export default App2;
