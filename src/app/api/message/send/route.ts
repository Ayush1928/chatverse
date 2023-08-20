import { fetchRedis } from "@/app/helpers/redis";
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db";
import { Message, messageValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth"
import { nanoid } from "nanoid";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
export async function POST(req: Request) {
    try {
        const { text, chatId }: { text: string, chatId: string } = await req.json();
        const session = await getServerSession(authOptions);

        //Check if the session exists or not.
        if (!session) return new Response('Unauthorised', { status: 401 })

        const [userId1, userId2] = chatId.split("--")

        //User authorised or not.
        if (session.user.id !== userId1 && session.user.id !== userId2) {
            return new Response('Unauthorised', { status: 401 })
        }

        //Verifying if the sender is in the friend list of the user. 
        const friendId = session.user.id === userId1 ? userId2 : userId1

        const friendList = await fetchRedis("smembers", `user:${session.user.id}:friends`) as string[]

        const isFriend = friendList.includes(friendId)

        if (!isFriend) {
            return new Response('Unauthorised', { status: 401 })
        }

        //Fetching sender's info
        const rawSender = await fetchRedis("get", `user:${session.user.id}`) as string
        const sender = JSON.parse(rawSender) as User

        const timestamp = Date.now()
        const messageData: Message = {
            id: nanoid(),
            senderId: session.user.id,
            text,
            timestamp,
        }

        const message = messageValidator.parse(messageData)

        //Notifying all the user subscribed to the chatId 
        pusherServer.trigger(toPusherKey(`chat:${chatId}`),"incoming-message",message)

        pusherServer.trigger(toPusherKey(`user:${friendId}:chats`),"new_message",{
            ...message,
            senderImg: sender.image,
            senderName: sender.name
        })

        //After all this checks message will be sent.
        await db.zadd(`chat:${chatId}:messages`, {
            score: timestamp,
            member: JSON.stringify(message)
        })

        return new Response("Ok")

    } catch (error) {
        if(error instanceof Error){
            return new Response(error.message)
        }

        return new Response("Internal server error", {status: 500})
    }
}