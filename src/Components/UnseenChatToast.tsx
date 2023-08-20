import { chatHrefConstructor, cname } from '@/lib/utils';
import { X } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { Toast, toast } from 'react-hot-toast';

interface IUnseenChatToastProps {
    t: Toast
    sessionId: string
    senderId: string
    senderImg: string
    senderName: string
    senderMessage: string
}

const UnseenChatToast: React.FunctionComponent<IUnseenChatToastProps> = ({ t, sessionId, senderId, senderImg, senderName, senderMessage }) => {
    return <div className={cname("max-w-md w-full bg-slate-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-slate-900 ring-opacity-5", {
        "animate-enter": t.visible,
        "animate-leave": !t.visible
    })}>
        <a href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`} onClick={() => toast.dismiss(t.id)} className='flex-1 w-0 p-4'>
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <div className="relative h-10 w-10">
                        <Image fill referrerPolicy='no-referrer' className='rounded-full' src={senderImg} alt={`${senderName} profile picture`} />
                    </div>
                </div>

                <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-slate-200">{senderName}</p>
                    <p className="mt-1 text-sm text-slate-400">{senderMessage}</p>
                </div>
            </div>
        </a>

        <div className="flex border-1 border-slate-900">
            <button onClick={()=> toast.dismiss(t.id)} className="w-full border-l border-slate-900 rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-700"><X/></button>
        </div>
    </div>;
};

export default UnseenChatToast;
