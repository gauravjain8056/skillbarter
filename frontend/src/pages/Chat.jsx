import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { getChatHistory } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { receiverId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);
  const roomIdRef = useRef(null);

  // Create the socket once per mount, clean up on unmount
  const socketRef = useRef(null);
  useEffect(() => {
    const socket = io("http://localhost:8000", {
      autoConnect: true,
      withCredentials: false,
    });
    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!user || !receiverId) return;
    roomIdRef.current = [user.id, receiverId].sort().join("-");
  }, [user, receiverId]);

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      if (!receiverId) return;
      setLoadingHistory(true);
      setError("");
      try {
        const res = await getChatHistory(receiverId);
        setMessages(res.data || []);
      } catch (err) {
        console.error("THE EXACT ERROR IS:", err);
        console.log("RESPONSE DATA:", err.response);
        const msg =
          err.response?.data?.message || "Failed to load chat history.";
        setError(msg);
      } finally {
        setLoadingHistory(false);
      }
    };

    if (isAuthenticated && receiverId) {
      loadHistory();
    }
  }, [receiverId, isAuthenticated]);

  // Join room and listen for incoming messages
  useEffect(() => {
    if (!user || !receiverId || !roomIdRef.current || !socketRef.current) return;

    const socket = socketRef.current;
    const roomId = roomIdRef.current;
    socket.emit("join_room", roomId);

    const handleReceive = (message) => {
      // Skip messages sent by ME — already added optimistically in handleSend
      if (message.senderId === user.id) return;

      if (
        (message.senderId === receiverId && message.receiverId === user.id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [user, receiverId]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !user || !receiverId || !roomIdRef.current || !socketRef.current) return;

    const roomId = roomIdRef.current;
    const payload = {
      roomId,
      senderId: user.id,
      receiverId,
      text: input.trim(),
    };

    // Optimistically add the message to UI immediately
    setMessages((prev) => [
      ...prev,
      {
        ...payload,
        createdAt: new Date().toISOString(),
      },
    ]);

    socketRef.current.emit("send_message", payload);
    setInput("");
  };

  if (!receiverId) {
    return (
      <main className="flex items-center justify-center h-[80vh] text-slate-300">
        Invalid chat session.
      </main>
    );
  }

  return (
    <main className="flex flex-col h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] mx-auto max-w-4xl px-4 py-4">
      <header className="mb-3 border-b border-slate-800 pb-2">
        <h1 className="text-lg font-semibold text-white">Chat</h1>
        <p className="text-xs text-slate-400">
          You're now connected. Coordinate your SkillBarter session here.
        </p>
      </header>

      {error && (
        <div className="mb-2 rounded-md bg-red-900/40 border border-red-500 text-red-100 px-3 py-1.5 text-xs">
          {error}
        </div>
      )}

      <section className="flex-1 min-h-0 mb-3">
        <div className="h-full rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col">
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5">
            {loadingHistory && (
              <p className="text-xs text-slate-400">Loading conversation...</p>
            )}

            {!loadingHistory && messages.length === 0 && !error && (
              <p className="text-xs text-slate-500">
                No messages yet. Say hi and propose how to structure your
                barter!
              </p>
            )}

            {messages.map((msg) => {
              const isMine = msg.senderId === user?.id;
              return (
                <div
                  key={
                    msg._id ||
                    `${msg.senderId}-${msg.createdAt}-${Math.random()}`
                  }
                  className={`flex w-full ${isMine ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-3 py-1.5 text-xs md:text-sm ${isMine
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-slate-800 text-slate-100 rounded-bl-sm"
                      }`}
                  >
                    <p>{msg.text}</p>
                    {msg.createdAt && (
                      <span className="mt-0.5 block text-[10px] opacity-70 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSend}
            className="border-t border-slate-800 px-3 py-2 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-xs md:text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs md:text-sm font-medium text-white disabled:opacity-60"
              disabled={!input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Chat;
