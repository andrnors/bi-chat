import { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Avatar from "./Avatar/Avatar";
import { supabase } from "../../supabase/supabaseClient";

import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { AccountFormValues, accountSchema } from "./interfaces";
import { fetchProfile, updateProfile } from "../../api/profile";

type AccountProps = {
  session: Session;
};
export default function Account({ session }: AccountProps) {
  const { user } = session;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
  });
  const avatarUrl = watch("avatarUrl");

  useEffect(() => {
    async function getProfile() {
      const data = await fetchProfile(user.id);

      if (data) {
        setValue("username", data.username || "");
        setValue("website", data.website || "");
        setValue("avatarUrl", data.avatar_url || "");
      }
    }

    getProfile();
  }, [setValue, user.id]);

  async function updateAccount(values: AccountFormValues) {
    const { user } = session;
    const { error } = await updateProfile(values, user.id);

    if (error) {
      alert(error.message);
    }
  }

  return (
    <form onSubmit={handleSubmit(updateAccount)}>
      <Avatar
        url={avatarUrl || null}
        size={150}
        onUpload={(_, url) => setValue("avatarUrl", url)}
      />

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" type="text" value={session.user.email} disabled />
      </div>

      <div>
        <label htmlFor="username">Name</label>
        <input id="username" type="text" {...register("username")} />
        {errors.username && <p>{errors.username.message}</p>}
      </div>

      <div>
        <label htmlFor="website">Website</label>
        <input id="website" type="url" {...register("website")} />
        {errors.website && <p>{errors.website.message}</p>}
      </div>

      <div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button type="button" onClick={() => supabase.auth.signOut()}>
          Sign Out
        </button>
      </div>
    </form>
  );
}
