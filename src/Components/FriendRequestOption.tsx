"use client"
import { pusherClient } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface IFriendRequestOptionProps {
    sessionId: string
    initialUnseenRequestCount: number
}

const FriendRequestOption: React.FunctionComponent<IFriendRequestOptionProps> = ({ initialUnseenRequestCount, sessionId }) => {

    const [unseenRequestCount, setUnseenRequestCount] = useState<number>(initialUnseenRequestCount)

    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))

        const friendRequestHandler = () => {
            setUnseenRequestCount((prev) => prev + 1)
        }

        const addedFriendHandler = () => {
            setUnseenRequestCount((prev) => prev - 1)
        }

        pusherClient.bind("incoming_friend_requests", friendRequestHandler)
        pusherClient.bind("new_friend", addedFriendHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

            pusherClient.unbind("incoming_friend_requests", friendRequestHandler)
            pusherClient.unbind("new_friend", addedFriendHandler)
        }
    }, [sessionId])

    return <Link href="/dashboard/requests" className='text-slate-200 hover:bg-slate-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
        <div className='text-slate-900 border-slate-200 group-hover:border-indigo-900 group-hover:text-indigo-900 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-slate-200'>
            <User className='h-4 w-4 text-slate-900 group-hover:border-indigo-900 group-hover:text-indigo-900' />
        </div>
        <p className="truncate">Friend Requests</p>
        {unseenRequestCount > 0 ? (
            <div className='bg-white font-medium text-xs w-5 h-5 p-[0.625rem] rounded-lg flex justify-center items-center opacity-70 text-indigo-900 ml-auto'>{unseenRequestCount}</div>) : null}
    </Link>;
};

export default FriendRequestOption;
