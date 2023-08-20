"use client"

import { cname, toPusherKey } from "@/lib/utils";
import { Message } from "@/lib/validations/message";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";

interface IMessagesProps {
    initialMessages: Message[],
    sessionId: string,
    sessionImg: string | null | undefined,
    chatPartner: User
    chatId: string
}

const Messages: React.FunctionComponent<IMessagesProps> = ({ initialMessages, sessionId, sessionImg, chatPartner, chatId }) => {

    const [messages, setMessages] = useState<Message[]>(initialMessages)

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`chat:${chatId}`))

        const messageHandler = (message: Message) => {
            setMessages((prev) =>[message,...prev])
        }

        pusherClient.bind("incoming-message", messageHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`))
            pusherClient.unbind("incoming_message", messageHandler)
        }
    }, [chatId])


    const scrollDownRef = useRef<HTMLDivElement | null>(null)

    const formatTimestamp = (timestamp: number) => {
        return format(timestamp, "h:MM aa")
    }

    return <div id="messages" className="flex h-full flex-1 flex-col-reverse gap-2 p-3 px-[1.5rem] overflow-y-auto border-t border-slate-900 -mx-[1.5rem]">
        <div ref={scrollDownRef} />
        {messages.map((message, index) => {
            const isCurrentUser = message.senderId === sessionId
            const hasNextMessageFromSameUser = messages[index - 1]?.senderId === messages[index].senderId
            return <div className="chat-message" key={`${message.id}-${message.timestamp}`}>
                <div className={cname('flex items-end', {
                    'justify-end': isCurrentUser,
                })}>
                    <div className={cname("flex flex-col space-y-2 text-base max-w-xs mx-2", {
                        "order-1 items-end": isCurrentUser,
                        "order-2 items-start": !isCurrentUser,
                    })}>
                        <span className={cname("px-4 py-2 rounded-lg inline-block", {
                            "bg-indigo-700 text-slate-200": isCurrentUser,
                            "bg-gray-700 text-slate-200": !isCurrentUser,
                            "rounded-br-none": !hasNextMessageFromSameUser && isCurrentUser,
                            "rounded-bl-none": !hasNextMessageFromSameUser && !isCurrentUser
                        })}>{message.text}{" "}
                            <span className="ml-2 text-xs text-gray-400">
                                {formatTimestamp(message.timestamp)}
                            </span>
                        </span>
                    </div>
                    <div className={cname("relative w-6 h-6", {
                        'order-2': isCurrentUser,
                        'order-1': !isCurrentUser,
                        'invisible': hasNextMessageFromSameUser
                    })}>
                        <Image fill src={isCurrentUser ? sessionImg as string : chatPartner.image} alt="Profile Picture" referrerPolicy="no-referrer" className="rounded-full" />
                    </div>
                </div>
            </div>
        })}
    </div>;
};

export default Messages;
