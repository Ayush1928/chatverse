import { fetchRedis } from "@/app/helpers/redis";
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/add-friends"
import { getServerSession } from "next-auth";
import { sendError } from "next/dist/server/api-utils";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email: emailToAdd } = addFriendValidator.parse(body.email)
        const idToAdd = await fetchRedis("get",`user:email:${emailToAdd}`) as string

        //Checking if the id to be axists or not.
        if (!idToAdd) {
            return new Response("This person does not exist.", { status: 400 })
        }

        //Checking if the session exists or not.
        const session = await getServerSession(authOptions)

        if (!session) {
            return new Response("Unauthorised", { status: 401 })
        }

        //Checking if the user is sending friend request to itself.
        if (idToAdd === session.user.id) {
            return new Response("You cannot add yourself as a friend", { status: 400 })
        }

        //Checking if the friend request is already sent.
        const isAlreadyAdded = await fetchRedis('sismember', `user:${idToAdd}:incoming_friend_requests`, session.user.id) as 0 | 1

        if (isAlreadyAdded) {
            return new Response('Already added this user.')
        }

        //Checking if they are already friends.
        const isAlreadyFriends = await fetchRedis('sismember', `user:${idToAdd}:friends`, idToAdd) as 0 | 1

        if (isAlreadyFriends) {
            return new Response('Already Friends.')
        }

        //Sending friend request

        pusherServer.trigger(toPusherKey(`user:${idToAdd}:incoming_friend_requests`),"incoming_friend_requests",{
            senderName: session.user.name,
            senderImage: session.user.image,
            senderId: session.user.id,
            senderEmail: session.user.email,
        })

        db.sadd(`user:${idToAdd}:incoming_friend_requests`,session.user.id);

        return new Response('ok');

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response('Invalid request payload',{status: 422});
        }

        return new Response('Invalid Request',{status: 400})
    }
}