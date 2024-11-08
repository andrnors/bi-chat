import { supabase } from "../../supabase/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

export default function SignIn() {
  return (
    <div>
      <div>
        <h1>Sign in to this amazing chat experience</h1>

        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
        ></Auth>
      </div>
    </div>
  );
}
