import { FiMessageCircle } from "react-icons/fi";

export const metadata = { title: "Chats" };

/** Right pane when no chat is open (desktop only: on mobile the list fills the screen). */
export default function Page() {
  return (
    <div className="chat-wallpaper flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex size-20 items-center justify-center rounded-full bg-card text-3xl text-main-color shadow-md">
        <FiMessageCircle />
      </span>
      <h2 className="text-xl font-bold text-foreground">Your conversations</h2>
      <p className="max-w-sm text-sm text-muted-foreground">
        Select a chat from the list. A new one starts when an identity request is accepted.
      </p>
    </div>
  );
}
