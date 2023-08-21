"use client"

import Button from './UI/Button';
import { addFriendValidator } from '@/lib/validations/add-friends';
import axios, { AxiosError } from "axios";
import { Fragment, useState, useRef } from 'react';
import { useForm } from "react-hook-form"
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, Transition } from '@headlessui/react'
interface IAddFriendButtonProps {
}

type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton: React.FunctionComponent<IAddFriendButtonProps> = ({ }) => {
    const [showSuccessState, setShowSuccessState] = useState<boolean>(false)
    const cancelButtonRef = useRef(null)
    const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(addFriendValidator),
    })
    const addFriend = async (email: string) => {
        try {
            const validatedEmail = addFriendValidator.parse({ email });
            await axios.post('/api/friends/add', {
                email: validatedEmail,
            })

            setShowSuccessState(true)
        } catch (err) {
            if (err instanceof z.ZodError) {
                setError('email', { message: err.message })
                return;
            }

            if (err instanceof AxiosError) {
                setError("email", { message: err.response?.data })
                return
            }

            setError('email', { message: "Something went wrong" })
        }

    }
    const onSubmit = (data: FormData) => {
        addFriend(data.email)
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-[24rem] md:w-[30rem]">
            <div className='mt-2 flex gap-4'>
                <input {...register('email')} type="text" className="block w-full bg-slate-200 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-500 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder='example@abc.com' />
                <Button className="hover:bg-slate-900 hover:border-indigo-700">
                    Add
                </Button>
            </div>
            <p className='mt-2 text-base text-red-600'>{errors.email?.message}</p>
            {showSuccessState ? (
                <p className='mt-1 text-sm text-green-600'>Friend request sent.</p>
            ) : null}
        </form>
    )
};

export default AddFriendButton;
