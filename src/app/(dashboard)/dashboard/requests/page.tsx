import FriendRequests from "@/Components/FriendRequests";
import { fetchRedis } from "@/app/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

interface IpageProps {
}

const page = async () => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()

    const incomingSenderIds = (await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_requests`)) as string[]

    const incomingFriendRequest = await Promise.all(
        incomingSenderIds.map(async (senderId) => {
            const senderData = await fetchRedis("get", `user:${senderId}`);
            
            try {
                const sender = JSON.parse(senderData) as User;
                return {
                    senderId,
                    senderEmail: sender.email,
                    senderName: sender.name,
                    senderImage: sender.image
                };
            } catch (error) {
                console.error("Error parsing sender data: ", error);
                return {
                    senderId,
                    senderEmail: "Error Parsing Email",
                    senderName: "Error Parsing Name",
                    senderImage: "Error Parsing Image"
                };
            }
        })
    );

    return <main className="mt-28 md:mt-16 flex flex-col items-center">
        <h1 className="font-bold text-slate-200 text-4xl md:text-5xl mb-8 text-center">Friend Requests</h1>
        <div className="flex flex-col w-full">
            <FriendRequests incomingFriendRequests={incomingFriendRequest} sessionId={session.user.id}/>
        </div>
    </main>;
};

export default page;
