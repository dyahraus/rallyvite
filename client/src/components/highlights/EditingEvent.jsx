'use client';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import HolderPFP from '@/assets/9.png';
import ThumbsUp from '@/assets/24-ofcpy.PNG';
import Crying from '@/assets/23-ofcpy.PNG';
import Maybe from '@/assets/25-ofcpy.PNG';
import { useSelector } from 'react-redux';

const attendanceEmoji = {
  yes: ThumbsUp,
  maybe: Maybe,
  no: Crying,
};

export default function EditingEvent({ event, onClose }) {
  const { data: currentUser, loading: userLoading } = useSelector(
    (state) => state.user
  );
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    async function fetchMessages() {
      if (!event?.id) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`/api/chats/event/${event.id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();

        // Transform the backend data to match frontend format
        const transformedMessages = data.map((message) => ({
          id: message.id,
          sender: {
            id: message.user_uuid,
            name: message.user_nick_name || message.user_name,
            profilePic: message.user_profile_picture_url || HolderPFP,
          },
          message: message.content,
          type: message.image_url ? 'image' : 'text',
          imageUrl: message.image_url,
          timestamp: new Date(message.created_at),
        }));

        setMessages(transformedMessages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();
  }, [event?.id]);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Create a preview URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage({ file, preview: imageUrl });
    }
  };

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !selectedImage) || isSending) return;

    try {
      setIsSending(true);
      let imageUrl = null;

      // If there's an image, upload it first
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage.file);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      // Send the message
      const response = await fetch('/api/chats/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_uuid: event.id,
          content: newMessage.trim(),
          image_url: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const newMessageData = await response.json();

      // Add the new message to the local state
      setMessages((prev) => [
        ...prev,
        {
          id: newMessageData.id,
          sender: {
            id: newMessageData.user_uuid,
            name: currentUser.nick_name || currentUser.name,
            profilePic: currentUser.profile_picture_url || HolderPFP,
          },
          message: newMessageData.content,
          type: newMessageData.image_url ? 'image' : 'text',
          imageUrl: newMessageData.image_url,
          timestamp: new Date(newMessageData.created_at),
        },
      ]);

      // Clear the input and selected image
      setNewMessage('');
      setSelectedImage(null);
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!event) return null;

  return (
    <div className="flex flex-col w-full max-w-2xl h-full">
      {/* Event Header */}
      <div className="text-center">
        <div className="font-semibold">{event.date}</div>
        <div className="text-sm font-medium">{event.time}</div>
        <div className="mt-2 font-bold text-lg">{event.name}</div>
        <div className="text-sm font-medium">{event.location}</div>
      </div>

      {/* Attendees Row */}
      <div className="w-full overflow-x-auto mt-4">
        <div className="flex justify-center space-x-2 w-max mx-auto px-2">
          {event.users.map((user) => (
            <div
              key={user.id}
              className="relative flex-shrink-0 w-12 h-12 rounded-full border-2 border-blue-500"
            >
              <Image
                src={user.profilePic}
                alt="User"
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
              <span className="absolute -top-1 -right-1 text-lg">
                <Image
                  src={attendanceEmoji[user.status]}
                  width={30}
                  height={30}
                  alt="status"
                />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 mt-4">
        {isLoading ? (
          <div className="text-center py-4">
            <p>Loading messages...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4">
            <p className="text-red-500">{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = currentUser?.id === message.sender.id;

            return (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Image
                  src={message.sender.profilePic}
                  alt={message.sender.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div
                  className={`max-w-[70%] rounded-2xl p-3 ${
                    isCurrentUser ? 'bg-rallyYellow' : 'bg-rallyBlue text-white'
                  }`}
                >
                  {message.type === 'image' ? (
                    <Image
                      src={message.imageUrl}
                      alt="Shared image"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  ) : (
                    <p>{message.message}</p>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="mt-4 px-4 pb-4">
        {selectedImage && (
          <div className="relative mb-2 inline-block">
            <Image
              src={selectedImage.preview}
              alt="Selected"
              width={100}
              height={100}
              className="rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={(!newMessage.trim() && !selectedImage) || isSending}
            className={`p-2 rounded-full ${
              (!newMessage.trim() && !selectedImage) || isSending
                ? 'text-gray-400'
                : 'text-rallyBlue hover:bg-rallyBlue hover:text-white'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
