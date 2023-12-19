import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../../SocketClient";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addNewContact } from "../../../features/contact/contactSlice";
import ConfirmationDialog from "../../Reusable/ConfirmationDialog";
import TypingDots from "./TypingDots";

interface PopulateMessageType {
  id: number | null;
  isYours: boolean;
  displayName: string | null;
  content: string | React.ReactNode;
  createdAt: string | null;
  contactDisplayName: string | null;
}

const Messages = () => {
  // Global states in Redux
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const contacts = useAppSelector((state) => state.contact.contacts);
  const messages = useAppSelector((state) => state.message.messages);

  // Local states & refs & variables
  const [othersAreTyping, setOthersAreTyping] = useState(false);
  const [contactsTypingDisplayNames, setContactsTypingDisplayNames] = useState<
    string[]
  >([]);
  const [unknownContactDisplayName, setUnknownContactDisplayName] = useState<
    string | null
  >(null);
  const [confirmationDialogIsOpen, setConfirmationDialogIsOpen] =
    useState(false);
  const ref = useRef<HTMLDivElement>(null);
  let newestMessage: boolean | null = null;

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

  const addUnknownToContact = async (contactDisplayName: string) => {
    try {
      const action = await dispatch(
        addNewContact({ displayName: contactDisplayName })
      );
      if (addNewContact.rejected.match(action)) {
        const error = action.payload as { message?: string };
        if (error && "message" in error) throw error;
      }
    } catch (error) {
      console.error(
        "An error occurred while dispatching addNewContact:",
        error
      );
    }

    setConfirmationDialogIsOpen(false);
    return;
  };

  const sendNewContactSignal = (contactDisplayName: string) => {
    if (socket && contactDisplayName && user.display_name && user.id) {
      socket.emit("send_new_contact", {
        contact_display_name: contactDisplayName,
        sender_display_name: user.display_name,
        sender_id: user.id,
      });
    }
  };

  const populateMessage = ({
    id,
    isYours,
    displayName,
    content,
    createdAt,
    contactDisplayName,
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
                <button
                  onClick={() => {
                    if (contactDisplayName)
                      setUnknownContactDisplayName(contactDisplayName);
                    setConfirmationDialogIsOpen(true);
                  }}
                >
                  <FontAwesomeIcon icon={faUserPlus} className="w-3 h-3 ml-1" />
                </button>
              </div>
            )}
          </div>
        )}
        <div
          className={`chat-bubble px-2.5 py-1.5 min-h-min ${
            isYours ? "bg-base-300" : "chat-bubble-accent"
          }`}
        >
          {content}
        </div>
        <div className="chat-footer opacity-75">
          <time className="text-xs opacity-75">{displayCreatedAt}</time>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="grow invisible"></div>
      {messages.map((message, i) => {
        newestMessage = messages.length - 1 === i;

        // Messages from you
        if (message.sender_display_name === user.display_name) {
          return populateMessage({
            id: i,
            isYours: true,
            displayName: null,
            content: message.content,
            createdAt: message.created_at,
            contactDisplayName: null,
          });
        }

        // Mesasges from your contacts
        if (
          contacts.some(
            (contact) => contact.display_name === message.sender_display_name
          )
        ) {
          return populateMessage({
            id: i,
            isYours: false,
            displayName: message.sender_display_name,
            content: message.content,
            createdAt: message.created_at,
            contactDisplayName: null,
          });
        }

        // Messages from deleted users
        if (message.sender_display_name === null) {
          return populateMessage({
            id: i,
            isYours: false,
            displayName: "Deleted User",
            content: message.content,
            createdAt: message.created_at,
            contactDisplayName: null,
          });
        }

        // Messages from unknown users
        return populateMessage({
          id: i,
          isYours: false,
          displayName: "Unknown User",
          content: message.content,
          createdAt: message.created_at,
          contactDisplayName: message.sender_display_name,
        });
      })}

      {/* Typing Signal */}
      {othersAreTyping &&
        populateMessage({
          id: null,
          isYours: false,
          displayName: contactsTypingDisplayNames.join(", "),
          content: <TypingDots />,
          createdAt: null,
          contactDisplayName: null,
        })}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmationDialogIsOpen}
        onConfirm={() => {
          if (unknownContactDisplayName) {
            addUnknownToContact(unknownContactDisplayName);
            sendNewContactSignal(unknownContactDisplayName);
          }
          setUnknownContactDisplayName(null);
        }}
        onCancel={() => setConfirmationDialogIsOpen(false)}
        text={`Are you sure you want to add this person as a new contact?`}
      />
    </>
  );
};

export default Messages;
