import { useEffect } from "react";
import { useChatContext } from "../context/ChatContext";
import { supabase } from "../supabase/supabaseClient";
import { Message } from "../../database.types";

export function useMessageSubscription() {
  const { setMessages, messages, loadProfileCache } = useChatContext();

  useEffect(() => {
    const subscription = supabase
      .channel("*")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          if (payload) {
            const newMessage = payload.new as Message;
            loadProfileCache(newMessage.profile_id!);
            setMessages([...messages, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [setMessages, loadProfileCache, messages]);
}
