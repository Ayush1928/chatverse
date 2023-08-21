"use client"

import { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Button from "./UI/Button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { SendHorizonal } from "lucide-react";

interface IChatInputProps {
    chatId: string
}

const ChatInput: React.FunctionComponent<IChatInputProps> = ({ chatId }) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [input, setInput] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const sendMessage = async () => {
        
        try {
            if(!input || input.trim() === "") return;
            setIsLoading(true);
            await axios.post("/api/message/send",{text: input, chatId})
            setInput("")
            textareaRef.current?.focus()
        } catch {
            toast.error("Something went wrong. Please try again later.")
        } finally {
            setIsLoading(false)

        }
    }

    return <div className="border-t border-slate-900 px-0 md:px-4 pt-0 md:pt-1 mt-auto -mx-[1.5rem] sm:mb-0">
        <div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-0 ring-slate-900 flex justify-center items-center p-2">
            <TextareaAutosize ref={textareaRef} onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage();
                }
            }} rows={1} value={input} onChange={((e) => setInput(e.target.value))} placeholder="Type your message here..." className="block w-[18rem] md:w-full resize-none border-0 bg-transparent text-slate-200 placeholder:text-slate-400 focus:ring-0 sm:py-1.5 lg:text-md sm:text-sm sm:leading-6" />

            <div className="absolute right-0 flex justify-between pl-3 pr-3">
                <div className="flex-shrink-0">
                    <Button className="rounded-full h-9 w-9 p-[0.625rem] bg-indigo-700 hover:bg-indigo-600 hover:text-slate-200" isLoading={isLoading} onClick={sendMessage} type="submit"><SendHorizonal/></Button>
                </div>
            </div>
        </div>
    </div>
};

export default ChatInput;
