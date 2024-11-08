import { Session } from "@supabase/supabase-js";

import { useEffect, useState } from "react";
import { supabase } from "../../supabase/supabaseClient";

import { Profile } from "../../../database.types";
import { useChatContext } from "../../context/ChatContext";
import { sendMessage } from "../../api/messages";
import { useMessageSubscription } from "../../hooks/messageSubscriber";
import MessageBuble from "./MessageBuble/MessageBuble";
import { fetchProfiles } from "../../api/profile";

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
        const initialProfiles = await fetchProfiles(profileIds);

        if (initialProfiles) {
          const profilesById = initialProfiles.reduce((acc, profile) => {
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

  function send(e: React.FormEvent<HTMLFormElement>) {
    throw new Error("Not implemented");
  }

  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <h1>Messages</h1>
      <div>
        {messages.map((message) => (
          <MessageBuble
            key={message.id}
            userId={user.id}
            message={message}
            sender={profiles[message.profile_id!]?.username ?? "No username"}
          />
        ))}
      </div>
      <form onSubmit={send}>
        <input
          type="text"
          placeholder="Enter your message"
          value={"FIX ME"}
          onChange={(e) => console.log("FIX ME")}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
