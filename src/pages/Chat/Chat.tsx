import { Session } from "@supabase/supabase-js";

import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";

import { Message, Profile } from "../../../database.types";
import { useChatContext } from "../../context/ChatContext";
import { sendMessage } from "../../api/messages";
import { useMessageSubscription } from "../../hooks/messageSubscriber";

export default function Chat({ session }: { session: Session }) {
  const { user } = session;
  const { profiles, setProfiles, messages, setMessages } = useChatContext();
  const [messageText, setMessageText] = useState<string>("");
  useMessageSubscription();

  useEffect(() => {
    async function fetchInitialMessages() {
      const { data: messages } = await supabase.from("messages").select("*");
      if (messages) {
        const profileIds = Array.from(
          new Set(messages.map((msg) => msg.profile_id))
        );
        const { data: profileCache } = await supabase
          .from("profiles")
          .select("*")
          .in("id", profileIds);

        if (profileCache) {
          const profilesById = profileCache.reduce((acc, profile) => {
            acc[profile.id] = profile;
            return acc;
          }, {} as Record<string, Profile>);

          setProfiles(profilesById);
        }

        setMessages(messages);
      }
    }
    fetchInitialMessages();
  }, []);

  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h1>Messages</h1>
      <div>
        {messages.map((m) => (
          <MessageBox
            userId={user.id}
            key={m.id}
            message={m}
            sender={profiles[m.profile_id!]?.username ?? "Not username"}
          />
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(user.id, messageText);
          setMessageText("");
        }}
      >
        <input
          type="text"
          placeholder="Enter your message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
type MessageBoxProps = {
  userId: string;
  message: Message;
  sender: string;
};

function MessageBox({ userId, message, sender }: MessageBoxProps): JSX.Element {
  return (
    <div>
      <p>{sender}</p>
      <p>{message?.profile_id}</p>
      <p>{message?.text}</p>
    </div>
  );
}
