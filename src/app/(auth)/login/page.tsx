"use client"

import Button from '@/Components/UI/Button';
import React from 'react';
import { useState } from 'react';
import { signIn } from "next-auth/react";
import { toast } from 'react-hot-toast';
import { Icons } from '@/Components/Icons';

interface IPageProps {
}

const Page: React.FunctionComponent<IPageProps> = (props) => {
  const [googleIsLoading, setGoogleIsLoading] = useState<boolean>(false)
  const [githubIsLoading, setGithubIsLoading] = useState<boolean>(false)

  const loginWithGoogle = async () => {
    setGoogleIsLoading(true);
    try {
      await signIn("google");
    } catch (err) {
      toast.error("Something went wrong.")
    } finally {
      setGoogleIsLoading(false);
    }
  }
  const loginWithGithub = async () => {
    setGithubIsLoading(true);
    try {
      await signIn("github");
    } catch (err) {

    } finally{
      setGithubIsLoading(false);
    }
  }

  return <>
    <div className='flex h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-800'>
      <div className='w-full flex flex-col items-center max-w-md space-y-8'>
        <div className="flex flex-col items-center gap-8">
          <Icons.Logo className="h-24 w-auto text-indigo-700" />
          <h2 className=' mt-6 text-center text-2xl font-bold traacking-light text-slate-200'>Sign in to your account</h2>
        </div>
        <Button isLoading={googleIsLoading} disabled={githubIsLoading} type="button" className='h-12 flex max-w-sm mx-auto w-full text-lg border-2 border-slate-900 bg-slate-900 hover:bg-slate-900 hover:border-indigo-700' onClick={loginWithGoogle}>
          {googleIsLoading ? null : (<svg
            className='mr-4 h-5 w-5'
            aria-hidden='true'
            focusable='false'
            data-prefix='fab'
            data-icon='github'
            role='img'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'>
            <path
              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              fill='#4285F4'
            />
            <path
              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              fill='#34A853'
            />
            <path
              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
              fill='#FBBC05'
            />
            <path
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
              fill='#EA4335'
            />
            <path d='M1 1h22v22H1z' fill='none' />
          </svg>)}Continue with Google
        </Button>
        <Button isLoading={githubIsLoading} disabled={googleIsLoading} type="button" className='h-12 flex max-w-sm mx-auto w-full text-lg bg-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:border-indigo-700' onClick={loginWithGithub}>
          {githubIsLoading ? null : (<svg aria-hidden="true" className="octicon octicon-mark-github mr-4 h-5 w-5" version="1.1" viewBox="0 0 16 16">
            <path fill="white" fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
          </svg>)}Continue with Github
        </Button>
      </div>
    </div>
  </>;
};

export default Page;
