"use client"

import { ButtonHTMLAttributes, useState } from "react";
import Button from "./UI/Button";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Loader2, LogOut } from "lucide-react";

interface ISignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
}

const SignOutButton: React.FunctionComponent<ISignOutButtonProps> = ({...props}) => {
    const [isSigningOut,setIsSigningOut] = useState<boolean>(false)
  return <Button {...props} variant="ghost" onClick={async () => {
    setIsSigningOut(true)
    try{
        await signOut();
    }catch(err){
        toast.error("There was a problem signing out.")
    }finally{
        setIsSigningOut(false)
    }
  }}>{isSigningOut ? (<Loader2 className="animate-spin h-3 w-3"/>) : (
    <LogOut className="w-3 h-3"/>
  )}</Button>;
};

export default SignOutButton;
