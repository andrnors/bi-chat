import { Message } from "../../../../database.types";

type MessageBubleProps = {
  userId: string;
  message: Message;
  sender: string;
};

export default function MessageBuble({
  userId,
  message,
  reaction,
  sender,
}: MessageBubleProps): JSX.Element {
  return (
    <div>
      <p>{sender}</p>
      <p>{message?.profile_id}</p>
      <p>{message?.text}</p>
    </div>
  );
}
