import React, { useState, useEffect, useRef } from 'react';
import { messagesApi } from '../../api/messagesApi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { FiSend, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

export const OrderChatBox = ({ orderId }) => {
  const { user } = useAuth();
  const { fetchNotifications } = useNotifications();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const chatContainerRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const data = await messagesApi.getOrderMessages(orderId, { size: 50 });
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to load order messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll chat every 8 seconds for responsive peer messaging
    const interval = setInterval(fetchMessages, 8000);
    return () => clearInterval(interval);
  }, [orderId]);

  // Scroll ONLY the inner chat messages container, never scrolling the browser window
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      setSending(true);
      const newMsg = await messagesApi.sendMessage(orderId, inputText.trim());
      setMessages((prev) => [...prev, newMsg]);
      setInputText('');
      fetchNotifications(true);
    } catch (err) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 shadow-sm flex flex-col h-[480px]">
      {/* Chat Header */}
      <div className="p-4 border-b border-base-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
            <FiMessageSquare />
          </div>
          <div>
            <h4 className="font-bold text-sm text-neutral">Order Discussion Room</h4>
            <span className="text-[10px] text-base-content/60">
              Only buyer and seller can see these messages
            </span>
          </div>
        </div>
        <span className="badge badge-success badge-xs font-semibold">Active</span>
      </div>

      {/* Messages Scroll Area */}
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-base-200/30">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <span className="loading loading-spinner text-primary"></span>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-base-content/50 space-y-1">
            <FiMessageSquare className="w-8 h-8 stroke-1 text-base-content/30" />
            <p className="text-xs">No messages in this order yet.</p>
            <p className="text-[11px] text-base-content/40">Say hello or share project updates below!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div
                key={msg.id}
                className={`chat ${isMe ? 'chat-end' : 'chat-start'}`}
              >
                <div className="chat-header text-[10px] opacity-50 mb-0.5">
                  {isMe ? 'You' : 'Peer'} •{' '}
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <div
                  className={`chat-bubble text-xs py-2 px-3.5 leading-relaxed rounded-2xl ${
                    isMe
                      ? 'chat-bubble-primary text-white font-medium shadow-xs'
                      : 'bg-base-100 text-neutral border border-base-300 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSendMessage} className="p-3 bg-base-100 border-t border-base-200 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message or project note..."
          className="input input-sm input-bordered flex-1 rounded-xl text-xs bg-base-200/50 focus:bg-base-100"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !inputText.trim()}
          className="btn btn-primary btn-sm btn-circle shrink-0 text-white"
        >
          {sending ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <FiSend className="w-3.5 h-3.5" />
          )}
        </button>
      </form>
    </div>
  );
};
