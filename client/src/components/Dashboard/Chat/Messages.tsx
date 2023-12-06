import { useEffect, useRef } from "react";
import { useAppSelector } from "../../../app/hooks";
import { DateTime } from "luxon";

interface PopulateMessageType {
  id: number;
  isYours: boolean;
  displayName: string | null;
  content: string;
  createdAt: string;
}

const Messages = () => {
  const user = useAppSelector((state) => state.user.user);
  const contacts = useAppSelector((state) => state.contact.contacts);
  const messages = useAppSelector((state) => state.message.messages);
  let newestMessage: boolean | null = null

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newestMessage && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const populateMessage = ({
    id,
    isYours,
    displayName,
    content,
    createdAt,
  }: PopulateMessageType) => {
    const today = DateTime.now().toFormat("D");
    const yesterday = DateTime.now().minus({ days: 1 }).toFormat("D");
    const modifiedCreatedAtDate = DateTime.fromISO(createdAt).toFormat("D");
    const modifiedCreatedAtTime = DateTime.fromISO(createdAt).toFormat("t");
    const modifiedCreatedAtDateTime =
      DateTime.fromISO(createdAt).toFormat("LLL d', ' t");

    let displayCreatedAt;

    if (modifiedCreatedAtDate == today) {
      displayCreatedAt = modifiedCreatedAtTime;
    } else if (modifiedCreatedAtDate == yesterday) {
      displayCreatedAt = `yesterday, ${modifiedCreatedAtTime}`;
    } else displayCreatedAt = modifiedCreatedAtDateTime;

    return (
      <div
        key={`${id}`}
        className={`chat ${isYours ? "chat-end" : "chat-start"}`}
        ref={ref}
      >
        {isYours ? null : <div className="chat-header">{displayName}</div>}
        <div
          className={`chat-bubble px-2.5 py-1.5 min-h-min ${
            isYours ? "" : "chat-bubble-accent"
          }`}
        >
          {content}
        </div>
        <div className="chat-footer opacity-50">
          <time className="text-xs opacity-50">{displayCreatedAt}</time>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grow invisible"></div>
      {messages.map((message, i) => {
        newestMessage = messages.length - 1 === i;
        if (message.sender_id === user.id) {
          return populateMessage({
            id: i,
            isYours: true,
            displayName: null,
            content: message.content,
            createdAt: message.created_at,
          });
        }

        if (contacts.some((contact) => contact.id !== message.sender_id)) {
          return populateMessage({
            id: i,
            isYours: false,
            displayName: "Unknown User",
            content: message.content,
            createdAt: message.created_at,
          });
        }

        if (contacts.some((contact) => contact.id === message.sender_id)) {
          const contactDisplayName = contacts.filter(
            (contact) => contact.id === message.sender_id
          )[0].display_name;
          return populateMessage({
            id: i,
            isYours: false,
            displayName: contactDisplayName,
            content: message.content,
            createdAt: message.created_at,
          });
        }
      })}
    </>
  );
};

export default Messages;
