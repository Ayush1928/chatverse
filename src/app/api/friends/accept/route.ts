import { fetchRedis } from "@/app/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const { id: idToAdd } = z.object({ id: z.string() }).parse(body)

        const session = await getServerSession(authOptions);

        //Checking if the session exists.
        if (!session) {
            return new Response("Unauthorised", { status: 401 })
        }

        //Checking if they are already friends.
        const isAlreadyFriend = await fetchRedis("sismember", `user:${session.user.id}:friends`, idToAdd)

        if (isAlreadyFriend) {
            return new Response("Already Friends", { status: 400 })
        }

        //Checking if there is a friend request.
        const hasFriendRequest = await fetchRedis("sismember", `user:${session.user.id}:incoming_friend_requests`, idToAdd)

        if (!hasFriendRequest) {
            return new Response("No friend request", { status: 400 })
        }

        const [userRaw, friendRaw] = (await Promise.all([
            fetchRedis("get", `user:${session.user.id}`),
            fetchRedis("get", `user:${idToAdd}`)
        ])) as [string, string]

        const user = JSON.parse(userRaw) as User
        const friend = JSON.parse(friendRaw) as User

        //Notifying users ,Adding them to the friends set of each other and removing the friend request.
        await Promise.all([
            pusherServer.trigger(toPusherKey(`user:${idToAdd}:friends`), "new_friend", user),

            pusherServer.trigger(toPusherKey(`user:${session.user.id}:friends`), "new_friend", friend),

            await db.sadd(`user:${session.user.id}:friends`, idToAdd),

            await db.sadd(`user:${idToAdd}:friends`, session.user.id),

            await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd)
        ])

        return new Response("Ok", { status: 200 });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return new Response("Invalid request payload", { status: 422 });
        }
        return new Response("Invalid request", { status: 400 })
    }
}