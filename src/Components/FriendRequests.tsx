"use client"

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import axios from "axios";
import { Check, UserPlus, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface IFriendRequestsProps {
    incomingFriendRequests: IncomingFriendRequest[]
    sessionId: string
}

const FriendRequests: React.FunctionComponent<IFriendRequestsProps> = ({
    incomingFriendRequests,
    sessionId
}) => {

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))

        const friendRequestHandler = ({ senderId, senderEmail, senderImage, senderName }: IncomingFriendRequest) => {
            setFriendRequests((prev) => [...prev, { senderId, senderEmail, senderImage, senderName }])
        }

        pusherClient.bind("incoming_friend_requests", friendRequestHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
            pusherClient.unbind("incoming_friend_requests", friendRequestHandler)
        }
    }, [sessionId])

    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(incomingFriendRequests)

    const router = useRouter();

    const acceptFriend = async (senderId: string) => {
        await axios.post('/api/friends/accept', { id: senderId })
        setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId))
        router.refresh()
    }

    const denyFriend = async (senderId: string) => {
        await axios.post('/api/friends/deny', { id: senderId })
        setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId))
        router.refresh()
    }

    return <>
        <h1 className="md:hidden font-bold text-slate-200 text-4xl mb-8 text-center">Friend Requests</h1>
        <ul role="list" className="flex flex-col items-center divide-y divide-gray-100 w-full">

            {friendRequests.length === 0 ? (
                <p className="text-lg text-zinc-500">Nothing to show here...</p>
            ) : (
                friendRequests.map((request) => (
                    <li key={request.senderEmail} className="flex justify-between gap-x-6 py-5 w-full max-w-2xl">
                        <div className="flex w-full gap-x-4">
                            <Image className="h-12 w-12 flex-none rounded-full bg-gray-50" src={request.senderImage} alt="" height={720} width={720}/>
                            <div className="min-w-0 flex-auto">
                                <p className="text-base font-semibold leading-6 text-slate-200">{request.senderName}</p>
                                <p className="mt-1 truncate text-sm leading-5 text-gray-300">{request.senderEmail}</p>
                            </div>
                        </div>
                        <div className="flex gap-x-4">
                            <button onClick={() => acceptFriend(request.senderId)} aria-label="accept friend" className="w-8 h-8 bg-indigo-700 hover:bg-indigo-600 grid place-items-center rounded-full transition hover:shadow-md">
                                <Check className="font-semibold text-white w-3/4 h-3/4" />
                            </button>
                            <button onClick={() => denyFriend(request.senderId)} aria-label="deny friend" className="w-8 h-8 bg-red-700 hover:bg-red-600 grid place-items-center rounded-full transition hover:shadow-md">
                                <X className="font-semibold text-white w-3/4 h-3/4" />
                            </button>
                        </div>
                    </li>
                ))
            )}
        </ul></>
};

export default FriendRequests;
