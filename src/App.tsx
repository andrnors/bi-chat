import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import Account from "./pages/Account/Account";
import SignIn from "./pages/SignIn/SignIn";
import { supabase } from "./supabase/supabaseClient";

import { Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat/Chat";
import { ChatProvider } from "./context/ChatContext";

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      <nav>
        <ul>
          {session && (
            <>
              <li>
                <a href="/">Chat</a>
              </li>
              <li>
                <a href="/account">Account</a>
              </li>
              <li>
                <button onClick={() => supabase.auth.signOut()}>
                  Sign out
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>

      <Routes>
        {!session ? (
          <Route path="/sign-in" element={<SignIn />} />
        ) : (
          <>
            <Route
              path="/account"
              element={<Account key={session.user.id} session={session} />}
            />
            <Route
              path="/"
              element={
                <ChatProvider>
                  <Chat session={session} />
                </ChatProvider>
              }
            />
          </>
        )}
      </Routes>
    </>
  );
}

export default App;
