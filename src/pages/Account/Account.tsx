import { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Avatar from "./Avatar/Avatar";

import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import { AccountFormValues, accountSchema } from "./interfaces";
import { fetchProfile, updateProfile } from "../../api/profile";
const noop = () => {};
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

  async function getProfile() {
    throw new Error("Not implemented");
  }

  async function updateAccount(values: AccountFormValues) {
    throw new Error("Not implemented");
  }

  return (
    <form onSubmit={handleSubmit(updateAccount)}>
      <Avatar
        url={avatarUrl || null}
        size={150}
        onUpload={(_, url) => noop()}
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
        <input id="website" type="url" />
      </div>

      <div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Loading ..." : "Update"}
        </button>
      </div>

      <div>
        <button type="button" onClick={noop}>
          Sign Out
        </button>
      </div>
    </form>
  );
}
