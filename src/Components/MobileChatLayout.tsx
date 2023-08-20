"use client"
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Menu, X } from 'lucide-react';
import Button, { buttonVariants } from './UI/Button';
import { Icons } from './Icons';
import SignOutButton from './SignOutButton';
import Image from 'next/image';
import FriendRequestOption from './FriendRequestOption';
import SidebarChatList from './SidebarChatList';
import { Session } from 'next-auth';
import { FriendsWithLastMessage, SidebarOptions } from '@/types/type';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface IMobileChatLayoutProps {
  friends: User[]
  session: Session
  sidebarOptions: SidebarOptions[]
  unseenRequestCount: number
  friendsWithLastMessage: FriendsWithLastMessage[]
}

const MobileChatLayout: React.FunctionComponent<IMobileChatLayoutProps> = ({ friends, session, sidebarOptions, unseenRequestCount, friendsWithLastMessage }) => {
  
  const [open, setOpen] = useState<boolean>(false)
  const pathname = usePathname()

  useEffect(()=>{
    setOpen(false);
  },[pathname])

  return <div className='fixed bg-gray-800 top-0 inset-x-0 py-2 px-4'>
    <div className='flex justify-end items-center py-3 border-b border-slate-900'>
      <Button onClick={() => setOpen(true)} className='px-2 py-[0.375rem] text-slate-200 border border-slate-900 bg-slate-900 hover:border-indigo-700 hover:bg-slate-900'>
        <Menu className='h-5 w-5' />
      </Button>
    </div>
    <Transition.Root show={open} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={setOpen}>
        <div className='fixed inset-0' />
        <div className='fixed inset-0 overflow-hidden'>
          <div className='absolute inset-0 overflow-hidden'>
            <div className='pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10'>
              <Transition.Child
                as={Fragment}
                enter='transform transition ease-in-out duration-500 sm:duration-700'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transform transition ease-in-out duration-500 sm:duration-700'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'>
                <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                  <div className='flex h-full flex-col overflow-hidden bg-slate-900 pb-3 shadow-xl'>
                    <div className='px-4 sm:px-6'>
                      <div className='flex items-center justify-between mt-2'>
                        <Dialog.Title className='text-base font-semibold leading-6 text-slate-200'>
                          <Link href="/dashboard" className="flex h-10 -mx-2 -mb-6 items-center">
                            <Icons.Logo className="h-10 w-auto text-indigo-700" />
                          </Link>
                        </Dialog.Title>
                        <div className='ml-3 flex h-7 items-center'>
                          <button
                            type='button'
                            className='rounded-md bg-slate-900 text-gray-200 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                            onClick={() => setOpen(false)}>
                            <span className='sr-only'>Close panel</span>
                            <X className='h-6 w-6' aria-hidden='true' />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='relative mt-6 flex-1 px-4 sm:px-6'>

                      {friends.length > 0 ? (
                        <div className='text-xs font-semibold leading-6 text-slate-300'>
                          Chats
                        </div>
                      ) : null}

                      <nav className='flex flex-1 h-full flex-col'>
                        <ul
                          role='list'
                          className='flex flex-1 flex-col h-full gap-y-7'>
                          <li>
                            <SidebarChatList
                              friends={friends}
                              session={session}
                              friendsWithLastMessage={friendsWithLastMessage}
                            />
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
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  </div>
};

export default MobileChatLayout;
