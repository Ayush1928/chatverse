import FriendRequestOption from "@/Components/FriendRequestOption";
import { Icon, Icons } from "@/Components/Icons";
import MobileChatLayout from "@/Components/MobileChatLayout";
import SidebarChatList from "@/Components/SidebarChatList";
import SignOutButton from "@/Components/SignOutButton";
import { getFriendsByUserId } from "@/app/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/app/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { SidebarOptions } from "@/types/type";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

interface ILayoutProps {
    children: ReactNode
}

const sidebarOptions: SidebarOptions[] = [{
    id: 1,
    name: "Add Friend",
    href: "/dashboard/add",
    Icon: "UserPlus"
}]

const Layout = async ({ children }: ILayoutProps) => {
    const session = await getServerSession(authOptions);
    if (!session) {
        notFound();
    }

    const friends = await getFriendsByUserId(session.user.id) as User[]

    const friendsWithLastMessage = await Promise.all(
        friends.map(async (friend) => {
            const [lastMessageString] = await fetchRedis("zrange", `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`, -1, -1) as string[] | undefined[]

            let lastMessage = undefined

            if(lastMessageString){
                lastMessage = JSON.parse(lastMessageString) as Message
            }

            return {
                ...friend,
                lastMessage
            }
        })
    )

    const unseenRequestCount = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`) as User[]).length
    return (<div className="w-full flex h-screen">
        <div className="md:hidden">
            <MobileChatLayout friendsWithLastMessage={friendsWithLastMessage} friends={friends} session={session} sidebarOptions={sidebarOptions} unseenRequestCount={unseenRequestCount}/>
        </div>
        <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-950 bg-slate-900 px-6">
            <Link href="/dashboard" className="flex h-14 -mx-5 mt-2 -mb-4 shrink-0 items-center">
                <Icons.Logo className="h-12 w-auto text-indigo-700" />
            </Link>
            {friends.length > 0 ? (
                <div className="text-xs font-semibold leading-6 text-slate-300">
                    Chats
                </div>
            ) : null}
            <nav className="flex flex-col h-full">
                <ul role="list" className="flex flex-col gap-y-1 h-full">
                    <li>
                        <SidebarChatList session={session} friends={friends} friendsWithLastMessage={friendsWithLastMessage} />
                    </li>


                    <li className="mt-auto -mx-2 px-2 flex flex-col h-fit">
                        <div className="text-xs font-semibold leading-6 text-slate-300">Overview</div>
                        <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {sidebarOptions.map((option) => {
                                const Icon = Icons[option.Icon]
                                return (
                                    <li key={option.id}>
                                        <Link href={option.href} className="text-slate-200 hover:bg-slate-800 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold">
                                            <span className="bg-slate-200 text-slate-900 border-gray-200 group-hover:border-indigo-900 group-hover:text-indigo-900 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium">
                                                <Icon className="h-4 w-4" />
                                            </span>
                                            <span className="truncate">{option.name}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                            <li>
                                <FriendRequestOption sessionId={session.user.id} initialUnseenRequestCount={unseenRequestCount} />
                            </li>
                        </ul>
                        <div className="flex flex-1 items-center py-3 gap-x-4 text-sm font-semibold leading-6 text-white">
                            <div className="relative h-8 w-8 bg-slate-900">
                                <Image
                                    fill
                                    referrerPolicy="no-referrer"
                                    className="rounded-full" src={session.user.image || ''} alt="Profile Picture" />
                            </div>
                            <span className="sr-only">Your Profile</span>
                            <div className="flex flex-col">
                                <span aria-hidden="true">{session.user.name}</span>
                                <span className="text-xs text-slate-400" aria-hidden="true">
                                    {session.user.email}
                                </span>
                            </div>
                            <SignOutButton className="h-8 w-8 aspect-square text-slate-200 hover:bg-slate-800 hover:text-slate-200 px-0 ml-auto" />
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
        <aside className="max-h-screen container pb-1 w-full bg-slate-800">
            {children}
        </aside>
    </div>);
};

export default Layout;
