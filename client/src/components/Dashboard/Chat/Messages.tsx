import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { DateTime } from "luxon";
import { socket } from "../../../SocketClient";
import TypingDots from "./TypingDots";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";
import { addNewContact } from "../../../features/contact/contactSlice";

interface PopulateMessageType {
  id: number | null;
  isYours: boolean;
  displayName: string | null;
  content: string | React.ReactNode;
  createdAt: string | null;
  addContact: MouseEventHandler<SVGSVGElement> | null;
}

const Messages = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const contacts = useAppSelector((state) => state.contact.contacts);
  const messages = useAppSelector((state) => state.message.messages);
  const [othersAreTyping, setOthersAreTyping] = useState(false);
  const [contactsTypingDisplayNames, setContactsTypingDisplayNames] = useState<
    string[]
  >([]);

  let newestMessage: boolean | null = null;

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (newestMessage && ref.current)
      ref.current?.scrollIntoView({ behavior: "smooth" });

    setOthersAreTyping(false);
  }, [messages]);

  useEffect(() => {
    if (othersAreTyping) ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [othersAreTyping]);

  useEffect(() => {
    if (socket) {
      let debounceTimer: ReturnType<typeof setTimeout>;
      socket.on("receive_typing", (data) => {
        if (!othersAreTyping) {
          setOthersAreTyping(true);

          const contact = contacts.find((c) => c.id === data.sender_id);

          let displayName: string;

          if (contact) {
            displayName = contact.display_name;
          } else {
            const unknownUsersCount =
              contactsTypingDisplayNames.filter((n) =>
                n.startsWith("Unknown User")
              ).length + 1;

            displayName = `Unknown User ${unknownUsersCount}`;
          }

          setContactsTypingDisplayNames((prev) =>
            [...prev, displayName].filter((c, i, a) => c !== a[i - 1])
          );

          if (debounceTimer) {
            clearTimeout(debounceTimer);
          }

          debounceTimer = setTimeout(() => {
            setOthersAreTyping(false);
          }, 1000); //
        }
      });
    }
  }, [socket.id]);

  const addUnknownToContact = async (contactId) => {
    try {
      const action = await dispatch(addNewContact({ displayName }));

      if (addNewContact.rejected.match(action)) {
        const error = action.payload as { message?: string };

        if (error && "message" in error) {
          setErrMsg(error.message);
          setWarningDialogIsOpen(true);
          return;
        }
        console.error("An unknown error occurred.");
        setErrMsg("An unknown error occurred.");
      }
    } catch (error) {
      console.error("An error occurred while dispatching signInUser:", error);
    }
  };

  const populateMessage = ({
    id,
    isYours,
    displayName,
    content,
    createdAt,
    addContact,
  }: PopulateMessageType) => {
    const today = DateTime.now().toFormat("D");
    const yesterday = DateTime.now().minus({ days: 1 }).toFormat("D");

    let modifiedCreatedAtDate, modifiedCreatedAtTime, modifiedCreatedAtDateTime;

    if (createdAt) {
      modifiedCreatedAtDate = DateTime.fromISO(createdAt).toFormat("D");
      modifiedCreatedAtTime = DateTime.fromISO(createdAt).toFormat("t");
      modifiedCreatedAtDateTime =
        DateTime.fromISO(createdAt).toFormat("LLL d', ' t");
    }

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
        {isYours ? null : (
          <div className="chat-header">
            {displayName}
            {displayName === "Unknown User" && (
              <div className="tooltip" data-tip="Add Contact">
                {" "}
                <button>
                  <FontAwesomeIcon
                    icon={faUserPlus}
                    className="w-3 h-3 ml-1"
                    onClick={() => {
                      if (addContact) addContact;
                    }}
                  />
                </button>
              </div>
            )}
          </div>
        )}
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
            addContact: null,
          });
        }

        if (contacts.some((contact) => contact.id !== message.sender_id)) {
          return populateMessage({
            id: i,
            isYours: false,
            displayName: "Unknown User",
            content: message.content,
            createdAt: message.created_at,
            addContact: addUnknownToContact(message.sender_id),
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
            addContact: null,
          });
        }
      })}
      {othersAreTyping &&
        populateMessage({
          id: null,
          isYours: false,
          displayName: contactsTypingDisplayNames.join(", "),
          content: <TypingDots />,
          createdAt: null,
          addContact: null,
        })}
    </>
  );
};

export default Messages;
