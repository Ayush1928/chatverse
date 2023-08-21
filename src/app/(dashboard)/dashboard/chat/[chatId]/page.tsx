import ChatInput from '@/Components/ChatInput';
import Messages from '@/Components/Messages';
import { fetchRedis } from '@/app/helpers/redis';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { messageArrayValidator } from '@/lib/validations/message';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import * as React from 'react';

interface IpageProps {
  params: {
    chatId: string
  }
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      'zrange', `chat:${chatId}:messages`,
      0, -1
    )

    const dbMessages = results.map((message) => JSON.parse(message) as Message)

    const reversedDbMessages = dbMessages.reverse()

    const messages = messageArrayValidator.parse(reversedDbMessages)

    return messages;
  } catch (error) {
    notFound()
  }
}

const page = async ({ params }: IpageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const { user } = session;

  const [userId1, userId2] = chatId.split("--")

  if (user.id !== userId1 && user.id !== userId2) {
    notFound()
  }

  const chatPartnerId = user.id === userId1 ? userId2 : userId1
  const chatPartnerString = await fetchRedis("get", `user:${chatPartnerId}`) as string
  const chatPartner = JSON.parse(chatPartnerString) as User

  const initialMessages = await getChatMessages(chatId);

  return (
    <div className="flex-1 justify-between flex flex-col h-screen">
      <div className="flex sm:items-center justify-between py-3 px-3">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="relative w-8 sm:w-12 h-8 sm:h-12">
              <Image fill referrerPolicy='no-referrer' src={chatPartner.image} alt={`${chatPartner.name} Profile Picture`} className="rounded-full" />
            </div>
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-xl flex items-center">
              <span className="text-slate-100 mr-3 font-semibold">{chatPartner.name}</span>
            </div>
            <span className="text-sm text-slate-400">{chatPartner.email}</span>
          </div>
        </div>
      </div>
      <Messages sessionId={session.user.id} initialMessages={initialMessages} chatPartner={chatPartner} sessionImg={session.user.image} chatId={chatId} />
      <ChatInput chatId={chatId} />
    </div>
  );
};

export default page;
