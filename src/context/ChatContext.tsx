import { createContext, useContext, useState, useCallback } from "react";
import { Message, Profile } from "../../database.types";
import { fetchProfile } from "../api/profile";

interface ChatContextProps {
  profiles: Record<string, Profile>;
  setProfiles: (profiles: Record<string, Profile>) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  loadProfileCache: (profileId: string) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [messages, setMessages] = useState<Message[]>([]);

  const loadProfileCache = useCallback(
    async (profileId: string) => {
      if (!profiles[profileId]) {
        const profile = await fetchProfile(profileId);
        if (profile) {
          setProfiles((prevProfiles) => ({
            ...prevProfiles,
            [profileId]: profile,
          }));
        }
      }
    },
    [profiles]
  );

  return (
    <ChatContext.Provider
      value={{ profiles, setProfiles, messages, setMessages, loadProfileCache }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context)
    throw new Error("useChatContext must be used within a ChatProvider");
  return context;
}
