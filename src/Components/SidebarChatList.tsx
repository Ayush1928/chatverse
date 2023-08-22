"use client"

import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, cname, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import UnseenChatToast from "./UnseenChatToast";
import Image from "next/image";
import Link from "next/link";
import { Session } from "next-auth";
import { fetchRedis } from "@/app/helpers/redis";
import { FriendsWithLastMessage } from "@/types/type";

interface ISidebarChatListProps {
  friends: User[]
  session: Session
  friendsWithLastMessage: FriendsWithLastMessage[]
}

interface ExtendedMessage extends Message {
  senderImg: string
  senderName: string
}

const SidebarChatList: React.FunctionComponent<ISidebarChatListProps> = ({ friends, session, friendsWithLastMessage }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [friendId, setFriendId] = useState<string>("")
  const [activeChats, setActiveChats] = useState<User[]>(friends)

  useEffect(() => {
    if (pathname !== null) {
      const ids = pathname.split('--');
      if (ids.length > 1) {
        const friendId = ids[1];
        setFriendId(friendId)
      }
    }
  }, [pathname]);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${session.user.id}:chats`))
    pusherClient.subscribe(toPusherKey(`user:${session.user.id}:friends`))

    const newFriendHandler = (newFriend: User) => {
      setActiveChats((prev) => [...prev, newFriend])
    }

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify = pathname !== `/dashboard/chat/${chatHrefConstructor(session.user.id, message.senderId)}`
      if (!shouldNotify) return


      toast.custom((t) => (
        <UnseenChatToast t={t} sessionId={session.user.id} senderId={message.senderId} senderImg={message.senderImg} senderMessage={message.text} senderName={message.senderName} />
      ))

      setUnseenMessages((prev) => [...prev, message])
    }

    pusherClient.bind("new_message", chatHandler)
    pusherClient.bind("new_friend", newFriendHandler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${session.user.id}:chats`))
      pusherClient.unsubscribe(toPusherKey(`user:${session.user.id}:friends`))

      pusherClient.unbind("new_message", chatHandler)
      pusherClient.unbind("new_friend", newFriendHandler)
    }
  }, [pathname, session.user.id, router])

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId))
      })
    }
  }, [pathname])

  return <ul role="list" className='max-h-[25] overflow-y-auto -mx-2 space-y-1 rounded-md'>
    {activeChats.sort().map((friend, index) => {
      const unseenMessageCount = unseenMessages.filter((unseenMsg) => {
        return unseenMsg.senderId === friend.id
      }).length
      const isChatOpened = friendId === friend.id;
      const lastMessage = friendsWithLastMessage[index].lastMessage?.text as string
      const truncatedLastMessage = lastMessage && lastMessage.length > 35
        ? lastMessage.slice(0, 35) + "..."
        : lastMessage;

      return <li key={friend.id}>
        <Link href={`/dashboard/chat/${chatHrefConstructor(session.user.id, friend.id)}`} className={cname("text-slate-200 group flex items-center gap-x-3 rounded-md p-2 text-md leading-6 font-semibold border-2 border-slate-900 hover:border-indigo-700", {
          "bg-indigo-700": isChatOpened,
          "bg-slate-900": !isChatOpened
        })}>
          <div className="relative h-9 w-9 bg-slate-900 rounded-full">
            <Image
              fill
              referrerPolicy="no-referrer"
              className="rounded-full" src={friend.image || ''} alt="Profile Picture" />
          </div>
          <div className="relative flex flex-col">
            <div className="font-medium">
              {friend.name}
            </div>
            <div className="text-xs text-slate-400">
              {truncatedLastMessage ? (
                <span>{truncatedLastMessage}</span>
              ) : null}
            </div>
          </div>
          {unseenMessageCount > 0 ? (
            <div className='bg-white font-medium text-xs w-6 h-6 p-[0.625rem] rounded-lg flex justify-center items-center opacity-70 text-indigo-900 ml-auto'>{unseenMessageCount}</div>) : null}
        </Link>
      </li>
    })}
  </ul>;
};

export default SidebarChatList;
